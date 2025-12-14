import { FileText, FilePlus, Droplet, Phone, MessageSquare, StickyNote } from 'lucide-react';
import { CameraShutterButton } from './CameraShutterButton';
import { SideButton3D } from './SideButton3D';
import { SubmitTimeButton } from './SubmitTimeButton';

interface CameraControlClusterProps {
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

export function CameraControlCluster({
  onCapturePhoto,
  onWorkOrder,
  onChangeOrder,
  onStainSignOff,
  onCall,
  onMessage,
  onNotes,
  onSubmitTime,
  timeSubmitted = false,
}: CameraControlClusterProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      width: '100%',
      padding: '24px 16px',
      backgroundColor: '#121212',
      borderRadius: '20px',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.4),
        0 8px 16px rgba(0, 0, 0, 0.3)
      `,
    }}>
      {/* Main Cluster: Left Stack | Shutter | Right Stack */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        position: 'relative',
        padding: '12px 0',
      }}>
        {/* LEFT COLUMN - 3 Buttons Stacked Vertically */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          alignItems: 'flex-end',
        }}>
          <div style={{ marginRight: '6px' }}>
            <SideButton3D
              icon={FileText}
              label="Work Order"
              accentColor="#4F6A41"
              onClick={onWorkOrder}
              side="left"
              size="small"
            />
          </div>
          <div style={{ marginRight: '-12px' }}>
            <SideButton3D
              icon={FilePlus}
              label="Change Order"
              accentColor="#8B4513"
              onClick={onChangeOrder}
              side="left"
              size="underlap"
            />
          </div>
          <div style={{ marginRight: '6px' }}>
            <SideButton3D
              icon={Droplet}
              label="Stain Sign-Off"
              accentColor="#EA580C"
              onClick={onStainSignOff}
              side="left"
              size="small"
            />
          </div>
        </div>

        {/* CENTER - 180px Shutter Button */}
        <CameraShutterButton onClick={onCapturePhoto} />

        {/* RIGHT COLUMN - 3 Buttons Stacked Vertically */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          alignItems: 'flex-start',
        }}>
          <div style={{ marginLeft: '6px' }}>
            <SideButton3D
              icon={Phone}
              label="Call"
              accentColor="#10B981"
              onClick={onCall}
              side="right"
              size="small"
            />
          </div>
          <div style={{ marginLeft: '-12px' }}>
            <SideButton3D
              icon={MessageSquare}
              label="Message"
              accentColor="#0F7BFF"
              onClick={onMessage}
              side="right"
              size="underlap"
            />
          </div>
          <div style={{ marginLeft: '6px' }}>
            <SideButton3D
              icon={StickyNote}
              label="Notes"
              accentColor="#F59E0B"
              onClick={onNotes}
              side="right"
              size="small"
            />
          </div>
        </div>
      </div>

      {/* Submit Time Button - Full Width Below Cluster */}
      <SubmitTimeButton 
        onClick={onSubmitTime}
        disabled={timeSubmitted}
      />
    </div>
  );
}