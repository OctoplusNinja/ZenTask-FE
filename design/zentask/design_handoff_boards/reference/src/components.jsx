// Shared atoms used across the app kit.

// ---- Avatar -----------------------------------------------------------
// Deterministic hue from initials so the same person is always the same color.
function avHue(initials) {
  let h = 0;
  for (const c of initials) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
function Avatar({ initials, size = 24, presence, ringColor }) {
  const hue = avHue(initials);
  const dim = { width: size, height: size, fontSize: Math.round(size * 0.42) };
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <span
        style={{
          ...dim,
          borderRadius: 999,
          background: `oklch(58% 0.10 ${hue})`,
          color: 'white',
          fontWeight: 600,
          letterSpacing: '-0.01em',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          boxShadow: ringColor ? `0 0 0 2px ${ringColor}` : undefined,
        }}
      >
        {initials}
      </span>
      {presence && (
        <span
          style={{
            position: 'absolute',
            right: -1, bottom: -1,
            width: Math.max(8, size * 0.32),
            height: Math.max(8, size * 0.32),
            borderRadius: 999,
            background: presence === 'on' ? 'var(--success)' : presence === 'away' ? 'var(--warning)' : 'var(--neutral-400)',
            border: '2px solid var(--bg-elevated)',
          }}
        />
      )}
    </span>
  );
}

function AvatarStack({ people, size = 24, max = 3 }) {
  const shown = people.slice(0, max);
  const rest = people.length - max;
  return (
    <span style={{ display: 'inline-flex' }}>
      {shown.map((p, i) => (
        <span key={p.initials + i} style={{ marginLeft: i === 0 ? 0 : -size * 0.33, boxShadow: '0 0 0 2px var(--bg-elevated)', borderRadius: 999 }}>
          <Avatar initials={p.initials} size={size} />
        </span>
      ))}
      {rest > 0 && (
        <span style={{
          marginLeft: -size * 0.33,
          width: size, height: size,
          borderRadius: 999,
          background: 'var(--neutral-200)',
          color: 'var(--neutral-700)',
          fontWeight: 600,
          fontSize: Math.round(size * 0.4),
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 0 2px var(--bg-elevated)',
        }}>+{rest}</span>
      )}
    </span>
  );
}

// ---- Button -----------------------------------------------------------
function Button({ variant = 'secondary', size = 'md', icon, iconRight, children, onClick, style, ...rest }) {
  const styles = {
    primary:   { background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-fg)', border: '1px solid transparent' },
    secondary: { background: 'var(--bg-elevated)', color: 'var(--fg)', border: '1px solid var(--border)' },
    ghost:     { background: 'transparent', color: 'var(--fg)', border: '1px solid transparent' },
    soft:      { background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)', border: '1px solid transparent' },
    danger:    { background: 'var(--danger)', color: 'white', border: '1px solid transparent' },
  }[variant];
  const sz = { sm: { padding: '5px 10px', fontSize: 12 }, md: { padding: '7px 12px', fontSize: 13 }, lg: { padding: '10px 16px', fontSize: 14 } }[size];
  return (
    <button onClick={onClick} className={`zt-btn zt-btn-${variant}`} style={{
      ...styles, ...sz,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontFamily: 'inherit', fontWeight: 600, letterSpacing: '-0.005em',
      borderRadius: 8, cursor: 'pointer', transition: 'all 120ms var(--ease-out)',
      ...style,
    }} {...rest}>
      {icon && <Icon name={icon} size={14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
}

function IconButton({ icon, size = 14, label, active, onClick, style, ...rest }) {
  return (
    <button onClick={onClick} aria-label={label} title={label} className="zt-iconbtn" style={{
      background: active ? 'var(--bg-active)' : 'transparent',
      border: 0, padding: 6, borderRadius: 6,
      color: active ? 'var(--fg)' : 'var(--fg-subtle)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 120ms var(--ease-out)', ...style,
    }} {...rest}>
      <Icon name={icon} size={size} />
    </button>
  );
}

// ---- Badge & Tag ------------------------------------------------------
const STATUS_HUE = {
  backlog: { soft: 'var(--neutral-100)', fg: 'var(--neutral-700)', dot: 'var(--neutral-400)' },
  in_progress: { soft: 'var(--info-soft)', fg: 'oklch(38% 0.10 240)', dot: 'var(--info)' },
  in_review: { soft: 'var(--warning-soft)', fg: 'oklch(40% 0.10 75)', dot: 'var(--warning)' },
  done: { soft: 'var(--success-soft)', fg: 'var(--sage-800)', dot: 'var(--success)' },
  blocked: { soft: 'var(--danger-soft)', fg: 'oklch(38% 0.13 22)', dot: 'var(--danger)' },
};
function StatusBadge({ status, label }) {
  const c = STATUS_HUE[status] || STATUS_HUE.backlog;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
      background: c.soft, color: c.fg, letterSpacing: '-0.005em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: c.dot }} />
      {label}
    </span>
  );
}

const TAG_HUE = {
  bug:      ['oklch(94% 0.04 22)',  'oklch(38% 0.13 22)'],
  design:   ['oklch(94% 0.05 80)',  'oklch(40% 0.10 75)'],
  growth:   ['var(--sage-100)',      'var(--sage-800)'],
  infra:    ['oklch(94% 0.035 240)', 'oklch(38% 0.10 240)'],
  research: ['oklch(94% 0.04 300)',  'oklch(38% 0.10 300)'],
  docs:     ['oklch(94% 0.025 200)', 'oklch(40% 0.07 240)'],
};
function Tag({ name }) {
  const [bg, fg] = TAG_HUE[name] || ['var(--neutral-100)', 'var(--neutral-700)'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 10.5, fontWeight: 500, padding: '1px 7px', borderRadius: 4,
      background: bg, color: fg,
    }}>{name}</span>
  );
}

function PriorityIcon({ level }) {
  // level: 1 low, 2 medium, 3 high, 4 urgent
  const color = level >= 4 ? 'var(--danger)' : level === 3 ? 'oklch(50% 0.10 75)' : 'var(--fg-muted)';
  const bars = [4, 8, 12, 16];
  return (
    <span title={['Low','Medium','High','Urgent'][level - 1]} style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 1.5, height: 12, color }}>
      {bars.map((h, i) => (
        <span key={i} style={{
          width: 2.5, height: h - 2,
          background: i < level ? 'currentColor' : 'var(--border-strong)',
          borderRadius: 1,
        }} />
      ))}
    </span>
  );
}

Object.assign(window, { Avatar, AvatarStack, Button, IconButton, StatusBadge, Tag, PriorityIcon });
