function avHue(initials: string): number {
  let h = 0;
  for (const c of initials) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

interface AvatarProps {
  initials: string;
  size?: number;
  presence?: 'on' | 'away' | 'off';
  ringColor?: string;
}

export function Avatar({ initials, size = 24, presence, ringColor }: AvatarProps) {
  const hue = avHue(initials);
  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
      <span
        style={{
          width: size, height: size,
          fontSize: Math.round(size * 0.42),
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

interface AvatarStackProps {
  people: { initials: string }[];
  size?: number;
  max?: number;
}

export function AvatarStack({ people, size = 24, max = 3 }: AvatarStackProps) {
  const shown = people.slice(0, max);
  const rest = people.length - max;
  return (
    <span style={{ display: 'inline-flex' }}>
      {shown.map((p, i) => (
        <span
          key={p.initials + i}
          style={{ marginLeft: i === 0 ? 0 : -size * 0.33, boxShadow: '0 0 0 2px var(--bg-elevated)', borderRadius: 999 }}
        >
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
