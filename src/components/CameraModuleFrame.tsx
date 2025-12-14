import { ReactNode } from 'react';

interface CameraModuleFrameProps {
  children: ReactNode;
}

export function CameraModuleFrame({ children }: CameraModuleFrameProps) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      maxWidth: '820px',
      height: 'auto',
      aspectRatio: '820 / 380',
      backgroundColor: '#141414',
      overflow: 'visible',
      margin: '0 auto',
      display: 'block',
    }}>
      {children}
    </div>
  );
}