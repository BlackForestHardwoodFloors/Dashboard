import { useState } from 'react';
import { 
  Home, Building, Bed, Shower, 
  Utensils, Briefcase, Waves, 
  MoreHorizontal, PlusCircle 
} from 'lucide-react';

export type Room = 
  // Bedrooms
  | 'One Bedroom'
  | 'Two Bedrooms'
  | 'Three Bedrooms'
  | 'Four Bedrooms'
  | 'Five Bedrooms'
  | 'Master Bedroom'
  
  // Living Areas
  | 'Living Room'
  | 'Family Room'
  | 'Great Room'
  | 'Dining Room'
  
  // Utility Rooms
  | 'Kitchen'
  | 'Laundry Room'
  | 'Bathroom'
  | 'Hallway'
  | 'Entry'
  | 'Office'
  
  // Others
  | 'Others'
  | 'Custom';

interface RoomSelectionModalProps {
  isVisible: boolean;
  onRoomSelect: (room: Room | string) => void;
  onClose: () => void;
}

// Mapping rooms to icons for visual representation
const ROOM_ICONS = {
  // Bedrooms
  'One Bedroom': Bed,
  'Two Bedrooms': Bed,
  'Three Bedrooms': Bed,
  'Four Bedrooms': Bed,
  'Five Bedrooms': Bed,
  'Master Bedroom': Bed,
  
  // Living Areas
  'Living Room': Home,
  'Family Room': Home,
  'Great Room': Home,
  'Dining Room': Utensils,
  
  // Utility Rooms
  'Kitchen': Utensils,
  'Laundry Room': Waves,
  'Bathroom': Shower,
  'Hallway': Building,
  'Entry': Building,
  'Office': Briefcase,
  
  // Others
  'Others': MoreHorizontal,
  'Custom': PlusCircle
};

export function RoomSelectionModal({ 
  isVisible, 
  onRoomSelect, 
  onClose 
}: RoomSelectionModalProps) {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isCustomRoom, setIsCustomRoom] = useState(false);
  const [customRoomName, setCustomRoomName] = useState('');

  const rooms: Room[] = [
    // Bedrooms
    'One Bedroom', 'Two Bedrooms', 'Three Bedrooms', 
    'Four Bedrooms', 'Five Bedrooms', 'Master Bedroom',
    
    // Living Areas
    'Living Room', 'Family Room', 'Great Room', 'Dining Room',
    
    // Utility Rooms
    'Kitchen', 'Laundry Room', 'Bathroom', 
    'Hallway', 'Entry', 'Office',
    
    // Others
    'Others', 'Custom'
  ];

  const handleRoomSelect = (room: Room) => {
    if (room === 'Custom') {
      setIsCustomRoom(true);
      setSelectedRoom(null);
    } else {
      setSelectedRoom(room);
      setIsCustomRoom(false);
    }
  };

  const handleConfirm = () => {
    if (isCustomRoom && customRoomName.trim()) {
      onRoomSelect(customRoomName.trim());
    } else if (selectedRoom) {
      onRoomSelect(selectedRoom);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <div 
        className="bg-[#1A1A1A] rounded-2xl w-full max-w-md mx-auto shadow-2xl"
        style={{
          maxHeight: '90vh',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#2A2A2A]">
          <h2 className="text-white text-xl font-semibold text-center">
            Select Room/Area
          </h2>
          <p className="text-gray-400 text-sm text-center mt-1">
            Where was this photo taken?
          </p>
        </div>

        {/* Custom Room Input */}
        {isCustomRoom && (
          <div className="p-4">
            <input 
              type="text" 
              value={customRoomName}
              onChange={(e) => setCustomRoomName(e.target.value)}
              placeholder="Enter custom room name"
              className="w-full p-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F7BFF]"
            />
          </div>
        )}

        {/* Room Grid */}
        {!isCustomRoom && (
          <div 
            className="grid grid-cols-3 gap-3 p-4 overflow-y-auto"
            style={{
              maxHeight: 'calc(90vh - 120px)',
            }}
          >
            {rooms.map((room) => {
              const RoomIcon = ROOM_ICONS[room];
              const isSelected = selectedRoom === room;

              return (
                <button
                  key={room}
                  onClick={() => handleRoomSelect(room)}
                  className={`
                    flex flex-col items-center justify-center 
                    p-3 rounded-xl 
                    transition-all duration-200
                    ${isSelected 
                      ? 'bg-[#0F7BFF] text-white' 
                      : 'bg-[#2A2A2A] text-gray-300 hover:bg-[#3A3A3A]'}
                  `}
                >
                  <RoomIcon 
                    className={`w-8 h-8 mb-2 ${isSelected ? 'text-white' : 'text-gray-500'}`} 
                  />
                  <span className="text-sm">{room}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex p-4 border-t border-[#2A2A2A]">
          <button 
            onClick={onClose}
            className="flex-1 bg-[#2A2A2A] text-white py-3 rounded-lg mr-2 hover:bg-[#3A3A3A] transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            disabled={!selectedRoom && (!isCustomRoom || !customRoomName.trim())}
            className={`
              flex-1 py-3 rounded-lg transition-colors
              ${(selectedRoom || (isCustomRoom && customRoomName.trim())) 
                ? 'bg-[#0F7BFF] text-white hover:bg-[#1A8CFF]' 
                : 'bg-[#2A2A2A] text-gray-500 cursor-not-allowed'}
            `}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
