import { FileText, FilePlus, Droplet, Phone, MessageSquare, StickyNote } from 'lucide-react';
import { ActionButton } from './ActionButton';

interface ActionButtonPanelProps {
  onWorkOrder: () => void;
  onChangeOrder: () => void;
  onStainSignOff: () => void;
  onCall: () => void;
  onMessage: () => void;
  onNotes: () => void;
}

export function ActionButtonPanel({
  onWorkOrder,
  onChangeOrder,
  onStainSignOff,
  onCall,
  onMessage,
  onNotes,
}: ActionButtonPanelProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '180px', // Exact 180px spacing for shutter button
      zIndex: 6,
      position: 'relative',
    }}>
      {/* LEFT COLUMN */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '160px',
      }}>
        {/* Work Order */}
        <ActionButton
          icon={FileText}
          label="Work Order"
          side="left"
          baseColor="#4F6A41"
          hoverColor="#628053"
          activeColor="#435A36"
          onClick={onWorkOrder}
        />

        {/* Change Order */}
        <ActionButton
          icon={FilePlus}
          label="Change Order"
          side="left"
          baseColor="#A37C4A"
          hoverColor="#B6955C"
          activeColor="#8D6537"
          onClick={onChangeOrder}
        />

        {/* Stain Sign-Off */}
        <ActionButton
          icon={Droplet}
          label="Stain Sign-Off"
          side="left"
          baseColor="#B38D3D"
          hoverColor="#C3A04D"
          activeColor="#9E7C31"
          onClick={onStainSignOff}
        />
      </div>

      {/* RIGHT COLUMN */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '160px',
      }}>
        {/* Call - Teal */}
        <ActionButton
          icon={Phone}
          label="Call"
          side="right"
          baseColor="#3B9CAA"
          hoverColor="#4AB8C3"
          activeColor="#318690"
          onClick={onCall}
        />

        {/* Message - Purple */}
        <ActionButton
          icon={MessageSquare}
          label="Message"
          side="right"
          baseColor="#7A4CC2"
          hoverColor="#8E62D1"
          activeColor="#693FAA"
          onClick={onMessage}
        />

        {/* Notes - Gold */}
        <ActionButton
          icon={StickyNote}
          label="Notes"
          side="right"
          baseColor="#C9A049"
          hoverColor="#DBB865"
          activeColor="#A58336"
          onClick={onNotes}
        />
      </div>
    </div>
  );
}
