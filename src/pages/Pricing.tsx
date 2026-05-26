import { useState, useLayoutEffect, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router';
import MarketingLayout from '../layouts/MarketingLayout';

const CheckIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ color: 'var(--accent)', flexShrink: 0, ...style }}
  >
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

type Billing = 'monthly' | 'annual';

const FREE_FEATURES = [
  <><strong>1</strong> workspace</>,
  <>Up to <strong>10</strong> members</>,
  <>Unlimited boards &amp; tasks</>,
  <>Kanban, list &amp; calendar views</>,
  <>14 days of activity history</>,
];

const STARTER_FEATURES = [
  <><strong>Unlimited</strong> workspaces</>,
  <>Up to <strong>50</strong> members per workspace</>,
  <>Custom workflows &amp; automations</>,
  <>Weekly auto-summaries (beta)</>,
  <>Unlimited activity history</>,
  <>Priority email support</>,
];

const BUSINESS_FEATURES = [
  <><strong>Unlimited</strong> members</>,
  <>SAML SSO &amp; SCIM provisioning</>,
  <>Audit log &amp; admin roles</>,
  <>Cross-workspace reporting</>,
  <>Guest access for clients</>,
  <>99.9% uptime SLA</>,
];

const ENTERPRISE_FEATURES = [
  'Custom data residency',
  'Dedicated CSM',
  'Custom MSA & DPA',
  'SOC 2 Type II & HIPAA',
  'Annual invoicing',
  'Onboarding & training',
];

export default function Pricing() {
  const [billing, setBilling] = useState<Billing>('monthly');
  const monthlyRef = useRef<HTMLButtonElement>(null);
  const annualRef = useRef<HTMLButtonElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  const positionPill = useCallback(() => {
    const btn = billing === 'monthly' ? monthlyRef.current : annualRef.current;
    const pill = pillRef.current;
    if (!btn || !pill) return;
    pill.style.left = btn.offsetLeft + 'px';
    pill.style.width = btn.offsetWidth + 'px';
  }, [billing]);

  useLayoutEffect(() => { positionPill(); }, [positionPill]);

  useEffect(() => {
    window.addEventListener('resize', positionPill);
    return () => window.removeEventListener('resize', positionPill);
  }, [positionPill]);

  const price = (monthly: number, annual: number) =>
    billing === 'monthly' ? monthly : annual;

  const billedNote = billing === 'annual'
    ? 'Billed annually. Save 20%.'
    : 'Billed monthly. Switch anytime.';

  const ctaStyle = (primary = false): React.CSSProperties => ({
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    padding: '11px 14px', borderRadius: 10,
    border: primary ? '1px solid transparent' : '1px solid var(--border)',
    background: primary ? 'var(--btn-primary-bg)' : 'var(--bg)',
    color: primary ? 'var(--btn-primary-fg)' : 'var(--fg)',
    fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600,
    letterSpacing: '-0.005em',
    textDecoration: 'none', cursor: 'pointer',
    marginBottom: 22,
  });

  return (
    <MarketingLayout currentPage="pricing">
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(24px, 5vw, 56px) clamp(20px, 5vw, 64px) 96px' }}>

        {/* ── Header ── */}
        <header style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 44px' }}>
          <span style={{
            display: 'inline-block', padding: '4px 12px',
            background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)',
            borderRadius: 999, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            marginBottom: 18,
          }}>
            Pricing
          </span>

          <h1
            className="text-balance"
            style={{ fontSize: 'clamp(38px, 5vw, 58px)', lineHeight: 1.02, letterSpacing: '-0.035em', fontWeight: 700, margin: '0 0 16px' }}
          >
            Pay for the{' '}
            <em style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.05em', color: 'var(--accent)' }}>
              people
            </em>
            , not the projects.
          </h1>

          <p className="text-pretty" style={{ fontSize: 17, lineHeight: 1.55, color: 'var(--fg-muted)', margin: 0, letterSpacing: '-0.005em' }}>
            Per-member pricing. Unlimited workspaces on every paid plan. Cancel anytime.
          </p>

          {/* ── Billing toggle ── */}
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div
              role="tablist"
              aria-label="Billing period"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 4, padding: 4,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 999, margin: '28px auto 8px',
                position: 'relative',
              }}
            >
              <div
                ref={pillRef}
                style={{
                  position: 'absolute', top: 4, bottom: 4,
                  background: 'var(--bg)', borderRadius: 999,
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'left 240ms var(--ease-out), width 240ms var(--ease-out)',
                }}
              />
              <button
                ref={monthlyRef}
                type="button"
                className="mktg-billing-btn"
                aria-pressed={billing === 'monthly'}
                onClick={() => setBilling('monthly')}
                style={{
                  padding: '7px 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  letterSpacing: '-0.005em', border: 0, borderRadius: 999,
                  background: 'transparent', cursor: 'pointer',
                  position: 'relative', zIndex: 1,
                }}
              >
                Monthly
              </button>
              <button
                ref={annualRef}
                type="button"
                className="mktg-billing-btn"
                aria-pressed={billing === 'annual'}
                onClick={() => setBilling('annual')}
                style={{
                  padding: '7px 16px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                  letterSpacing: '-0.005em', border: 0, borderRadius: 999,
                  background: 'transparent', cursor: 'pointer',
                  position: 'relative', zIndex: 1,
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}
              >
                Annual
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
                  padding: '2px 6px', borderRadius: 999,
                  background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)',
                  textTransform: 'uppercase',
                }}>
                  −20%
                </span>
              </button>
            </div>
          </div>
        </header>

        {/* ── Tier grid ── */}
        <section
          className="mktg-tier-grid"
          aria-label="Plans"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, alignItems: 'stretch' }}
        >
          {/* Free */}
          <div
            className="mktg-tier"
            style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '28px 26px 26px',
              display: 'flex', flexDirection: 'column', position: 'relative',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--fg)' }}>Free</div>
            <p className="text-pretty" style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '6px 0 22px', lineHeight: 1.5, letterSpacing: '-0.005em', minHeight: 39 }}>
              For solo planners and small teams getting started.
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>$0</span>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)', letterSpacing: '-0.005em', lineHeight: 1.35 }}>forever</span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', letterSpacing: '-0.005em', marginBottom: 22, minHeight: 16 }}>
              No credit card required.
            </div>

            <Link to="/signup?plan=free" className="mktg-tier-cta" style={ctaStyle(false)}>
              Get started
            </Link>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FREE_FEATURES.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>
                  <CheckIcon style={{ marginTop: 3 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Starter (featured) */}
          <div
            className="mktg-tier mktg-tier--featured"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--accent)',
              boxShadow: '0 0 0 1px var(--accent) inset, var(--shadow-md)',
              borderRadius: 16, padding: '28px 26px 26px',
              display: 'flex', flexDirection: 'column', position: 'relative',
            }}
          >
            <span style={{
              position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
              padding: '3px 10px',
              background: 'var(--accent)', color: 'var(--btn-primary-fg)',
              fontSize: 10.5, fontWeight: 700, letterSpacing: '0.06em',
              textTransform: 'uppercase', borderRadius: 999,
              boxShadow: 'var(--shadow-sm)',
              whiteSpace: 'nowrap',
            }}>
              Most popular
            </span>
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--fg)' }}>Starter</div>
            <p className="text-pretty" style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '6px 0 22px', lineHeight: 1.5, letterSpacing: '-0.005em', minHeight: 39 }}>
              For growing teams who need real collaboration.
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--fg-muted)', alignSelf: 'flex-start', marginTop: 6 }}>$</span>
              <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {price(8, 6)}
              </span>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)', letterSpacing: '-0.005em', lineHeight: 1.35 }}>
                per member<br />/ month
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', letterSpacing: '-0.005em', marginBottom: 22, minHeight: 16 }}>
              {billedNote}
            </div>

            <Link to="/signup?plan=starter" className="mktg-tier-cta mktg-tier-cta-primary" style={ctaStyle(true)}>
              Start with Starter
              <ArrowRight />
            </Link>

            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', margin: '8px 0 2px' }}>
              Everything in Free, plus
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {STARTER_FEATURES.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>
                  <CheckIcon style={{ marginTop: 3 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div
            className="mktg-tier"
            style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 16, padding: '28px 26px 26px',
              display: 'flex', flexDirection: 'column', position: 'relative',
            }}
          >
            <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--fg)' }}>Business</div>
            <p className="text-pretty" style={{ fontSize: 13, color: 'var(--fg-muted)', margin: '6px 0 22px', lineHeight: 1.5, letterSpacing: '-0.005em', minHeight: 39 }}>
              For organizations that need control and reporting.
            </p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--fg-muted)', alignSelf: 'flex-start', marginTop: 6 }}>$</span>
              <span style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                {price(14, 11)}
              </span>
              <span style={{ fontSize: 13, color: 'var(--fg-muted)', letterSpacing: '-0.005em', lineHeight: 1.35 }}>
                per member<br />/ month
              </span>
            </div>
            <div style={{ fontSize: 11.5, color: 'var(--fg-subtle)', letterSpacing: '-0.005em', marginBottom: 22, minHeight: 16 }}>
              {billedNote}
            </div>

            <Link to="/signup?plan=business" className="mktg-tier-cta" style={ctaStyle(false)}>
              Start with Business
            </Link>

            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', margin: '8px 0 2px' }}>
              Everything in Starter, plus
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {BUSINESS_FEATURES.map((f, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>
                  <CheckIcon style={{ marginTop: 3 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Enterprise ── */}
        <section
          className="mktg-enterprise"
          aria-label="Enterprise"
          style={{
            marginTop: 40,
            display: 'grid', gridTemplateColumns: '1.4fr 1fr',
            gap: 32, alignItems: 'center',
            padding: '32px 36px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-subtle)', marginBottom: 8 }}>
              Enterprise
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
              For larger teams with custom needs.
            </h3>
            <p className="text-pretty" style={{ fontSize: 14, color: 'var(--fg-muted)', margin: 0, lineHeight: 1.5, letterSpacing: '-0.005em' }}>
              Volume pricing, dedicated support, custom contracts, and security review. Built for companies that take procurement seriously.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
              <a href="#" className="mktg-tier-cta mktg-tier-cta-primary" style={{ ...ctaStyle(true), marginBottom: 0 }}>
                Talk to sales
              </a>
              <a href="#" className="mktg-tier-cta" style={{ ...ctaStyle(false), marginBottom: 0 }}>
                Download security pack
              </a>
            </div>
          </div>

          <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px', listStyle: 'none', padding: 0, margin: 0 }}>
            {ENTERPRISE_FEATURES.map(f => (
              <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--fg)', letterSpacing: '-0.005em' }}>
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
        </section>

        {/* ── Footnote ── */}
        <p style={{ textAlign: 'center', marginTop: 56, fontSize: 13, color: 'var(--fg-muted)', letterSpacing: '-0.005em' }}>
          Prices in USD.{' '}
          <a href="#" className="mktg-accent-link">See full feature comparison</a>
          {' · '}
          <a href="#" className="mktg-accent-link">Read pricing FAQs</a>
        </p>
      </main>
    </MarketingLayout>
  );
}
