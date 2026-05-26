import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import MarketingLayout from '../layouts/MarketingLayout';

type ViewId = 'kanban' | 'list' | 'calendar' | 'timeline';

const VIEWS: { id: ViewId; label: string }[] = [
  { id: 'kanban',   label: 'Kanban' },
  { id: 'list',     label: 'List' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'timeline', label: 'Timeline' },
];

// ── Inline SVGs ─────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const CalIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="17" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);

const ChevDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--fg-subtle)', flexShrink: 0 }}>
    <circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);

const BoardIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>
  </svg>
);

const TrendIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12h4l3-9 4 18 3-9h4"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
  </svg>
);

const CheckIcon = ({ size = 16, strokeWidth = 2.5 }: { size?: number; strokeWidth?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
);

const XCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9"/><path d="M15 9l-6 6M9 9l6 6"/>
  </svg>
);

const CursorArrow = ({ color }: { color: string }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={color}>
    <path d="M5 3l14 8-6 1-3 7z"/>
  </svg>
);

// ── Avatar ───────────────────────────────────────────────────
const AV_COLORS: Record<string, string> = {
  JL: 'oklch(70% 0.12 50)',
  MK: 'oklch(68% 0.13 280)',
  RT: 'oklch(70% 0.13 180)',
  SC: 'oklch(72% 0.10 25)',
};

function Av({ id, size = 18, first = false }: { id: string; size?: number; first?: boolean }) {
  return (
    <span style={{
      width: size, height: size, borderRadius: '50%',
      border: '1.5px solid var(--bg)',
      fontSize: size * 0.5, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      background: AV_COLORS[id] ?? 'var(--fg-subtle)', color: 'white', flexShrink: 0,
      marginLeft: first ? 0 : -6,
    }}>
      {id}
    </span>
  );
}

// ── Shared style objects ─────────────────────────────────────
const WRAP: React.CSSProperties = {
  maxWidth: 1200, margin: '0 auto',
  padding: '0 clamp(20px, 5vw, 64px)',
};

const SECTION_PAD: React.CSSProperties = {
  padding: 'clamp(72px, 9vw, 120px) 0',
  position: 'relative',
};

const EYEBROW: React.CSSProperties = {
  display: 'inline-block', padding: '4px 12px',
  background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)',
  borderRadius: 999, fontSize: 11, fontWeight: 700,
  letterSpacing: '0.08em', textTransform: 'uppercase',
  marginBottom: 18,
};

const EYEBROW_PLAIN: React.CSSProperties = {
  display: 'inline-block', background: 'transparent', color: 'var(--fg-subtle)',
  padding: 0, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', marginBottom: 12,
};

const H2: React.CSSProperties = {
  fontSize: 'clamp(30px, 3.4vw, 44px)',
  lineHeight: 1.05, letterSpacing: '-0.03em',
  fontWeight: 700, margin: '0 0 14px',
  textWrap: 'balance' as never,
};

const BODY_TEXT: React.CSSProperties = {
  fontSize: 15.5, lineHeight: 1.6, color: 'var(--fg-muted)',
  maxWidth: 520, margin: 0,
  letterSpacing: '-0.005em',
};

function Accent({ children }: { children: string }) {
  return (
    <em style={{
      fontFamily: 'var(--font-serif)', fontStyle: 'italic',
      fontWeight: 400, fontSize: '1.05em', color: 'var(--accent)',
    }}>{children}</em>
  );
}

// ── Hero sidebar column ──────────────────────────────────────
function HsCol({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-sunken)', borderRadius: 10, padding: 10,
      display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        textTransform: 'uppercase', color: 'var(--fg-subtle)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '2px 4px 4px',
      }}>
        <span>{title}</span>
        <span style={{ fontWeight: 500, opacity: 0.7 }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function HsCard({ title, tag, accent, avs }: { title: string; tag: string; accent?: boolean; avs: string[] }) {
  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border-subtle)',
      borderRadius: 8, padding: '9px 10px',
      display: 'flex', flexDirection: 'column', gap: 7,
      boxShadow: 'var(--shadow-xs)',
    }}>
      <span style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' }}>{title}</span>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: 9.5, padding: '1px 5px', borderRadius: 3, fontWeight: 600,
          background: accent ? 'var(--accent-soft)' : 'var(--bg-sunken)',
          color: accent ? 'var(--accent-soft-fg)' : 'var(--fg-subtle)',
        }}>{tag}</span>
        <div style={{ display: 'flex' }}>
          {avs.map((id, i) => <Av key={id + i} id={id} size={18} first={i === 0} />)}
        </div>
      </div>
    </div>
  );
}

// ── Closeup task card ────────────────────────────────────────
function CloseupCard({ id, pri, med, title, tags, due, avs, dragging }: {
  id: string; pri: string; med?: boolean; title: string;
  tags: { label: string; accent?: boolean }[];
  due: string; avs: string[]; dragging?: boolean;
}) {
  return (
    <div style={{
      background: 'var(--bg)',
      border: `1px solid ${dragging ? 'var(--accent)' : 'var(--border-subtle)'}`,
      borderRadius: 10, padding: '14px 14px 12px',
      display: 'flex', flexDirection: 'column', gap: 10,
      transform: dragging ? 'rotate(-1.5deg) translateY(-3px)' : undefined,
      boxShadow: dragging ? 'var(--shadow-md)' : undefined,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>{id}</span>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
          background: med ? 'var(--accent-soft)' : 'oklch(96% 0.04 50)',
          color: med ? 'var(--accent-soft-fg)' : 'oklch(40% 0.12 50)',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
          {pri}
        </span>
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' }}>{title}</div>
      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
        {tags.map(t => (
          <span key={t.label} style={{
            fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600,
            background: t.accent ? 'var(--accent-soft)' : 'var(--bg-sunken)',
            color: t.accent ? 'var(--accent-soft-fg)' : 'var(--fg-muted)',
          }}>{t.label}</span>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: 11, color: 'var(--fg-subtle)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
          <CalIcon />{due}
        </span>
        <div style={{ display: 'flex' }}>
          {avs.map((av, i) => <Av key={av + i} id={av} size={22} first={i === 0} />)}
        </div>
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────
export default function Product() {
  const [activeView, setActiveView] = useState<ViewId>('kanban');
  const pillRef = useRef<HTMLSpanElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const positionPill = useCallback(() => {
    const pill = pillRef.current;
    if (!pill) return;
    const idx = VIEWS.findIndex(v => v.id === activeView);
    const tab = tabRefs.current[idx];
    if (!tab) return;
    pill.style.left = tab.offsetLeft + 'px';
    pill.style.width = tab.offsetWidth + 'px';
  }, [activeView]);

  useEffect(() => {
    positionPill();
    window.addEventListener('resize', positionPill);
    return () => window.removeEventListener('resize', positionPill);
  }, [positionPill]);

  return (
    <MarketingLayout currentPage="product">
      <main style={{ overflowX: 'clip' }}>

        {/* ══════════════════════════════════════════════════════
            1. Hero
        ══════════════════════════════════════════════════════ */}
        <div style={WRAP}>
          <section style={{
            textAlign: 'center',
            padding: 'clamp(40px, 6vw, 72px) 0 clamp(40px, 5vw, 64px)',
          }}>
            <span style={EYEBROW}>Product</span>
            <h1 style={{
              fontSize: 'clamp(40px, 5.5vw, 68px)',
              lineHeight: 1.02, letterSpacing: '-0.035em',
              fontWeight: 700, margin: '0 0 18px',
              textWrap: 'balance' as never,
              maxWidth: 820, marginLeft: 'auto', marginRight: 'auto',
            }}>
              Plan the work, <Accent>then get back to it.</Accent>
            </h1>
            <p style={{
              fontSize: 17, lineHeight: 1.55, color: 'var(--fg-muted)',
              maxWidth: 580, margin: '0 auto',
              letterSpacing: '-0.005em',
            }}>
              ZenTask is the Kanban for teams who'd rather think than triage. One workspace, four views, a keyboard for every action.
            </p>
          </section>

          {/* Faux dashboard screenshot */}
          <div aria-label="ZenTask dashboard preview" style={{
            maxWidth: 1120, margin: '0 auto',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 14, boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
          }}>
            {/* Chrome bar */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 14px',
              background: 'var(--bg-sunken)',
              borderBottom: '1px solid var(--border-subtle)',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--border-strong)', opacity: 0.55, flexShrink: 0 }} />
                ))}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--fg-subtle)', flex: 1, textAlign: 'center', letterSpacing: '-0.005em' }}>
                zentask.app / <strong style={{ color: 'var(--fg-muted)', fontWeight: 600 }}>Acme</strong> / Roadmap
              </div>
              <div style={{ width: 60 }} />
            </div>

            {/* Dashboard body */}
            <div className="prod-hero-body">
              <aside className="prod-hs-sidebar" aria-hidden="true">
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '7px 10px', borderRadius: 8,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  marginBottom: 10,
                }}>
                  <span style={{ width: 22, height: 22, borderRadius: 6, background: 'var(--sage-200)', color: 'var(--sage-800)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0 }}>A</span>
                  <span style={{ fontSize: 12, fontWeight: 600, flex: 1 }}>Acme Co.</span>
                  <span style={{ color: 'var(--fg-subtle)', display: 'inline-flex' }}><ChevDown /></span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', margin: '10px 6px 4px' }}>Workspace</div>
                {[
                  { label: 'Dashboard', active: false },
                  { label: 'Boards', active: true },
                  { label: 'My tasks', active: false },
                  { label: 'Inbox', active: false },
                ].map(({ label, active }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 9,
                    padding: '6px 10px', borderRadius: 6, fontSize: 12.5,
                    color: active ? 'var(--accent-soft-fg)' : 'var(--fg-muted)',
                    background: active ? 'var(--accent-soft)' : undefined,
                    fontWeight: active ? 600 : undefined,
                  }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: 'currentColor', opacity: active ? 1 : 0.5, flexShrink: 0 }} />
                    {label}
                  </div>
                ))}
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', margin: '10px 6px 4px' }}>Boards</div>
                {[
                  { label: 'Roadmap', color: 'var(--accent)' },
                  { label: 'Sprint 24', color: 'oklch(60% 0.16 240)' },
                  { label: 'Bug triage', color: 'oklch(64% 0.16 70)' },
                ].map(b => (
                  <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 10px', borderRadius: 6, fontSize: 12.5, color: 'var(--fg-muted)' }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: b.color, flexShrink: 0 }} />
                    {b.label}
                  </div>
                ))}
              </aside>

              <div style={{ padding: '22px 24px', minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                  <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em' }}>
                    Roadmap <small style={{ color: 'var(--fg-subtle)', fontWeight: 500, marginLeft: 8 }}>· Q2 2026</small>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, padding: '6px 10px', borderRadius: 7, background: 'var(--accent)', color: 'var(--btn-primary-fg)' }}>+ New task</span>
                </div>
                <div className="prod-hs-cols">
                  <HsCol title="Backlog" count={8}>
                    <HsCard title="Ship workspace switcher v2" tag="design" accent avs={['JL']} />
                    <HsCard title="Decide on per-seat pricing tiers" tag="growth" avs={['MK']} />
                    <HsCard title="Audit log for Business plan" tag="security" avs={['RT']} />
                  </HsCol>
                  <HsCol title="In progress" count={5}>
                    <HsCard title="Pricing page polish" tag="design" accent avs={['JL', 'MK']} />
                    <HsCard title="WebSocket reconnect on /board" tag="infra" avs={['SC']} />
                    <HsCard title="SAML SSO setup wizard" tag="security" avs={['RT']} />
                  </HsCol>
                  <HsCol title="Review" count={3}>
                    <HsCard title="Calendar drag-to-reschedule" tag="eng" avs={['MK']} />
                    <HsCard title="Empty-state copy pass" tag="content" avs={['SC']} />
                  </HsCol>
                  <HsCol title="Shipped" count={12}>
                    <HsCard title="Sign-up flow v1" tag="design" accent avs={['JL']} />
                    <HsCard title="Workspace switcher dropdown" tag="eng" avs={['MK']} />
                    <HsCard title="Theme: dark mode tokens" tag="design" accent avs={['RT']} />
                  </HsCol>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            2. Boards that breathe
        ══════════════════════════════════════════════════════ */}
        <div style={WRAP}>
          <section className="prod-split" style={SECTION_PAD}>
            <div>
              <span style={EYEBROW_PLAIN}>Kanban</span>
              <h2 style={H2}>Boards that <Accent>breathe.</Accent></h2>
              <p style={BODY_TEXT}>Generous spacing, clear typography, and cards that hold the things you actually look at — assignee, priority, due date. Drag with the keyboard or the mouse. Whichever's closer.</p>
            </div>
            <div className="prod-closeup" aria-label="Two task cards, one being dragged">
              <CloseupCard
                id="ZT-1156" pri="High"
                title="Investigate WebSocket disconnects on the /board page"
                tags={[{ label: 'bug' }, { label: 'infra' }]}
                due="Today" avs={['SC', 'MK']} dragging
              />
              <CloseupCard
                id="ZT-1162" pri="Med" med
                title="Add starter templates to workspace setup"
                tags={[{ label: 'design', accent: true }, { label: 'onboarding' }]}
                due="Fri" avs={['JL']}
              />
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════════
            3. Stay in flow — keyboard-first
        ══════════════════════════════════════════════════════ */}
        <div style={WRAP}>
          <section className="prod-split prod-split--reverse" style={SECTION_PAD}>
            {/* Command palette (visual — first child, goes right via order:2) */}
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 14, boxShadow: 'var(--shadow-lg)',
              overflow: 'hidden', maxWidth: 520,
            }} aria-label="Command palette">
              {/* Search bar */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '14px 16px',
                borderBottom: '1px solid var(--border-subtle)',
              }}>
                <SearchIcon />
                <span style={{ flex: 1, fontSize: 15, color: 'var(--fg)', letterSpacing: '-0.005em' }}>new task</span>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)',
                  padding: '2px 6px', border: '1px solid var(--border)',
                  borderRadius: 4, background: 'var(--bg-sunken)',
                }}>⌘K</span>
              </div>
              {/* Results */}
              <div style={{ padding: 6 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', padding: '8px 10px 4px' }}>Actions</div>
                {/* Active row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 10px', borderRadius: 8,
                  background: 'var(--accent-soft)',
                }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg)', color: 'var(--accent)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <PlusIcon />
                  </span>
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.005em' }}>New task</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>⌘N</span>
                </div>
                {/* Plain row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 10px', borderRadius: 8,
                }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-sunken)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <BoardIcon />
                  </span>
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.005em' }}>New board</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>⌘⇧N</span>
                </div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--fg-subtle)', padding: '8px 10px 4px' }}>Jump to</div>
                {[
                  { icon: <TrendIcon />, label: 'Roadmap', sub: '· board' },
                  { icon: <ClockIcon />, label: 'Sprint 24', sub: '· board' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 10px', borderRadius: 8 }}>
                    <span style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-sunken)', color: 'var(--fg-muted)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {r.icon}
                    </span>
                    <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: 'var(--fg)', letterSpacing: '-0.005em' }}>
                      {r.label} <span style={{ color: 'var(--fg-subtle)', fontSize: 12 }}>{r.sub}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Text + cheat sheet */}
            <div>
              <span style={EYEBROW_PLAIN}>Keyboard-first</span>
              <h2 style={H2}>Stay in <Accent>flow.</Accent></h2>
              <p style={BODY_TEXT}>Every action has a shortcut. ⌘K opens the palette — type what you want, hit return. Power users never need the mouse.</p>
              {/* Keyboard shortcuts grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px',
                maxWidth: 480, marginTop: 24,
              }}>
                {[
                  ['Open palette', '⌘K'],
                  ['New task', '⌘N'],
                  ['Switch workspace', '⌘1–9'],
                  ['Toggle sidebar', '⌘\\'],
                  ['Move card', '⌥←/→'],
                  ['Assign to me', 'A · M'],
                ].map(([label, key]) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '7px 0', borderBottom: '1px solid var(--border-subtle)',
                    fontSize: 13,
                  }}>
                    <span style={{ flex: 1, color: 'var(--fg-muted)', letterSpacing: '-0.005em' }}>{label}</span>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg)',
                      padding: '2px 6px', border: '1px solid var(--border)',
                      borderRadius: 4, background: 'var(--bg)',
                    }}>{key}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════════
            4. Views switcher (full-bleed gradient background)
        ══════════════════════════════════════════════════════ */}
        <section style={{
          background: 'linear-gradient(to bottom, transparent, color-mix(in oklch, var(--accent-soft) 30%, transparent), transparent)',
          padding: 'clamp(72px, 9vw, 120px) 0',
        }}>
          <div style={{ ...WRAP, maxWidth: 1100 }}>
            {/* Section header */}
            <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
              <span style={EYEBROW}>Views</span>
              <h2 style={{ ...H2, margin: '0 0 14px' }}>See it your way.</h2>
              <p style={{ ...BODY_TEXT, maxWidth: '100%', margin: '0 auto' }}>
                Same tasks, four shapes. Plan in Kanban, review in List, schedule in Calendar, ship in Timeline.
              </p>
              {/* Tab bar */}
              <div style={{
                display: 'inline-flex', gap: 4, padding: 4,
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 999, margin: '24px auto 0',
                position: 'relative',
              }} role="tablist" aria-label="Board view">
                <span ref={pillRef} style={{
                  position: 'absolute', top: 4, bottom: 4,
                  background: 'var(--bg)', borderRadius: 999,
                  boxShadow: 'var(--shadow-xs)',
                  transition: 'left 240ms var(--ease-out), width 240ms var(--ease-out)',
                }} />
                {VIEWS.map((v, i) => (
                  <button
                    key={v.id}
                    ref={el => { tabRefs.current[i] = el; }}
                    className="prod-views-tab"
                    type="button"
                    role="tab"
                    aria-selected={activeView === v.id ? 'true' : 'false'}
                    onClick={() => setActiveView(v.id)}
                    style={{
                      padding: '7px 16px', fontFamily: 'inherit',
                      fontSize: 13, fontWeight: 600,
                      border: 0, borderRadius: 999, background: 'transparent',
                      cursor: 'pointer', letterSpacing: '-0.005em',
                      position: 'relative', zIndex: 1,
                    }}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Kanban panel ── */}
            <div role="tabpanel" hidden={activeView !== 'kanban'} style={{ marginTop: 32 }}>
              <div className="prod-v-kanban">
                <HsCol title="Backlog" count={8}>
                  <HsCard title="Workspace switcher v2" tag="design" accent avs={['JL']} />
                  <HsCard title="Per-seat pricing tiers" tag="growth" avs={['MK']} />
                </HsCol>
                <HsCol title="In progress" count={5}>
                  <HsCard title="Pricing page polish" tag="design" accent avs={['JL']} />
                  <HsCard title="WebSocket reconnect" tag="infra" avs={['SC']} />
                </HsCol>
                <HsCol title="Review" count={3}>
                  <HsCard title="Calendar drag-to-reschedule" tag="eng" avs={['MK']} />
                </HsCol>
                <HsCol title="Shipped" count={12}>
                  <HsCard title="Sign-up flow v1" tag="design" accent avs={['JL']} />
                  <HsCard title="Workspace switcher dropdown" tag="eng" avs={['MK']} />
                </HsCol>
              </div>
            </div>

            {/* ── List panel ── */}
            <div role="tabpanel" hidden={activeView !== 'list'} style={{ marginTop: 32 }}>
              <div style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-md)',
              }}>
                <div className="prod-v-list-head">
                  <span /><span>Task</span><span>Status</span><span>Due</span><span>Assignee</span>
                </div>
                {[
                  { done: true,  title: 'Sign-up flow v1',              status: 'Shipped',     statusCls: 'dn',  due: 'Mon',      av: 'JL' },
                  { done: false, title: 'Pricing page polish',          status: 'In progress', statusCls: 'ip',  due: 'Today',    av: 'JL' },
                  { done: false, title: 'WebSocket reconnect on /board', status: 'In progress', statusCls: 'ip', due: 'Today',    av: 'SC' },
                  { done: false, title: 'Calendar drag-to-reschedule',  status: 'In review',   statusCls: 'rv',  due: 'Fri',      av: 'MK' },
                  { done: false, title: 'Audit log for Business plan',  status: 'Backlog',     statusCls: '',    due: 'Next wk',  av: 'RT' },
                  { done: false, title: 'Workspace switcher v2',        status: 'Backlog',     statusCls: '',    due: '—',        av: 'JL' },
                ].map(row => {
                  const chipBg: Record<string, string> = {
                    ip: 'oklch(95% 0.03 240)', rv: 'oklch(95% 0.04 70)', dn: 'var(--accent-soft)',
                  };
                  const chipFg: Record<string, string> = {
                    ip: 'oklch(40% 0.12 240)', rv: 'oklch(40% 0.12 70)', dn: 'var(--accent-soft-fg)',
                  };
                  return (
                    <div key={row.title} className="prod-v-list-row">
                      <span style={{
                        width: 14, height: 14, borderRadius: 4, flexShrink: 0,
                        border: row.done ? 'none' : '1.5px solid var(--border-strong)',
                        background: row.done ? 'var(--accent)' : undefined,
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                      }}>
                        {row.done && <CheckIcon size={10} strokeWidth={3} />}
                      </span>
                      <span style={{
                        fontWeight: 500, letterSpacing: '-0.005em',
                        color: row.done ? 'var(--fg-subtle)' : undefined,
                        textDecoration: row.done ? 'line-through' : undefined,
                      }}>{row.title}</span>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 999, fontWeight: 600,
                        background: chipBg[row.statusCls] ?? 'var(--bg-sunken)',
                        color: chipFg[row.statusCls] ?? 'var(--fg-muted)',
                        justifySelf: 'start',
                      }}>{row.status}</span>
                      <span style={{ color: 'var(--fg-muted)', fontSize: 12.5 }}>{row.due}</span>
                      <span style={{ display: 'flex' }}><Av id={row.av} size={22} first /></span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Calendar panel ── */}
            <div role="tabpanel" hidden={activeView !== 'calendar'} style={{ marginTop: 32 }}>
              <div style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 14, overflow: 'hidden', boxShadow: 'var(--shadow-md)',
              }}>
                {/* Day headers */}
                <div style={{
                  display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
                  background: 'var(--bg-sunken)', borderBottom: '1px solid var(--border-subtle)',
                }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} style={{
                      padding: 10, fontSize: 10.5, fontWeight: 700,
                      letterSpacing: '0.06em', textTransform: 'uppercase',
                      color: 'var(--fg-subtle)', textAlign: 'center',
                    }}>{d}</div>
                  ))}
                </div>
                <div className="prod-v-cal-grid">
                  {[
                    { n: '25', other: true, chips: [] },
                    { n: '26', chips: [{ label: 'Sprint planning', cls: 'blue' }] },
                    { n: '27', today: true, chips: [{ label: 'Pricing polish', cls: '' }, { label: 'WS reconnect', cls: 'amber' }] },
                    { n: '28', chips: [] },
                    { n: '29', chips: [{ label: 'Calendar review', cls: '' }] },
                    { n: '30', chips: [] },
                    { n: '31', chips: [] },
                    { n: '1', chips: [{ label: 'Roadmap sync', cls: 'blue' }] },
                    { n: '2', chips: [] },
                    { n: '3', chips: [{ label: 'SSO wizard', cls: '' }] },
                    { n: '4', chips: [{ label: 'Audit log', cls: 'amber' }] },
                    { n: '5', chips: [] },
                    { n: '6', other: true, chips: [] },
                    { n: '7', other: true, chips: [] },
                  ].map((cell, i) => {
                    const chipBg: Record<string, string> = {
                      blue: 'oklch(95% 0.03 240)', amber: 'oklch(95% 0.04 70)',
                    };
                    const chipFg: Record<string, string> = {
                      blue: 'oklch(40% 0.12 240)', amber: 'oklch(40% 0.12 70)',
                    };
                    return (
                      <div key={i} style={{
                        padding: 8,
                        borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid var(--border-subtle)',
                        borderBottom: '1px solid var(--border-subtle)',
                        color: 'var(--fg-muted)', fontSize: 11,
                        display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0,
                        opacity: cell.other ? 0.6 : 1,
                        background: cell.other ? 'var(--bg-sunken)' : undefined,
                      }}>
                        <span style={{ fontWeight: 600, color: cell.today ? 'var(--accent)' : undefined }}>{cell.n}</span>
                        {cell.chips.map((chip, ci) => (
                          <span key={ci} style={{
                            fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                            background: chipBg[chip.cls] ?? 'var(--accent-soft)',
                            color: chipFg[chip.cls] ?? 'var(--accent-soft-fg)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>{chip.label}</span>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Timeline panel ── */}
            <div role="tabpanel" hidden={activeView !== 'timeline'} style={{ marginTop: 32 }}>
              <div style={{
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                borderRadius: 14, padding: '22px 16px 18px',
                boxShadow: 'var(--shadow-md)', overflow: 'hidden',
              }}>
                <div className="prod-v-tl-head">
                  {['W18','W19','W20','W21','W22','W23','W24','W25'].map(w => <span key={w}>{w}</span>)}
                </div>
                {[
                  { label: 'Pricing redesign',  bar: { left: '0%',   width: '28%', cls: '' },       text: 'Design' },
                  { label: 'Sign-up flow',       bar: { left: '12%',  width: '22%', cls: 'blue' },   text: 'Build' },
                  { label: 'WebSocket fix',      bar: { left: '28%',  width: '14%', cls: 'amber' },  text: 'Patch' },
                  { label: 'SSO setup wizard',   bar: { left: '40%',  width: '24%', cls: '' },       text: 'Design + build' },
                  { label: 'Audit log',          bar: { left: '56%',  width: '30%', cls: 'blue' },   text: 'Build' },
                  { label: 'Workspace v2',       bar: { left: '72%',  width: '26%', cls: 'ghost' },  text: 'Planned' },
                ].map(row => {
                  const barBg: Record<string, string> = {
                    blue: 'oklch(58% 0.16 240)', amber: 'oklch(64% 0.16 70)',
                    ghost: 'color-mix(in oklch, var(--accent) 25%, transparent)',
                  };
                  const barFg: Record<string, string> = { ghost: 'var(--accent-soft-fg)' };
                  return (
                    <div key={row.label} className="prod-v-tl-row">
                      <span className="prod-v-tl-lbl" style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.005em' }}>{row.label}</span>
                      <div style={{ position: 'relative', height: 22 }}>
                        <div style={{
                          position: 'absolute', top: 0, height: 22, borderRadius: 6,
                          background: barBg[row.bar.cls] ?? 'var(--accent)',
                          left: row.bar.left, width: row.bar.width,
                          display: 'flex', alignItems: 'center', padding: '0 8px',
                          fontSize: 11, fontWeight: 600,
                          color: barFg[row.bar.cls] ?? 'var(--btn-primary-fg)',
                          letterSpacing: '-0.005em', whiteSpace: 'nowrap',
                        }}>{row.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════
            5. Quiet by default
        ══════════════════════════════════════════════════════ */}
        <div style={WRAP}>
          <section style={{ ...SECTION_PAD, textAlign: 'center' }}>
            <span style={EYEBROW}>The Principle</span>
            <h2 style={{ ...H2, margin: '0 0 14px' }}>Quiet by <Accent>default.</Accent></h2>
            <p style={{ ...BODY_TEXT, maxWidth: 580, margin: '0 auto' }}>
              We removed the things that distract you from work. Then we removed a few more.
            </p>

            <div className="prod-compare">
              {/* Bad card */}
              <div style={{
                borderRadius: 14, padding: 22,
                display: 'flex', flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)',
                background: 'repeating-linear-gradient(45deg, transparent 0 12px, color-mix(in oklch, oklch(70% 0.18 25) 4%, transparent) 12px 13px), var(--bg-elevated)',
              }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'oklch(48% 0.14 25)',
                  marginBottom: 14, textAlign: 'left',
                }}>A typical PM tool</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'Notification badges on every menu item',
                    'Confetti when you check off a task',
                    '"AI suggestions" everywhere, all the time',
                    'Five colors of red, urgent, panic, mayday',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, lineHeight: 1.45, letterSpacing: '-0.005em', textAlign: 'left' }}>
                      <span style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'oklch(55% 0.18 25)' }}>
                        <XCircleIcon />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 16, padding: 12,
                  background: 'oklch(96% 0.03 25)',
                  border: '1px solid color-mix(in oklch, oklch(55% 0.18 25) 25%, var(--border-subtle))',
                  borderRadius: 8,
                  fontFamily: 'var(--font-mono)', fontSize: 11.5,
                  color: 'oklch(40% 0.14 25)',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: 14 }}>🎉</span>
                  {' '}Great job team! You're on fire! 🔥
                  <span style={{ marginLeft: 'auto', background: 'oklch(60% 0.22 25)', color: 'white', padding: '1px 6px', borderRadius: 999, fontWeight: 700 }}>12</span>
                </div>
              </div>

              {/* Good card */}
              <div style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 14, padding: 22,
                display: 'flex', flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <div style={{
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--fg-subtle)',
                  marginBottom: 14, textAlign: 'left',
                }}>ZenTask</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    'One inbox. Read it when you\'re ready.',
                    'Tasks move quietly. The work is the reward.',
                    'AI helpers exist. You opt in, not the other way around.',
                    'Priority is a label, not a color war.',
                  ].map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13.5, lineHeight: 1.45, letterSpacing: '-0.005em', textAlign: 'left' }}>
                      <span style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <CheckIcon />
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 16, padding: 12,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-muted)' }}>3 updates · since Mon</span>
                  <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontWeight: 600, fontSize: 11.5 }}>Open inbox →</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════════
            6. Built for teams
        ══════════════════════════════════════════════════════ */}
        <div style={WRAP}>
          <section className="prod-split" style={SECTION_PAD}>
            <div>
              <span style={EYEBROW_PLAIN}>Collaboration</span>
              <h2 style={H2}>Built for <Accent>teams.</Accent></h2>
              <p style={BODY_TEXT}>See who's where, mention who needs to know, and ship together — without the noise. Multiplayer without the chaos.</p>
            </div>

            {/* Collab card */}
            <div style={{
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              borderRadius: 14, padding: 22,
              boxShadow: 'var(--shadow-md)', position: 'relative', overflow: 'hidden',
            }} aria-label="A task with live cursors and a comment thread">
              {/* Task card */}
              <div style={{
                background: 'var(--bg)', border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '14px 14px 12px',
                display: 'flex', flexDirection: 'column', gap: 10,
                position: 'relative',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-subtle)' }}>ZT-1142</span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 999,
                    background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                    Med
                  </span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, lineHeight: 1.35, letterSpacing: '-0.005em' }}>Workspace switcher dropdown</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600, background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)' }}>design</span>
                  <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, fontWeight: 600, background: 'var(--bg-sunken)', color: 'var(--fg-muted)' }}>sidebar</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: 'var(--fg-subtle)', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                    <CalIcon />Fri
                  </span>
                  <div style={{ display: 'flex' }}>
                    <Av id="JL" size={22} first /><Av id="MK" size={22} /><Av id="SC" size={22} />
                  </div>
                </div>

                {/* Live cursors */}
                <div style={{ position: 'absolute', top: 6, right: 70, display: 'inline-flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
                  <CursorArrow color="oklch(60% 0.16 280)" />
                  <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, color: 'white', background: 'oklch(60% 0.16 280)', letterSpacing: '-0.005em' }}>Marcus</span>
                </div>
                <div style={{ position: 'absolute', bottom: 30, left: '50%', display: 'inline-flex', alignItems: 'center', gap: 6, pointerEvents: 'none' }}>
                  <CursorArrow color="oklch(58% 0.14 50)" />
                  <span style={{ padding: '2px 7px', borderRadius: 4, fontSize: 11, fontWeight: 600, color: 'white', background: 'oklch(58% 0.14 50)', letterSpacing: '-0.005em' }}>June</span>
                </div>
              </div>

              {/* Comments */}
              {[
                {
                  av: 'MK', name: 'Marcus Kim', time: '2m ago',
                  content: (<><span style={{ color: 'var(--accent)', background: 'var(--accent-soft)', fontWeight: 600, padding: '0 4px', borderRadius: 3 }}>@June</span>{' '}The check icon should be sage, not slate — fixed in the commit. Mind giving it a look before I ship?</>),
                },
                {
                  av: 'JL', name: 'June Lee', time: 'just now',
                  content: 'Looks great. Approved.',
                },
              ].map(c => (
                <div key={c.name} style={{
                  marginTop: 14, background: 'var(--bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10, padding: '12px 14px',
                  display: 'flex', gap: 10,
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: 'white',
                    background: AV_COLORS[c.av],
                  }}>{c.av}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, marginBottom: 4 }}>
                      <strong style={{ fontWeight: 600 }}>{c.name}</strong>
                      <time style={{ color: 'var(--fg-subtle)', marginLeft: 6, fontSize: 11.5 }}>{c.time}</time>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--fg)', lineHeight: 1.5, letterSpacing: '-0.005em' }}>
                      {c.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ══════════════════════════════════════════════════════
            7. Final CTA
        ══════════════════════════════════════════════════════ */}
        <div style={WRAP}>
          <section style={{
            textAlign: 'center',
            padding: 'clamp(72px, 9vw, 120px) 0 clamp(96px, 11vw, 140px)',
          }}>
            <h2 style={{ ...H2, maxWidth: 720, margin: '0 auto 18px' }}>
              Plan calmly. <Accent>Ship anyway.</Accent>
            </h2>
            <p style={{ ...BODY_TEXT, maxWidth: 480, margin: '0 auto 36px', fontSize: 17, lineHeight: 1.55 }}>
              Free for teams up to 10. No credit card required.
            </p>
            <div style={{ display: 'inline-flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Link
                to="/signup?plan=free"
                className="prod-btn prod-btn--primary"
                style={{
                  padding: '11px 18px', borderRadius: 10,
                  border: '1px solid transparent',
                  background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-fg)',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                  letterSpacing: '-0.005em', cursor: 'pointer', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                Get started <ArrowRight />
              </Link>
              <Link
                to="/pricing"
                className="prod-btn"
                style={{
                  padding: '11px 18px', borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-elevated)', color: 'var(--fg)',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
                  letterSpacing: '-0.005em', cursor: 'pointer', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                See pricing
              </Link>
            </div>
          </section>
        </div>

      </main>
    </MarketingLayout>
  );
}
