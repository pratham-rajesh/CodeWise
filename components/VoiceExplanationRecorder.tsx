'use client';

import { useState, useRef, useEffect } from 'react';
import { Problem, ExplanationEvaluation } from '@/lib/api';

interface VoiceExplanationRecorderProps {
  currentProblem: Problem | null;
  userId: string;
  onEvaluationReceived?: (evaluation: ExplanationEvaluation) => void;
}

export default function VoiceExplanationRecorder({
  currentProblem,
  userId,
  onEvaluationReceived,
}: VoiceExplanationRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<ExplanationEvaluation | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_RECORDING_TIME = 120; // 2 minutes in seconds

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setPermissionDenied(false);
      setEvaluation(null);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      setPermissionDenied(true);
      alert('Microphone access denied. Please enable microphone permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleEvaluate = async () => {
    if (!audioBlob || !currentProblem || !userId) return;

    setLoading(true);
    setEvaluation(null);

    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);

      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        const base64Data = base64Audio.split(',')[1]; // Remove data:audio/...;base64, prefix

        const response = await fetch('http://localhost:3000/api/evaluate_explanation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            audio_base64: base64Data,
            problem_title: currentProblem.title,
            problem_description: currentProblem.description,
            pattern: currentProblem.pattern,
            difficulty: currentProblem.difficulty,
          }),
        });

        const data = await response.json();

        if (data.success) {
          setEvaluation(data);
          if (onEvaluationReceived) {
            onEvaluationReceived(data);
          }
        } else {
          alert('Failed to evaluate explanation: ' + (data.error || 'Unknown error'));
        }

        setLoading(false);
      };

      reader.onerror = () => {
        alert('Error reading audio file');
        setLoading(false);
      };

    } catch (error) {
      console.error('Error evaluating explanation:', error);
      alert('Network error. Please try again.');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setAudioBlob(null);
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
    setAudioURL(null);
    setRecordingTime(0);
    setEvaluation(null);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!currentProblem) {
    return (
      <div className="notion-card" style={{ opacity: 0.6 }}>
        <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
          <span>🎙️</span>
          <span>Explain Your Solution (Voice)</span>
        </h3>
        <p className="text-sm text-notion-text-secondary italic">
          Get a challenge first to use this feature
        </p>
      </div>
    );
  }

  return (
    <div className="notion-card">
      <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
        <span>🎙️</span>
        <span>Explain Your Solution (Voice)</span>
      </h3>

      <div className="space-y-4">
        {/* Current Problem Context */}
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs font-medium text-blue-900">
            Current Problem: <span className="font-bold">{currentProblem.title}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Pattern: {currentProblem?.pattern?.replace(/_/g, ' ') || 'N/A'} • Difficulty: {currentProblem?.difficulty || 'N/A'}
          </p>
        </div>

        {/* Permission Denied Warning */}
        {permissionDenied && (
          <div className="p-3 bg-red-50 rounded-md border border-red-200">
            <p className="text-xs font-semibold text-red-900">
              Microphone access denied. Please enable permissions and try again.
            </p>
          </div>
        )}

        {/* Recording Controls */}
        {!audioBlob ? (
          <div className="space-y-3">
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-2 border-purple-200">
              <p className="text-sm font-medium text-purple-900 mb-2">
                Explain your approach as if you're in an interview:
              </p>
              <ul className="text-xs text-purple-800 space-y-1 list-disc list-inside">
                <li>Describe the problem and your understanding</li>
                <li>Explain your solution approach and algorithm</li>
                <li>Discuss time & space complexity</li>
                <li>Mention edge cases and trade-offs</li>
              </ul>
              <p className="text-xs text-purple-700 mt-2 font-semibold">
                Max duration: 2 minutes
              </p>
            </div>

            {/* Timer Display */}
            {isRecording && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 rounded-full border-2 border-red-400">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-lg font-mono font-bold text-red-900">
                    {formatTime(recordingTime)}
                  </span>
                  <span className="text-xs text-red-700">/ 2:00</span>
                </div>
              </div>
            )}

            {/* Record/Stop Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-full ${
                isRecording
                  ? 'notion-btn-danger'
                  : 'notion-btn-primary'
              }`}
              style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                padding: '0.75rem 1.25rem',
              }}
            >
              {isRecording ? (
                <>
                  <span>⏹️</span>
                  <span>Stop Recording</span>
                </>
              ) : (
                <>
                  <span>🎙️</span>
                  <span>Start Recording</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Audio Preview */}
            <div className="p-3 bg-green-50 rounded-md border border-green-200">
              <p className="text-xs font-semibold text-green-900 mb-2">
                Recording Complete ({formatTime(recordingTime)})
              </p>
              {audioURL && (
                <audio controls className="w-full" src={audioURL}>
                  Your browser does not support audio playback.
                </audio>
              )}
            </div>

            {/* Evaluate Button */}
            <button
              onClick={handleEvaluate}
              disabled={loading}
              className="notion-btn-primary w-full disabled:opacity-50"
              style={{
                fontSize: '0.95rem',
                fontWeight: '700',
                padding: '0.75rem 1.25rem',
              }}
            >
              {loading ? (
                <>
                  <div className="spinner" />
                  <span>Evaluating Your Explanation...</span>
                </>
              ) : (
                <>
                  <span>🎯</span>
                  <span>Evaluate Explanation (1 credit)</span>
                </>
              )}
            </button>

            {/* Record Again Button */}
            <button
              onClick={handleClear}
              disabled={loading}
              className="notion-btn-secondary w-full disabled:opacity-50"
              style={{
                fontSize: '0.875rem',
                padding: '0.6rem 1rem',
              }}
            >
              <span>🔄</span>
              <span>Record Again</span>
            </button>
          </div>
        )}

        {/* Evaluation Results */}
        {evaluation && evaluation.success && (
          <div className="space-y-3 animate-fade-in">
            {/* Overall Score */}
            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-blue-900">Overall Score</p>
                <div className="text-2xl font-bold text-blue-600">
                  {evaluation.score}/100
                </div>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${evaluation.score}%` }}
                ></div>
              </div>
            </div>

            {/* Transcript */}
            {evaluation.transcript && (
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-xs font-semibold text-gray-900 mb-1">
                  📝 Transcript
                </p>
                <p className="text-sm text-gray-800 italic">{evaluation.transcript}</p>
              </div>
            )}

            {/* Detailed Feedback Breakdown */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-notion-text">📊 Breakdown:</p>
              {Object.entries(evaluation.feedback).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-200">
                  <span className="text-xs font-medium text-purple-900 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-xs font-bold text-purple-700">
                    {value}/{key === 'edgeCases' || key === 'communication' ? 10 : 20}
                  </span>
                </div>
              ))}
            </div>

            {/* Strengths */}
            {evaluation.strengths && evaluation.strengths.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-notion-text">✅ Strengths:</p>
                {evaluation.strengths.map((strength, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-md border border-green-200">
                    <p className="text-sm text-green-900">
                      <span className="font-semibold">{index + 1}.</span> {strength}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions */}
            {evaluation.suggestions && evaluation.suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-notion-text">💡 Suggestions:</p>
                {evaluation.suggestions.map((suggestion, index) => (
                  <div key={index} className="p-3 bg-yellow-50 rounded-md border border-yellow-200">
                    <p className="text-sm text-yellow-900">
                      <span className="font-semibold">{index + 1}.</span> {suggestion}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
