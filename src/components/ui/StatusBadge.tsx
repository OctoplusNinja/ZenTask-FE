import type { ColId } from '../../data/data';

type StatusKey = ColId | 'blocked';

const STATUS_HUE: Record<StatusKey, { soft: string; fg: string; dot: string }> = {
  backlog:     { soft: 'var(--neutral-100)',   fg: 'var(--neutral-700)',        dot: 'var(--neutral-400)' },
  in_progress: { soft: 'var(--info-soft)',     fg: 'oklch(38% 0.10 240)',       dot: 'var(--info)' },
  in_review:   { soft: 'var(--warning-soft)',  fg: 'oklch(40% 0.10 75)',        dot: 'var(--warning)' },
  done:        { soft: 'var(--success-soft)',  fg: 'var(--sage-800)',           dot: 'var(--success)' },
  blocked:     { soft: 'var(--danger-soft)',   fg: 'oklch(38% 0.13 22)',        dot: 'var(--danger)' },
};

const STATUS_LABELS: Record<ColId, string> = {
  backlog:     'Backlog',
  in_progress: 'In progress',
  in_review:   'In review',
  done:        'Done',
};

interface StatusBadgeProps {
  status: StatusKey;
  label?: string;
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const c = STATUS_HUE[status] ?? STATUS_HUE.backlog;
  const displayLabel = label ?? STATUS_LABELS[status as ColId] ?? status;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
      background: c.soft, color: c.fg, letterSpacing: '-0.005em',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: c.dot }} />
      {displayLabel}
    </span>
  );
}
