// Direct connection to backend to avoid Next.js proxy timeout issues
const API_BASE = 'http://localhost:3000';

export interface Pattern {
  id: string;
  name: string;
  description: string;
}

export interface Problem {
  title: string;
  description: string;
  pattern: string;
  difficulty: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  test_cases?: Array<{
    input: string;
    expected_output: string;
  }>;
  constraints?: string[];
  hints?: string[];
}

export interface UserProfile {
  user_id: string;
  credits_used: number;
  total_challenges: number;
  overall_success_rate: number | string; // Can be string from MongoDB
  weak_patterns: Array<{
    pattern: string;
    weakness_score: number | string; // Can be string from MongoDB
  }>;
  strong_patterns: Array<{
    pattern: string;
    success_rate: number | string; // Can be string from MongoDB
  }>;
}

export interface EvaluationResult {
  correct: boolean;
  errors: string[];
  complexity?: {
    time: string;
    space: string;
  };
  suggestions: string[];
  pattern_usage?: string;
  code_quality?: string;
  score: number;
  credits_used: number;
  total_credits_used: number;
  weak_patterns: string[];
}

export interface ExplanationEvaluation {
  success: boolean;
  score: number; // 0-100
  transcript: string;
  feedback: {
    clarity: number; // 0-20
    problemUnderstanding: number; // 0-20
    approachExplanation: number; // 0-20
    complexityAnalysis: number; // 0-20
    edgeCases: number; // 0-10
    communication: number; // 0-10
  };
  suggestions: string[];
  strengths: string[];
  credits_used?: number;
  total_credits_used?: number;
  error?: string;
}

export const api = {
  async getPatterns(): Promise<Pattern[]> {
    const res = await fetch(`${API_BASE}/api/patterns`);
    const data = await res.json();
    return data.success ? data.patterns : [];
  },

  async requestChallenge(
    userId: string,
    pattern: string,
    difficulty: string
  ): Promise<{
    success: boolean;
    problem?: Problem;
    credits_used?: number;
    total_credits_used?: number;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/api/request_challenge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, pattern, difficulty }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error requesting challenge:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check if the backend server is running.',
      };
    }
  },

  async submitSolution(
    userId: string,
    pattern: string,
    code: string,
    problemDescription: string
  ): Promise<{ success: boolean; error?: string } & Partial<EvaluationResult>> {
    try {
      const res = await fetch(`${API_BASE}/api/submit_solution`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          pattern,
          code,
          problem_description: problemDescription,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error submitting solution:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check if the backend server is running.',
      };
    }
  },

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const url = `${API_BASE}/api/user_profile/${userId}`;
    console.log('🌐 Fetching profile from:', url);

    const res = await fetch(url);
    const data = await res.json();

    console.log('📡 API Response:', data);

    return data.success ? data.profile : null;
  },

  async checkHealth() {
    const res = await fetch(`${API_BASE}/api/health`);
    return res.json();
  },

  async getImageHint(
    userId: string,
    imageBase64: string,
    problemDescription: string,
    problemTitle: string,
    pattern: string,
    difficulty: string
  ): Promise<{
    success: boolean;
    analysis?: string;
    hints?: string[];
    encouragement?: string;
    credits_used?: number;
    total_credits_used?: number;
    error?: string;
  }> {
    try {
      const res = await fetch(`${API_BASE}/api/get_image_hint`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          image_base64: imageBase64,
          problem_description: problemDescription,
          problem_title: problemTitle,
          pattern,
          difficulty,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error getting image hint:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error. Please check if the backend server is running.',
      };
    }
  },

  async evaluateExplanation(
    userId: string,
    audioBase64: string,
    problemTitle: string,
    problemDescription: string,
    pattern: string,
    difficulty: string
  ): Promise<ExplanationEvaluation> {
    try {
      const res = await fetch(`${API_BASE}/api/evaluate_explanation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          audio_base64: audioBase64,
          problem_title: problemTitle,
          problem_description: problemDescription,
          pattern,
          difficulty,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error evaluating explanation:', error);
      return {
        success: false,
        score: 0,
        transcript: '',
        feedback: {
          clarity: 0,
          problemUnderstanding: 0,
          approachExplanation: 0,
          complexityAnalysis: 0,
          edgeCases: 0,
          communication: 0,
        },
        suggestions: [],
        strengths: [],
        error: error instanceof Error ? error.message : 'Network error. Please check if the backend server is running.',
      };
    }
  },
};
