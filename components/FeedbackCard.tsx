'use client';

import { EvaluationResult, ExplanationEvaluation } from '@/lib/api';

interface FeedbackCardProps {
  feedback: EvaluationResult | null;
  explanationEvaluation?: ExplanationEvaluation | null;
}

export default function FeedbackCard({ feedback, explanationEvaluation }: FeedbackCardProps) {
  if (!feedback && !explanationEvaluation) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-700 bg-green-50 border-green-200';
    if (score >= 50) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    return 'text-red-700 bg-red-50 border-red-200';
  };

  return (
    <div className="notion-card border-l-4 border-l-notion-primary">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>📊</span>
        <span>Feedback</span>
      </h2>

      <div className="space-y-4">
        {/* Dual Score Overview (if both available) */}
        {feedback && explanationEvaluation && (
          <div className="p-4 rounded-md border bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <h3 className="font-semibold mb-3 text-blue-900">Overall Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <p className="text-xs font-medium text-blue-800 mb-1">Code Score</p>
                <div className={`px-3 py-2 rounded-md text-lg font-bold ${getScoreColor(feedback.score)}`}>
                  {feedback.score}/100
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-purple-800 mb-1">Explanation Score</p>
                <div className={`px-3 py-2 rounded-md text-lg font-bold ${getScoreColor(explanationEvaluation.score)}`}>
                  {explanationEvaluation.score}/100
                </div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-blue-300 text-center">
              <p className="text-xs font-medium text-blue-800 mb-1">Combined Average</p>
              <div className="text-2xl font-bold text-blue-900">
                {Math.round((feedback.score + explanationEvaluation.score) / 2)}/100
              </div>
            </div>
          </div>
        )}

        {/* Correctness & Code Score (if only code feedback) */}
        {feedback && !explanationEvaluation && (
          <div
            className={`p-4 rounded-md border ${
              feedback.correct
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <span>{feedback.correct ? '✅' : '❌'}</span>
              <span>{feedback.correct ? 'Correct!' : 'Incorrect'}</span>
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Score:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(
                  feedback.score
                )}`}
              >
                {feedback.score}/100
              </span>
            </div>
          </div>
        )}

        {/* Errors */}
        {feedback?.errors && feedback.errors.length > 0 && (
          <div className="bg-notion-bg-secondary p-4 rounded-md border border-notion-border">
            <h3 className="text-sm font-semibold text-notion-text mb-2 flex items-center gap-2">
              <span>🐛</span>
              <span>Issues Found</span>
            </h3>
            <ul className="space-y-2">
              {feedback.errors.map((error, idx) => (
                <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                  <span>•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Complexity Analysis */}
        {feedback?.complexity && (
          <div className="bg-notion-bg-secondary p-4 rounded-md border border-notion-border">
            <h3 className="text-sm font-semibold text-notion-text mb-2 flex items-center gap-2">
              <span>⏱️</span>
              <span>Complexity Analysis</span>
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium text-notion-text">Time:</span>
                <span className="text-notion-text-secondary font-mono">
                  {feedback.complexity.time || 'Not analyzed'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-notion-text">Space:</span>
                <span className="text-notion-text-secondary font-mono">
                  {feedback.complexity.space || 'Not analyzed'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pattern Usage */}
        {feedback?.pattern_usage && (
          <div className="bg-notion-bg-secondary p-4 rounded-md border border-notion-border">
            <h3 className="text-sm font-semibold text-notion-text mb-2 flex items-center gap-2">
              <span>🎯</span>
              <span>Pattern Usage</span>
            </h3>
            <p className="text-sm text-notion-text-secondary">{feedback.pattern_usage}</p>
          </div>
        )}

        {/* Code Quality */}
        {feedback?.code_quality && (
          <div className="bg-notion-bg-secondary p-4 rounded-md border border-notion-border">
            <h3 className="text-sm font-semibold text-notion-text mb-2 flex items-center gap-2">
              <span>✨</span>
              <span>Code Quality</span>
            </h3>
            <p className="text-sm text-notion-text-secondary">{feedback.code_quality}</p>
          </div>
        )}

        {/* Suggestions */}
        {feedback?.suggestions && feedback.suggestions.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span>💡</span>
              <span>Suggestions</span>
            </h3>
            <ul className="space-y-2">
              {feedback.suggestions.map((suggestion, idx) => (
                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                  <span>•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Weak Patterns */}
        {feedback?.weak_patterns && feedback.weak_patterns.length > 0 && (
          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
              <span>📈</span>
              <span>Your Weak Patterns</span>
            </h3>
            <p className="text-sm text-yellow-800">
              Based on your submissions, you may need more practice with:{' '}
              <strong>{feedback.weak_patterns.join(', ')}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
