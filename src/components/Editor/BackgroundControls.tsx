import React from 'react';
import { BackgroundConfig, AspectRatioType } from '../../types/poster';
import { PALETTE_PRESETS, GRADIENT_PRESETS, CANVAS_PRESETS } from '../../utils/constants';
import { Palette, Sparkles, Layout } from 'lucide-react';

interface BackgroundControlsProps {
  background: BackgroundConfig;
  currentAspectRatio: AspectRatioType;
  onUpdateBackground: (bg: BackgroundConfig) => void;
  onChangeAspectRatio: (ratio: AspectRatioType, width: number, height: number) => void;
}

export const BackgroundControls: React.FC<BackgroundControlsProps> = ({
  background,
  currentAspectRatio,
  onUpdateBackground,
  onChangeAspectRatio,
}) => {
  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      {/* Canvas Dimensions / Aspect Ratio Presets */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
          <Layout className="w-3.5 h-3.5 text-amber-400" />
          Canvas Format &amp; Aspect Ratio
        </span>
        <div className="grid grid-cols-2 gap-2">
          {CANVAS_PRESETS.map((preset) => {
            const isSelected = currentAspectRatio === preset.aspectRatio;
            return (
              <button
                key={preset.aspectRatio}
                onClick={() => onChangeAspectRatio(preset.aspectRatio, preset.width, preset.height)}
                className={`p-2.5 rounded-xl border text-left flex flex-col transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="font-semibold text-[11px] truncate">{preset.label}</span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {preset.width} × {preset.height}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Background Type: Solid vs Gradient */}
      <div className="flex flex-col gap-3 border-t border-slate-800 pt-4">
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          Background Mode
        </span>

        <div className="flex p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() =>
              onUpdateBackground({
                type: 'color',
                color: background.color || '#0F172A',
              })
            }
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              background.type === 'color' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Solid Color
          </button>
          <button
            onClick={() =>
              onUpdateBackground({
                type: 'gradient',
                gradient: background.gradient || GRADIENT_PRESETS[0].gradient,
              })
            }
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              background.type === 'gradient'
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Gradient
          </button>
        </div>

        {background.type === 'color' ? (
          /* Solid Color Swatches */
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Canvas Color</label>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded border border-slate-600 inline-block shadow-sm"
                  style={{ backgroundColor: background.color || '#FFFFFF' }}
                />
                <input
                  type="text"
                  value={background.color || '#FFFFFF'}
                  onChange={(e) => onUpdateBackground({ type: 'color', color: e.target.value })}
                  className="w-20 p-1 bg-slate-900 border border-slate-700 rounded text-center font-mono text-white text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 gap-1.5 pt-1">
              {PALETTE_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdateBackground({ type: 'color', color })}
                  className={`w-full aspect-square rounded-lg border transition-transform hover:scale-110 ${
                    background.color === color ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Gradient Presets & Angles */
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Curated Gradients
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {GRADIENT_PRESETS.map((preset) => {
                const stopsStr = preset.gradient.stops
                  .map((s) => `${s.color} ${s.offset * 100}%`)
                  .join(', ');
                return (
                  <button
                    key={preset.name}
                    onClick={() =>
                      onUpdateBackground({
                        type: 'gradient',
                        gradient: preset.gradient,
                      })
                    }
                    className="p-2 rounded-xl border border-slate-700 hover:border-amber-400/60 transition-all flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className="w-full h-8 rounded-lg shadow-inner group-hover:scale-105 transition-transform"
                      style={{
                        background: `linear-gradient(${preset.gradient.angle || 180}deg, ${stopsStr})`,
                      }}
                    />
                    <span className="text-[10px] text-slate-300 font-medium truncate w-full text-center">
                      {preset.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {background.gradient && (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex justify-between text-slate-400">
                  <span>Gradient Direction / Angle</span>
                  <span className="font-mono text-white">{background.gradient.angle || 180}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={background.gradient.angle || 180}
                  onChange={(e) =>
                    onUpdateBackground({
                      type: 'gradient',
                      gradient: {
                        ...background.gradient!,
                        angle: Number(e.target.value),
                      },
                    })
                  }
                  className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
