'use client';

import { Pattern } from '@/lib/api';

interface ChallengePanelProps {
  patterns: Pattern[];
  selectedPattern: string;
  selectedDifficulty: string;
  loading: boolean;
  onPatternChange: (pattern: string) => void;
  onDifficultyChange: (difficulty: string) => void;
  onGetChallenge: () => void;
}

export default function ChallengePanel({
  patterns,
  selectedPattern,
  selectedDifficulty,
  loading,
  onPatternChange,
  onDifficultyChange,
  onGetChallenge,
}: ChallengePanelProps) {
  return (
    <div className="notion-card">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>📝</span>
        <span>Request Challenge</span>
      </h2>

      <div className="space-y-4">
        {/* Pattern Select */}
        <div>
          <label htmlFor="pattern" className="block text-sm font-medium text-notion-text mb-2">
            Select Pattern
          </label>
          <select
            id="pattern"
            value={selectedPattern}
            onChange={(e) => onPatternChange(e.target.value)}
            className="notion-select"
            disabled={loading}
          >
            <option value="">Choose a pattern...</option>
            {patterns.map((pattern) => (
              <option key={pattern.id} value={pattern.id}>
                {pattern.name} - {pattern.description}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Select */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-notion-text mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={selectedDifficulty}
            onChange={(e) => onDifficultyChange(e.target.value)}
            className="notion-select"
            disabled={loading}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        {/* Get Challenge Button */}
        <button
          onClick={onGetChallenge}
          disabled={loading || !selectedPattern}
          className="notion-btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            padding: '0.875rem 1.5rem',
            backgroundImage: loading
              ? 'linear-gradient(135deg, #93c5fd 0%, #c7d2fe 100%)'
              : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)',
            boxShadow: loading
              ? 'none'
              : '0 8px 20px rgba(59, 130, 246, 0.4), 0 4px 8px rgba(99, 102, 241, 0.3)',
            transform: loading ? 'none' : undefined,
            backgroundSize: '200% 200%',
            animation: loading ? 'none' : 'gradient-shift 3s ease infinite'
          }}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span style={{ fontSize: '0.95rem' }}>Generating Challenge...</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '1.25rem' }}>🎯</span>
              <span>Get Challenge</span>
            </>
          )}
        </button>

        {loading && (
          <p className="text-xs text-notion-text-secondary text-center">
            Generating challenge via AI Agent...
          </p>
        )}
      </div>
    </div>
  );
}
