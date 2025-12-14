export function ActionBasePlate() {
  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '340px',
      borderRadius: '42px',
      background: 'linear-gradient(180deg, #181818 0%, #101010 100%)',
      // Outer shadow for depth
      boxShadow: `
        0 28px 56px rgba(0, 0, 0, 0.3),
        0 12px 24px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.03)
      `,
      zIndex: 1,
      // Noise texture overlay
      backgroundImage: `
        linear-gradient(180deg, #181818 0%, #101010 100%),
        url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")
      `,
      backgroundBlendMode: 'normal, overlay',
    }}>
      {/* Top-left highlight arc */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '60%',
        height: '50%',
        borderRadius: '42px 0 100% 0',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      
      {/* Bottom-right cool rim-light */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '50%',
        height: '40%',
        borderRadius: '0 0 42px 0',
        background: 'linear-gradient(315deg, rgba(15, 123, 255, 0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Inner edge shadow */}
      <div style={{
        position: 'absolute',
        inset: '0',
        borderRadius: '42px',
        boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.4)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
