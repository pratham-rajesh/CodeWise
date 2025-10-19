'use client';

import { Problem } from '@/lib/api';
import ImageHintUploader from './ImageHintUploader';

interface UserProfileProps {
  weakPatterns: Array<{ pattern: string; weakness_score: number | string }>;
  strongPatterns: Array<{ pattern: string; success_rate: number | string }>;
  onRefresh: () => void;
  loading?: boolean;
  currentProblem?: Problem | null;
  userId?: string;
}

export default function UserProfile({
  weakPatterns,
  strongPatterns,
  onRefresh,
  loading = false,
  currentProblem = null,
  userId = '',
}: UserProfileProps) {
  const formatPatternName = (patternId: string) => {
    return patternId
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatScore = (score: number | string) => {
    const numScore = typeof score === 'string' ? parseFloat(score) : score;
    return Math.round(numScore);
  };

  return (
    <div className="notion-card">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>👤</span>
        <span>Your Profile</span>
      </h2>

      <div className="space-y-6">
        {/* Weak Patterns */}
        <div>
          <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
            <span className="text-red-500">🔴</span>
            <span>Weak Patterns</span>
          </h3>
          <div className="space-y-2">
            {weakPatterns.length > 0 ? (
              weakPatterns.map((item) => (
                <div
                  key={item.pattern}
                  className="flex items-center justify-between p-3 bg-notion-bg-secondary rounded-md border border-notion-border hover:border-red-200 transition-colors"
                >
                  <span className="text-sm text-notion-text">
                    {formatPatternName(item.pattern)}
                  </span>
                  <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                    {formatScore(item.weakness_score)}% weak
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-notion-text-secondary italic">
                Complete some challenges to see your weak patterns
              </p>
            )}
          </div>
        </div>

        {/* Strong Patterns */}
        <div>
          <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
            <span className="text-green-500">🟢</span>
            <span>Strong Patterns</span>
          </h3>
          <div className="space-y-2">
            {strongPatterns.length > 0 ? (
              strongPatterns.map((item) => (
                <div
                  key={item.pattern}
                  className="flex items-center justify-between p-3 bg-notion-bg-secondary rounded-md border border-notion-border hover:border-green-200 transition-colors"
                >
                  <span className="text-sm text-notion-text">
                    {formatPatternName(item.pattern)}
                  </span>
                  <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                    {formatScore(item.success_rate)}% success
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-notion-text-secondary italic">
                Complete some challenges to see your strong patterns
              </p>
            )}
          </div>
        </div>

        {/* Image Hint Uploader */}
        <ImageHintUploader
          currentProblem={currentProblem}
          userId={userId}
          onHintReceived={onRefresh}
        />

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="notion-btn-secondary w-full disabled:opacity-50"
          style={{
            fontSize: '0.95rem',
            fontWeight: '700',
            padding: '0.75rem 1.25rem',
            backgroundImage: loading
              ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            border: loading
              ? '2px solid #d1d5db'
              : '2px solid var(--color-notion-primary)',
            color: loading ? '#9ca3af' : 'var(--color-notion-primary)',
            boxShadow: loading
              ? 'none'
              : '0 4px 12px rgba(59, 130, 246, 0.15)',
            transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span style={{ fontSize: '0.9rem' }}>Refreshing Profile...</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '1.1rem' }}>🔄</span>
              <span>Refresh Profile</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
