import { ArrowLeft, MapPin, Tag, Droplet, Ruler, Calendar, User } from 'lucide-react';
import { Job, MediaItem } from '../App';

type JobProgressStoryProps = {
  job: Job;
  mediaItems: MediaItem[];
  onBack: () => void;
};

export function JobProgressStory({ job, mediaItems, onBack }: JobProgressStoryProps) {
  // Sort media by timestamp
  const sortedMedia = [...mediaItems].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Group by stage based on tags
  const stages = [
    { name: 'Before', tags: ['before'], color: 'blue' },
    { name: 'Prep', tags: ['Prep Complete', 'prep'], color: 'purple' },
    { name: 'In Progress', tags: ['during', 'in progress'], color: 'amber' },
    { name: 'Materials', tags: ['Materials', 'materials'], color: 'green' },
    { name: 'Moisture Checks', tags: ['Moisture Check', 'Floor Dry'], color: 'cyan' },
    { name: 'Quality Control', tags: ['Punch List', 'qc'], color: 'orange' },
    { name: 'After', tags: ['after', 'complete'], color: 'emerald' },
  ];

  const getStageForMedia = (item: MediaItem) => {
    for (const stage of stages) {
      if (item.metadata.tags.some(tag => 
        stage.tags.some(stageTag => 
          tag.toLowerCase().includes(stageTag.toLowerCase())
        )
      )) {
        return stage;
      }
    }
    return { name: 'General', tags: [], color: 'gray' };
  };

  const groupedMedia = stages.map(stage => ({
    ...stage,
    items: sortedMedia.filter(item => 
      item.metadata.tags.some(tag => 
        stage.tags.some(stageTag => 
          tag.toLowerCase().includes(stageTag.toLowerCase())
        )
      )
    ),
  })).filter(stage => stage.items.length > 0);

  // Add uncategorized media
  const uncategorized = sortedMedia.filter(item => {
    const stage = getStageForMedia(item);
    return stage.name === 'General';
  });

  if (uncategorized.length > 0) {
    groupedMedia.push({
      name: 'General Documentation',
      tags: [],
      color: 'gray',
      items: uncategorized,
    });
  }

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
      <div className="bg-[#4F6A41] text-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm">Job Progress Story</h2>
          <p className="text-xs text-white/80 mt-0.5">{job.clientName}</p>
        </div>
      </div>

      {/* Job Summary */}
      <div className="bg-gradient-to-br from-[#4F6A41] to-[#55624C] text-white px-4 py-4">
        <h3>{job.jobName}</h3>
        <p className="text-sm text-white/80 mt-1">{job.address}</p>
        <div className="flex gap-4 mt-3 text-sm">
          <div>
            <p className="text-white/70">Total Media</p>
            <p className="text-xl">{mediaItems.length}</p>
          </div>
          <div>
            <p className="text-white/70">Stages</p>
            <p className="text-xl">{groupedMedia.length}</p>
          </div>
          <div>
            <p className="text-white/70">Measurements</p>
            <p className="text-xl">
              {mediaItems.reduce((sum, item) => 
                sum + (item.metadata.measurements?.length || 0), 0
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto">
        {groupedMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 px-4">
            <Calendar className="w-16 h-16 mb-4" />
            <p>No media captured yet</p>
            <p className="text-sm mt-1">Start capturing photos to build your job story</p>
          </div>
        ) : (
          <div className="p-4 space-y-6">
            {groupedMedia.map((stage, stageIdx) => (
              <div key={stageIdx} className="relative">
                {/* Stage Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full bg-${stage.color}-500 flex items-center justify-center text-white flex-shrink-0`}>
                    <span>{stageIdx + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-gray-900">{stage.name}</h4>
                    <p className="text-sm text-gray-600">{stage.items.length} items</p>
                  </div>
                </div>

                {/* Stage Items */}
                <div className="ml-5 pl-5 border-l-2 border-gray-200 space-y-4 pb-4">
                  {stage.items.map((item, itemIdx) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      {/* Media Preview */}
                      <img
                        src={item.thumbnail}
                        alt=""
                        className="w-full h-48 object-cover"
                      />

                      {/* Media Details */}
                      <div className="p-3 space-y-2">
                        {/* Timestamp & Employee */}
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(item.timestamp)}</span>
                          <span>•</span>
                          <User className="w-3 h-3" />
                          <span>Employee {item.employeeId}</span>
                        </div>

                        {/* Room/Location */}
                        {item.metadata.room && (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{item.metadata.room}</span>
                          </div>
                        )}

                        {/* Tags */}
                        {item.metadata.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.metadata.tags.map(tag => (
                              <span 
                                key={tag}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full"
                              >
                                <Tag className="w-3 h-3" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Notes */}
                        {item.metadata.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                            {item.metadata.notes}
                          </p>
                        )}

                        {/* Audio Transcription */}
                        {item.metadata.audioTranscription && (
                          <div className="bg-blue-50 rounded p-2">
                            <p className="text-xs text-blue-700 mb-1">🎤 Voice Note:</p>
                            <p className="text-sm text-blue-900">{item.metadata.audioTranscription}</p>
                          </div>
                        )}

                        {/* Moisture Reading */}
                        {item.metadata.moistureReading && (
                          <div className="flex items-center gap-2 text-sm">
                            <Droplet className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-700">
                              Moisture: {item.metadata.moistureReading}%
                            </span>
                          </div>
                        )}

                        {/* Measurements */}
                        {item.metadata.measurements && item.metadata.measurements.length > 0 && (
                          <div className="bg-amber-50 rounded p-2">
                            <div className="flex items-center gap-2 text-sm text-amber-900 mb-1">
                              <Ruler className="w-4 h-4" />
                              <span>{item.metadata.measurements.length} measurement(s)</span>
                            </div>
                            <div className="space-y-1">
                              {item.metadata.measurements.map((m, idx) => (
                                <div key={idx} className="text-xs text-amber-800">
                                  {m.room}: {m.distance}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Client-Facing Badge */}
                        {item.clientFacing && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            ✓ Shared with client
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
