import type { ReactNode } from 'react';
import { Link } from 'react-router';
import zenTaskLogo from '../assets/ZenTask Logo Transparent.png';

export const BrandMark = ({ size = 22 }: { size?: number }) => (
  <img src={zenTaskLogo} alt="ZenTask" width={size} height={size} style={{ objectFit: 'contain' }} />
);

const ArrowRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

const NAV_LINKS = [
  { label: 'Product',   href: '/product' },
  { label: 'Pricing',   href: '/pricing' },
  { label: 'Customers', href: '#' },
  { label: 'Changelog', href: '#' },
];

function Nav({ currentPage }: { currentPage?: 'home' | 'pricing' | 'product' }) {
  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '20px clamp(20px, 5vw, 64px)',
      maxWidth: 1280, margin: '0 auto',
    }}>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'var(--fg)' }}>
        <span style={{ color: 'var(--accent)', display: 'inline-flex' }}>
          <BrandMark />
        </span>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em' }}>ZenTask</span>
      </Link>

      <div className="mktg-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {NAV_LINKS.map(link => {
          const isActive =
            (link.label === 'Pricing' && currentPage === 'pricing') ||
            (link.label === 'Product' && currentPage === 'product');
          return (
            <Link
              key={link.label}
              to={link.href}
              className="mktg-nav-link"
              aria-current={isActive ? 'page' : undefined}
              style={{
                fontSize: 13, fontWeight: 500,
                color: isActive ? 'var(--fg)' : 'var(--fg-muted)',
                textDecoration: 'none', letterSpacing: '-0.005em',
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      <Link
        to="/pricing"
        className="zt-btn-primary"
        style={{
          fontSize: 13, fontWeight: 600,
          color: 'var(--btn-primary-fg)',
          textDecoration: 'none', padding: '7px 14px',
          borderRadius: 8, border: '1px solid transparent',
          background: 'var(--btn-primary-bg)',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          letterSpacing: '-0.005em',
          transition: 'background 120ms var(--ease-out), transform 80ms var(--ease-out)',
        }}
      >
        Get started
        <ArrowRight />
      </Link>
    </nav>
  );
}

export function MarketingFooter() {
  return (
    <footer style={{
      maxWidth: 1280, margin: '0 auto',
      padding: '20px clamp(20px, 5vw, 64px) 32px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: 16, flexWrap: 'wrap',
      fontSize: 12, color: 'var(--fg-subtle)',
    }}>
      <span>© 2026 ZenTask, Inc.</span>
      <ul style={{ display: 'flex', gap: 20, listStyle: 'none', margin: 0, padding: 0 }}>
        {['Privacy', 'Terms', 'Security', 'Status'].map(label => (
          <li key={label}>
            <a href="#" className="mktg-footer-link" style={{ color: 'var(--fg-muted)', textDecoration: 'none' }}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
}

interface MarketingLayoutProps {
  children: ReactNode;
  currentPage?: 'home' | 'pricing' | 'product';
}

export default function MarketingLayout({ children, currentPage }: MarketingLayoutProps) {
  return (
    <div className="mktg-bg" style={{ minHeight: '100vh', color: 'var(--fg)', fontFamily: 'var(--font-sans)' }}>
      <Nav currentPage={currentPage} />
      {children}
      <MarketingFooter />
    </div>
  );
}
