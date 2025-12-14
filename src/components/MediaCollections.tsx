import { useState } from 'react';
import { ArrowLeft, Grid, List, Filter, Search } from 'lucide-react';
import { Job, MediaItem } from '../App';

type MediaCollectionsProps = {
  job: Job;
  mediaItems: MediaItem[];
  onBack: () => void;
  onOpenMedia: (item: MediaItem) => void;
};

type CollectionType = 'all' | 'before' | 'during' | 'after' | 'materials' | 'qc' | 'communication';

export function MediaCollections({ job, mediaItems, onBack, onOpenMedia }: MediaCollectionsProps) {
  const [selectedCollection, setSelectedCollection] = useState<CollectionType>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const collections = [
    { id: 'all' as CollectionType, name: 'All Media', tags: [] },
    { id: 'before' as CollectionType, name: 'Before', tags: ['before'] },
    { id: 'during' as CollectionType, name: 'During', tags: ['during', 'in progress', 'Prep Complete'] },
    { id: 'after' as CollectionType, name: 'After', tags: ['after', 'complete'] },
    { id: 'materials' as CollectionType, name: 'Materials', tags: ['Materials', 'materials'] },
    { id: 'qc' as CollectionType, name: 'QC / Punch List', tags: ['Punch List', 'qc', 'quality'] },
    { id: 'communication' as CollectionType, name: 'Communication', tags: ['General Note'] },
  ];

  const getFilteredMedia = () => {
    let filtered = mediaItems;

    // Filter by collection
    if (selectedCollection !== 'all') {
      const collection = collections.find(c => c.id === selectedCollection);
      if (collection && collection.tags.length > 0) {
        filtered = filtered.filter(item =>
          item.metadata.tags.some(tag =>
            collection.tags.some(collTag =>
              tag.toLowerCase().includes(collTag.toLowerCase())
            )
          )
        );
      }
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.metadata.room?.toLowerCase().includes(query) ||
        item.metadata.notes?.toLowerCase().includes(query) ||
        item.metadata.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const filteredMedia = getFilteredMedia();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#3B9CAA] text-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm">Media Collections</h2>
          <p className="text-xs text-white/80 mt-0.5">{job.clientName}</p>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
        </button>
      </div>

      {/* Search Bar */}
      <div className="border-b border-gray-200 px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by room, tags, or notes..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Collection Tabs */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-2 px-4 py-2 min-w-max">
          {collections.map(collection => {
            const count = collection.id === 'all' 
              ? mediaItems.length 
              : mediaItems.filter(item =>
                  item.metadata.tags.some(tag =>
                    collection.tags.some(collTag =>
                      tag.toLowerCase().includes(collTag.toLowerCase())
                    )
                  )
                ).length;

            return (
              <button
                key={collection.id}
                onClick={() => setSelectedCollection(collection.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCollection === collection.id
                    ? 'bg-[#3B9CAA] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {collection.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {filteredMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
            <Filter className="w-16 h-16 mb-4" />
            <p>No media found</p>
            <p className="text-sm mt-1 text-center">
              {searchQuery ? 'Try a different search term' : 'Capture photos to see them here'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 gap-2 p-4">
            {filteredMedia.map(item => (
              <button
                key={item.id}
                onClick={() => onOpenMedia(item)}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 group"
              >
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                
                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-2 left-2 right-2">
                    {item.metadata.room && (
                      <p className="text-white text-xs mb-1">{item.metadata.room}</p>
                    )}
                    <p className="text-white/70 text-[10px]">{formatDate(item.timestamp)}</p>
                  </div>
                </div>

                {/* Tags Badge */}
                {item.metadata.tags.length > 0 && (
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
                    {item.metadata.tags.length} tags
                  </div>
                )}

                {/* Client Facing Badge */}
                {item.clientFacing && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredMedia.map(item => (
              <button
                key={item.id}
                onClick={() => onOpenMedia(item)}
                className="w-full bg-white rounded-lg border border-gray-200 p-3 flex gap-3 hover:bg-gray-50 transition-colors"
              >
                {/* Thumbnail */}
                <img
                  src={item.thumbnail}
                  alt=""
                  className="w-20 h-20 rounded object-cover flex-shrink-0"
                />

                {/* Details */}
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.metadata.room && (
                      <span className="text-sm text-gray-900">{item.metadata.room}</span>
                    )}
                    {item.clientFacing && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Shared
                      </span>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-1">{formatDate(item.timestamp)}</p>
                  
                  {item.metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.metadata.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                      {item.metadata.tags.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{item.metadata.tags.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {item.metadata.notes && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {item.metadata.notes}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Showing {filteredMedia.length} of {mediaItems.length} items
          </span>
          <span className="text-gray-600">
            {mediaItems.filter(m => m.clientFacing).length} shared with client
          </span>
        </div>
      </div>
    </div>
  );
}
