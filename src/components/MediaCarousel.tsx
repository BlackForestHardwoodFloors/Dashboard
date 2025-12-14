import { CloudOff, Check, Video } from 'lucide-react';
import { MediaItem } from '../App';

type MediaCarouselProps = {
  mediaItems: MediaItem[];
  onMediaClick: (item: MediaItem) => void;
  selectedId?: string;
};

export function MediaCarousel({ mediaItems, onMediaClick, selectedId }: MediaCarouselProps) {
  if (mediaItems.length === 0) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {mediaItems.map(item => (
        <button
          key={item.id}
          onClick={() => onMediaClick(item)}
          className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden ${
            selectedId === item.id ? 'ring-2 ring-[#3B9CAA]' : ''
          }`}
        >
          {/* Thumbnail */}
          <img
            src={item.thumbnail}
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Video indicator */}
          {item.type === 'video' && (
            <div className="absolute top-1 left-1 w-5 h-5 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
              <Video className="w-3 h-3 text-white" />
            </div>
          )}

          {/* Upload status indicator */}
          <div className="absolute bottom-1 right-1">
            {item.uploadStatus === 'pending' && (
              <div className="w-5 h-5 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                <CloudOff className="w-3 h-3 text-amber-400" />
              </div>
            )}
            {item.uploadStatus === 'synced' && (
              <div className="w-5 h-5 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-green-400" />
              </div>
            )}
            {item.uploadStatus === 'uploading' && (
              <div className="w-5 h-5 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                <div className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Room tag */}
          {item.metadata.room && (
            <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded">
              {item.metadata.room}
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
