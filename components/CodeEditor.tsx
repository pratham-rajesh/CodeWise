'use client';

import { useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  loading: boolean;
  disabled: boolean;
}

export default function CodeEditor({
  code,
  onChange,
  onSubmit,
  onClear,
  loading,
  disabled,
}: CodeEditorProps) {
  const placeholder = `Write your solution here...

Example (Python):
def solution(nums, k):
    # Your code here
    pass

Example (JavaScript):
function solution(nums, k) {
    // Your code here
}`;

  return (
    <div className="notion-card">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <span>💻</span>
        <span>Your Solution</span>
      </h2>

      {/* Code Textarea */}
      <div className="mb-4">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full h-64 px-4 py-3 border border-notion-border rounded-md focus:outline-none focus:ring-2 focus:ring-notion-primary focus:border-transparent transition-all duration-200 resize-none code-editor bg-notion-bg-secondary disabled:opacity-50"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onSubmit}
          disabled={disabled || !code.trim() || loading}
          className="notion-btn-success flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            fontSize: '1rem',
            fontWeight: '700',
            padding: '0.875rem 1.5rem',
            backgroundImage: loading
              ? 'linear-gradient(135deg, #a7f3d0 0%, #6ee7b7 100%)'
              : disabled || !code.trim()
              ? 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
            boxShadow: (disabled || !code.trim() || loading)
              ? 'none'
              : '0 8px 20px rgba(16, 185, 129, 0.4), 0 4px 8px rgba(20, 184, 166, 0.3)',
            transform: loading ? 'none' : undefined,
            backgroundSize: '200% 200%',
            animation: (loading || disabled || !code.trim()) ? 'none' : 'gradient-shift 3s ease infinite'
          }}
        >
          {loading ? (
            <>
              <div className="spinner" />
              <span style={{ fontSize: '0.95rem' }}>Evaluating Solution...</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '1.25rem' }}>✅</span>
              <span>Submit Solution</span>
            </>
          )}
        </button>
        <button
          onClick={onClear}
          disabled={loading}
          className="notion-btn-secondary disabled:opacity-50"
          style={{
            fontSize: '0.95rem',
            fontWeight: '700',
            padding: '0.875rem 1.25rem',
            backgroundImage: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
            border: '2px solid #fca5a5',
            color: '#991b1b',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(239, 68, 68, 0.2)'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>🗑️</span>
          <span>Clear</span>
        </button>
      </div>

      {loading && (
        <p className="text-xs text-notion-text-secondary text-center mt-3">
          Evaluating your code via AI Agent...
        </p>
      )}
    </div>
  );
}
