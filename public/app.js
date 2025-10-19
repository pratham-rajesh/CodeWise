// Application State
const state = {
    userId: localStorage.getItem('pattern_trainer_user_id') || 'user_' + Math.random().toString(36).substr(2, 9),
    currentProblem: null,
    patterns: [],
    userProfile: null
};

// Save user ID to localStorage
if (!localStorage.getItem('pattern_trainer_user_id')) {
    localStorage.setItem('pattern_trainer_user_id', state.userId);
}

// DOM Elements
const elements = {
    patternSelect: document.getElementById('patternSelect'),
    difficultySelect: document.getElementById('difficultySelect'),
    getChallengeBtn: document.getElementById('getChallengeBtn'),
    challengeLoading: document.getElementById('challengeLoading'),
    submitBtn: document.getElementById('submitBtn'),
    clearBtn: document.getElementById('clearBtn'),
    submitLoading: document.getElementById('submitLoading'),
    codeEditor: document.getElementById('codeEditor'),
    problemTitle: document.getElementById('problemTitle'),
    problemDifficulty: document.getElementById('problemDifficulty'),
    problemContent: document.getElementById('problemContent'),
    feedbackCard: document.getElementById('feedbackCard'),
    feedbackContent: document.getElementById('feedbackContent'),
    userId: document.getElementById('userId'),
    creditsUsed: document.getElementById('creditsUsed'),
    successRate: document.getElementById('successRate'),
    totalChallenges: document.getElementById('totalChallenges'),
    weakPatterns: document.getElementById('weakPatterns'),
    strongPatterns: document.getElementById('strongPatterns'),
    refreshProfileBtn: document.getElementById('refreshProfileBtn'),
    agentStatus: document.getElementById('agentStatus')
};

// Initialize Application
async function init() {
    elements.userId.textContent = state.userId;
    await loadPatterns();
    await loadUserProfile();
    setupEventListeners();
    checkHealth();
}

// Setup Event Listeners
function setupEventListeners() {
    elements.getChallengeBtn.addEventListener('click', handleGetChallenge);
    elements.submitBtn.addEventListener('click', handleSubmitSolution);
    elements.clearBtn.addEventListener('click', handleClearCode);
    elements.refreshProfileBtn.addEventListener('click', loadUserProfile);
    elements.codeEditor.addEventListener('input', () => {
        elements.submitBtn.disabled = !elements.codeEditor.value.trim();
    });
}

// Load Available Patterns
async function loadPatterns() {
    try {
        const response = await fetch('/api/patterns');
        const data = await response.json();

        if (data.success) {
            state.patterns = data.patterns;
            renderPatternOptions();
        }
    } catch (error) {
        console.error('Error loading patterns:', error);
        showNotification('Failed to load patterns', 'error');
    }
}

// Render Pattern Options
function renderPatternOptions() {
    elements.patternSelect.innerHTML = '<option value="">Select a pattern...</option>';

    state.patterns.forEach(pattern => {
        const option = document.createElement('option');
        option.value = pattern.id;
        option.textContent = `${pattern.name} - ${pattern.description}`;
        elements.patternSelect.appendChild(option);
    });
}

// Handle Get Challenge
async function handleGetChallenge() {
    const pattern = elements.patternSelect.value;
    const difficulty = elements.difficultySelect.value;

    if (!pattern) {
        showNotification('Please select a pattern', 'warning');
        return;
    }

    elements.getChallengeBtn.disabled = true;
    elements.challengeLoading.style.display = 'block';
    elements.feedbackCard.style.display = 'none';

    try {
        const response = await fetch('/api/request_challenge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: state.userId,
                pattern,
                difficulty
            })
        });

        const data = await response.json();

        if (data.success) {
            state.currentProblem = data.problem;
            renderProblem(data.problem);
            updateStats({ credits_used: data.total_credits_used });
            elements.submitBtn.disabled = !elements.codeEditor.value.trim();
            showNotification(`Challenge generated! Used ${data.credits_used} credit(s)`, 'success');
        } else {
            showNotification('Failed to generate challenge: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error requesting challenge:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        elements.getChallengeBtn.disabled = false;
        elements.challengeLoading.style.display = 'none';
    }
}

// Render Problem
function renderProblem(problem) {
    elements.problemTitle.textContent = problem.title;

    // Set difficulty badge
    elements.problemDifficulty.textContent = problem.difficulty;
    elements.problemDifficulty.className = `difficulty-badge difficulty-${problem.difficulty}`;

    // Build problem content
    let html = `
        <div class="problem-section">
            <h3>📋 Description</h3>
            <p>${problem.description}</p>
        </div>
    `;

    if (problem.examples && problem.examples.length > 0) {
        html += '<div class="problem-section"><h3>💡 Examples</h3>';
        problem.examples.forEach((example, idx) => {
            html += `
                <div class="example">
                    <strong>Example ${idx + 1}:</strong>
                    <pre>Input: ${example.input}</pre>
                    <pre>Output: ${example.output}</pre>
                    ${example.explanation ? `<p><em>${example.explanation}</em></p>` : ''}
                </div>
            `;
        });
        html += '</div>';
    }

    if (problem.test_cases && problem.test_cases.length > 0) {
        html += '<div class="problem-section"><h3>🧪 Test Cases</h3>';
        problem.test_cases.forEach((tc, idx) => {
            html += `
                <div class="test-case">
                    Test ${idx + 1}: ${tc.input} → ${tc.expected_output}
                </div>
            `;
        });
        html += '</div>';
    }

    if (problem.constraints && problem.constraints.length > 0) {
        html += '<div class="problem-section"><h3>⚠️ Constraints</h3>';
        problem.constraints.forEach(constraint => {
            html += `<div class="constraint">• ${constraint}</div>`;
        });
        html += '</div>';
    }

    if (problem.hints && problem.hints.length > 0) {
        html += '<div class="problem-section"><h3>💭 Hints</h3>';
        problem.hints.forEach(hint => {
            html += `<div class="hint">💡 ${hint}</div>`;
        });
        html += '</div>';
    }

    elements.problemContent.innerHTML = html;
}

// Handle Submit Solution
async function handleSubmitSolution() {
    if (!state.currentProblem) {
        showNotification('Please get a challenge first', 'warning');
        return;
    }

    const code = elements.codeEditor.value.trim();
    if (!code) {
        showNotification('Please write some code first', 'warning');
        return;
    }

    elements.submitBtn.disabled = true;
    elements.submitLoading.style.display = 'block';
    elements.feedbackCard.style.display = 'none';

    try {
        const response = await fetch('/api/submit_solution', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: state.userId,
                pattern: state.currentProblem.pattern,
                code,
                problem_description: state.currentProblem.description
            })
        });

        const data = await response.json();

        if (data.success) {
            renderFeedback(data);
            updateStats({ credits_used: data.total_credits_used });
            await loadUserProfile();
            showNotification(
                data.correct ? 'Solution submitted successfully! ✅' : 'Solution submitted. See feedback below.',
                data.correct ? 'success' : 'info'
            );
        } else {
            showNotification('Failed to submit solution: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error submitting solution:', error);
        showNotification('Network error. Please try again.', 'error');
    } finally {
        elements.submitBtn.disabled = false;
        elements.submitLoading.style.display = 'none';
    }
}

// Render Feedback
function renderFeedback(data) {
    let html = `
        <div class="feedback-item ${data.correct ? 'feedback-correct' : 'feedback-incorrect'}">
            <h3>${data.correct ? '✅ Correct!' : '❌ Incorrect'}</h3>
            <p><strong>Score:</strong> <span class="score-badge ${getScoreClass(data.score)}">${data.score}/100</span></p>
        </div>
    `;

    if (data.errors && data.errors.length > 0) {
        html += `
            <div class="feedback-item">
                <h3>🐛 Issues Found</h3>
                <ul class="feedback-list">
                    ${data.errors.map(error => `<li>${error}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (data.complexity) {
        html += `
            <div class="feedback-item">
                <h3>⏱️ Complexity Analysis</h3>
                <p><strong>Time:</strong> ${data.complexity.time || 'Not analyzed'}</p>
                <p><strong>Space:</strong> ${data.complexity.space || 'Not analyzed'}</p>
            </div>
        `;
    }

    if (data.pattern_usage) {
        html += `
            <div class="feedback-item">
                <h3>🎯 Pattern Usage</h3>
                <p>${data.pattern_usage}</p>
            </div>
        `;
    }

    if (data.code_quality) {
        html += `
            <div class="feedback-item">
                <h3>✨ Code Quality</h3>
                <p>${data.code_quality}</p>
            </div>
        `;
    }

    if (data.suggestions && data.suggestions.length > 0) {
        html += `
            <div class="feedback-item">
                <h3>💡 Suggestions</h3>
                <ul class="feedback-list">
                    ${data.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    if (data.weak_patterns && data.weak_patterns.length > 0) {
        html += `
            <div class="feedback-item">
                <h3>📈 Your Weak Patterns</h3>
                <p>Based on your submissions, you may need more practice with: <strong>${data.weak_patterns.join(', ')}</strong></p>
            </div>
        `;
    }

    elements.feedbackContent.innerHTML = html;
    elements.feedbackCard.style.display = 'block';
}

// Get Score Class
function getScoreClass(score) {
    if (score >= 80) return 'score-high';
    if (score >= 50) return 'score-medium';
    return 'score-low';
}

// Load User Profile
async function loadUserProfile() {
    try {
        const response = await fetch(`/api/user_profile/${state.userId}`);
        const data = await response.json();

        if (data.success) {
            state.userProfile = data.profile;
            renderUserProfile(data.profile);
            updateStats({
                success_rate: data.profile.overall_success_rate,
                total_challenges: data.profile.total_challenges,
                credits_used: data.profile.credits_used
            });
        }
    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Render User Profile
function renderUserProfile(profile) {
    // Render weak patterns
    if (profile.weak_patterns && profile.weak_patterns.length > 0) {
        let html = '';
        profile.weak_patterns.forEach(item => {
            html += `
                <div class="pattern-item">
                    <span class="pattern-name">${formatPatternName(item.pattern)}</span>
                    <span class="pattern-score weak-score">${item.weakness_score}% weak</span>
                </div>
            `;
        });
        elements.weakPatterns.innerHTML = html;
    } else {
        elements.weakPatterns.innerHTML = '<p class="empty-state">No weak patterns yet</p>';
    }

    // Render strong patterns
    if (profile.strong_patterns && profile.strong_patterns.length > 0) {
        let html = '';
        profile.strong_patterns.forEach(item => {
            html += `
                <div class="pattern-item">
                    <span class="pattern-name">${formatPatternName(item.pattern)}</span>
                    <span class="pattern-score strong-score">${item.success_rate}% success</span>
                </div>
            `;
        });
        elements.strongPatterns.innerHTML = html;
    } else {
        elements.strongPatterns.innerHTML = '<p class="empty-state">No strong patterns yet</p>';
    }
}

// Format Pattern Name
function formatPatternName(patternId) {
    return patternId
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Update Stats
function updateStats(stats) {
    if (stats.credits_used !== undefined) {
        elements.creditsUsed.textContent = stats.credits_used;
    }
    if (stats.success_rate !== undefined) {
        elements.successRate.textContent = stats.success_rate + '%';
    }
    if (stats.total_challenges !== undefined) {
        elements.totalChallenges.textContent = stats.total_challenges;
    }
}

// Handle Clear Code
function handleClearCode() {
    if (confirm('Are you sure you want to clear your code?')) {
        elements.codeEditor.value = '';
        elements.submitBtn.disabled = true;
    }
}

// Check Health
async function checkHealth() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();

        if (data.success) {
            const geminiStatus = data.gemini_configured ? 'configured' : 'not configured';
            elements.agentStatus.textContent = `Agent marketplace active | Gemini: ${geminiStatus}`;
            elements.agentStatus.style.color = data.gemini_configured ? 'var(--success-color)' : 'var(--warning-color)';
        }
    } catch (error) {
        console.error('Health check failed:', error);
        elements.agentStatus.textContent = 'Connection error';
        elements.agentStatus.style.color = 'var(--danger-color)';
    }
}

// Show Notification (simple console log for now, can be enhanced with toast)
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    // Could be enhanced with a toast notification library
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
