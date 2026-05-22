// Stub panels for items in the sidebar we haven't fully built out.

function StubPanel({ icon, title, blurb, screenLabel }) {
  return (
    <div data-screen-label={screenLabel} style={{
      flex: 1, overflow: 'auto',
      background: 'var(--bg)',
      padding: '20px 28px 40px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.025em' }}>{title}</h1>
        <div style={{ display: 'flex', gap: 6 }}>
          <Button variant="secondary" size="md" icon="filter">Filter</Button>
          <Button variant="primary"   size="md" icon="plus">New</Button>
        </div>
      </div>

      <div style={{
        marginTop: 24,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 14, boxShadow: 'var(--shadow-xs)',
        padding: '64px 24px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 12,
      }}>
        <span style={{
          width: 56, height: 56, borderRadius: 14,
          background: 'var(--accent-soft)', color: 'var(--accent-soft-fg)',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={26} />
        </span>
        <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.015em' }}>{title}</div>
        <div style={{ fontSize: 13.5, color: 'var(--fg-muted)', maxWidth: 460, lineHeight: 1.5 }}>{blurb}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <Button variant="primary" size="md" icon="plus">Add your first {title.toLowerCase()}</Button>
          <Button variant="ghost"   size="md">Learn more</Button>
        </div>
      </div>
    </div>
  );
}

const STUBS = {
  mytasks:  { icon: 'checkcir', title: 'My tasks', blurb: 'Everything assigned to you across every board, in one list. Filter by due date, status, or priority.' },
  inbox:    { icon: 'inbox',    title: 'Inbox',    blurb: 'Mentions, assigned reviews, and changes to tasks you follow. Triage from here without leaving your flow.' },
  calendar: { icon: 'calendar', title: 'Calendar', blurb: 'See deadlines across every board, drag to reschedule, and overlay your work calendar from Google or Outlook.' },
  reports:  { icon: 'chart',    title: 'Reports',  blurb: 'Throughput, cycle time, and a weekly digest of what shipped. Built from your boards — no manual updates.' },
  members:  { icon: 'users',    title: 'Members',  blurb: 'Invite teammates, manage roles, and adjust which spaces each member can see.' },
  settings: { icon: 'settings', title: 'Settings', blurb: 'Workspace preferences, billing, integrations, and personal account settings.' },
};

function Stubs({ panel }) {
  const s = STUBS[panel];
  if (!s) return null;
  return <StubPanel screenLabel={s.title} {...s} />;
}

Object.assign(window, { Stubs });
