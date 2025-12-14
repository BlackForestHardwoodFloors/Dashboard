import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Pen, Circle, ArrowRight, Undo, Trash2 } from 'lucide-react';
import { Job, MediaItem } from '../App';

type MarkupToolsProps = {
  job: Job;
  mediaItem: MediaItem;
  onSave: (item: MediaItem) => void;
  onBack: () => void;
};

type DrawingTool = 'pen' | 'arrow' | 'circle';
type DrawingColor = '#3B9CAA' | '#EF4444' | '#FFFFFF';

type DrawingElement = {
  type: DrawingTool;
  color: DrawingColor;
  points?: { x: number; y: number }[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
};

export function MarkupTools({ job, mediaItem, onSave, onBack }: MarkupToolsProps) {
  const [selectedTool, setSelectedTool] = useState<DrawingTool>('pen');
  const [selectedColor, setSelectedColor] = useState<DrawingColor>('#3B9CAA');
  const [drawings, setDrawings] = useState<DrawingElement[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawing, setCurrentDrawing] = useState<DrawingElement | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    redrawCanvas();
  }, [drawings, currentDrawing]);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all saved elements
    drawings.forEach(element => {
      drawElement(ctx, element);
    });

    // Draw current element being created
    if (currentDrawing) {
      drawElement(ctx, currentDrawing);
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (element.type === 'pen' && element.points) {
      if (element.points.length < 2) return;
      
      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);
      element.points.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }

    if (element.type === 'arrow' && element.start && element.end) {
      const { start, end } = element;
      
      // Draw line
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw arrowhead
      const angle = Math.atan2(end.y - start.y, end.x - start.x);
      const headLength = 20;
      
      ctx.beginPath();
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle - Math.PI / 6),
        end.y - headLength * Math.sin(angle - Math.PI / 6)
      );
      ctx.moveTo(end.x, end.y);
      ctx.lineTo(
        end.x - headLength * Math.cos(angle + Math.PI / 6),
        end.y - headLength * Math.sin(angle + Math.PI / 6)
      );
      ctx.stroke();
    }

    if (element.type === 'circle' && element.start && element.end) {
      const { start, end } = element;
      const radius = Math.sqrt(
        Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
      );
      
      ctx.beginPath();
      ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  };

  const getCanvasPoint = (e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;

    setIsDrawing(true);

    if (selectedTool === 'pen') {
      setCurrentDrawing({
        type: 'pen',
        color: selectedColor,
        points: [point],
      });
    } else {
      setCurrentDrawing({
        type: selectedTool,
        color: selectedColor,
        start: point,
        end: point,
      });
    }
  };

  const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || !currentDrawing) return;
    e.preventDefault();
    
    const point = getCanvasPoint(e);
    if (!point) return;

    if (selectedTool === 'pen') {
      setCurrentDrawing({
        ...currentDrawing,
        points: [...(currentDrawing.points || []), point],
      });
    } else {
      setCurrentDrawing({
        ...currentDrawing,
        end: point,
      });
    }
  };

  const handleEnd = () => {
    if (currentDrawing) {
      setDrawings([...drawings, currentDrawing]);
      setCurrentDrawing(null);
    }
    setIsDrawing(false);
  };

  const handleUndo = () => {
    setDrawings(drawings.slice(0, -1));
  };

  const handleClear = () => {
    setDrawings([]);
  };

  const handleSave = () => {
    // In a real app, would generate a composite image with markup
    const updatedItem: MediaItem = {
      ...mediaItem,
      metadata: {
        ...mediaItem.metadata,
        markup: 'markup-data-url', // Would be actual composite image
      },
    };
    onSave(updatedItem);
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
          <h2 className="text-sm">Markup Tools</h2>
          <p className="text-xs text-white/80 mt-0.5">{job.clientName}</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm hover:bg-white/30"
        >
          Save
        </button>
      </div>

      {/* Canvas Container */}
      <div className="flex-1 relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Background Image */}
            <img
              ref={imageRef}
              src={mediaItem.url}
              alt=""
              className="max-w-full max-h-full"
              onLoad={() => {
                if (canvasRef.current && imageRef.current) {
                  canvasRef.current.width = imageRef.current.width;
                  canvasRef.current.height = imageRef.current.height;
                  redrawCanvas();
                }
              }}
            />
            {/* Drawing Canvas Overlay */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 touch-none"
              onMouseDown={handleStart}
              onMouseMove={handleMove}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
              onTouchStart={handleStart}
              onTouchMove={handleMove}
              onTouchEnd={handleEnd}
            />
          </div>
        </div>
      </div>

      {/* Tools Panel */}
      <div className="bg-gradient-to-t from-black/80 to-transparent p-4 space-y-3">
        {/* Tool Selection */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedTool('pen')}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              selectedTool === 'pen'
                ? 'bg-[#3B9CAA] text-white'
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            <Pen className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedTool('arrow')}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              selectedTool === 'arrow'
                ? 'bg-[#3B9CAA] text-white'
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setSelectedTool('circle')}
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              selectedTool === 'circle'
                ? 'bg-[#3B9CAA] text-white'
                : 'bg-white/20 text-white backdrop-blur-sm'
            }`}
          >
            <Circle className="w-5 h-5" />
          </button>
        </div>

        {/* Color Selection */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setSelectedColor('#3B9CAA')}
            className={`w-10 h-10 rounded-full border-2 ${
              selectedColor === '#3B9CAA' ? 'border-white' : 'border-transparent'
            }`}
            style={{ backgroundColor: '#3B9CAA' }}
          />
          <button
            onClick={() => setSelectedColor('#EF4444')}
            className={`w-10 h-10 rounded-full border-2 ${
              selectedColor === '#EF4444' ? 'border-white' : 'border-transparent'
            }`}
            style={{ backgroundColor: '#EF4444' }}
          />
          <button
            onClick={() => setSelectedColor('#FFFFFF')}
            className={`w-10 h-10 rounded-full border-2 ${
              selectedColor === '#FFFFFF' ? 'border-white' : 'border-gray-400'
            }`}
            style={{ backgroundColor: '#FFFFFF' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleUndo}
            disabled={drawings.length === 0}
            className="flex-1 bg-white/20 backdrop-blur-sm text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Undo className="w-4 h-4" />
            Undo
          </button>
          <button
            onClick={handleClear}
            disabled={drawings.length === 0}
            className="flex-1 bg-white/20 backdrop-blur-sm text-white rounded-lg px-4 py-3 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
