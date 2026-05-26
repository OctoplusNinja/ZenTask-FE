import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import MarketingLayout, { BrandMark } from '../layouts/MarketingLayout';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.4-4.5 2.4-7.2 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.1 5.6l6.2 5.2c-.4.4 6.6-4.8 6.6-14.8 0-1.3-.1-2.4-.4-3.5z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const ArrowRight = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const inputStyle = {
  padding: '10px 12px', fontFamily: 'inherit', fontSize: 14,
  border: '1px solid var(--border)', borderRadius: 10,
  background: 'var(--bg)', color: 'var(--fg)',
  letterSpacing: '-0.005em', width: '100%',
} as const;

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <MarketingLayout currentPage="home">
      <main
        className="mktg-main-grid"
        style={{
          maxWidth: 1280, margin: '0 auto',
          padding: 'clamp(24px, 4vw, 48px) clamp(20px, 5vw, 64px) 96px',
          minHeight: 'calc(100vh - 96px)',
        }}
      >
        {/* ── Left: editorial ── */}
        <section>
          <a
            href="#"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '5px 14px 5px 6px',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 999, fontSize: 12.5, fontWeight: 500,
              color: 'var(--fg-muted)', textDecoration: 'none',
              boxShadow: 'var(--shadow-xs)', letterSpacing: '-0.005em',
              marginBottom: 28,
            }}
          >
            <span style={{
              padding: '2px 8px', background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)',
              borderRadius: 999, fontSize: 10.5, fontWeight: 700,
              letterSpacing: '0.04em', textTransform: 'uppercase',
            }}>New</span>
            Weekly auto-summaries are in beta
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--fg-subtle)' }}>
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </a>

          <h1
            className="text-balance"
            style={{
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              lineHeight: 1.02, letterSpacing: '-0.035em',
              fontWeight: 700, margin: '0 0 20px',
            }}
          >
            A{' '}
            <em style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontWeight: 400, fontSize: '1.05em',
              color: 'var(--accent)',
            }}>calmer</em>
            {' '}place<br />to plan the work.
          </h1>

          <p
            className="text-pretty"
            style={{
              fontSize: 17, lineHeight: 1.55, color: 'var(--fg-muted)',
              maxWidth: 480, margin: '0 0 36px',
              letterSpacing: '-0.005em',
            }}
          >
            ZenTask is a Kanban for teams who'd rather think than triage. Boards that breathe, tasks that stay where you put them.
          </p>
        </section>

        {/* ── Right: sign-in card ── */}
        <section style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 16,
              boxShadow: 'var(--shadow-lg)',
              padding: '36px 36px 28px',
              maxWidth: 440,
              width: '100%',
            }}
          >
            {/* Head */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 24, textAlign: 'center' }}>
              <span style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--accent-soft)', color: 'var(--accent)',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BrandMark />
              </span>
              <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>
                Sign in to ZenTask
              </h2>
              <p style={{ fontSize: 13.5, color: 'var(--fg-muted)', margin: 0, letterSpacing: '-0.005em' }}>
                Welcome back. Pick up where you left off.
              </p>
            </div>

            {/* OAuth */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {[
                { icon: <GoogleIcon />, label: 'Continue with Google' },
                { icon: <LockIcon />, label: 'Continue with SSO' },
              ].map(btn => (
                <button
                  key={btn.label}
                  type="button"
                  className="mktg-oauth"
                  onClick={() => navigate('/dashboard')}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    padding: '10px 14px', borderRadius: 10,
                    border: '1px solid var(--border)', background: 'var(--bg)',
                    color: 'var(--fg)', fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
                    cursor: 'pointer', letterSpacing: '-0.005em',
                  }}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div
              className="mktg-divider"
              style={{
                margin: '6px 0 18px',
                fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: 'var(--fg-subtle)',
              }}
            >
              or
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              <label htmlFor="signin-email" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>
                Work email
              </label>
              <input
                id="signin-email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mktg-input"
                style={inputStyle}
              />
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label htmlFor="signin-password" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>
                  Password
                </label>
                <a href="#" className="mktg-forgot" style={{ fontSize: 12, color: 'var(--fg-muted)', textDecoration: 'none' }}>
                  Forgot?
                </a>
              </div>
              <input
                id="signin-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mktg-input"
                style={inputStyle}
              />
            </div>

            {/* Remember */}
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--fg-muted)', margin: '2px 0 18px', cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                style={{ width: 14, height: 14, accentColor: 'var(--accent)' }}
              />
              Keep me signed in
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="zt-btn-primary"
              style={{
                width: '100%', padding: '11px 14px',
                background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-fg)',
                border: '1px solid transparent', borderRadius: 10,
                fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                letterSpacing: '-0.005em', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'background 120ms var(--ease-out), transform 80ms var(--ease-out)',
              }}
            >
              Sign in
              <ArrowRight />
            </button>

            {/* Footer */}
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', fontSize: 12.5, color: 'var(--fg-muted)', textAlign: 'center', letterSpacing: '-0.005em' }}>
              New to ZenTask?{' '}
              <Link to="/signup" className="mktg-accent-link">Start free</Link>
            </div>
          </form>
        </section>
      </main>
    </MarketingLayout>
  );
}
