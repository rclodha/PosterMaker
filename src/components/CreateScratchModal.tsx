import React, { useState } from 'react';
import { CANVAS_PRESETS, PALETTE_PRESETS, GRADIENT_PRESETS } from '../utils/constants';
import { CanvasDimensions, BackgroundConfig, PosterProject } from '../types/poster';
import { X, Sparkles, Plus } from 'lucide-react';

interface CreateScratchModalProps {
  onClose: () => void;
  onCreateProject: (project: PosterProject) => void;
}

export const CreateScratchModal: React.FC<CreateScratchModalProps> = ({
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('Untitled Poster');
  const [selectedPreset, setSelectedPreset] = useState<CanvasDimensions>(CANVAS_PRESETS[0]);
  const [bgType, setBgType] = useState<'color' | 'gradient'>('color');
  const [color, setColor] = useState('#0F172A');
  const [gradient, setGradient] = useState(GRADIENT_PRESETS[0].gradient);

  const handleCreate = () => {
    const bg: BackgroundConfig =
      bgType === 'color'
        ? { type: 'color', color }
        : { type: 'gradient', gradient };

    const newProject: PosterProject = {
      id: `project-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim() || 'Untitled Poster',
      canvas: {
        width: selectedPreset.width,
        height: selectedPreset.height,
        aspectRatio: selectedPreset.aspectRatio,
        background: bg,
      },
      elements: [
        {
          id: `text-title-${Date.now()}`,
          type: 'text',
          text: 'YOUR HEADLINE HERE',
          fontFamily: 'Bebas Neue',
          fontSize: 100,
          fontWeight: 900,
          color: '#FFFFFF',
          textAlign: 'center',
          letterSpacing: 4,
          lineHeight: 1,
          textTransform: 'uppercase',
          x: Math.round((selectedPreset.width - 700) / 2),
          y: Math.round(selectedPreset.height * 0.35),
          width: 700,
          height: 110,
          rotation: 0,
          zIndex: 1,
          opacity: 1,
        },
        {
          id: `text-sub-${Date.now()}`,
          type: 'text',
          text: 'Tap here to customize your message, change fonts, and add stickers',
          fontFamily: 'Outfit',
          fontSize: 26,
          fontWeight: 500,
          color: '#CBD5E1',
          textAlign: 'center',
          letterSpacing: 1,
          lineHeight: 1.4,
          x: Math.round((selectedPreset.width - 640) / 2),
          y: Math.round(selectedPreset.height * 0.48),
          width: 640,
          height: 60,
          rotation: 0,
          zIndex: 2,
          opacity: 1,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onCreateProject(newProject);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Create Poster From Scratch</h2>
            <p className="text-xs text-slate-400">Choose dimensions and background</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
          {/* Title Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Poster Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Mega Sale"
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Canvas Size Presets */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Format &amp; Canvas Ratio</label>
            <div className="grid grid-cols-2 gap-2">
              {CANVAS_PRESETS.map((preset) => {
                const isSelected = selectedPreset.aspectRatio === preset.aspectRatio;
                return (
                  <button
                    key={preset.aspectRatio}
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-amber-400 bg-amber-500/10 text-white ring-1 ring-amber-400'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="font-semibold text-xs truncate">{preset.label}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {preset.width} × {preset.height} px
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Initial Background */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-slate-300">Initial Background</label>
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mb-2">
              <button
                onClick={() => setBgType('color')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  bgType === 'color' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400'
                }`}
              >
                Solid Color
              </button>
              <button
                onClick={() => setBgType('gradient')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  bgType === 'gradient' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400'
                }`}
              >
                Gradient
              </button>
            </div>

            {bgType === 'color' ? (
              <div className="grid grid-cols-8 gap-1.5">
                {PALETTE_PRESETS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-full aspect-square rounded-lg border transition-transform hover:scale-110 ${
                      color === c ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map((g) => {
                  const stopsStr = g.gradient.stops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ');
                  return (
                    <button
                      key={g.name}
                      onClick={() => setGradient(g.gradient)}
                      className="p-1.5 rounded-lg border border-slate-800 hover:border-amber-400 flex flex-col items-center gap-1"
                    >
                      <div
                        className="w-full h-8 rounded"
                        style={{ background: `linear-gradient(135deg, ${stopsStr})` }}
                      />
                      <span className="text-[10px] text-slate-300 truncate w-full text-center">
                        {g.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end gap-2 bg-slate-950/60">
          <button
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Poster</span>
          </button>
        </div>
      </div>
    </div>
  );
};
