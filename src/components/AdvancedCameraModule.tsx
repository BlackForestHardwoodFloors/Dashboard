import { FileText, FilePlus, Droplet, Phone, MessageSquare, StickyNote } from 'lucide-react';
import { CameraModuleFrame } from './CameraModuleFrame';
import { ActionBasePlateAbsolute } from './ActionBasePlateAbsolute';
import { ContouredActionButton } from './ContouredActionButton';
import { MaskRing } from './MaskRing';
import { CameraShutter3DAbsolute } from './CameraShutter3DAbsolute';

interface AdvancedCameraModuleProps {
  onCapturePhoto: () => void;
  onWorkOrder: () => void;
  onChangeOrder: () => void;
  onStainSignOff: () => void;
  onCall: () => void;
  onMessage: () => void;
  onNotes: () => void;
}

export function AdvancedCameraModule({
  onCapturePhoto,
  onWorkOrder,
  onChangeOrder,
  onStainSignOff,
  onCall,
  onMessage,
  onNotes,
}: AdvancedCameraModuleProps) {
  return (
    <CameraModuleFrame>
      {/* LAYER 1: Base Plate (z=1) */}
      <ActionBasePlateAbsolute />

      {/* LAYER 2: Left Column Buttons (z=6) */}
      
      {/* Work Order - x: 40px, y: 40px */}
      <ContouredActionButton
        icon={FileText}
        label="Work Order"
        x={40}
        y={40}
        side="left"
        baseColor="#4F6A41"
        hoverColor="#628053"
        activeColor="#435A36"
        onClick={onWorkOrder}
      />

      {/* Change Order - x: 40px, y: 130px */}
      <ContouredActionButton
        icon={FilePlus}
        label="Change Order"
        x={40}
        y={130}
        side="left"
        baseColor="#A37C4A"
        hoverColor="#B6955C"
        activeColor="#8D6537"
        onClick={onChangeOrder}
      />

      {/* Stain Sign-Off - x: 40px, y: 220px */}
      <ContouredActionButton
        icon={Droplet}
        label="Stain Sign-Off"
        x={40}
        y={220}
        side="left"
        baseColor="#B38D3D"
        hoverColor="#C3A04D"
        activeColor="#9E7C31"
        onClick={onStainSignOff}
      />

      {/* LAYER 3: Right Column Buttons (z=6) */}
      
      {/* Call - Teal - x: 530px, y: 40px */}
      <ContouredActionButton
        icon={Phone}
        label="Call"
        x={530}
        y={40}
        side="right"
        baseColor="#3B9CAA"
        hoverColor="#4AB8C3"
        activeColor="#318690"
        onClick={onCall}
      />

      {/* Message - Purple - x: 530px, y: 130px */}
      <ContouredActionButton
        icon={MessageSquare}
        label="Message"
        x={530}
        y={130}
        side="right"
        baseColor="#7A4CC2"
        hoverColor="#8E62D1"
        activeColor="#693FAA"
        onClick={onMessage}
      />

      {/* Notes - Gold - x: 530px, y: 220px */}
      <ContouredActionButton
        icon={StickyNote}
        label="Notes"
        x={530}
        y={220}
        side="right"
        baseColor="#C9A049"
        hoverColor="#DBB865"
        activeColor="#A58336"
        onClick={onNotes}
      />

      {/* LAYER 4: Mask Ring (z=19) - x: 305px, y: 85px */}
      <MaskRing />

      {/* LAYER 5: Camera Shutter (z=20) - x: 320px, y: 100px */}
      <CameraShutter3DAbsolute onClick={onCapturePhoto} />
    </CameraModuleFrame>
  );
}
