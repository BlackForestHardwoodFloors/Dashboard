export function MaskRing() {
  // Convert to percentages: x:305/820 = 37.2%, y:85/380 = 22.37%, diameter:210/820 = 25.61%
  return (
    <div style={{
      position: 'absolute',
      left: '37.2%',
      top: '22.37%',
      width: '25.61%',
      aspectRatio: '1 / 1',
      borderRadius: '50%',
      backgroundColor: '#141414',
      boxShadow: `
        inset 0 0 18px rgba(0, 0, 0, 0.5),
        0 0 24px rgba(0, 0, 0, 0.33)
      `,
      zIndex: 19,
      pointerEvents: 'none',
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