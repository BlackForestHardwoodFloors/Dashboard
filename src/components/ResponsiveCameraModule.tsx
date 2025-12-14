import { useState, useEffect } from 'react';
import { AdvancedCameraModuleCircular } from './AdvancedCameraModuleCircular';
import { MobileCameraActions } from './MobileCameraActions';

interface ResponsiveCameraModuleProps {
  onCapturePhoto: () => void;
  onWorkOrder: () => void;
  onChangeOrder: () => void;
  onStainSignOff: () => void;
  onCall: () => void;
  onMessage: () => void;
  onNotes: () => void;
}

export function ResponsiveCameraModule({
  onCapturePhoto,
  onWorkOrder,
  onChangeOrder,
  onStainSignOff,
  onCall,
  onMessage,
  onNotes,
}: ResponsiveCameraModuleProps) {
  // Always show grid layout - no camera shutter
  return (
    <MobileCameraActions
      onWorkOrder={onWorkOrder}
      onChangeOrder={onChangeOrder}
      onStainSignOff={onStainSignOff}
      onCall={onCall}
      onMessage={onMessage}
      onNotes={onNotes}
    />
  );
}