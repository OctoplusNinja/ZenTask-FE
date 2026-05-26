import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { BrandMark, MarketingFooter } from '../layouts/MarketingLayout';

// ── Icons ──────────────────────────────────────────────────────────

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

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>
  </svg>
);

// Template icons
const RoadmapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h4l3-9 4 18 3-9h4"/>
  </svg>
);
const SprintIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const BlankIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
  </svg>
);
const WorkspaceIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4"/>
    <path d="M9 3v18"/>
    <path d="M3 9h6"/>
  </svg>
);

// ── Slug derive helper ─────────────────────────────────────────────

function deriveSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// ── Shared style constants ─────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  padding: '10px 12px', fontFamily: 'inherit', fontSize: 14,
  border: '1px solid var(--border)', borderRadius: 10,
  background: 'var(--bg)', color: 'var(--fg)',
  letterSpacing: '-0.005em', width: '100%',
};

type Template = 'roadmap' | 'sprint' | 'marketing' | 'blank';

const PLAN_COPY: Record<string, string> = {
  free:     'Start on the Free plan. Upgrade your workspace anytime.',
  starter:  'Starting on the Starter plan — $8 per member / month.',
  business: 'Starting on the Business plan — $14 per member / month.',
};

const TEMPLATES: { id: Template; icon: React.ReactNode; name: string; sub: string }[] = [
  { id: 'roadmap',   icon: <RoadmapIcon />, name: 'Roadmap',           sub: 'Quarterly themes, in progress, shipped.' },
  { id: 'sprint',    icon: <SprintIcon />,  name: 'Sprint',            sub: 'Backlog, this week, doing, done.' },
  { id: 'marketing', icon: <CalendarIcon />, name: 'Marketing calendar', sub: 'Ideas, drafting, scheduled, live.' },
  { id: 'blank',     icon: <BlankIcon />,   name: 'Blank',             sub: 'An empty board. Roll your own.' },
];

// ── Component ─────────────────────────────────────────────────────

export default function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') ?? 'free';
  const planSub = PLAN_COPY[plan] ?? PLAN_COPY.free;

  const [step, setStep] = useState(1);
  const [animKey, setAnimKey] = useState(0);

  // Step 1 state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Step 2 state
  const [wsName, setWsName] = useState('');
  const [wsSlug, setWsSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [template, setTemplate] = useState<Template>('roadmap');

  function goTo(n: number) {
    setStep(n);
    setAnimKey(k => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleWsNameChange(val: string) {
    setWsName(val);
    if (!slugTouched) setWsSlug(deriveSlug(val));
  }

  function handleWsSlugChange(val: string) {
    setSlugTouched(true);
    setWsSlug(val.toLowerCase().replace(/[^a-z0-9-]/g, ''));
  }

  function handleStep1Submit(e: { preventDefault(): void }) {
    e.preventDefault();
    if (!wsName) {
      const domain = email.split('@')[1] ?? '';
      const base = domain.split('.')[0] ?? '';
      if (base) {
        const derived = base.charAt(0).toUpperCase() + base.slice(1);
        setWsName(derived);
        if (!slugTouched) setWsSlug(deriveSlug(derived));
      }
    }
    goTo(2);
  }

  function handleOAuth() { goTo(2); }

  function handleStep2Submit(e: { preventDefault(): void }) {
    e.preventDefault();
    navigate('/dashboard');
  }

  const stepDotStyle = (n: number): React.CSSProperties => {
    const isActive = step === n;
    const isDone = n < step;
    return {
      width: 22, height: 22, borderRadius: '50%',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 11, fontWeight: 700,
      background: isActive ? 'var(--accent)' : isDone ? 'var(--accent-soft)' : 'var(--bg-elevated)',
      color: isActive ? 'var(--btn-primary-fg)' : isDone ? 'var(--accent)' : 'var(--fg-subtle)',
      border: isActive || isDone ? '1px solid transparent' : '1px solid var(--border)',
    };
  };

  const stepLabelColor = (n: number) =>
    step === n ? 'var(--fg)' : n < step ? 'var(--fg-muted)' : 'var(--fg-subtle)';

  return (
    <div className="mktg-bg" style={{ minHeight: '100vh', color: 'var(--fg)', fontFamily: 'var(--font-sans)' }}>
      {/* ── Nav ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px clamp(20px, 5vw, 64px)',
        maxWidth: 1280, margin: '0 auto',
      }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--fg)' }}>
          <span style={{ color: 'var(--accent)', display: 'inline-flex' }}><BrandMark /></span>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>ZenTask</span>
        </Link>
        <Link to="/" className="mktg-nav-link" style={{ fontSize: 13, fontWeight: 500, color: 'var(--fg-muted)', textDecoration: 'none', letterSpacing: '-0.005em' }}>
          Already have an account?{' '}
          <strong style={{ color: 'var(--fg)', fontWeight: 600, marginLeft: 4 }}>Sign in</strong>
        </Link>
      </nav>

      {/* ── Main ── */}
      <main style={{ maxWidth: 520, margin: '0 auto', padding: 'clamp(16px, 4vw, 32px) 20px 64px' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
          {[1, 2].map((n, idx) => (
            <>
              <div
                key={n}
                className="mktg-step"
                style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.005em', color: stepLabelColor(n) }}
              >
                <span className="mktg-step-dot" style={stepDotStyle(n)}>{n}</span>
                <span>{n === 1 ? 'Account' : 'Workspace'}</span>
              </div>
              {idx === 0 && <span style={{ width: 28, height: 1, background: 'var(--border)' }} />}
            </>
          ))}
        </div>

        {/* Animated card wrapper */}
        <div key={animKey} style={{ animation: 'mktg-fadeIn 220ms var(--ease-out)' }}>

          {/* ── Step 1: Account ── */}
          {step === 1 && (
            <form
              onSubmit={handleStep1Submit}
              noValidate
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 16, boxShadow: 'var(--shadow-lg)',
                padding: '36px 36px 28px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 24, textAlign: 'center' }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BrandMark />
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>Create your account</h2>
                <p className="text-pretty" style={{ fontSize: 13.5, color: 'var(--fg-muted)', margin: 0, letterSpacing: '-0.005em', maxWidth: 360 }}>
                  {planSub}
                </p>
              </div>

              {/* OAuth */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                {[
                  { icon: <GoogleIcon />, label: 'Sign up with Google' },
                  { icon: <LockIcon />, label: 'Sign up with SSO' },
                ].map(btn => (
                  <button
                    key={btn.label}
                    type="button"
                    className="mktg-oauth"
                    onClick={handleOAuth}
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

              <div className="mktg-divider" style={{ margin: '6px 0 18px', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)' }}>
                or
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <label htmlFor="su-name" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>Full name</label>
                <input id="su-name" type="text" placeholder="Alex Rivera" autoComplete="name" required className="mktg-input" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <label htmlFor="su-email" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>Work email</label>
                <input id="su-email" type="email" placeholder="you@company.com" autoComplete="email" required className="mktg-input" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <label htmlFor="su-password" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>Password</label>
                <input id="su-password" type="password" placeholder="At least 8 characters" autoComplete="new-password" required minLength={8} className="mktg-input" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
              </div>

              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: 'var(--fg-muted)', margin: '6px 0 18px', lineHeight: 1.45, cursor: 'pointer', userSelect: 'none' }}>
                <input type="checkbox" required checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} style={{ width: 14, height: 14, accentColor: 'var(--accent)', marginTop: 2, flexShrink: 0 }} />
                <span>
                  I agree to ZenTask's{' '}
                  <a href="#" className="mktg-accent-link">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="mktg-accent-link">Privacy Policy</a>.
                </span>
              </label>

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
                Continue
                <ArrowRight />
              </button>

              <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border-subtle)', fontSize: 12.5, color: 'var(--fg-muted)', textAlign: 'center', letterSpacing: '-0.005em' }}>
                Already have an account?{' '}
                <Link to="/" className="mktg-accent-link">Sign in</Link>
              </div>
            </form>
          )}

          {/* ── Step 2: Workspace ── */}
          {step === 2 && (
            <form
              onSubmit={handleStep2Submit}
              noValidate
              style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 16, boxShadow: 'var(--shadow-lg)',
                padding: '36px 36px 28px',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, marginBottom: 24, textAlign: 'center' }}>
                <span style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--accent-soft)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <WorkspaceIcon />
                </span>
                <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', margin: 0 }}>Set up your workspace</h2>
                <p className="text-pretty" style={{ fontSize: 13.5, color: 'var(--fg-muted)', margin: 0, letterSpacing: '-0.005em', maxWidth: 360 }}>
                  A workspace is where your team lives. You can rename it or invite people anytime.
                </p>
              </div>

              {/* Workspace name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <label htmlFor="ws-name" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>Workspace name</label>
                <input
                  id="ws-name" type="text" placeholder="Acme Co." autoComplete="organization" required
                  className="mktg-input"
                  value={wsName}
                  onChange={e => handleWsNameChange(e.target.value)}
                  style={inputStyle}
                />
              </div>

              {/* Workspace URL */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
                <label htmlFor="ws-slug" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>Workspace URL</label>
                <div
                  className="mktg-slug"
                  style={{
                    display: 'flex', alignItems: 'stretch',
                    border: '1px solid var(--border)', borderRadius: 10,
                    background: 'var(--bg)', overflow: 'hidden',
                  }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center',
                    padding: '0 12px', fontSize: 13.5, color: 'var(--fg-subtle)',
                    background: 'var(--bg-sunken)', borderRight: '1px solid var(--border-subtle)',
                    fontFamily: 'var(--font-mono)', letterSpacing: '-0.005em',
                    whiteSpace: 'nowrap',
                  }}>
                    zentask.app/
                  </span>
                  <input
                    id="ws-slug"
                    type="text"
                    placeholder="acme"
                    pattern="[a-z0-9-]+"
                    required
                    value={wsSlug}
                    onChange={e => handleWsSlugChange(e.target.value)}
                    style={{
                      flex: 1, border: 0, borderRadius: 0, background: 'transparent',
                      fontFamily: 'var(--font-mono)', fontSize: 13.5,
                      padding: '10px 12px', color: 'var(--fg)',
                      outline: 'none', minWidth: 0,
                    }}
                  />
                </div>
                <span style={{ fontSize: 11.5, color: 'var(--fg-subtle)', letterSpacing: '-0.005em', marginTop: 2 }}>
                  Lowercase letters, numbers, and dashes only.
                </span>
              </div>

              {/* Template picker */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg)', letterSpacing: '-0.005em' }}>Starter template</label>
                <span style={{ fontSize: 11.5, color: 'var(--fg-subtle)', letterSpacing: '-0.005em' }}>
                  We'll create your first board with a few example tasks. You can delete them.
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Starter template"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, margin: '6px 0 20px' }}
              >
                {TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    type="button"
                    role="radio"
                    aria-checked={template === tpl.id}
                    aria-pressed={template === tpl.id ? 'true' : 'false'}
                    onClick={() => setTemplate(tpl.id)}
                    className="mktg-tpl"
                    style={{
                      display: 'flex', alignItems: 'flex-start', gap: 10,
                      padding: 12, border: '1px solid var(--border)', borderRadius: 12,
                      background: 'var(--bg)', cursor: 'pointer', textAlign: 'left',
                      fontFamily: 'inherit', color: 'var(--fg)',
                    }}
                  >
                    <span
                      className="mktg-tpl-icon"
                      style={{
                        width: 28, height: 28, borderRadius: 7,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--accent)', flexShrink: 0,
                      }}
                    >
                      {tpl.icon}
                    </span>
                    <span>
                      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.25, marginBottom: 2, letterSpacing: '-0.005em' }}>{tpl.name}</div>
                      <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', lineHeight: 1.35 }}>{tpl.sub}</div>
                    </span>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button
                  type="button"
                  className="mktg-back-btn"
                  onClick={() => goTo(1)}
                  style={{
                    padding: '11px 16px', border: '1px solid var(--border)', borderRadius: 10,
                    background: 'transparent', color: 'var(--fg-muted)',
                    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                    letterSpacing: '-0.005em', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    transition: 'background 120ms var(--ease-out), border-color 120ms var(--ease-out)',
                    flexShrink: 0,
                  }}
                >
                  <ArrowLeft />
                  Back
                </button>
                <button
                  type="submit"
                  className="zt-btn-primary"
                  style={{
                    flex: 1, padding: '11px 14px',
                    background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-fg)',
                    border: '1px solid transparent', borderRadius: 10,
                    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                    letterSpacing: '-0.005em', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 120ms var(--ease-out), transform 80ms var(--ease-out)',
                  }}
                >
                  Create workspace
                  <ArrowRight />
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
