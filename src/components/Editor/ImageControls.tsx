import React, { useRef } from 'react';
import { ImageElement } from '../../types/poster';
import { GRAPHIC_ASSETS, GraphicAsset } from '../../data/stickersAndBadges';
import { PALETTE_PRESETS } from '../../utils/constants';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ImageControlsProps {
  element: ImageElement | null;
  onUpdate: (updated: ImageElement) => void;
  onAddImage: (src: string, width: number, height: number, alt?: string) => void;
}

export const ImageControls: React.FC<ImageControlsProps> = ({ element, onUpdate, onAddImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        // Create an image object to calculate original aspect ratio
        const img = new Image();
        img.onload = () => {
          let w = 400;
          let h = Math.round((img.naturalHeight / img.naturalWidth) * 400);
          if (h > 500) {
            h = 500;
            w = Math.round((img.naturalWidth / img.naturalHeight) * 500);
          }
          onAddImage(result, w, h, file.name);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
    // Reset input
    e.target.value = '';
  };

  const handleAddSticker = (asset: GraphicAsset) => {
    onAddImage(asset.svgDataUri, asset.defaultWidth, asset.defaultHeight, asset.name);
  };

  return (
    <div className="flex flex-col gap-4 p-4 text-xs">
      {/* Upload Custom Image / Logo */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Import Image &amp; Logo
        </span>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-md transition-all active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload From Device / Logo</span>
        </button>
        <p className="text-[10px] text-slate-400 text-center">
          Supports PNG, JPG, WebP, SVG logos with transparency
        </p>
      </div>

      {/* Stickers & Badges Library */}
      <div className="flex flex-col gap-2 border-t border-slate-800 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Promo Badges &amp; Stickers
          </span>
          <span className="text-[10px] text-slate-400">{GRAPHIC_ASSETS.length} assets</span>
        </div>

        <div className="grid grid-cols-3 gap-2 max-h-56 overflow-y-auto p-1 bg-slate-900/60 rounded-xl border border-slate-800/80">
          {GRAPHIC_ASSETS.map((asset) => (
            <button
              key={asset.id}
              onClick={() => handleAddSticker(asset)}
              className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 hover:border-amber-400/50 border border-slate-700/60 transition-all group"
              title={`Add ${asset.name}`}
            >
              <div className="w-14 h-14 flex items-center justify-center p-1">
                <img
                  src={asset.svgDataUri}
                  alt={asset.name}
                  className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform"
                />
              </div>
              <span className="text-[9px] text-slate-300 truncate w-full text-center mt-1 font-medium">
                {asset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Image Controls */}
      {element ? (
        <div className="flex flex-col gap-4 border-t border-slate-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-wide text-amber-400 uppercase flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
              Adjust Selected Image
            </span>
          </div>

          {/* Opacity */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-slate-400">
              <span>Opacity</span>
              <span className="font-mono text-white">{Math.round((element.opacity ?? 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={element.opacity ?? 1}
              onChange={(e) => onUpdate({ ...element, opacity: Number(e.target.value) })}
              className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Corner Radius */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-slate-400">
              <span>Corner Radius</span>
              <span className="font-mono text-white">{element.borderRadius || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={element.borderRadius || 0}
              onChange={(e) => onUpdate({ ...element, borderRadius: Number(e.target.value) })}
              className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
            />
          </div>

          {/* Border Width & Color */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-slate-400">
              <span>Border Outline</span>
              <span className="font-mono text-white">{element.borderWidth || 0}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={element.borderWidth || 0}
              onChange={(e) =>
                onUpdate({
                  ...element,
                  borderWidth: Number(e.target.value),
                  borderColor: element.borderColor || '#FFFFFF',
                })
              }
              className="accent-amber-400 cursor-pointer w-full h-1.5 bg-slate-700 rounded-lg"
            />

            {element.borderWidth ? (
              <div className="grid grid-cols-8 gap-1.5 pt-1">
                {PALETTE_PRESETS.map((color) => (
                  <button
                    key={color}
                    onClick={() => onUpdate({ ...element, borderColor: color })}
                    className={`w-full aspect-square rounded border transition-transform hover:scale-110 ${element.borderColor === color ? 'border-amber-400 ring-2 ring-amber-400/50' : 'border-slate-700'}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-900/60 border border-dashed border-slate-800 rounded-xl text-center text-slate-400">
          Select an image on the canvas to configure opacity, borders, and rounding.
        </div>
      )}
    </div>
  );
};
