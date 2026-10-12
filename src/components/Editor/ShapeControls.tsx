import React from 'react';
import { ShapeElement, ShapeKind } from '../../types/poster';
import { PALETTE_PRESETS } from '../../utils/constants';
import { Square, Circle, Star, Minus } from 'lucide-react';

interface ShapeControlsProps {
  element: ShapeElement | null;
  onUpdate: (updated: ShapeElement) => void;
  onAddShape: (kind: ShapeKind) => void;
}

export const ShapeControls: React.FC<ShapeControlsProps> = ({ element, onUpdate, onAddShape }) => {
  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      {/* Add Shapes Palette */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Add Geometric Shape
        </span>
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onAddShape('rectangle')}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl transition-all"
          >
            <Square className="w-5 h-5 text-amber-400 mb-1" />
            <span className="text-[10px] text-slate-300 font-medium">Box</span>
          </button>
          <button
            onClick={() => onAddShape('circle')}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl transition-all"
          >
            <Circle className="w-5 h-5 text-sky-400 mb-1" />
            <span className="text-[10px] text-slate-300 font-medium">Circle</span>
          </button>
          <button
            onClick={() => onAddShape('star')}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl transition-all"
          >
            <Star className="w-5 h-5 text-yellow-400 mb-1" />
            <span className="text-[10px] text-slate-300 font-medium">Star</span>
          </button>
          <button
            onClick={() => onAddShape('line')}
            className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 active:scale-95 border border-slate-700 rounded-xl transition-all"
          >
            <Minus className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[10px] text-slate-300 font-medium">Line</span>
          </button>
        </div>
      </div>

      {/* Selected Shape Configuration */}
      {element ? (
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-amber-400 uppercase">
              Configure {element.shapeKind}
            </span>
          </div>

          {/* Fill Color */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Fill Color</label>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded border border-slate-600 inline-block shadow-sm"
                  style={{ backgroundColor: element.fillColor }}
                />
                <input
                  type="text"
                  value={element.fillColor}
                  onChange={(e) => onUpdate({ ...element, fillColor: e.target.value })}
                  className="w-20 p-1 bg-slate-900 border border-slate-700 rounded text-center font-mono text-white text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {PALETTE_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdate({ ...element, fillColor: color })}
                  className={`w-full aspect-square rounded-lg border transition-transform hover:scale-110 ${element.fillColor === color ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Corner Radius (for rectangle) */}
          {element.shapeKind === 'rectangle' && (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-slate-400">
                <span>Corner Rounding</span>
                <span className="font-mono text-white">{element.borderRadius || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="120"
                value={element.borderRadius || 0}
                onChange={(e) => onUpdate({ ...element, borderRadius: Number(e.target.value) })}
                className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          )}

          {/* Stroke / Outline Width & Color */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-slate-400">
              <span>Stroke Outline</span>
              <span className="font-mono text-white">{element.strokeWidth || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              value={element.strokeWidth || 0}
              onChange={(e) =>
                onUpdate({
                  ...element,
                  strokeWidth: Number(e.target.value),
                  strokeColor: element.strokeColor || '#FFFFFF',
                })
              }
              className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
            />

            {element.strokeWidth ? (
              <div className="grid grid-cols-8 gap-1.5 pt-1">
                {PALETTE_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ ...element, strokeColor: color })}
                    className={`w-full aspect-square rounded border transition-transform hover:scale-110 ${element.strokeColor === color ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-900/60 border border-dashed border-slate-800 rounded-xl text-center text-slate-400">
          Tap a shape on the canvas to customize fill, borders, or rounded corners.
        </div>
      )}
    </div>
  );
};
