import React from 'react';
import { TextElement } from '../../types/poster';
import { FONT_OPTIONS, PALETTE_PRESETS } from '../../utils/constants';
import { AlignLeft, AlignCenter, AlignRight, Bold, Italic, Type } from 'lucide-react';

interface TextControlsProps {
  element: TextElement | null;
  onUpdate: (updated: TextElement) => void;
  onAddText: (preset: 'heading' | 'subheading' | 'body' | 'price') => void;
}

export const TextControls: React.FC<TextControlsProps> = ({ element, onUpdate, onAddText }) => {
  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      {/* Quick Add Text Presets */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Add New Text
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddText('heading')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white rounded-xl border border-slate-700 transition-all font-semibold"
          >
            <Type className="w-3.5 h-3.5 text-amber-400" />
            + Heading
          </button>
          <button
            onClick={() => onAddText('subheading')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-xl border border-slate-700 transition-all font-medium"
          >
            + Subheading
          </button>
          <button
            onClick={() => onAddText('body')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 rounded-xl border border-slate-700 transition-all text-xs"
          >
            + Body Text
          </button>
          <button
            onClick={() => onAddText('price')}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 rounded-xl border border-amber-500/30 transition-all font-bold"
          >
            + Price Badge
          </button>
        </div>
      </div>

      {element ? (
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-amber-400 uppercase">
              Edit Selected Text
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              ID: {element.id.substring(0, 10)}
            </span>
          </div>

          {/* Text Content Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 font-medium">Text Content</label>
            <textarea
              value={element.text}
              onChange={(e) => onUpdate({ ...element, text: e.target.value })}
              rows={3}
              placeholder="Enter poster text..."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none font-sans text-sm leading-snug"
            />
          </div>

          {/* Font Family Selection */}
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-300 font-medium">Typography &amp; Font</label>
            <select
              value={element.fontFamily}
              onChange={(e) => onUpdate({ ...element, fontFamily: e.target.value })}
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Font Size & Weight */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-slate-400">
                <span>Font Size</span>
                <span className="font-mono text-white">{element.fontSize}px</span>
              </div>
              <input
                type="range"
                min="16"
                max="240"
                value={element.fontSize}
                onChange={(e) => onUpdate({ ...element, fontSize: Number(e.target.value) })}
                className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-slate-400">Weight</label>
              <select
                value={String(element.fontWeight || 600)}
                onChange={(e) => onUpdate({ ...element, fontWeight: e.target.value })}
                className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white"
              >
                <option value="400">Regular (400)</option>
                <option value="600">Medium (600)</option>
                <option value="700">Bold (700)</option>
                <option value="800">Extra Bold (800)</option>
                <option value="900">Black (900)</option>
              </select>
            </div>
          </div>

          {/* Alignment & Format Buttons */}
          <div className="flex items-center justify-between gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onUpdate({ ...element, textAlign: 'left' })}
                className={`p-2 rounded-lg transition-colors ${element.textAlign === 'left' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Align Left"
              >
                <AlignLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdate({ ...element, textAlign: 'center' })}
                className={`p-2 rounded-lg transition-colors ${element.textAlign === 'center' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Align Center"
              >
                <AlignCenter className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdate({ ...element, textAlign: 'right' })}
                className={`p-2 rounded-lg transition-colors ${element.textAlign === 'right' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                title="Align Right"
              >
                <AlignRight className="w-4 h-4" />
              </button>
            </div>

            <div className="w-[1px] h-5 bg-slate-800" />

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onUpdate({
                    ...element,
                    fontWeight: element.fontWeight === 800 || element.fontWeight === 900 ? 400 : 800,
                  })
                }
                className={`p-2 rounded-lg transition-colors ${Number(element.fontWeight) >= 700 ? 'bg-slate-700 text-amber-400' : 'text-slate-400 hover:text-white'}`}
                title="Toggle Bold"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  onUpdate({
                    ...element,
                    fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic',
                  })
                }
                className={`p-2 rounded-lg transition-colors ${element.fontStyle === 'italic' ? 'bg-slate-700 text-amber-400' : 'text-slate-400 hover:text-white'}`}
                title="Toggle Italic"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  onUpdate({
                    ...element,
                    textTransform: element.textTransform === 'uppercase' ? 'none' : 'uppercase',
                  })
                }
                className={`px-2 py-1 rounded-lg text-xs font-bold transition-colors ${element.textTransform === 'uppercase' ? 'bg-slate-700 text-amber-400' : 'text-slate-400 hover:text-white'}`}
                title="Toggle Uppercase"
              >
                AA
              </button>
            </div>
          </div>

          {/* Text Color Picker */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-medium">Text Color</label>
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full border border-slate-600 inline-block shadow-sm"
                  style={{ backgroundColor: element.color }}
                />
                <input
                  type="text"
                  value={element.color}
                  onChange={(e) => onUpdate({ ...element, color: e.target.value })}
                  className="w-20 p-1 bg-slate-900 border border-slate-700 rounded text-center font-mono text-white text-[11px]"
                />
              </div>
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {PALETTE_PRESETS.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdate({ ...element, color })}
                  className={`w-full aspect-square rounded-lg border transition-transform hover:scale-110 active:scale-95 ${element.color === color ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Letter Spacing & Line Height */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-slate-400">
                <span>Letter Spacing</span>
                <span className="font-mono text-white">{element.letterSpacing || 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                value={element.letterSpacing || 0}
                onChange={(e) => onUpdate({ ...element, letterSpacing: Number(e.target.value) })}
                className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-slate-400">
                <span>Line Height</span>
                <span className="font-mono text-white">{element.lineHeight || 1.2}</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="2.0"
                step="0.1"
                value={element.lineHeight || 1.2}
                onChange={(e) => onUpdate({ ...element, lineHeight: Number(e.target.value) })}
                className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Text Shadow Toggle */}
          <div className="flex items-center justify-between p-2.5 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="flex flex-col">
              <span className="text-slate-200 font-medium">Text Drop Shadow</span>
              <span className="text-[10px] text-slate-400">Add depth for readability</span>
            </div>
            <button
              onClick={() =>
                onUpdate({
                  ...element,
                  shadowColor: element.shadowColor ? undefined : 'rgba(0,0,0,0.6)',
                  shadowBlur: 12,
                  shadowOffsetY: 4,
                })
              }
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${element.shadowColor ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
            >
              {element.shadowColor ? 'Enabled' : 'Off'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 bg-slate-900/60 border border-dashed border-slate-800 rounded-xl text-center text-slate-400">
          Tap any text element on the poster canvas to adjust fonts, colors, and layout.
        </div>
      )}
    </div>
  );
};
