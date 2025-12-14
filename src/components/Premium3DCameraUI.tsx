import { ActionBasePlate } from './ActionBasePlate';
import { ActionButtonPanel } from './ActionButtonPanel';
import { CameraCutoutRing } from './CameraCutoutRing';
import { CameraShutter3D } from './CameraShutter3D';
import { SubmitTimeButton } from './SubmitTimeButton';

interface Premium3DCameraUIProps {
  onCapturePhoto: () => void;
  onWorkOrder: () => void;
  onChangeOrder: () => void;
  onStainSignOff: () => void;
  onCall: () => void;
  onMessage: () => void;
  onNotes: () => void;
  onSubmitTime: () => void;
  timeSubmitted?: boolean;
}

export function Premium3DCameraUI({
  onCapturePhoto,
  onWorkOrder,
  onChangeOrder,
  onStainSignOff,
  onCall,
  onMessage,
  onNotes,
  onSubmitTime,
  timeSubmitted = false,
}: Premium3DCameraUIProps) {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    }}>
      {/* Camera Control Cluster */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '340px',
        padding: '24px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* LAYER 1: Curved Base Plate (z=1) */}
        <ActionBasePlate />

        {/* LAYER 2: Button Columns + Shutter + Ring (positioned absolutely for perfect centering) */}
        <div style={{
          position: 'relative',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}>
          {/* Button Panel with 180px gap */}
          <ActionButtonPanel
            onWorkOrder={onWorkOrder}
            onChangeOrder={onChangeOrder}
            onStainSignOff={onStainSignOff}
            onCall={onCall}
            onMessage={onMessage}
            onNotes={onNotes}
          />

          {/* LAYER 3: Camera Cutout Ring (z=19) - positioned absolutely in the center gap */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 19,
          }}>
            <CameraCutoutRing />
          </div>

          {/* LAYER 4: Camera Shutter Button (z=20) - positioned absolutely in the center gap */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
          }}>
            <CameraShutter3D onClick={onCapturePhoto} />
          </div>
        </div>
      </div>

      {/* Submit Time Button - Full Width Below */}
      <SubmitTimeButton 
        onClick={onSubmitTime}
        disabled={timeSubmitted}
      />
    </div>
  );
}