'use client';

interface HeaderProps {
  userId: string;
  creditsUsed: number;
  successRate: number;
  totalChallenges: number;
}

export default function Header({
  userId,
  creditsUsed,
  successRate,
  totalChallenges,
}: HeaderProps) {
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
                Pattern-Trainer Agent
              </h1>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-notion-text-secondary)', fontWeight: '500' }}>
                AI-Powered Algorithm Practice ✨
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
              background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              borderRadius: '9999px',
              border: '2px solid #93c5fd',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
            }}>
              <span style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: '600' }}>💎 Credits:</span>
              <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e3a8a' }}>{creditsUsed}</span>
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
          </div>
        </div>
      </div>
    </header>
  );
}
