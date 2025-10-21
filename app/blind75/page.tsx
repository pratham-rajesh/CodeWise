'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Blind75Checklist from '@/components/Blind75Checklist';

export default function Blind75Page() {
  const [userId, setUserId] = useState('user_da741dsxm');
  const [statistics, setStatistics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, [userId]);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/blind75/statistics/${userId}`
      );
      const data = await response.json();

      if (data.success) {
        setStatistics(data.statistics);
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPatternName = (pattern: string) => {
    return pattern
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen notion-bg">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Page Header */}
          <div className="notion-card">
            <h1 className="text-3xl font-bold text-notion-text mb-3 flex items-center gap-3">
              <span>🎯</span>
              <span>Blind 75 LeetCode Problems</span>
            </h1>
            <p className="text-notion-text-secondary">
              Master the 75 most important coding interview problems curated by NeetCode.
              Track your progress and build interview confidence.
            </p>
          </div>

          {/* Statistics Overview */}
          {!loading && statistics && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Overall Progress */}
              <div className="notion-card">
                <div className="text-sm font-medium text-notion-text-secondary mb-2">
                  Overall Progress
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl font-bold text-notion-text">
                    {statistics.completed}
                  </div>
                  <div className="text-lg text-notion-text-secondary">
                    / {statistics.total}
                  </div>
                </div>
                <div className="text-sm text-blue-600 font-medium mt-1">
                  {statistics.progressPercentage}% Complete
                </div>
              </div>

              {/* Difficulty Breakdown */}
              <div className="notion-card">
                <div className="text-sm font-medium text-notion-text-secondary mb-3">
                  By Difficulty
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">Easy</span>
                    <span className="text-xs text-notion-text-secondary">
                      {statistics.byDifficulty.Easy.completed} /{' '}
                      {statistics.byDifficulty.Easy.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-yellow-600 font-medium">Medium</span>
                    <span className="text-xs text-notion-text-secondary">
                      {statistics.byDifficulty.Medium.completed} /{' '}
                      {statistics.byDifficulty.Medium.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-red-600 font-medium">Hard</span>
                    <span className="text-xs text-notion-text-secondary">
                      {statistics.byDifficulty.Hard.completed} /{' '}
                      {statistics.byDifficulty.Hard.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pattern Breakdown */}
              <div className="notion-card">
                <div className="text-sm font-medium text-notion-text-secondary mb-3">
                  Top Patterns
                </div>
                <div className="space-y-2">
                  {Object.entries(statistics.byPattern || {})
                    .sort((a: any, b: any) => b[1].total - a[1].total)
                    .slice(0, 3)
                    .map(([pattern, stats]: [string, any]) => (
                      <div key={pattern} className="flex items-center justify-between">
                        <span className="text-sm text-notion-text truncate">
                          {formatPatternName(pattern)}
                        </span>
                        <span className="text-xs text-notion-text-secondary">
                          {stats.completed} / {stats.total}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* Checklist */}
          <Blind75Checklist userId={userId} />

          {/* Info Card */}
          <div className="notion-card bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-semibold text-notion-text mb-2">About Blind 75</h3>
                <p className="text-sm text-notion-text-secondary leading-relaxed">
                  The Blind 75 is a curated list of 75 LeetCode problems that cover the most
                  important data structures and algorithms patterns for coding interviews. Created
                  by a Facebook engineer, this list has helped thousands of developers prepare for
                  FAANG interviews. Completing these problems will give you strong fundamentals for
                  any technical interview.
                </p>
                <div className="mt-3 flex gap-4 text-sm">
                  <a
                    href="https://www.youtube.com/@NeetCode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    NeetCode YouTube →
                  </a>
                  <a
                    href="https://leetcode.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    LeetCode →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
