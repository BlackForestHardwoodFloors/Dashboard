export function CameraCutoutRing() {
  return (
    <div style={{
      position: 'absolute',
      width: '194px',
      height: '194px',
      borderRadius: '50%',
      backgroundColor: '#121212',
      zIndex: 19,
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 10px 20px rgba(0, 0, 0, 0.2)
      `,
    }}>
      {/* Inner anti-glare highlight */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '30%',
        borderRadius: '50% 50% 0 0',
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  );
}
