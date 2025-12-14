import { useState, useRef } from 'react';
import { ArrowLeft, Check, Ruler } from 'lucide-react';
import { Job, MediaItem } from '../App';

type MeasureToolProps = {
  job: Job;
  mediaItem: MediaItem;
  onSave: (item: MediaItem) => void;
  onBack: () => void;
};

type MeasurePoint = { x: number; y: number };
type Measurement = {
  start: MeasurePoint;
  end: MeasurePoint;
  distance: string;
  room: string;
};

export function MeasureTool({ job, mediaItem, onSave, onBack }: MeasureToolProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>(
    mediaItem.metadata.measurements || []
  );
  const [startPoint, setStartPoint] = useState<MeasurePoint | null>(null);
  const [currentPoint, setCurrentPoint] = useState<MeasurePoint | null>(null);
  const [room, setRoom] = useState(mediaItem.metadata.room || '');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const getPointFromEvent = (e: React.MouseEvent | React.TouchEvent): MeasurePoint | null => {
    const container = containerRef.current;
    const image = imageRef.current;
    if (!container || !image) return null;

    const rect = image.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const calculateDistance = (start: MeasurePoint, end: MeasurePoint): string => {
    const pixelDistance = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    // Use job calibration if available
    if (job.calibration) {
      const realDistance = pixelDistance * job.calibration.scaleFactor;
      return `${realDistance.toFixed(2)}"`;
    }

    // Otherwise show in pixels
    return `${pixelDistance.toFixed(0)}px`;
  };

  const handleImageClick = (e: React.MouseEvent | React.TouchEvent) => {
    const point = getPointFromEvent(e);
    if (!point) return;

    if (!startPoint) {
      // First click - set start point
      setStartPoint(point);
      setCurrentPoint(point);
    } else {
      // Second click - complete measurement
      const distance = calculateDistance(startPoint, point);
      setMeasurements([
        ...measurements,
        { start: startPoint, end: point, distance, room: room || 'Unknown' },
      ]);
      setStartPoint(null);
      setCurrentPoint(null);
    }
  };

  const handleImageMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!startPoint) return;
    const point = getPointFromEvent(e);
    if (point) {
      setCurrentPoint(point);
    }
  };

  const handleUndo = () => {
    if (startPoint) {
      setStartPoint(null);
      setCurrentPoint(null);
    } else if (measurements.length > 0) {
      setMeasurements(measurements.slice(0, -1));
    }
  };

  const handleSave = () => {
    const updatedItem: MediaItem = {
      ...mediaItem,
      metadata: {
        ...mediaItem.metadata,
        measurements,
      },
    };
    onSave(updatedItem);
  };

  const getCalibrationText = () => {
    if (!job.calibration) return 'No calibration - measurements in pixels';
    
    const { method, confidence } = job.calibration;
    if (method === 'ar') {
      return `✓ AR auto-calibrated (job-wide) - ${(confidence * 100).toFixed(0)}% confidence`;
    }
    if (method === 'ai-board') {
      return '✓ AI calibrated using board width (job-wide)';
    }
    return '✓ Manual scale set (job-wide)';
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="bg-[#3B9CAA] text-white px-4 py-3 flex items-center gap-3 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center active:bg-white/30"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h2 className="text-sm flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Measure Tool
          </h2>
          <p className="text-xs text-white/80 mt-0.5">{job.clientName}</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30"
        >
          Save
        </button>
      </div>

      {/* Calibration Banner */}
      <div className={`px-4 py-2 text-sm ${
        job.calibration 
          ? 'bg-green-900/40 text-green-200' 
          : 'bg-amber-900/40 text-amber-200'
      }`}>
        {getCalibrationText()}
      </div>

      {/* Instructions */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 text-white text-sm">
        {!startPoint ? (
          <p>📍 Tap the start point of your measurement</p>
        ) : (
          <p>📍 Tap the end point to complete measurement</p>
        )}
      </div>

      {/* Image Container */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-auto bg-gray-950"
      >
        <div className="min-h-full flex items-center justify-center p-4">
          <div className="relative">
            <img
              ref={imageRef}
              src={mediaItem.url}
              alt=""
              className="max-w-full"
              onClick={handleImageClick}
              onTouchEnd={handleImageClick}
              onMouseMove={handleImageMove}
              onTouchMove={handleImageMove}
            />

            {/* Saved Measurements */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
              {measurements.map((m, idx) => {
                const midX = (m.start.x + m.end.x) / 2;
                const midY = (m.start.y + m.end.y) / 2;
                
                return (
                  <g key={idx}>
                    {/* Tape measure line */}
                    <line
                      x1={m.start.x}
                      y1={m.start.y}
                      x2={m.end.x}
                      y2={m.end.y}
                      stroke="#FCD34D"
                      strokeWidth="3"
                      strokeDasharray="8,4"
                    />
                    {/* Start point */}
                    <circle
                      cx={m.start.x}
                      cy={m.start.y}
                      r="6"
                      fill="#FCD34D"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* End point */}
                    <circle
                      cx={m.end.x}
                      cy={m.end.y}
                      r="6"
                      fill="#FCD34D"
                      stroke="#000"
                      strokeWidth="2"
                    />
                    {/* Distance label with halo */}
                    <text
                      x={midX}
                      y={midY - 10}
                      fill="#FCD34D"
                      stroke="#000"
                      strokeWidth="4"
                      paintOrder="stroke"
                      className="text-sm"
                      textAnchor="middle"
                    >
                      {m.distance}
                    </text>
                  </g>
                );
              })}

              {/* Current measurement being drawn */}
              {startPoint && currentPoint && (
                <g>
                  <line
                    x1={startPoint.x}
                    y1={startPoint.y}
                    x2={currentPoint.x}
                    y2={currentPoint.y}
                    stroke="#3B9CAA"
                    strokeWidth="3"
                    strokeDasharray="8,4"
                  />
                  <circle
                    cx={startPoint.x}
                    cy={startPoint.y}
                    r="6"
                    fill="#3B9CAA"
                    stroke="#FFF"
                    strokeWidth="2"
                  />
                  <circle
                    cx={currentPoint.x}
                    cy={currentPoint.y}
                    r="6"
                    fill="#3B9CAA"
                    stroke="#FFF"
                    strokeWidth="2"
                  />
                  <text
                    x={(startPoint.x + currentPoint.x) / 2}
                    y={(startPoint.y + currentPoint.y) / 2 - 10}
                    fill="#3B9CAA"
                    stroke="#000"
                    strokeWidth="4"
                    paintOrder="stroke"
                    className="text-sm"
                    textAnchor="middle"
                  >
                    {calculateDistance(startPoint, currentPoint)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3">
        {/* Room selection */}
        {measurements.length > 0 && (
          <div>
            <label className="block text-white text-sm mb-2">Room/Area</label>
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g., Living Room"
              className="w-full px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50"
            />
          </div>
        )}

        {/* Measurements List */}
        {measurements.length > 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 max-h-32 overflow-y-auto">
            <p className="text-white text-xs mb-2">Measurements ({measurements.length})</p>
            {measurements.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between text-white text-sm py-1">
                <span className="text-white/70">#{idx + 1}</span>
                <span>{m.distance}</span>
                <span className="text-white/50 text-xs">{m.room}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={!startPoint && measurements.length === 0}
            className="flex-1 bg-white/20 backdrop-blur-sm text-white rounded-lg px-4 py-3 disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={handleSave}
            className="flex-1 bg-[#4F6A41] text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            Save Measurements
          </button>
        </div>
      </div>
    </div>
  );
}
