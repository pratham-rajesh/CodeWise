'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import ChallengePanel from '@/components/ChallengePanel';
import UserProfile from '@/components/UserProfile';
import ProblemDisplay from '@/components/ProblemDisplay';
import CodeEditor from '@/components/CodeEditor';
import FeedbackCard from '@/components/FeedbackCard';
import { api, Pattern, Problem, UserProfile as UserProfileType, EvaluationResult } from '@/lib/api';

export default function Home() {
  // User state
  const [userId, setUserId] = useState<string>('');
  const [creditsUsed, setCreditsUsed] = useState<number>(0);
  const [successRate, setSuccessRate] = useState<number>(0);
  const [totalChallenges, setTotalChallenges] = useState<number>(0);

  // Pattern & challenge state
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('medium');
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);

  // Code state
  const [code, setCode] = useState<string>('');

  // UI state
  const [challengeLoading, setChallengeLoading] = useState<boolean>(false);
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<EvaluationResult | null>(null);

  // Profile state
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);

  // Initialize user ID
  useEffect(() => {
    let storedUserId = localStorage.getItem('pattern_trainer_user_id');
    if (!storedUserId) {
      storedUserId = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('pattern_trainer_user_id', storedUserId);
    }
    console.log('👤 Current User ID:', storedUserId);
    setUserId(storedUserId);
  }, []);

  // Load patterns on mount
  useEffect(() => {
    loadPatterns();
  }, []);

  // Load user profile when userId changes
  useEffect(() => {
    if (userId) {
      loadUserProfile();
    }
  }, [userId]);

  const loadPatterns = async () => {
    try {
      const patternsData = await api.getPatterns();
      setPatterns(patternsData);
    } catch (error) {
      console.error('Error loading patterns:', error);
    }
  };

  const loadUserProfile = async () => {
    if (!userId) return;

    console.log('🔍 Loading profile for user:', userId);
    setProfileLoading(true);
    try {
      const profile = await api.getUserProfile(userId);
      console.log('📊 Profile received:', profile);

      if (profile) {
        setUserProfile(profile);
        setCreditsUsed(profile.credits_used);
        // Convert success rate to number (it comes as string from backend)
        const rate = typeof profile.overall_success_rate === 'string'
          ? parseFloat(profile.overall_success_rate)
          : profile.overall_success_rate;
        setSuccessRate(Math.round(rate));
        setTotalChallenges(profile.total_challenges);

        console.log('✅ Profile loaded:', {
          credits: profile.credits_used,
          successRate: Math.round(rate),
          challenges: profile.total_challenges,
          weakPatterns: profile.weak_patterns.length,
          strongPatterns: profile.strong_patterns.length
        });
      }
    } catch (error) {
      console.error('❌ Error loading user profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleGetChallenge = async () => {
    if (!selectedPattern || !userId) return;

    setChallengeLoading(true);
    setFeedback(null);
    setCode('');

    try {
      const result = await api.requestChallenge(userId, selectedPattern, selectedDifficulty);

      if (result.success && result.problem) {
        setCurrentProblem(result.problem);
        if (result.total_credits_used !== undefined) {
          setCreditsUsed(result.total_credits_used);
        }
      } else {
        alert('Failed to generate challenge: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error requesting challenge:', error);
      alert('Network error. Please try again.');
    } finally {
      setChallengeLoading(false);
    }
  };

  const handleSubmitSolution = async () => {
    if (!currentProblem || !code.trim() || !userId) return;

    setSubmitLoading(true);
    setFeedback(null);

    try {
      const result = await api.submitSolution(
        userId,
        currentProblem.pattern,
        code,
        currentProblem.description
      );

      if (result.success) {
        const evaluationResult: EvaluationResult = {
          correct: result.correct || false,
          errors: result.errors || [],
          complexity: result.complexity,
          suggestions: result.suggestions || [],
          pattern_usage: result.pattern_usage,
          code_quality: result.code_quality,
          score: result.score || 0,
          credits_used: result.credits_used || 0,
          total_credits_used: result.total_credits_used || 0,
          weak_patterns: result.weak_patterns || [],
        };

        setFeedback(evaluationResult);

        if (result.total_credits_used !== undefined) {
          setCreditsUsed(result.total_credits_used);
        }

        // Reload profile to get updated stats
        await loadUserProfile();
      } else {
        alert('Failed to submit solution: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting solution:', error);
      alert('Network error. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleClearCode = () => {
    if (confirm('Are you sure you want to clear your code?')) {
      setCode('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header
        userId={userId}
        creditsUsed={creditsUsed}
        successRate={successRate}
        totalChallenges={totalChallenges}
      />

      <main style={{ maxWidth: '80rem', margin: '0 auto', padding: '2rem 1.5rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '1.5rem'
        }} className="lg-grid-cols-3">
          {/* Left Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="col-left">
            <ChallengePanel
              patterns={patterns}
              selectedPattern={selectedPattern}
              selectedDifficulty={selectedDifficulty}
              loading={challengeLoading}
              onPatternChange={setSelectedPattern}
              onDifficultyChange={setSelectedDifficulty}
              onGetChallenge={handleGetChallenge}
            />

            <UserProfile
              weakPatterns={userProfile?.weak_patterns || []}
              strongPatterns={userProfile?.strong_patterns || []}
              onRefresh={loadUserProfile}
              loading={profileLoading}
            />
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="col-right">
            <ProblemDisplay problem={currentProblem} />

            <CodeEditor
              code={code}
              onChange={setCode}
              onSubmit={handleSubmitSolution}
              onClear={handleClearCode}
              loading={submitLoading}
              disabled={!currentProblem}
            />

            <FeedbackCard feedback={feedback} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: '3rem',
        padding: '2rem 0',
        borderTop: '2px solid var(--color-notion-border)',
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(249,250,251,0.8) 100%)',
        backdropFilter: 'blur(8px)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Powered by Google Gemini AI & Fetch.ai Agent Architecture
          </p>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-notion-text-secondary)', marginTop: '0.5rem', fontWeight: '500' }}>
            🤖 Agent marketplace active ✨
          </p>
        </div>
      </footer>
    </div>
  );
}
