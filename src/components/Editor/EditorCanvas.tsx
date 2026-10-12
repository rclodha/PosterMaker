import React, { useRef, useState, useEffect } from 'react';
import { PosterProject, CanvasElement, TextElement, ImageElement, ShapeElement } from '../../types/poster';
import { ZoomIn, ZoomOut, Maximize2, Grid3X3, Eye } from 'lucide-react';

interface EditorCanvasProps {
  project: PosterProject;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  onElementChangeEnd?: () => void;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
  project,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onElementChangeEnd,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);
  const [autoScale, setAutoScale] = useState(0.45);
  const [showGrid, setShowGrid] = useState(false);
  const [showSafeMargins, setShowSafeMargins] = useState(true);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<'move' | 'nw' | 'ne' | 'se' | 'sw' | 'rotate' | null>(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [initialElemState, setInitialElemState] = useState<CanvasElement | null>(null);

  // Snapping guide states
  const [snapLines, setSnapLines] = useState<{ x?: number; y?: number }>({});

  const selectedElement = project.elements.find((el) => el.id === selectedElementId) || null;

  // Auto-calculate scale to fit container comfortably
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const padding = 32;
      const availW = Math.max(280, clientWidth - padding);
      const availH = Math.max(300, clientHeight - padding);
      const scaleX = availW / project.canvas.width;
      const scaleY = availH / project.canvas.height;
      const newScale = Math.min(scaleX, scaleY, 0.95);
      setAutoScale(newScale);
      setScale(newScale);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [project.canvas.width, project.canvas.height]);

  // Pointer Down on Element or Handles
  const handlePointerDown = (
    e: React.PointerEvent,
    elem: CanvasElement,
    handle: 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'rotate'
  ) => {
    e.stopPropagation();
    if (elem.locked) return;

    onSelectElement(elem.id);
    setIsDragging(true);
    setDragHandle(handle);
    setStartPos({ x: e.clientX, y: e.clientY });
    setInitialElemState({ ...elem });

    // Capture pointer
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragHandle || !initialElemState || !selectedElement) return;

    const dx = (e.clientX - startPos.x) / scale;
    const dy = (e.clientY - startPos.y) / scale;

    if (dragHandle === 'move') {
      let nextX = Math.round(initialElemState.x + dx);
      let nextY = Math.round(initialElemState.y + dy);

      // Smart Snapping to center
      const centerX = nextX + initialElemState.width / 2;
      const canvasCenterX = project.canvas.width / 2;
      const newSnap: { x?: number; y?: number } = {};

      if (Math.abs(centerX - canvasCenterX) < 15) {
        nextX = canvasCenterX - initialElemState.width / 2;
        newSnap.x = canvasCenterX;
      }

      const centerY = nextY + initialElemState.height / 2;
      const canvasCenterY = project.canvas.height / 2;
      if (Math.abs(centerY - canvasCenterY) < 15) {
        nextY = canvasCenterY - initialElemState.height / 2;
        newSnap.y = canvasCenterY;
      }

      setSnapLines(newSnap);

      onUpdateElement({
        ...selectedElement,
        x: nextX,
        y: nextY,
      });
    } else if (dragHandle === 'rotate') {
      // Rotate handle
      const elemCenterCanvasX = initialElemState.x + initialElemState.width / 2;
      const elemCenterCanvasY = initialElemState.y + initialElemState.height / 2;

      // Mouse pos relative to canvas container
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      const mouseCanvasX = (e.clientX - containerRect.left) / scale;
      const mouseCanvasY = (e.clientY - containerRect.top) / scale;

      const angleRad = Math.atan2(mouseCanvasY - elemCenterCanvasY, mouseCanvasX - elemCenterCanvasX);
      let angleDeg = Math.round((angleRad * 180) / Math.PI) + 90;
      if (angleDeg < 0) angleDeg += 360;

      // Snap to 0, 90, 180, 270 degrees
      if (Math.abs(angleDeg % 90) < 5) angleDeg = Math.round(angleDeg / 90) * 90;

      onUpdateElement({
        ...selectedElement,
        rotation: angleDeg,
      });
    } else {
      // Corner resizing
      let { x, y, width, height } = initialElemState;
      const minSize = 30;

      if (dragHandle === 'se') {
        width = Math.max(minSize, Math.round(initialElemState.width + dx));
        height = Math.max(minSize, Math.round(initialElemState.height + dy));
      } else if (dragHandle === 'sw') {
        const newW = Math.max(minSize, Math.round(initialElemState.width - dx));
        x = initialElemState.x + (initialElemState.width - newW);
        width = newW;
        height = Math.max(minSize, Math.round(initialElemState.height + dy));
      } else if (dragHandle === 'ne') {
        width = Math.max(minSize, Math.round(initialElemState.width + dx));
        const newH = Math.max(minSize, Math.round(initialElemState.height - dy));
        y = initialElemState.y + (initialElemState.height - newH);
        height = newH;
      } else if (dragHandle === 'nw') {
        const newW = Math.max(minSize, Math.round(initialElemState.width - dx));
        x = initialElemState.x + (initialElemState.width - newW);
        width = newW;
        const newH = Math.max(minSize, Math.round(initialElemState.height - dy));
        y = initialElemState.y + (initialElemState.height - newH);
        height = newH;
      }

      onUpdateElement({
        ...selectedElement,
        x,
        y,
        width,
        height,
      });
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDragHandle(null);
      setInitialElemState(null);
      setSnapLines({});
      onElementChangeEnd?.();
    }
  };

  // Canvas background style helper
  const getBackgroundStyle = (): React.CSSProperties => {
    const bg = project.canvas.background;
    if (bg.type === 'color') {
      return { backgroundColor: bg.color || '#FFFFFF' };
    }
    if (bg.type === 'gradient' && bg.gradient) {
      const stopsStr = bg.gradient.stops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ');
      if (bg.gradient.type === 'linear') {
        return {
          background: `linear-gradient(${bg.gradient.angle || 180}deg, ${stopsStr})`,
        };
      }
      return {
        background: `radial-gradient(circle, ${stopsStr})`,
      };
    }
    return { backgroundColor: '#FFFFFF' };
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 select-none overflow-hidden">
      {/* Floating Canvas Controls Top Right */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5 p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg">
        <button
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid"
          className={`p-2 rounded-lg transition-colors ${showGrid ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Grid3X3 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowSafeMargins(!showSafeMargins)}
          title="Safe Margins"
          className={`p-2 rounded-lg transition-colors ${showSafeMargins ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Eye className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />
        <button
          onClick={() => setScale((s) => Math.max(0.15, s - 0.08))}
          title="Zoom Out"
          className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1 tabular-nums">
          {Math.round((scale / autoScale) * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => Math.min(1.5, s + 0.08))}
          title="Zoom In"
          className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setScale(autoScale)}
          title="Fit Canvas"
          className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 w-full h-full flex items-center justify-center p-4 overflow-auto touch-none"
        onClick={() => onSelectElement(null)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div
          id="poster-canvas-viewport"
          className="relative transition-transform duration-75 shadow-2xl origin-center"
          style={{
            width: project.canvas.width,
            height: project.canvas.height,
            transform: `scale(${scale})`,
            ...getBackgroundStyle(),
          }}
        >
          {/* Optional Grid Overlay */}
          {showGrid && (
            <div
              className="absolute inset-0 pointer-events-none z-10 opacity-20"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #94A3B8 1px, transparent 1px), linear-gradient(to bottom, #94A3B8 1px, transparent 1px)',
                backgroundSize: '80px 80px',
              }}
            />
          )}

          {/* Safe Margins Guide */}
          {showSafeMargins && (
            <div
              className="absolute pointer-events-none z-10 border border-dashed border-amber-400/40 rounded-xl"
              style={{
                top: 40,
                left: 40,
                right: 40,
                bottom: 40,
              }}
            >
              <span className="absolute top-2 left-2 text-[10px] font-mono uppercase tracking-wider text-amber-400/60">
                Safe Margin
              </span>
            </div>
          )}

          {/* Dynamic Snapping Guide Lines */}
          {snapLines.x !== undefined && (
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-cyan-400 pointer-events-none z-30 shadow-[0_0_8px_cyan]"
              style={{ left: snapLines.x }}
            />
          )}
          {snapLines.y !== undefined && (
            <div
              className="absolute left-0 right-0 h-[2px] bg-cyan-400 pointer-events-none z-30 shadow-[0_0_8px_cyan]"
              style={{ top: snapLines.y }}
            />
          )}

          {/* Render Elements in Layer Order */}
          {project.elements
            .filter((el) => !el.hidden)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map((elem) => {
              const isSelected = selectedElementId === elem.id;

              return (
                <div
                  key={elem.id}
                  id={`canvas-elem-${elem.id}`}
                  className={`absolute group cursor-move select-none ${elem.locked ? 'cursor-not-allowed' : ''}`}
                  style={{
                    left: elem.x,
                    top: elem.y,
                    width: elem.width,
                    height: elem.height,
                    transform: `rotate(${elem.rotation || 0}deg)`,
                    zIndex: elem.zIndex,
                    opacity: elem.opacity ?? 1,
                  }}
                  onPointerDown={(e) => handlePointerDown(e, elem, 'move')}
                >
                  {/* Element Content Render */}
                  {elem.type === 'shape' && <RenderShapeElement element={elem as ShapeElement} />}
                  {elem.type === 'image' && <RenderImageElement element={elem as ImageElement} />}
                  {elem.type === 'text' && <RenderTextElement element={elem as TextElement} />}

                  {/* Selection Bounding Box & Transform Handles */}
                  {isSelected && !elem.locked && (
                    <div className="absolute inset-0 pointer-events-none ring-2 ring-amber-400 ring-offset-2 ring-offset-black/50">
                      {/* Rotate Handle */}
                      <div
                        className="absolute -top-12 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-400 text-slate-900 border-2 border-white shadow-md flex items-center justify-center cursor-grab pointer-events-auto active:cursor-grabbing hover:scale-110 transition-transform"
                        onPointerDown={(e) => handlePointerDown(e, elem, 'rotate')}
                        title="Rotate element"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                        </svg>
                      </div>
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-[2px] h-6 bg-amber-400" />

                      {/* 4 Corner Resize Handles */}
                      <div
                        className="absolute -top-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-amber-500 rounded-sm shadow-md cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                        onPointerDown={(e) => handlePointerDown(e, elem, 'nw')}
                      />
                      <div
                        className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-amber-500 rounded-sm shadow-md cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
                        onPointerDown={(e) => handlePointerDown(e, elem, 'ne')}
                      />
                      <div
                        className="absolute -bottom-2.5 -right-2.5 w-5 h-5 bg-white border-2 border-amber-500 rounded-sm shadow-md cursor-nwse-resize pointer-events-auto hover:scale-125 transition-transform"
                        onPointerDown={(e) => handlePointerDown(e, elem, 'se')}
                      />
                      <div
                        className="absolute -bottom-2.5 -left-2.5 w-5 h-5 bg-white border-2 border-amber-500 rounded-sm shadow-md cursor-nesw-resize pointer-events-auto hover:scale-125 transition-transform"
                        onPointerDown={(e) => handlePointerDown(e, elem, 'sw')}
                      />
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

// Sub-component: Render Shape
const RenderShapeElement: React.FC<{ element: ShapeElement }> = ({ element }) => {
  const { shapeKind, fillColor, strokeColor, strokeWidth, borderRadius, width, height } = element;

  if (shapeKind === 'circle') {
    return (
      <div
        className="w-full h-full rounded-full"
        style={{
          backgroundColor: fillColor,
          borderColor: strokeColor,
          borderWidth: strokeWidth ? `${strokeWidth}px` : undefined,
          borderStyle: strokeColor ? 'solid' : undefined,
        }}
      />
    );
  }

  if (shapeKind === 'line') {
    return (
      <div
        className="w-full h-full"
        style={{
          backgroundColor: fillColor,
        }}
      />
    );
  }

  if (shapeKind === 'star') {
    return (
      <svg className="w-full h-full" viewBox="0 0 100 100">
        <polygon
          points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36"
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </svg>
    );
  }

  return (
    <div
      className="w-full h-full"
      style={{
        backgroundColor: fillColor,
        borderColor: strokeColor,
        borderWidth: strokeWidth ? `${strokeWidth}px` : undefined,
        borderStyle: strokeColor ? 'solid' : undefined,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      }}
    />
  );
};

// Sub-component: Render Image
const RenderImageElement: React.FC<{ element: ImageElement }> = ({ element }) => {
  return (
    <img
      src={element.src}
      alt={element.alt || 'Poster Element'}
      referrerPolicy="no-referrer"
      draggable={false}
      className="w-full h-full object-contain pointer-events-none select-none"
      style={{
        borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
        borderColor: element.borderColor,
        borderWidth: element.borderWidth ? `${element.borderWidth}px` : undefined,
        borderStyle: element.borderColor ? 'solid' : undefined,
      }}
    />
  );
};

// Sub-component: Render Text
const RenderTextElement: React.FC<{ element: TextElement }> = ({ element }) => {
  const {
    text,
    fontFamily,
    fontSize,
    fontWeight,
    fontStyle,
    color,
    textAlign,
    letterSpacing,
    lineHeight,
    textTransform,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    backgroundColor,
    backgroundPadding,
    borderRadius,
  } = element;

  return (
    <div
      className="w-full h-full flex flex-col justify-center whitespace-pre-wrap select-none"
      style={{
        fontFamily: `"${fontFamily}", sans-serif`,
        fontSize: `${fontSize}px`,
        fontWeight: fontWeight || 400,
        fontStyle: fontStyle || 'normal',
        color: color || '#FFFFFF',
        textAlign: textAlign || 'center',
        letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
        lineHeight: lineHeight || 1.2,
        textTransform: textTransform || 'none',
        textShadow: shadowColor
          ? `${shadowOffsetX || 0}px ${shadowOffsetY || 4}px ${shadowBlur || 8}px ${shadowColor}`
          : undefined,
        backgroundColor: backgroundColor || undefined,
        padding: backgroundPadding ? `${backgroundPadding}px` : undefined,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
      }}
    >
      {text}
    </div>
  );
};
