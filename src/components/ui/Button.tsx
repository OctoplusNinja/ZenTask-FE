import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react';
import { Icon } from './Icon';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconRight?: string;
  children?: ReactNode;
}

const VARIANT_STYLES: Record<Variant, CSSProperties> = {
  primary:   { background: 'var(--btn-primary-bg)',  color: 'var(--btn-primary-fg)', border: '1px solid transparent' },
  secondary: { background: 'var(--bg-elevated)',     color: 'var(--fg)',             border: '1px solid var(--border)' },
  ghost:     { background: 'transparent',            color: 'var(--fg)',             border: '1px solid transparent' },
  soft:      { background: 'var(--accent-soft)',     color: 'var(--accent-soft-fg)', border: '1px solid transparent' },
  danger:    { background: 'var(--danger)',          color: 'white',                 border: '1px solid transparent' },
};

const SIZE_STYLES: Record<Size, CSSProperties> = {
  sm: { padding: '5px 10px', fontSize: 12 },
  md: { padding: '7px 12px', fontSize: 13 },
  lg: { padding: '10px 16px', fontSize: 14 },
};

export function Button({ variant = 'secondary', size = 'md', icon, iconRight, children, style, ...rest }: ButtonProps) {
  return (
    <button
      className={`zt-btn zt-btn-${variant}`}
      style={{
        ...VARIANT_STYLES[variant],
        ...SIZE_STYLES[size],
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'inherit', fontWeight: 600, letterSpacing: '-0.005em',
        borderRadius: 8, cursor: 'pointer', transition: 'all 120ms var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      {icon && <Icon name={icon} size={14} />}
      {children}
      {iconRight && <Icon name={iconRight} size={14} />}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  size?: number;
  label?: string;
  active?: boolean;
}

export function IconButton({ icon, size = 14, label, active, style, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className="zt-iconbtn"
      style={{
        background: active ? 'var(--bg-active)' : 'transparent',
        border: 0, padding: 6, borderRadius: 6,
        color: active ? 'var(--fg)' : 'var(--fg-subtle)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 120ms var(--ease-out)',
        ...style,
      }}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}
