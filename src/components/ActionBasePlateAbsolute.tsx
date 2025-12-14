export function ActionBasePlateAbsolute() {
  return (
    <div style={{
      position: 'absolute',
      left: '0',
      top: '0',
      width: '100%',
      height: '100%',
      borderRadius: 'clamp(24px, 5.85vw, 48px)',
      background: 'linear-gradient(180deg, #1A1A1A 0%, #0E0E0E 100%)',
      boxShadow: `
        inset 0 0 32px rgba(0, 0, 0, 0.38),
        0 22px 38px rgba(0, 0, 0, 0.5)
      `,
      zIndex: 1,
      // Noise texture overlay
      backgroundImage: `
        linear-gradient(180deg, #1A1A1A 0%, #0E0E0E 100%),
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
        borderRadius: 'clamp(24px, 5.85vw, 48px) 0 100% 0',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      
      {/* Bottom-right cool rim-light */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '50%',
        height: '40%',
        borderRadius: '0 0 clamp(24px, 5.85vw, 48px) 0',
        background: 'linear-gradient(315deg, rgba(15, 123, 255, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}