'use client';

import Link from 'next/link';
import { useState } from 'react';

interface HeaderProps {
  userId: string;
  successRate: number;
  totalChallenges: number;
}

export default function Header({
  userId,
  successRate,
  totalChallenges,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)',
      borderBottom: '2px solid var(--color-notion-border)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
    }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo and Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              🎯
            </div>
            <div>
              <h1 style={{
                fontSize: '1.875rem',
                fontWeight: '800',
                backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.025em'
              }}>
                Code Wise
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-notion-text-secondary)', fontWeight: '500' }}>
                A smart way to prepare for technical interviews
              </p>
            </div>
          </div>

          {/* Stats Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
              borderRadius: '9999px',
              border: '2px solid var(--color-notion-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-notion-text-secondary)', fontWeight: '600' }}>👤 User:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--color-notion-text)' }}>{userId}</span>
            </div>
            <div style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
              borderRadius: '9999px',
              border: '2px solid #6ee7b7',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#065f46', fontWeight: '600' }}>🎯 Success:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#064e3b' }}>{successRate}%</span>
            </div>
            <div style={{
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '9999px',
              border: '2px solid #fcd34d',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: '600' }}>🏆 Challenges:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#78350f' }}>{totalChallenges}</span>
            </div>

            {/* Navigation Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                style={{
                  padding: '0.5rem 1rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'var(--color-notion-text)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  border: '2px solid var(--color-notion-border)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-notion-border)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }}
              >
                <span style={{ fontSize: '1rem' }}>☰</span>
                <span>Menu</span>
                <span style={{ fontSize: '0.75rem', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  background: 'white',
                  border: '2px solid var(--color-notion-border)',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)',
                  minWidth: '200px',
                  overflow: 'hidden',
                  zIndex: 100
                }}>
                  <Link
                    href="/"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      color: 'var(--color-notion-text)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.15s',
                      borderBottom: '1px solid var(--color-notion-border)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(59, 130, 246, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/blind75"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.875rem 1rem',
                      color: 'var(--color-notion-text)',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(139, 92, 246, 0.08)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>📋</span>
                    <span>Blind 75 Checklist</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
