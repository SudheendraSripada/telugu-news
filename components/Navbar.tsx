'use client'
import { useState } from 'react'
import Link from 'next/link'

function Logo() {
  return (
    <svg width="52" height="72" viewBox="0 0 110 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="55,2 52,10 58,10" fill="#F0CC55"/>
      <circle cx="55" cy="11" r="2.5" fill="#D4AF37"/>
      <rect x="49" y="13" width="12" height="3" rx="1.5" fill="#D4AF37"/>
      <rect x="46" y="16" width="18" height="3" rx="1.5" fill="#D4AF37"/>
      <rect x="43" y="19" width="24" height="3.5" rx="1.5" fill="#B8962E"/>
      <circle cx="49" cy="20.5" r="1.2" fill="#F0CC55"/><circle cx="55" cy="20.5" r="1.5" fill="#F0CC55"/><circle cx="61" cy="20.5" r="1.2" fill="#F0CC55"/>
      <rect x="40" y="22" width="30" height="4" rx="2" fill="#D4AF37"/>
      <path d="M38 30 Q30 35 26 48 Q22 62 20 78 Q18 92 20 108 Q21 118 24 126" stroke="#1A0A00" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <path d="M72 30 Q80 35 84 48 Q88 62 90 78 Q92 92 90 108 Q89 118 86 126" stroke="#1A0A00" strokeWidth="8" fill="none" strokeLinecap="round"/>
      <ellipse cx="55" cy="40" rx="16" ry="18" fill="#F5C89A" stroke="#C8A070" strokeWidth="0.5"/>
      <circle cx="55" cy="29" r="2.5" fill="#C8102E"/><circle cx="55" cy="29" r="1.2" fill="#F0CC55" opacity="0.9"/>
      <path d="M44 35 Q48 32.5 52 33.5" stroke="#1A0A00" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M58 33.5 Q62 32.5 66 35" stroke="#1A0A00" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M44 38.5 Q48 35.5 52 38.5 Q48 41.5 44 38.5Z" fill="#1A0A00"/>
      <path d="M58 38.5 Q62 35.5 66 38.5 Q62 41.5 58 38.5Z" fill="#1A0A00"/>
      <circle cx="47" cy="37.5" r="1" fill="white" opacity="0.7"/>
      <circle cx="61" cy="37.5" r="1" fill="white" opacity="0.7"/>
      <path d="M49 49 Q52 47.5 55 48 Q58 47.5 61 49" stroke="#C86060" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <path d="M49 49 Q52 51.5 55 51 Q58 51.5 61 49" fill="#E08080" stroke="#C86060" strokeWidth="0.6"/>
      <circle cx="38.5" cy="42" r="4" fill="#D4AF37" stroke="#B8962E" strokeWidth="0.7"/>
      <circle cx="38.5" cy="42" r="2" fill="#F0CC55"/>
      <line x1="38.5" y1="46" x2="38.5" y2="52" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="38.5" cy="54.5" rx="3" ry="2" fill="#D4AF37"/>
      <circle cx="71.5" cy="42" r="4" fill="#D4AF37" stroke="#B8962E" strokeWidth="0.7"/>
      <circle cx="71.5" cy="42" r="2" fill="#F0CC55"/>
      <line x1="71.5" y1="46" x2="71.5" y2="52" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round"/>
      <ellipse cx="71.5" cy="54.5" rx="3" ry="2" fill="#D4AF37"/>
      <rect x="50" y="57" width="10" height="9" rx="3" fill="#F5C89A"/>
      <path d="M40 61 Q55 67 70 61" stroke="#D4AF37" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M36 65 Q55 74 74 65" stroke="#D4AF37" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <circle cx="55" cy="75" r="3.5" fill="#D4AF37"/><circle cx="55" cy="75" r="1.8" fill="#F0CC55"/>
      <path d="M30 70 Q24 76 22 88 L88 88 Q86 76 80 70 Q68 64 55 64 Q42 64 30 70Z" fill="#C8102E"/>
      <path d="M32 70 Q55 78 78 70" stroke="#D4AF37" strokeWidth="1.2" fill="none"/>
      <rect x="24" y="85" width="62" height="6" rx="3" fill="#D4AF37"/>
      <circle cx="40" cy="88" r="2" fill="#F0CC55"/><circle cx="55" cy="88" r="2.5" fill="#F0CC55"/><circle cx="70" cy="88" r="2" fill="#F0CC55"/>
      <path d="M22 88 Q18 100 19 114 L91 114 Q92 100 88 88Z" fill="#C8102E"/>
      <path d="M25 94 Q55 101 85 94" stroke="#D4AF37" strokeWidth="0.9" fill="none" opacity="0.6"/>
      <path d="M22 102 Q55 109 88 102" stroke="#D4AF37" strokeWidth="0.9" fill="none" opacity="0.6"/>
      <path d="M19 114 Q16 128 18 142 L92 142 Q94 128 91 114Z" fill="#A00D24"/>
      <path d="M20 118 Q55 124 90 118" stroke="#D4AF37" strokeWidth="1.2" fill="none" opacity="0.8"/>
      <path d="M30 72 Q18 80 12 96" stroke="#F5C89A" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M12 96 Q10 104 11 110" stroke="#F5C89A" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <ellipse cx="16" cy="90" rx="5" ry="2" fill="none" stroke="#D4AF37" strokeWidth="2"/>
      <ellipse cx="16" cy="93" rx="5" ry="2" fill="none" stroke="#F0CC55" strokeWidth="1.5"/>
      <line x1="10" y1="110" x2="8" y2="78" stroke="#8B7355" strokeWidth="2.5" strokeLinecap="round"/>
      <ellipse cx="4" cy="72" rx="2.5" ry="5" fill="#C8A84B" transform="rotate(-30,4,72)"/>
      <ellipse cx="7" cy="69" rx="2.5" ry="5" fill="#C8A84B" transform="rotate(-15,7,69)"/>
      <ellipse cx="9" cy="67" rx="2.5" ry="5" fill="#C8A84B" transform="rotate(0,9,67)"/>
      <ellipse cx="12" cy="68" rx="2.5" ry="5" fill="#C8A84B" transform="rotate(15,12,68)"/>
      <ellipse cx="14" cy="71" rx="2.5" ry="5" fill="#C8A84B" transform="rotate(28,14,71)"/>
      <path d="M8 78 Q2 70 5 62" stroke="#2D7A2D" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M80 72 Q92 80 98 96" stroke="#F5C89A" strokeWidth="7" strokeLinecap="round" fill="none"/>
      <path d="M98 96 Q100 104 99 110" stroke="#F5C89A" strokeWidth="6" strokeLinecap="round" fill="none"/>
      <ellipse cx="94" cy="90" rx="5" ry="2" fill="none" stroke="#D4AF37" strokeWidth="2"/>
      <ellipse cx="94" cy="93" rx="5" ry="2" fill="none" stroke="#F0CC55" strokeWidth="1.5"/>
      <ellipse cx="99" cy="148" rx="9" ry="2.5" fill="#B8962E"/>
      <path d="M90 136 Q88 142 90 146 Q94 150 99 150 Q104 150 108 146 Q110 142 108 136 Q106 128 99 126 Q92 128 90 136Z" fill="#D4AF37" stroke="#B8962E" strokeWidth="0.7"/>
      <rect x="95" y="120" width="8" height="7" rx="2" fill="#D4AF37"/>
      <ellipse cx="99" cy="120" rx="7" ry="2.5" fill="#B8962E"/>
      <path d="M92 120 Q99 112 106 120" fill="#C8A84B"/>
      <ellipse cx="99" cy="116" rx="5" ry="1.8" fill="#D4AF37"/>
      <circle cx="99" cy="109" r="2" fill="#F0CC55"/>
      <path d="M94 120 Q88 112 90 106" stroke="#2D7A2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M99 119 Q99 111 100 105" stroke="#2D7A2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M104 120 Q110 112 108 106" stroke="#2D7A2D" strokeWidth="2" fill="none" strokeLinecap="round"/>
    </svg>
  )
}

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'AI News', href: '/ai' },
  { label: 'Business', href: '/business' },
  { label: 'Telugu', href: '/telugu' },
  { label: 'Politics', href: '/politics' },
  { label: 'Tech', href: '/tech' },
  { label: 'World', href: '/world' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--white)', borderBottom: '1px solid var(--border)' }}>
      {/* Top bar */}
      <div style={{ background: 'var(--ink)', padding: '5px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#aaa', fontSize: '11px', letterSpacing: '0.04em' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button style={{ background: 'var(--red)', border: 'none', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '3px', cursor: 'pointer' }}>తెలుగు</button>
            {['YT', 'TW', 'FB', 'IG'].map(s => <span key={s} style={{ color: '#888', fontSize: '11px', cursor: 'pointer' }}>{s}</span>)}
          </div>
        </div>
      </div>

      {/* Logo + Nav */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Logo />
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-0.02em' }}>Telugu News</div>
            <div style={{ fontFamily: 'var(--font-telugu)', fontSize: '14px', color: 'var(--red)', fontWeight: 600, marginTop: '3px' }}>తెలుగు వార్తలు</div>
            <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '1px' }}>AI · Business · Breaking News</div>
          </div>
        </Link>

        <nav style={{ display: 'flex' }} className="desk-nav">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              style={{ padding: '8px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--ink)', letterSpacing: '0.03em', textTransform: 'uppercase', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--red)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--ink)')}
            >{item.label}</Link>
          ))}
        </nav>

        <button onClick={() => setOpen(!open)} className="burger" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 22, height: 2, background: 'var(--ink)', marginBottom: i < 2 ? 5 : 0 }} />)}
        </button>
      </div>

      {/* Red strip */}
      <div style={{ background: 'var(--red)' }}>
        <div className="container" style={{ display: 'flex' }}>
          {['Breaking', 'AI & Tech', 'Markets', 'AP & TS', 'World', 'Sports'].map((cat, i) => (
            <Link key={cat} href="#" style={{ color: '#fff', fontSize: '11px', fontWeight: 600, padding: '5px 14px', letterSpacing: '0.04em', borderRight: '1px solid rgba(255,255,255,0.2)', background: i === 0 ? 'rgba(0,0,0,0.25)' : 'transparent', textTransform: 'uppercase' }}>
              {i === 0 ? '⬤ ' : ''}{cat}
            </Link>
          ))}
        </div>
      </div>

      {open && (
        <div style={{ background: 'var(--white)', borderTop: '1px solid var(--border)', padding: '8px 20px' }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'block', padding: '10px 0', fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--border)', color: 'var(--ink)' }}>{item.label}</Link>
          ))}
        </div>
      )}

      <style>{`@media(max-width:900px){.desk-nav{display:none!important}.burger{display:block!important}}`}</style>
    </header>
  )
}
