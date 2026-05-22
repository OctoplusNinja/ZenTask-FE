const TAG_HUE: Record<string, [string, string]> = {
  bug:      ['oklch(94% 0.04 22)',   'oklch(38% 0.13 22)'],
  design:   ['oklch(94% 0.05 80)',   'oklch(40% 0.10 75)'],
  growth:   ['var(--sage-100)',       'var(--sage-800)'],
  infra:    ['oklch(94% 0.035 240)', 'oklch(38% 0.10 240)'],
  research: ['oklch(94% 0.04 300)',  'oklch(38% 0.10 300)'],
  docs:     ['oklch(94% 0.025 200)', 'oklch(40% 0.07 240)'],
};

export function Tag({ name }: { name: string }) {
  const [bg, fg] = TAG_HUE[name] ?? ['var(--neutral-100)', 'var(--neutral-700)'];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      fontSize: 10.5, fontWeight: 500, padding: '1px 7px', borderRadius: 4,
      background: bg, color: fg,
    }}>{name}</span>
  );
}

export function PriorityIcon({ level }: { level: number }) {
  const color = level >= 4 ? 'var(--danger)' : level === 3 ? 'oklch(50% 0.10 75)' : 'var(--fg-muted)';
  const labels = ['Low', 'Medium', 'High', 'Urgent'];
  return (
    <span
      title={labels[level - 1] ?? 'Low'}
      style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 1.5, height: 12, color }}
    >
      {[4, 8, 12, 16].map((h, i) => (
        <span key={i} style={{
          width: 2.5,
          height: h - 2,
          background: i < level ? 'currentColor' : 'var(--border-strong)',
          borderRadius: 1,
        }} />
      ))}
    </span>
  );
}
