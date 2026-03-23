'use client'
export default function BreakingTicker({ items }: { items?: string[] }) {
  const text = (items && items.length > 0 ? items : ['Telugu News Live — తెలుగు వార్తలు']).join('   ·   ') + '   ·   '
  return (
    <div style={{ background: 'var(--ink)', color: '#fff', display: 'flex', alignItems: 'center', overflow: 'hidden', height: '34px' }}>
      <div style={{ background: 'var(--red)', fontSize: '11px', fontWeight: 700, padding: '0 14px', height: '100%', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', flexShrink: 0, letterSpacing: '0.08em' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 1.2s ease-in-out infinite' }} />
        LIVE
      </div>
      <div style={{ overflow: 'hidden', flex: 1 }}>
        <div style={{ display: 'inline-block', whiteSpace: 'nowrap', animation: 'ticker 45s linear infinite', fontSize: '12.5px', fontWeight: 500, color: '#f0ece4', paddingLeft: '20px' }}>
          {text}{text}
        </div>
      </div>
      <style>{`
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}
