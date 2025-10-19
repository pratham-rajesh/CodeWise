'use client';

import { useState, useRef } from 'react';
import { Problem } from '@/lib/api';

interface ImageHintUploaderProps {
  currentProblem: Problem | null;
  userId: string;
  onHintReceived?: () => void;
}

interface HintResponse {
  hints: string[];
  analysis: string;
  encouragement: string;
}

export default function ImageHintUploader({
  currentProblem,
  userId,
  onHintReceived,
}: ImageHintUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [hintResponse, setHintResponse] = useState<HintResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WEBP)');
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    setHintResponse(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGetHint = async () => {
    if (!selectedImage || !currentProblem || !userId) return;

    setLoading(true);
    setHintResponse(null);

    try {
      const response = await fetch('http://localhost:3000/api/get_image_hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          image_base64: selectedImage.split(',')[1], // Remove data:image/...;base64, prefix
          problem_description: currentProblem.description,
          problem_title: currentProblem.title,
          pattern: currentProblem.pattern,
          difficulty: currentProblem.difficulty,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setHintResponse({
          hints: data.hints || [],
          analysis: data.analysis || '',
          encouragement: data.encouragement || '',
        });
        if (onHintReceived) {
          onHintReceived();
        }
      } else {
        alert('Failed to get hints: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error getting hint:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setImageFile(null);
    setHintResponse(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!currentProblem) {
    return (
      <div className="notion-card" style={{ opacity: 0.6 }}>
        <h3 className="text-sm font-semibold text-notion-text mb-3 flex items-center gap-2">
          <span>📸</span>
          <span>Get Hints from Your Notes</span>
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
        <span>📸</span>
        <span>Get Hints from Your Notes</span>
      </h3>

      <div className="space-y-4">
        {/* Current Problem Context */}
        <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs font-medium text-blue-900">
            Current Problem: <span className="font-bold">{currentProblem.title}</span>
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Pattern: {currentProblem.pattern.replace(/_/g, ' ')} • Difficulty: {currentProblem.difficulty}
          </p>
        </div>

        {/* Upload Area */}
        {!selectedImage ? (
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-notion-primary bg-blue-50'
                : 'border-notion-border hover:border-notion-primary hover:bg-notion-bg-secondary'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleChange}
              style={{ display: 'none' }}
            />
            <div className="space-y-2">
              <p className="text-3xl">📤</p>
              <p className="text-sm font-medium text-notion-text">
                Upload your handwritten notes or diagrams
              </p>
              <p className="text-xs text-notion-text-secondary">
                Drag & drop or click to browse
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="notion-btn-secondary mt-2"
                style={{
                  fontSize: '0.875rem',
                  padding: '0.5rem 1rem',
                }}
              >
                Choose Image
              </button>
              <p className="text-xs text-notion-text-secondary mt-2">
                JPG, PNG, WEBP • Max 5MB
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Image Preview */}
            <div className="relative">
              <img
                src={selectedImage}
                alt="Uploaded notes"
                className="w-full rounded-lg border-2 border-notion-border"
                style={{ maxHeight: '300px', objectFit: 'contain' }}
              />
              <button
                onClick={handleClear}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                style={{ fontSize: '1.2rem' }}
              >
                ×
              </button>
            </div>

            {/* Get Hint Button */}
            <button
              onClick={handleGetHint}
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
                  <span>Analyzing Your Notes...</span>
                </>
              ) : (
                <>
                  <span>💡</span>
                  <span>Get Hints (0.5 credits)</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Hint Response */}
        {hintResponse && (
          <div className="space-y-3 animate-fade-in">
            {/* Analysis */}
            {hintResponse.analysis && (
              <div className="p-3 bg-purple-50 rounded-md border border-purple-200">
                <p className="text-xs font-semibold text-purple-900 mb-1">
                  📊 Analysis
                </p>
                <p className="text-sm text-purple-800">{hintResponse.analysis}</p>
              </div>
            )}

            {/* Hints */}
            {hintResponse.hints && hintResponse.hints.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-notion-text">💡 Hints:</p>
                {hintResponse.hints.map((hint, index) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-50 rounded-md border border-yellow-200"
                  >
                    <p className="text-sm text-yellow-900">
                      <span className="font-semibold">{index + 1}.</span> {hint}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Encouragement */}
            {hintResponse.encouragement && (
              <div className="p-3 bg-green-50 rounded-md border border-green-200">
                <p className="text-xs font-semibold text-green-900 mb-1">
                  ✨ Encouragement
                </p>
                <p className="text-sm text-green-800">{hintResponse.encouragement}</p>
              </div>
            )}

            {/* Upload Another */}
            <button
              onClick={handleClear}
              className="notion-btn-secondary w-full"
              style={{
                fontSize: '0.875rem',
                padding: '0.6rem 1rem',
              }}
            >
              <span>📤</span>
              <span>Upload Another Image</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
