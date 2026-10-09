import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Pencil, 
  Eraser, 
  RotateCcw, 
  RotateCw, 
  Trash2, 
  Grid, 
  Tag, 
  Minus, 
  Square, 
  Circle,
  Palette,
  Check
} from 'lucide-react';
import { BlueprintLabel } from '../types';

interface DrawingCanvasProps {
  initialDataUrl?: string;
  labels: BlueprintLabel[];
  onSave: (dataUrl: string, labels: BlueprintLabel[]) => void;
  readOnly?: boolean;
}

type ToolMode = 'draw' | 'line' | 'rect' | 'circle' | 'eraser' | 'label';

const PALETTE_COLORS = [
  { name: 'Blueprint Navy', value: '#1e3a8a' },
  { name: 'Graphite Black', value: '#1e293b' },
  { name: 'Safety Red', value: '#dc2626' },
  { name: 'Forest Green', value: '#16a34a' },
  { name: 'Solar Amber', value: '#d97706' },
  { name: 'Bright Cyan', value: '#0284c7' },
];

const STROKE_WIDTHS = [
  { label: 'Fine', size: 2 },
  { label: 'Medium', size: 5 },
  { label: 'Thick', size: 10 },
];

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  initialDataUrl,
  labels,
  onSave,
  readOnly = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeTool, setActiveTool] = useState<ToolMode>('draw');
  const [activeColor, setActiveColor] = useState<string>('#1e3a8a');
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  
  // History for Undo/Redo
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Labels placed on canvas
  const [placedLabels, setPlacedLabels] = useState<BlueprintLabel[]>(labels || []);
  const [pendingLabelText, setPendingLabelText] = useState<string>('');
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [pendingLabelCoords, setPendingLabelCoords] = useState<{ x: number; y: number } | null>(null);

  // Drawing state
  const isDrawingRef = useRef<boolean>(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set high resolution for crisp drawing on iPad Retina displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    // Default virtual dimensions
    const width = 800;
    const height = 500;
    
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    // Initial fill with clean white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    if (initialDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        const data = canvas.toDataURL();
        setHistory([data]);
        setHistoryIndex(0);
      };
      img.src = initialDataUrl;
    } else {
      const data = canvas.toDataURL();
      setHistory([data]);
      setHistoryIndex(0);
    }
  }, []);

  // Save changes to parent whenever history or labels change
  const triggerSave = useCallback((overrideData?: string, overrideLabels?: BlueprintLabel[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = overrideData || canvas.toDataURL('image/png');
    onSave(data, overrideLabels !== undefined ? overrideLabels : placedLabels);
  }, [onSave, placedLabels]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL('image/png');
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(data);
    // Limit history to 20 states to prevent memory issues on iPads
    if (newHistory.length > 20) newHistory.shift();
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    triggerSave(data);
  };

  const restoreState = (dataUrl: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      const dpr = window.devicePixelRatio || 1;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
      ctx.drawImage(img, 0, 0, 800, 500);
      triggerSave(dataUrl);
    };
    img.src = dataUrl;
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      restoreState(history[prevIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      restoreState(history[nextIndex]);
    }
  };

  const handleClear = () => {
    if (readOnly) return;
    if (confirm('Clear the entire blueprint? You can click Undo if made by mistake!')) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 500);
      setPlacedLabels([]);
      saveToHistory();
      triggerSave(canvas.toDataURL('image/png'), []);
    }
  };

  // Coordinate normalizer for mouse and touch events
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = 800 / rect.width;
    const scaleY = 500 / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    // If label tool is selected, prompt for label at this percentage location
    if (activeTool === 'label') {
      const rect = canvas.getBoundingClientRect();
      const pctX = Math.round((coords.x / 800) * 100);
      const pctY = Math.round((coords.y / 500) * 100);
      setPendingLabelCoords({ x: pctX, y: pctY });
      setShowLabelModal(true);
      return;
    }

    isDrawingRef.current = true;
    startPosRef.current = coords;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (activeTool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = strokeWidth * 3;
    } else {
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = strokeWidth;
    }

    if (activeTool === 'draw' || activeTool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(coords.x, coords.y);
    } else {
      // Shape tools: take snapshot for preview
      const dpr = window.devicePixelRatio || 1;
      snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  };

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawingRef.current || readOnly) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);

    if (activeTool === 'draw' || activeTool === 'eraser') {
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else if (snapshotRef.current && startPosRef.current) {
      // Restore snapshot to draw shape preview cleanly
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = activeColor;
      ctx.lineWidth = strokeWidth;

      const sx = startPosRef.current.x;
      const sy = startPosRef.current.y;

      if (activeTool === 'line') {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();
      } else if (activeTool === 'rect') {
        ctx.beginPath();
        ctx.strokeRect(sx, sy, coords.x - sx, coords.y - sy);
      } else if (activeTool === 'circle') {
        const radius = Math.sqrt(Math.pow(coords.x - sx, 2) + Math.pow(coords.y - sy, 2));
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    startPosRef.current = null;
    snapshotRef.current = null;
    saveToHistory();
  };

  const handleAddLabel = () => {
    if (!pendingLabelText.trim() || !pendingLabelCoords) return;
    const newLabel: BlueprintLabel = {
      id: 'lbl_' + Date.now(),
      text: pendingLabelText.trim(),
      x: pendingLabelCoords.x,
      y: pendingLabelCoords.y,
      color: activeColor,
    };
    const updated = [...placedLabels, newLabel];
    setPlacedLabels(updated);
    setPendingLabelText('');
    setShowLabelModal(false);
    setPendingLabelCoords(null);
    triggerSave(undefined, updated);
  };

  const removeLabel = (labelId: string) => {
    if (readOnly) return;
    const updated = placedLabels.filter((l) => l.id !== labelId);
    setPlacedLabels(updated);
    triggerSave(undefined, updated);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Top Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-100 rounded-xl border border-slate-200">
          {/* Tool selectors */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTool('draw')}
              title="Pencil / Draw"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTool === 'draw'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Pencil className="w-4 h-4" />
              <span>Draw</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('line')}
              title="Straight Line"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTool === 'line'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Line</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('rect')}
              title="Rectangle"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTool === 'rect'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Square className="w-4 h-4" />
              <span>Box</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('circle')}
              title="Circle"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTool === 'circle'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Circle className="w-4 h-4" />
              <span>Circle</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('label')}
              title="Add Label Pin"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTool === 'label'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>+ Label Pin</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTool('eraser')}
              title="Eraser"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTool === 'eraser'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Eraser className="w-4 h-4" />
              <span>Eraser</span>
            </button>
          </div>

          {/* Color & Size palette */}
          <div className="flex items-center gap-3">
            {/* Colors */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              {PALETTE_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => {
                    setActiveColor(c.value);
                    if (activeTool === 'eraser') setActiveTool('draw');
                  }}
                  title={c.name}
                  className="w-6 h-6 rounded-md flex items-center justify-center transition-transform active:scale-95"
                  style={{ backgroundColor: c.value }}
                >
                  {activeColor === c.value && activeTool !== 'eraser' && (
                    <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>

            {/* Stroke widths */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
              {STROKE_WIDTHS.map((s) => (
                <button
                  key={s.size}
                  type="button"
                  onClick={() => setStrokeWidth(s.size)}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    strokeWidth === s.size ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Grid & Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                title="Toggle Grid Paper"
                className={`p-1.5 rounded-lg border transition-colors ${
                  showGrid ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={historyIndex <= 0}
                onClick={handleUndo}
                title="Undo"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={historyIndex >= history.length - 1}
                onClick={handleRedo}
                title="Redo"
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleClear}
                title="Clear Blueprint"
                className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Viewport with Blueprint Backdrop */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-2xl border-2 border-slate-300 shadow-sm bg-white touch-none"
        style={{ aspectRatio: '800 / 500' }}
      >
        {/* Optional Blueprint Grid Lines */}
        {showGrid && (
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: `
                linear-gradient(to right, #0284c7 1px, transparent 1px),
                linear-gradient(to bottom, #0284c7 1px, transparent 1px),
                linear-gradient(to right, #0284c7 0.5px, transparent 0.5px),
                linear-gradient(to bottom, #0284c7 0.5px, transparent 0.5px)
              `,
              backgroundSize: '80px 80px, 80px 80px, 16px 16px, 16px 16px',
            }}
          />
        )}

        {/* Canvas Element */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={drawMove}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={drawMove}
          onTouchEnd={stopDrawing}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Interactive Labeled Pins Overlay */}
        {placedLabels.map((lbl, idx) => (
          <div
            key={lbl.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 group pointer-events-auto"
            style={{ left: `${lbl.x}%`, top: `${lbl.y}%` }}
          >
            {/* Pin Marker with Arrow indicator */}
            <div className="relative flex items-center">
              <div 
                className="px-2.5 py-1 text-xs font-bold text-white rounded-lg shadow-md flex items-center gap-1.5 border border-white/60"
                style={{ backgroundColor: lbl.color || '#1e3a8a' }}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-mono">
                  {idx + 1}
                </span>
                <span>{lbl.text}</span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeLabel(lbl.id);
                    }}
                    className="ml-1 text-white/80 hover:text-white"
                    title="Remove label"
                  >
                    ×
                  </button>
                )}
              </div>
              {/* Pointer dot */}
              <div 
                className="w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm -ml-1"
                style={{ backgroundColor: lbl.color || '#1e3a8a' }}
              />
            </div>
          </div>
        ))}

        {/* Helper guide when using label tool */}
        {activeTool === 'label' && !readOnly && (
          <div className="absolute bottom-3 left-3 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium shadow pointer-events-none animate-pulse">
            👉 Tap anywhere on your drawing to place a part label!
          </div>
        )}
      </div>

      {/* Label Modal Dialog */}
      {showLabelModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
              <Tag className="w-5 h-5" />
              <span>Label this Part of your Blueprint</span>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Give this part a clear name (e.g., "Front Wheels", "Tall Mast", "Strong Triangle Support", "Tape Joint"):
            </p>
            <input
              type="text"
              autoFocus
              value={pendingLabelText}
              onChange={(e) => setPendingLabelText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddLabel();
              }}
              placeholder="e.g. Cardboard Base Pier"
              className="w-full px-3 py-2 text-sm border-2 border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowLabelModal(false);
                  setPendingLabelCoords(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddLabel}
                disabled={!pendingLabelText.trim()}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg disabled:opacity-50"
              >
                Pin Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary of Labels placed */}
      <div className="flex items-center justify-between text-xs text-slate-600 px-1">
        <span>
          <strong>{placedLabels.length}</strong> labelled parts on blueprint
        </span>
        <span className="text-slate-400">
          Tip: Use both drawings and labels so anyone can understand your design!
        </span>
      </div>
    </div>
  );
};
