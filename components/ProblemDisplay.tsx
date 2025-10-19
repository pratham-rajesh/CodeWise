'use client';

import { Problem } from '@/lib/api';

interface ProblemDisplayProps {
  problem: Problem | null;
}

export default function ProblemDisplay({ problem }: ProblemDisplayProps) {
  if (!problem) {
    return (
      <div className="notion-card">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-xl font-semibold text-notion-text mb-2">
            Ready to start practicing?
          </h2>
          <p className="text-notion-text-secondary">
            Select a pattern and click &quot;Get Challenge&quot; to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="notion-card">
      {/* Problem Header */}
      <div className="flex items-start justify-between mb-6">
        <h2 className="text-2xl font-bold text-notion-text">{problem.title}</h2>
        {problem.difficulty && (
          <span className={`difficulty-badge difficulty-${problem.difficulty}`}>
            {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-notion-text mb-2 flex items-center gap-2">
          <span>📋</span>
          <span>Description</span>
        </h3>
        <p className="text-notion-text leading-relaxed">{problem.description}</p>
      </div>

      {/* Examples */}
      {problem.examples && problem.examples.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Examples</span>
          </h3>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div
                key={idx}
                className="bg-notion-bg-secondary p-4 rounded-md border border-notion-border"
              >
                <div className="font-medium text-sm text-notion-text mb-2">
                  Example {idx + 1}:
                </div>
                <div className="space-y-1 font-mono text-sm">
                  <div className="text-notion-text-secondary">
                    <span className="text-notion-text font-semibold">Input:</span> {example.input}
                  </div>
                  <div className="text-notion-text-secondary">
                    <span className="text-notion-text font-semibold">Output:</span> {example.output}
                  </div>
                  {example.explanation && (
                    <div className="text-notion-text-secondary italic mt-2">
                      {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Cases */}
      {problem.test_cases && problem.test_cases.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
            <span>🧪</span>
            <span>Test Cases</span>
          </h3>
          <div className="space-y-2">
            {problem.test_cases.map((tc, idx) => (
              <div
                key={idx}
                className="bg-notion-bg-secondary px-4 py-2 rounded-md border border-notion-border font-mono text-sm text-notion-text-secondary"
              >
                Test {idx + 1}: {tc.input} → {tc.expected_output}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>Constraints</span>
          </h3>
          <ul className="space-y-2">
            {problem.constraints.map((constraint, idx) => (
              <li
                key={idx}
                className="text-sm text-notion-text-secondary flex items-start gap-2"
              >
                <span className="text-notion-text">•</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Hints */}
      {problem.hints && problem.hints.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
            <span>💭</span>
            <span>Hints</span>
          </h3>
          <div className="space-y-2">
            {problem.hints.map((hint, idx) => (
              <div
                key={idx}
                className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-md text-sm text-blue-900"
              >
                💡 {hint}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
