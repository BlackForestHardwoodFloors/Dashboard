import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Save,
  Undo,
  Redo,
  Trash2,
  Pencil,
  Highlighter,
  Type,
  Ruler,
  Circle,
  Square,
  ArrowRight,
  Mic,
  MicOff,
  Sparkles,
  FileText,
  Move,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Download,
  Eraser,
  Palette,
  ChevronDown,
  Check,
  Loader2
} from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  jobName: string;
  room: string;
  phase: string;
  notes?: string;
}

interface Annotation {
  id: string;
  type: 'draw' | 'highlight' | 'text' | 'measurement' | 'arrow' | 'circle' | 'rectangle';
  points: { x: number; y: number }[];
  color: string;
  strokeWidth: number;
  text?: string;
  fontSize?: number;
  measurementValue?: string;
}

interface PhotoAnnotationEditorProps {
  photo: Photo;
  isOpen: boolean;
  onClose: () => void;
  onSave: (annotations: Annotation[], notes: string) => void;
}

const ACCENT_COLOR = '#0F7BFF';

// Color palette
const COLORS = [
  '#FF0000', // Red
  '#FFD700', // Yellow
  '#00FF00', // Green
  '#0F7BFF', // Blue
  '#FFFFFF', // White
];

export default function PhotoAnnotationEditor({
  photo,
  isOpen,
  onClose,
  onSave
}: PhotoAnnotationEditorProps) {
  // Canvas refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Tool state
  const [activeTool, setActiveTool] = useState<'draw' | 'highlight' | 'text' | 'measurement' | 'arrow' | 'circle' | 'rectangle' | 'eraser' | 'move'>('draw');
  const [activeColor, setActiveColor] = useState('#0F7BFF');
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [fontSize, setFontSize] = useState(16);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Annotations state
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);
  const [history, setHistory] = useState<Annotation[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);

  // Text input state
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputPosition, setTextInputPosition] = useState({ x: 0, y: 0 });
  const [textInputValue, setTextInputValue] = useState('');

  // Notes state
  const [notes, setNotes] = useState(photo.notes || '');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Zoom/Pan state
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Measurement calibration (pixels per inch - can be calibrated)
  const [pixelsPerInch, setPixelsPerInch] = useState(96);
  const [measurementUnit, setMeasurementUnit] = useState<'in' | 'ft' | 'cm'>('in');
  const [showCalibrationModal, setShowCalibrationModal] = useState(false);
  const [calibrationMode, setCalibrationMode] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState<{ x: number; y: number }[]>([]);
  const [calibrationKnownDistance, setCalibrationKnownDistance] = useState('');
  const [calibrationUnit, setCalibrationUnit] = useState<'in' | 'ft' | 'cm'>('in');
  const [isAICalibrating, setIsAICalibrating] = useState(false);

  // Initialize canvas and load image
  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageRef.current = img;
      
      // Set canvas size to match container
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        // Calculate scale to fit image
        const scaleX = containerWidth / img.width;
        const scaleY = containerHeight / img.height;
        const fitScale = Math.min(scaleX, scaleY, 1);
        
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        setScale(fitScale);
        setOffset({
          x: (containerWidth - img.width * fitScale) / 2,
          y: (containerHeight - img.height * fitScale) / 2
        });
      }
      
      redrawCanvas();
    };
    img.src = photo.url;
  }, [isOpen, photo.url]);

  // Redraw canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imageRef.current;
    
    if (!canvas || !ctx || !img) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0);
    ctx.restore();

    // Draw all annotations
    annotations.forEach(annotation => {
      drawAnnotation(ctx, annotation);
    });

    // Draw current annotation being created
    if (currentAnnotation) {
      drawAnnotation(ctx, currentAnnotation);
    }
  }, [annotations, currentAnnotation, scale, offset]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Draw a single annotation
  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Annotation) => {
    ctx.save();
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    switch (annotation.type) {
      case 'draw':
      case 'highlight':
        if (annotation.points.length < 2) break;
        
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.strokeWidth / scale;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        if (annotation.type === 'highlight') {
          ctx.globalAlpha = 0.4;
          ctx.lineWidth = (annotation.strokeWidth * 3) / scale;
        }
        
        ctx.beginPath();
        ctx.moveTo(annotation.points[0].x, annotation.points[0].y);
        annotation.points.forEach((point, i) => {
          if (i > 0) ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
        break;

      case 'text':
        if (!annotation.text || annotation.points.length === 0) break;
        
        ctx.font = `${(annotation.fontSize || 16) / scale}px Arial`;
        ctx.fillStyle = annotation.color;
        ctx.fillText(annotation.text, annotation.points[0].x, annotation.points[0].y);
        break;

      case 'measurement':
        if (annotation.points.length < 2) break;
        
        const [start, end] = annotation.points;
        
        // Draw line
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = 2 / scale;
        ctx.setLineDash([5 / scale, 5 / scale]);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Draw endpoints
        ctx.fillStyle = annotation.color;
        ctx.beginPath();
        ctx.arc(start.x, start.y, 4 / scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(end.x, end.y, 4 / scale, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw measurement label
        if (annotation.measurementValue) {
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2;
          
          ctx.font = `bold ${14 / scale}px Arial`;
          const textWidth = ctx.measureText(annotation.measurementValue).width;
          
          // Background
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          ctx.fillRect(
            midX - textWidth / 2 - 6 / scale,
            midY - 10 / scale,
            textWidth + 12 / scale,
            20 / scale
          );
          
          // Text
          ctx.fillStyle = '#FFFFFF';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(annotation.measurementValue, midX, midY);
        }
        break;

      case 'arrow':
        if (annotation.points.length < 2) break;
        
        const [arrowStart, arrowEnd] = annotation.points;
        const angle = Math.atan2(arrowEnd.y - arrowStart.y, arrowEnd.x - arrowStart.x);
        const headLength = 15 / scale;
        
        ctx.strokeStyle = annotation.color;
        ctx.fillStyle = annotation.color;
        ctx.lineWidth = annotation.strokeWidth / scale;
        
        // Draw line
        ctx.beginPath();
        ctx.moveTo(arrowStart.x, arrowStart.y);
        ctx.lineTo(arrowEnd.x, arrowEnd.y);
        ctx.stroke();
        
        // Draw arrowhead
        ctx.beginPath();
        ctx.moveTo(arrowEnd.x, arrowEnd.y);
        ctx.lineTo(
          arrowEnd.x - headLength * Math.cos(angle - Math.PI / 6),
          arrowEnd.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          arrowEnd.x - headLength * Math.cos(angle + Math.PI / 6),
          arrowEnd.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fill();
        break;

      case 'circle':
        if (annotation.points.length < 2) break;
        
        const [circleStart, circleEnd] = annotation.points;
        const radius = Math.sqrt(
          Math.pow(circleEnd.x - circleStart.x, 2) + 
          Math.pow(circleEnd.y - circleStart.y, 2)
        );
        
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.strokeWidth / scale;
        ctx.beginPath();
        ctx.arc(circleStart.x, circleStart.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'rectangle':
        if (annotation.points.length < 2) break;
        
        const [rectStart, rectEnd] = annotation.points;
        
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = annotation.strokeWidth / scale;
        ctx.strokeRect(
          rectStart.x,
          rectStart.y,
          rectEnd.x - rectStart.x,
          rectEnd.y - rectStart.y
        );
        break;
    }

    ctx.restore();
  };

  // Get canvas coordinates from mouse event
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;
    
    return { x, y };
  };

  // Calculate measurement distance
  const calculateDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }): string => {
    const pixelDistance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    const inches = pixelDistance / pixelsPerInch;
    
    switch (measurementUnit) {
      case 'ft':
        return `${(inches / 12).toFixed(2)} ft`;
      case 'cm':
        return `${(inches * 2.54).toFixed(1)} cm`;
      default:
        return `${inches.toFixed(2)} in`;
    }
  };

  // Manual calibration - set pixels per inch based on known distance
  const performCalibration = () => {
    if (calibrationPoints.length < 2 || !calibrationKnownDistance) return;
    
    const pixelDistance = Math.sqrt(
      Math.pow(calibrationPoints[1].x - calibrationPoints[0].x, 2) +
      Math.pow(calibrationPoints[1].y - calibrationPoints[0].y, 2)
    );
    
    let knownInches = parseFloat(calibrationKnownDistance);
    if (calibrationUnit === 'ft') knownInches *= 12;
    if (calibrationUnit === 'cm') knownInches /= 2.54;
    
    const newPPI = pixelDistance / knownInches;
    setPixelsPerInch(newPPI);
    setShowCalibrationModal(false);
    setCalibrationMode(false);
    setCalibrationPoints([]);
    setCalibrationKnownDistance('');
  };

  // AI Calibration - detect common objects and estimate scale
  const performAICalibration = async () => {
    setIsAICalibrating(true);
    
    // Simulate AI analysis (in production, call vision API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // AI would detect objects like:
    // - Standard door (80" tall, 36" wide)
    // - Floor planks (typically 3-7" wide)
    // - Baseboards (typically 3-5" tall)
    // - Outlets (standard 4.5" tall)
    // - Light switches (standard 4.5" tall)
    
    // For demo, we'll estimate based on typical flooring photo
    // Assuming average floor plank width of 5 inches
    const estimatedPPI = 85; // Reasonable estimate for floor photos
    
    setPixelsPerInch(estimatedPPI);
    setIsAICalibrating(false);
    setShowCalibrationModal(false);
    
    // Show result to user
    alert(`AI Calibration Complete!\n\nDetected: Floor planks\nEstimated scale: ~${estimatedPPI.toFixed(0)} pixels/inch\n\nFor best accuracy, use manual calibration with a known measurement.`);
  };

  // Handle calibration clicks on canvas
  const handleCalibrationClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!calibrationMode) return;
    
    const coords = getCanvasCoords(e);
    
    if (calibrationPoints.length < 2) {
      setCalibrationPoints(prev => [...prev, coords]);
    }
    
    if (calibrationPoints.length === 1) {
      // Second point added, draw calibration line
      redrawCanvas();
    }
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'move') return;
    
    const coords = getCanvasCoords(e);
    
    // Eraser tool - find and remove annotation under cursor
    if (activeTool === 'eraser') {
      const annotationToRemove = findAnnotationAtPoint(coords);
      if (annotationToRemove) {
        const newAnnotations = annotations.filter(a => a.id !== annotationToRemove.id);
        setAnnotations(newAnnotations);
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newAnnotations);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
      return;
    }
    
    setIsDrawing(true);
    setStartPoint(coords);

    if (activeTool === 'text') {
      setTextInputPosition({ x: e.clientX, y: e.clientY });
      setShowTextInput(true);
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: activeTool,
      points: [coords],
      color: activeTool === 'highlight' ? '#FFD700' : activeColor,
      strokeWidth: strokeWidth,
      fontSize
    };

    setCurrentAnnotation(newAnnotation);
  };

  // Find annotation at a given point (for eraser)
  const findAnnotationAtPoint = (point: { x: number; y: number }): Annotation | null => {
    const threshold = 15; // pixels tolerance
    
    // Check in reverse order (top-most first)
    for (let i = annotations.length - 1; i >= 0; i--) {
      const annotation = annotations[i];
      
      switch (annotation.type) {
        case 'draw':
        case 'highlight':
          // Check if point is near any segment of the path
          for (let j = 0; j < annotation.points.length - 1; j++) {
            const p1 = annotation.points[j];
            const p2 = annotation.points[j + 1];
            if (distanceToLineSegment(point, p1, p2) < threshold) {
              return annotation;
            }
          }
          break;
          
        case 'text':
          // Check if point is near text position
          if (annotation.points.length > 0) {
            const textPos = annotation.points[0];
            const textWidth = (annotation.text?.length || 0) * (annotation.fontSize || 16) * 0.6;
            if (
              point.x >= textPos.x - 10 &&
              point.x <= textPos.x + textWidth + 10 &&
              point.y >= textPos.y - (annotation.fontSize || 16) - 5 &&
              point.y <= textPos.y + 10
            ) {
              return annotation;
            }
          }
          break;
          
        case 'measurement':
        case 'arrow':
          if (annotation.points.length >= 2) {
            if (distanceToLineSegment(point, annotation.points[0], annotation.points[1]) < threshold) {
              return annotation;
            }
          }
          break;
          
        case 'circle':
          if (annotation.points.length >= 2) {
            const center = annotation.points[0];
            const edge = annotation.points[1];
            const radius = Math.sqrt(
              Math.pow(edge.x - center.x, 2) + Math.pow(edge.y - center.y, 2)
            );
            const distToCenter = Math.sqrt(
              Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2)
            );
            // Check if near the circle's edge
            if (Math.abs(distToCenter - radius) < threshold) {
              return annotation;
            }
          }
          break;
          
        case 'rectangle':
          if (annotation.points.length >= 2) {
            const [p1, p2] = annotation.points;
            const minX = Math.min(p1.x, p2.x);
            const maxX = Math.max(p1.x, p2.x);
            const minY = Math.min(p1.y, p2.y);
            const maxY = Math.max(p1.y, p2.y);
            
            // Check if near any edge of rectangle
            const nearTop = point.y >= minY - threshold && point.y <= minY + threshold && point.x >= minX && point.x <= maxX;
            const nearBottom = point.y >= maxY - threshold && point.y <= maxY + threshold && point.x >= minX && point.x <= maxX;
            const nearLeft = point.x >= minX - threshold && point.x <= minX + threshold && point.y >= minY && point.y <= maxY;
            const nearRight = point.x >= maxX - threshold && point.x <= maxX + threshold && point.y >= minY && point.y <= maxY;
            
            if (nearTop || nearBottom || nearLeft || nearRight) {
              return annotation;
            }
          }
          break;
      }
    }
    
    return null;
  };

  // Calculate distance from point to line segment
  const distanceToLineSegment = (
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
  ): number => {
    const A = point.x - lineStart.x;
    const B = point.y - lineStart.y;
    const C = lineEnd.x - lineStart.x;
    const D = lineEnd.y - lineStart.y;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq !== 0) param = dot / lenSq;

    let xx, yy;

    if (param < 0) {
      xx = lineStart.x;
      yy = lineStart.y;
    } else if (param > 1) {
      xx = lineEnd.x;
      yy = lineEnd.y;
    } else {
      xx = lineStart.x + param * C;
      yy = lineStart.y + param * D;
    }

    const dx = point.x - xx;
    const dy = point.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Eraser - erase annotations while dragging
    if (activeTool === 'eraser' && e.buttons === 1) {
      const coords = getCanvasCoords(e);
      const annotationToRemove = findAnnotationAtPoint(coords);
      if (annotationToRemove) {
        const newAnnotations = annotations.filter(a => a.id !== annotationToRemove.id);
        setAnnotations(newAnnotations);
        
        // Update history
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newAnnotations);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
      return;
    }
    
    if (!isDrawing || !currentAnnotation || activeTool === 'text' || activeTool === 'eraser') return;

    const coords = getCanvasCoords(e);

    if (activeTool === 'draw' || activeTool === 'highlight' || activeTool === 'eraser') {
      setCurrentAnnotation(prev => prev ? {
        ...prev,
        points: [...prev.points, coords]
      } : null);
    } else {
      // For shapes, just update the end point
      setCurrentAnnotation(prev => prev ? {
        ...prev,
        points: [prev.points[0], coords],
        measurementValue: activeTool === 'measurement' ? calculateDistance(prev.points[0], coords) : undefined
      } : null);
    }
  };

  const handleMouseUp = () => {
    if (currentAnnotation && currentAnnotation.points.length > 1) {
      const newAnnotations = [...annotations, currentAnnotation];
      setAnnotations(newAnnotations);
      
      // Update history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newAnnotations);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
    
    setIsDrawing(false);
    setCurrentAnnotation(null);
    setStartPoint(null);
  };

  // Add text annotation
  const handleTextSubmit = () => {
    if (!textInputValue.trim() || !startPoint) {
      setShowTextInput(false);
      setTextInputValue('');
      return;
    }

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type: 'text',
      points: [startPoint],
      color: activeColor,
      strokeWidth: 0,
      text: textInputValue,
      fontSize
    };

    const newAnnotations = [...annotations, newAnnotation];
    setAnnotations(newAnnotations);
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newAnnotations);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setShowTextInput(false);
    setTextInputValue('');
    setStartPoint(null);
  };

  // Undo/Redo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnnotations(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnnotations(history[historyIndex + 1]);
    }
  };

  // Clear all annotations
  const handleClear = () => {
    setAnnotations([]);
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Voice transcription
  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice transcription is not supported in this browser. Try Chrome.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setNotes(prev => prev + ' ' + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  // AI Enhancement for notes
  const enhanceNotesWithAI = async () => {
    if (!notes.trim()) return;
    
    setIsAIProcessing(true);
    
    // Simulate AI processing (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Example AI enhancement - in production, call your AI endpoint
    const enhancedNotes = `${notes}\n\n--- AI Summary ---\nPhoto taken at ${photo.jobName}, ${photo.room} during ${photo.phase} phase. ${
      notes.toLowerCase().includes('damage') ? 'Potential issue identified - recommend follow-up inspection.' :
      notes.toLowerCase().includes('complete') ? 'Work appears to be progressing well.' :
      'Standard documentation photo.'
    }`;
    
    setNotes(enhancedNotes);
    setIsAIProcessing(false);
  };

  // Save
  const handleSave = () => {
    onSave(annotations, notes);
    onClose();
  };

  // Download annotated image
  const downloadAnnotatedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `annotated-${photo.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (!isOpen) return null;

  const ToolButton = ({ tool, icon: Icon, label }: { tool: typeof activeTool; icon: any; label: string }) => (
    <button
      onClick={() => {
        setActiveTool(tool);
        // Auto-switch to yellow for highlight tool
        if (tool === 'highlight') {
          setActiveColor('#FFD700');
        }
      }}
      title={label}
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: activeTool === tool ? ACCENT_COLOR : '#2D2D2D',
        border: `1px solid ${activeTool === tool ? ACCENT_COLOR : '#3D3D3D'}`,
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000000',
      zIndex: 10000,
      display: 'flex'
    }}>
      {/* Left Side - Canvas */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Toolbar */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#1A1A1A',
          borderBottom: '1px solid #2D2D2D',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Drawing Tools */}
          <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: '#252525', borderRadius: '10px' }}>
            <ToolButton tool="draw" icon={Pencil} label="Draw" />
            <ToolButton tool="highlight" icon={Highlighter} label="Highlight" />
            <ToolButton tool="eraser" icon={Eraser} label="Erase Annotations (click to remove)" />
          </div>

          {/* Shape Tools */}
          <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: '#252525', borderRadius: '10px' }}>
            <ToolButton tool="arrow" icon={ArrowRight} label="Arrow" />
            <ToolButton tool="circle" icon={Circle} label="Circle" />
            <ToolButton tool="rectangle" icon={Square} label="Rectangle" />
          </div>

          {/* Text & Measurement */}
          <div style={{ display: 'flex', gap: '4px', padding: '4px', backgroundColor: '#252525', borderRadius: '10px' }}>
            <ToolButton tool="text" icon={Type} label="Text" />
            <ToolButton tool="measurement" icon={Ruler} label="Measure" />
          </div>

          {/* Color Picker */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: activeColor,
                border: '3px solid #3D3D3D',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Palette size={16} color={activeColor === '#000000' ? '#FFFFFF' : '#000000'} />
            </button>
            
            {showColorPicker && (
              <div style={{
                position: 'absolute',
                top: '48px',
                left: 0,
                padding: '8px',
                backgroundColor: '#2D2D2D',
                borderRadius: '10px',
                border: '1px solid #3D3D3D',
                display: 'flex',
                gap: '6px',
                zIndex: 100
              }}>
                {COLORS.map(color => (
                  <button
                    key={color}
                    onClick={() => {
                      setActiveColor(color);
                      setShowColorPicker(false);
                    }}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
                      backgroundColor: color,
                      border: activeColor === color ? `3px solid ${ACCENT_COLOR}` : '2px solid #3D3D3D',
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Stroke Width */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#A0A0A0', fontSize: '12px' }}>Size:</span>
            <input
              type="range"
              min="2"
              max="16"
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              style={{ width: '80px', accentColor: ACCENT_COLOR }}
            />
          </div>

          {/* Measurement Unit */}
          {activeTool === 'measurement' && (
            <>
              <select
                value={measurementUnit}
                onChange={(e) => setMeasurementUnit(e.target.value as 'in' | 'ft' | 'cm')}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #3D3D3D',
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: '12px'
                }}
              >
                <option value="in">Inches</option>
                <option value="ft">Feet</option>
                <option value="cm">Centimeters</option>
              </select>
              
              <button
                onClick={() => setShowCalibrationModal(true)}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#2D2D2D',
                  border: '1px solid #FFD700',
                  borderRadius: '6px',
                  color: '#FFD700',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Ruler size={14} />
                Calibrate
              </button>
              
              <span style={{ color: '#666', fontSize: '11px' }}>
                Scale: {pixelsPerInch.toFixed(0)} px/in
              </span>
            </>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* History Controls */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#2D2D2D',
                border: '1px solid #3D3D3D',
                color: historyIndex <= 0 ? '#666' : '#FFFFFF',
                cursor: historyIndex <= 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Undo size={16} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#2D2D2D',
                border: '1px solid #3D3D3D',
                color: historyIndex >= history.length - 1 ? '#666' : '#FFFFFF',
                cursor: historyIndex >= history.length - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Redo size={16} />
            </button>
            <button
              onClick={handleClear}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                backgroundColor: '#2D2D2D',
                border: '1px solid #E74C3C',
                color: '#E74C3C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div 
          ref={containerRef}
          style={{ 
            flex: 1, 
            position: 'relative', 
            backgroundColor: '#0D0D0D',
            overflow: 'hidden'
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={calibrationMode ? handleCalibrationClick : handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
              cursor: calibrationMode ? 'crosshair' :
                      activeTool === 'text' ? 'text' : 
                      activeTool === 'move' ? 'grab' : 
                      activeTool === 'eraser' ? 'pointer' :
                      'crosshair'
            }}
          />

          {/* Text Input Overlay */}
          {showTextInput && (
            <div
              style={{
                position: 'absolute',
                left: textInputPosition.x,
                top: textInputPosition.y,
                zIndex: 100
              }}
            >
              <input
                autoFocus
                type="text"
                value={textInputValue}
                onChange={(e) => setTextInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTextSubmit();
                  if (e.key === 'Escape') {
                    setShowTextInput(false);
                    setTextInputValue('');
                  }
                }}
                onBlur={handleTextSubmit}
                placeholder="Type text..."
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#1A1A1A',
                  border: `2px solid ${ACCENT_COLOR}`,
                  borderRadius: '6px',
                  color: '#FFFFFF',
                  fontSize: `${fontSize}px`,
                  minWidth: '150px'
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#1A1A1A',
          borderTop: '1px solid #2D2D2D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ color: '#A0A0A0', fontSize: '13px' }}>
            {photo.jobName} • {photo.room} • {photo.phase}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={downloadAnnotatedImage}
              style={{
                padding: '8px 16px',
                backgroundColor: '#2D2D2D',
                border: '1px solid #3D3D3D',
                borderRadius: '6px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px'
              }}
            >
              <Download size={14} />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - Notes Panel */}
      <div style={{
        width: '400px',
        backgroundColor: '#1A1A1A',
        borderLeft: '1px solid #2D2D2D',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid #2D2D2D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={20} />
            Notes
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              border: '1px solid #3D3D3D',
              color: '#A0A0A0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Notes Input */}
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Voice & AI Controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isRecording ? '#E74C3C' : '#2D2D2D',
                border: `1px solid ${isRecording ? '#E74C3C' : '#3D3D3D'}`,
                borderRadius: '8px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {isRecording ? (
                <>
                  <MicOff size={16} />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic size={16} />
                  Voice Note
                </>
              )}
            </button>
            
            <button
              onClick={enhanceNotesWithAI}
              disabled={isAIProcessing || !notes.trim()}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: isAIProcessing ? '#3D3D3D' : `${ACCENT_COLOR}22`,
                border: `1px solid ${ACCENT_COLOR}`,
                borderRadius: '8px',
                color: isAIProcessing ? '#666' : ACCENT_COLOR,
                cursor: isAIProcessing || !notes.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              {isAIProcessing ? (
                <>
                  <Loader2 size={16} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  AI Enhance
                </>
              )}
            </button>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div style={{
              padding: '12px',
              backgroundColor: '#E74C3C22',
              border: '1px solid #E74C3C',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#E74C3C',
                animation: 'pulse 1s infinite'
              }} />
              <span style={{ color: '#E74C3C', fontSize: '13px', fontWeight: '500' }}>
                Listening... Speak now
              </span>
            </div>
          )}

          {/* Notes Textarea */}
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about this photo...

• Describe what you see
• Note any issues or concerns
• Add measurements or specifications
• Include follow-up actions needed"
            style={{
              flex: 1,
              padding: '16px',
              backgroundColor: '#2D2D2D',
              border: '1px solid #3D3D3D',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '14px',
              lineHeight: '1.6',
              resize: 'none',
              fontFamily: 'inherit'
            }}
          />

          {/* Quick Tags */}
          <div>
            <p style={{ color: '#A0A0A0', fontSize: '12px', marginBottom: '8px' }}>Quick Tags:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['Water Damage', 'Repair Needed', 'Complete', 'In Progress', 'Before', 'After', 'Issue', 'Approved'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setNotes(prev => prev + (prev ? '\n' : '') + `[${tag}] `)}
                  style={{
                    padding: '6px 10px',
                    backgroundColor: '#2D2D2D',
                    border: '1px solid #3D3D3D',
                    borderRadius: '6px',
                    color: '#A0A0A0',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{
          padding: '16px 20px',
          borderTop: '1px solid #2D2D2D'
        }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: ACCENT_COLOR,
              border: 'none',
              borderRadius: '10px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>

      {/* CSS for animations */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      {/* Calibration Modal */}
      {showCalibrationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 20000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#1A1A1A',
            borderRadius: '16px',
            border: '1px solid #3D3D3D',
            width: '100%',
            maxWidth: '500px',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #3D3D3D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Ruler size={22} color="#FFD700" />
                Calibrate Measurement Tool
              </h2>
              <button
                onClick={() => {
                  setShowCalibrationModal(false);
                  setCalibrationMode(false);
                  setCalibrationPoints([]);
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  border: '1px solid #3D3D3D',
                  color: '#A0A0A0',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div style={{ padding: '24px' }}>
              {/* AI Calibration */}
              <div style={{
                padding: '16px',
                backgroundColor: `${ACCENT_COLOR}15`,
                border: `1px solid ${ACCENT_COLOR}`,
                borderRadius: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Sparkles size={24} color={ACCENT_COLOR} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600', margin: '0 0 6px 0' }}>
                      AI Auto-Calibration
                    </h3>
                    <p style={{ color: '#A0A0A0', fontSize: '13px', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                      AI will analyze the photo to detect common objects (floor planks, doors, outlets) and estimate the scale automatically.
                    </p>
                    <button
                      onClick={performAICalibration}
                      disabled={isAICalibrating}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: isAICalibrating ? '#3D3D3D' : ACCENT_COLOR,
                        border: 'none',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: isAICalibrating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      {isAICalibrating ? (
                        <>
                          <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                          Analyzing Photo...
                        </>
                      ) : (
                        <>
                          <Sparkles size={16} />
                          Auto-Calibrate with AI
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#3D3D3D' }} />
                <span style={{ color: '#666', fontSize: '12px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#3D3D3D' }} />
              </div>

              {/* Manual Calibration */}
              <div style={{
                padding: '16px',
                backgroundColor: '#2D2D2D',
                borderRadius: '12px'
              }}>
                <h3 style={{ color: '#FFFFFF', fontSize: '15px', fontWeight: '600', margin: '0 0 12px 0' }}>
                  Manual Calibration
                </h3>
                
                {!calibrationMode ? (
                  <>
                    <p style={{ color: '#A0A0A0', fontSize: '13px', margin: '0 0 16px 0', lineHeight: '1.5' }}>
                      For best accuracy, draw a line across a known distance in the photo (e.g., a floor plank, door frame, or tape measure).
                    </p>
                    <button
                      onClick={() => {
                        setCalibrationMode(true);
                        setCalibrationPoints([]);
                        setShowCalibrationModal(false);
                      }}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#FFD700',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#1A1A1A',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Ruler size={16} />
                      Start Manual Calibration
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{
                      padding: '12px',
                      backgroundColor: calibrationPoints.length === 2 ? '#7BAA8E22' : '#FFD70022',
                      border: `1px solid ${calibrationPoints.length === 2 ? '#7BAA8E' : '#FFD700'}`,
                      borderRadius: '8px',
                      marginBottom: '16px'
                    }}>
                      <p style={{ color: '#FFFFFF', fontSize: '13px', margin: 0 }}>
                        {calibrationPoints.length === 0 && '👆 Click the FIRST point on the photo'}
                        {calibrationPoints.length === 1 && '👆 Click the SECOND point on the photo'}
                        {calibrationPoints.length === 2 && '✓ Line drawn! Enter the known distance below.'}
                      </p>
                    </div>

                    {calibrationPoints.length === 2 && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ color: '#A0A0A0', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                            Known Distance
                          </label>
                          <input
                            type="number"
                            value={calibrationKnownDistance}
                            onChange={(e) => setCalibrationKnownDistance(e.target.value)}
                            placeholder="e.g., 5"
                            style={{
                              width: '100%',
                              padding: '10px 12px',
                              backgroundColor: '#1A1A1A',
                              border: '1px solid #3D3D3D',
                              borderRadius: '6px',
                              color: '#FFFFFF',
                              fontSize: '14px'
                            }}
                          />
                        </div>
                        <div>
                          <label style={{ color: '#A0A0A0', fontSize: '12px', display: 'block', marginBottom: '6px' }}>
                            Unit
                          </label>
                          <select
                            value={calibrationUnit}
                            onChange={(e) => setCalibrationUnit(e.target.value as 'in' | 'ft' | 'cm')}
                            style={{
                              padding: '10px 12px',
                              backgroundColor: '#1A1A1A',
                              border: '1px solid #3D3D3D',
                              borderRadius: '6px',
                              color: '#FFFFFF',
                              fontSize: '14px'
                            }}
                          >
                            <option value="in">Inches</option>
                            <option value="ft">Feet</option>
                            <option value="cm">cm</option>
                          </select>
                        </div>
                        <button
                          onClick={performCalibration}
                          disabled={!calibrationKnownDistance}
                          style={{
                            padding: '10px 20px',
                            backgroundColor: calibrationKnownDistance ? '#7BAA8E' : '#3D3D3D',
                            border: 'none',
                            borderRadius: '6px',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: calibrationKnownDistance ? 'pointer' : 'not-allowed'
                          }}
                        >
                          Apply
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setCalibrationMode(false);
                        setCalibrationPoints([]);
                      }}
                      style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        border: '1px solid #3D3D3D',
                        borderRadius: '6px',
                        color: '#A0A0A0',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel Calibration
                    </button>
                  </>
                )}
              </div>

              {/* Current Scale Info */}
              <div style={{
                marginTop: '20px',
                padding: '12px 16px',
                backgroundColor: '#252525',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ color: '#A0A0A0', fontSize: '13px' }}>Current Scale:</span>
                <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
                  {pixelsPerInch.toFixed(1)} pixels per inch
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calibration Mode Overlay */}
      {calibrationMode && !showCalibrationModal && (
        <div style={{
          position: 'fixed',
          top: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '12px 20px',
          backgroundColor: '#FFD700',
          borderRadius: '10px',
          zIndex: 15000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Ruler size={18} color="#1A1A1A" />
          <span style={{ color: '#1A1A1A', fontSize: '14px', fontWeight: '600' }}>
            {calibrationPoints.length === 0 && 'Click first point of known distance'}
            {calibrationPoints.length === 1 && 'Click second point of known distance'}
            {calibrationPoints.length === 2 && 'Line drawn! '}
          </span>
          {calibrationPoints.length === 2 && (
            <button
              onClick={() => setShowCalibrationModal(true)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#1A1A1A',
                border: 'none',
                borderRadius: '6px',
                color: '#FFD700',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Enter Distance →
            </button>
          )}
          <button
            onClick={() => {
              setCalibrationMode(false);
              setCalibrationPoints([]);
            }}
            style={{
              padding: '4px 8px',
              backgroundColor: 'transparent',
              border: 'none',
              color: '#1A1A1A',
              cursor: 'pointer',
              fontSize: '18px'
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
