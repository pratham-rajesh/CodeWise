'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blind75Problem {
  _id: string;
  problemId: string;
  order: number;
  title: string;
  titleSlug: string;
  pattern: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  leetcodeUrl: string;
  videoUrl?: string;
  completed?: boolean;
  progressInfo?: {
    status: 'not_started' | 'in_progress' | 'completed';
    attempts: number;
    lastAttempt?: string;
    completedAt?: string;
  };
}

interface Blind75ChecklistProps {
  userId: string;
}

export default function Blind75Checklist({ userId }: Blind75ChecklistProps) {
  const [problems, setProblems] = useState<Blind75Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Blind75Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [progress, setProgress] = useState({
    completed: 0,
    total: 75,
    percentage: 0,
  });

  const patterns = [
    'all',
    'sliding_window',
    'two_pointers',
    'binary_search',
    'dynamic_programming',
    'graph_bfs',
    'graph_dfs',
    'backtracking',
    'greedy',
    'heap',
    'linked_list',
  ];

  const difficulties = ['all', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    loadProblems();
  }, [userId]);

  useEffect(() => {
    filterProblems();
  }, [problems, selectedPattern, selectedDifficulty]);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/blind75?user_id=${userId}`);
      const data = await response.json();

      if (data.success) {
        setProblems(data.problems);
        updateProgress(data.problems);
      }
    } catch (error) {
      console.error('Error loading Blind 75 problems:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProblems = () => {
    let filtered = [...problems];

    if (selectedPattern !== 'all') {
      filtered = filtered.filter((p) => p.pattern === selectedPattern);
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((p) => p.difficulty === selectedDifficulty);
    }

    setFilteredProblems(filtered);
  };

  const updateProgress = (problemList: Blind75Problem[]) => {
    const completed = problemList.filter((p) => p.completed).length;
    const total = problemList.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    setProgress({ completed, total, percentage });
  };

  const handleToggleComplete = async (problem: Blind75Problem) => {
    try {
      const endpoint = problem.completed
        ? `/api/blind75/${problem.titleSlug}/in-progress`
        : `/api/blind75/${problem.titleSlug}/complete`;

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        // Reload problems to get updated state
        await loadProblems();
      }
    } catch (error) {
      console.error('Error toggling problem status:', error);
    }
  };

  const formatPatternName = (pattern: string) => {
    return pattern
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-600 bg-green-50';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'Hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (problem: Blind75Problem) => {
    if (problem.completed) {
      return '✅';
    } else if (problem.progressInfo?.status === 'in_progress') {
      return '🔄';
    } else {
      return '⭕';
    }
  };

  if (loading) {
    return (
      <div className="notion-card">
        <div className="flex items-center justify-center py-12">
          <div className="text-notion-text-secondary">Loading Blind 75 problems...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="notion-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span>📋</span>
            <span>Blind 75 Progress</span>
          </h2>
          <div className="text-right">
            <div className="text-2xl font-bold text-notion-text">
              {progress.completed}/{progress.total}
            </div>
            <div className="text-sm text-notion-text-secondary">{progress.percentage}% Complete</div>
          </div>
        </div>

        <div className="w-full bg-notion-bg-secondary rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Filters */}
      <div className="notion-card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pattern Filter */}
          <div>
            <label className="block text-sm font-medium text-notion-text mb-2">
              Filter by Pattern
            </label>
            <select
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
              className="w-full p-2 rounded-md border border-notion-border bg-notion-bg-secondary text-notion-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {patterns.map((pattern) => (
                <option key={pattern} value={pattern}>
                  {pattern === 'all' ? 'All Patterns' : formatPatternName(pattern)}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-sm font-medium text-notion-text mb-2">
              Filter by Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full p-2 rounded-md border border-notion-border bg-notion-bg-secondary text-notion-text focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'all' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Problems List */}
      <div className="notion-card">
        <h3 className="text-sm font-semibold text-notion-text mb-4">
          Problems ({filteredProblems.length})
        </h3>

        <div className="space-y-2">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <div
                key={problem.problemId}
                className="flex items-center gap-3 p-3 bg-notion-bg-secondary rounded-md border border-notion-border hover:border-blue-300 transition-colors"
              >
                {/* Checkbox */}
                <button
                  onClick={() => handleToggleComplete(problem)}
                  className="text-xl hover:scale-110 transition-transform"
                  title={problem.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  {getStatusIcon(problem)}
                </button>

                {/* Order */}
                <span className="text-xs font-mono text-notion-text-secondary w-8">
                  #{problem.order}
                </span>

                {/* Problem Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-medium ${
                        problem.completed
                          ? 'text-notion-text-secondary line-through'
                          : 'text-notion-text'
                      }`}
                    >
                      {problem.title}
                    </span>
                    <span className="text-xs text-notion-text-secondary">
                      ({formatPatternName(problem.pattern)})
                    </span>
                  </div>

                  {problem.progressInfo && problem.progressInfo.attempts > 0 && (
                    <div className="text-xs text-notion-text-secondary mt-1">
                      {problem.progressInfo.attempts} attempt
                      {problem.progressInfo.attempts !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>

                {/* Difficulty Badge */}
                <span
                  className={`text-xs font-medium px-2 py-1 rounded ${getDifficultyColor(
                    problem.difficulty
                  )}`}
                >
                  {problem.difficulty}
                </span>

                {/* Links */}
                <div className="flex items-center gap-2">
                  <a
                    href={problem.leetcodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    title="View on LeetCode"
                  >
                    LeetCode
                  </a>
                  {problem.videoUrl && (
                    <a
                      href={problem.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-red-600 hover:text-red-700 hover:underline"
                      title="Watch video explanation"
                    >
                      Video
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-notion-text-secondary italic text-center py-8">
              No problems match the selected filters
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
