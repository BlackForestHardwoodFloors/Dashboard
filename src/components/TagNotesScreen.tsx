import { useState } from 'react';
import { ArrowLeft, Mic, MicOff, MapPin, Sparkles, Tag, Image as ImageIcon, Ruler, Trash2, Share2 } from 'lucide-react';
import { Job, MediaItem } from '../App';

type TagNotesScreenProps = {
  job: Job;
  mediaItem: MediaItem;
  isOffline: boolean;
  onSave: (item: MediaItem) => void;
  onDiscard: () => void;
  onOpenMarkup: (item: MediaItem) => void;
  onOpenMeasure: (item: MediaItem) => void;
};

const TAG_PRESETS = [
  'Prep Complete',
  'Floor Dry',
  'Punch List',
  'Moisture Check',
  'Materials',
  'General Note',
];

const ROOM_OPTIONS = [
  'Living Room',
  'Kitchen',
  'Hallway',
  'Bedroom',
  'Bathroom',
  'Stairs',
  'Exterior',
  'Office',
  'Dining Room',
  'Basement',
];

export function TagNotesScreen({
  job,
  mediaItem: initialMediaItem,
  isOffline,
  onSave,
  onDiscard,
  onOpenMarkup,
  onOpenMeasure,
}: TagNotesScreenProps) {
  const [mediaItem, setMediaItem] = useState(initialMediaItem);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [clientFacing, setClientFacing] = useState(false);

  // Simulate moisture meter detection
  const detectedMoisture = Math.random() > 0.7 ? (Math.random() * 15 + 5).toFixed(1) : null;

  const updateMetadata = (updates: Partial<MediaItem['metadata']>) => {
    setMediaItem(prev => ({
      ...prev,
      metadata: { ...prev.metadata, ...updates },
    }));
  };

  const addTag = (tag: string) => {
    if (!mediaItem.metadata.tags.includes(tag)) {
      updateMetadata({
        tags: [...mediaItem.metadata.tags, tag],
      });
    }
  };

  const removeTag = (tag: string) => {
    updateMetadata({
      tags: mediaItem.metadata.tags.filter(t => t !== tag),
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording - simulate transcription
      setIsRecording(false);
      const mockTranscription = 'Customer requested extra coats in the hallway area. Floor surface was prepped and ready for finishing.';
      updateMetadata({
        audioTranscription: mockTranscription,
        notes: (mediaItem.metadata.notes || '') + '\n' + mockTranscription,
      });
      setRecordingTime(0);
    } else {
      // Start recording
      setIsRecording(true);
      const interval = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 10) {
            clearInterval(interval);
            toggleRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  const handleSave = () => {
    onSave({
      ...mediaItem,
      clientFacing,
    });
  };

  const suggestNextRoom = () => {
    const usedRooms = new Set([mediaItem.metadata.room]);
    const available = ROOM_OPTIONS.filter(r => !usedRooms.has(r));
    return available[0] || 'Next Area';
  };

  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Header */}
      <div className="bg-[#3B9CAA] text-white px-4 py-3 flex items-center gap-3">
        <button
          onClick={onDiscard}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm">Tag & Notes</h2>
          <p className="text-xs text-white/80 mt-0.5">{mediaItem.metadata.clientName}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Media Preview */}
        <div className="relative bg-black">
          <img
            src={mediaItem.thumbnail}
            alt="Captured media"
            className="w-full h-64 object-contain"
          />
          
          {/* Quick Actions Overlay */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={() => onOpenMarkup(mediaItem)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => onOpenMeasure(mediaItem)}
              className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center"
            >
              <Ruler className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Job Info */}
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <p className="text-sm">
              <span className="text-gray-600">Client:</span>{' '}
              <span className="text-gray-900">{mediaItem.metadata.clientName}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Job:</span>{' '}
              <span className="text-gray-900">{mediaItem.metadata.jobName}</span>
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Address:</span>{' '}
              <span className="text-gray-900">{mediaItem.metadata.reverseGeocode}</span>
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <MapPin className="w-4 h-4" />
              <span>GPS recorded</span>
            </div>
          </div>

          {/* AI Room Detection */}
          {mediaItem.metadata.aiRoomDetection && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI detected: {mediaItem.metadata.aiRoomDetection}</span>
              </div>
            </div>
          )}

          {/* Room/Area Selection */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Where is this?</label>
            <select
              value={mediaItem.metadata.room || ''}
              onChange={(e) => updateMetadata({ room: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Select room or area...</option>
              {ROOM_OPTIONS.map(room => (
                <option key={room} value={room}>{room}</option>
              ))}
            </select>
          </div>

          {/* Moisture Meter Detection */}
          {detectedMoisture && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-blue-700">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm">Moisture meter detected</span>
                  </div>
                  <p className="text-blue-900 mt-1">Reading: {detectedMoisture}%</p>
                </div>
                <button
                  onClick={() => updateMetadata({ moistureReading: parseFloat(detectedMoisture) })}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg"
                >
                  Save Reading
                </button>
              </div>
            </div>
          )}

          {/* Tag Presets */}
          <div>
            <label className="block text-sm text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Quick Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {TAG_PRESETS.map(tag => {
                const isSelected = mediaItem.metadata.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => isSelected ? removeTag(tag) : addTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      isSelected
                        ? 'bg-[#4F6A41] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">Notes</label>
            <textarea
              value={mediaItem.metadata.notes || ''}
              onChange={(e) => updateMetadata({ notes: e.target.value })}
              placeholder="Add notes about this photo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm min-h-[100px] resize-none"
            />
          </div>

          {/* Voice Notes */}
          <div>
            <button
              onClick={toggleRecording}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isRecording ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>Recording... {recordingTime}s</span>
                  <MicOff className="w-4 h-4" />
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Record Voice Note</span>
                </>
              )}
            </button>
            {mediaItem.metadata.audioTranscription && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">Auto-transcribed:</p>
                <p className="text-sm text-gray-900">{mediaItem.metadata.audioTranscription}</p>
              </div>
            )}
          </div>

          {/* Client-Facing Toggle */}
          <div className="border border-gray-200 rounded-lg p-3">
            <label className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-900">Share with client</p>
                  <p className="text-xs text-gray-600">Upload to client portal</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={clientFacing}
                onChange={(e) => setClientFacing(e.target.checked)}
                className="w-5 h-5 text-[#4F6A41] rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        {/* Next Room Button */}
        <button
          onClick={handleSave}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-2.5 flex items-center justify-center gap-2 text-sm"
        >
          Next Room → {suggestNextRoom()}
        </button>

        {/* Main Actions */}
        <div className="flex gap-2">
          <button
            onClick={onDiscard}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg px-4 py-3 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Discard
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#4F6A41] hover:bg-[#4F6A41]/90 text-white rounded-lg px-4 py-3"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
