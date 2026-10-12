import React, { useState, useEffect } from 'react';
import {
  PosterProject,
  CanvasElement,
  TextElement,
  ImageElement,
  ShapeElement,
  ShapeKind,
  BackgroundConfig,
  AspectRatioType,
} from '../../types/poster';
import { TextControls } from './TextControls';
import { ImageControls } from './ImageControls';
import { ShapeControls } from './ShapeControls';
import { BackgroundControls } from './BackgroundControls';
import { LayersPanel } from './LayersPanel';
import {
  Type,
  Image as ImageIcon,
  Square,
  Palette,
  Layers,
  Copy,
  Trash2,
  AlignCenterHorizontal,
  AlignCenterVertical,
  X,
} from 'lucide-react';

interface ToolbarProps {
  project: PosterProject;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: CanvasElement) => void;
  onAddElement: (element: CanvasElement) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onUpdateBackground: (bg: BackgroundConfig) => void;
  onChangeAspectRatio: (ratio: AspectRatioType, width: number, height: number) => void;
}

type TabType = 'text' | 'images' | 'shapes' | 'background' | 'layers';

export const Toolbar: React.FC<ToolbarProps> = ({
  project,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  onDuplicateElement,
  onDeleteElement,
  onReorderLayer,
  onToggleLock,
  onToggleVisibility,
  onUpdateBackground,
  onChangeAspectRatio,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('text');

  const selectedElement = project.elements.find((el) => el.id === selectedElementId) || null;

  // Auto-switch tab based on selected element type
  useEffect(() => {
    if (selectedElement) {
      if (selectedElement.type === 'text') setActiveTab('text');
      else if (selectedElement.type === 'image') setActiveTab('images');
      else if (selectedElement.type === 'shape') setActiveTab('shapes');
    }
  }, [selectedElementId]);

  // Handler: Add Text with preset styles
  const handleAddText = (preset: 'heading' | 'subheading' | 'body' | 'price') => {
    const nextZ = Math.max(1, ...project.elements.map((e) => e.zIndex)) + 1;
    const baseId = `text-${Date.now()}`;

    let newEl: TextElement;

    if (preset === 'heading') {
      newEl = {
        id: baseId,
        type: 'text',
        text: 'SPECIAL OFFER',
        fontFamily: 'Bebas Neue',
        fontSize: 100,
        fontWeight: 900,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 4,
        lineHeight: 1,
        textTransform: 'uppercase',
        x: Math.round((project.canvas.width - 700) / 2),
        y: Math.round(project.canvas.height * 0.25),
        width: 700,
        height: 110,
        rotation: 0,
        zIndex: nextZ,
        opacity: 1,
      };
    } else if (preset === 'subheading') {
      newEl = {
        id: baseId,
        type: 'text',
        text: 'DISCOVER OUR NEW COLLECTION',
        fontFamily: 'Montserrat',
        fontSize: 32,
        fontWeight: 700,
        color: '#FBBF24',
        textAlign: 'center',
        letterSpacing: 3,
        lineHeight: 1.2,
        textTransform: 'uppercase',
        x: Math.round((project.canvas.width - 640) / 2),
        y: Math.round(project.canvas.height * 0.38),
        width: 640,
        height: 45,
        rotation: 0,
        zIndex: nextZ,
        opacity: 1,
      };
    } else if (preset === 'price') {
      newEl = {
        id: baseId,
        type: 'text',
        text: '$49.99',
        fontFamily: 'Bebas Neue',
        fontSize: 72,
        fontWeight: 900,
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 2,
        lineHeight: 1,
        backgroundColor: '#EA580C',
        backgroundPadding: 16,
        borderRadius: 24,
        x: Math.round((project.canvas.width - 240) / 2),
        y: Math.round(project.canvas.height * 0.45),
        width: 240,
        height: 90,
        rotation: 0,
        zIndex: nextZ,
        opacity: 1,
      };
    } else {
      newEl = {
        id: baseId,
        type: 'text',
        text: 'Available this weekend only at all participating stores. Terms and conditions apply.',
        fontFamily: 'Outfit',
        fontSize: 22,
        fontWeight: 400,
        color: '#E2E8F0',
        textAlign: 'center',
        letterSpacing: 1,
        lineHeight: 1.4,
        x: Math.round((project.canvas.width - 600) / 2),
        y: Math.round(project.canvas.height * 0.55),
        width: 600,
        height: 70,
        rotation: 0,
        zIndex: nextZ,
        opacity: 1,
      };
    }

    onAddElement(newEl);
    onSelectElement(newEl.id);
  };

  // Handler: Add Image / Sticker
  const handleAddImage = (src: string, width: number, height: number, alt?: string) => {
    const nextZ = Math.max(1, ...project.elements.map((e) => e.zIndex)) + 1;
    const newEl: ImageElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      src,
      alt,
      x: Math.round((project.canvas.width - width) / 2),
      y: Math.round((project.canvas.height - height) / 2),
      width,
      height,
      rotation: 0,
      zIndex: nextZ,
      opacity: 1,
    };
    onAddElement(newEl);
    onSelectElement(newEl.id);
  };

  // Handler: Add Shape
  const handleAddShape = (kind: ShapeKind) => {
    const nextZ = Math.max(1, ...project.elements.map((e) => e.zIndex)) + 1;
    let w = 400;
    let h = 200;
    let fill = '#EA580C';
    let rad = 16;

    if (kind === 'circle') {
      w = 260;
      h = 260;
      fill = '#3B82F6';
    } else if (kind === 'star') {
      w = 220;
      h = 220;
      fill = '#FACC15';
    } else if (kind === 'line') {
      w = 500;
      h = 6;
      fill = '#FFFFFF';
    }

    const newEl: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeKind: kind,
      x: Math.round((project.canvas.width - w) / 2),
      y: Math.round((project.canvas.height - h) / 2),
      width: w,
      height: h,
      fillColor: fill,
      borderRadius: rad,
      rotation: 0,
      zIndex: nextZ,
      opacity: 1,
    };

    onAddElement(newEl);
    onSelectElement(newEl.id);
  };

  // Alignment helpers
  const handleCenterHorizontal = () => {
    if (!selectedElement) return;
    onUpdateElement({
      ...selectedElement,
      x: Math.round((project.canvas.width - selectedElement.width) / 2),
    });
  };

  const handleCenterVertical = () => {
    if (!selectedElement) return;
    onUpdateElement({
      ...selectedElement,
      y: Math.round((project.canvas.height - selectedElement.height) / 2),
    });
  };

  return (
    <div className="w-full bg-slate-900 border-t border-slate-800 flex flex-col shrink-0 select-none shadow-2xl">
      {/* Contextual Action Bar when Element is Selected */}
      {selectedElement && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950/70 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <span className="text-amber-400 font-semibold truncate capitalize">
              Selected: {selectedElement.type}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCenterHorizontal}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Center Horizontally"
            >
              <AlignCenterHorizontal className="w-4 h-4" />
            </button>
            <button
              onClick={handleCenterVertical}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Center Vertically"
            >
              <AlignCenterVertical className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-800 mx-1" />
            <button
              onClick={() => onDuplicateElement(selectedElement.id)}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Duplicate"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteElement(selectedElement.id)}
              className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-slate-800 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectElement(null)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Deselect"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab Panels Content */}
      <div className="max-h-72 sm:max-h-80 overflow-y-auto">
        {activeTab === 'text' && (
          <TextControls
            element={selectedElement?.type === 'text' ? (selectedElement as TextElement) : null}
            onUpdate={onUpdateElement}
            onAddText={handleAddText}
          />
        )}
        {activeTab === 'images' && (
          <ImageControls
            element={selectedElement?.type === 'image' ? (selectedElement as ImageElement) : null}
            onUpdate={onUpdateElement}
            onAddImage={handleAddImage}
          />
        )}
        {activeTab === 'shapes' && (
          <ShapeControls
            element={selectedElement?.type === 'shape' ? (selectedElement as ShapeElement) : null}
            onUpdate={onUpdateElement}
            onAddShape={handleAddShape}
          />
        )}
        {activeTab === 'background' && (
          <BackgroundControls
            background={project.canvas.background}
            currentAspectRatio={project.canvas.aspectRatio}
            onUpdateBackground={onUpdateBackground}
            onChangeAspectRatio={onChangeAspectRatio}
          />
        )}
        {activeTab === 'layers' && (
          <LayersPanel
            elements={project.elements}
            selectedElementId={selectedElementId}
            onSelect={onSelectElement}
            onReorder={onReorderLayer}
            onToggleLock={onToggleLock}
            onToggleVisibility={onToggleVisibility}
            onDuplicate={onDuplicateElement}
            onDelete={onDeleteElement}
          />
        )}
      </div>

      {/* Bottom Main Navigation Tabs */}
      <div className="grid grid-cols-5 border-t border-slate-800 bg-slate-950/90 py-1 px-2">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeTab === 'text'
              ? 'text-amber-400 bg-amber-400/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Text</span>
        </button>

        <button
          onClick={() => setActiveTab('images')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeTab === 'images'
              ? 'text-amber-400 bg-amber-400/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Graphics</span>
        </button>

        <button
          onClick={() => setActiveTab('shapes')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeTab === 'shapes'
              ? 'text-amber-400 bg-amber-400/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Square className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Shapes</span>
        </button>

        <button
          onClick={() => setActiveTab('background')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeTab === 'background'
              ? 'text-amber-400 bg-amber-400/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab('layers')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all ${
            activeTab === 'layers'
              ? 'text-amber-400 bg-amber-400/10 font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 mb-1" />
          <span className="text-[10px] tracking-tight">Layers</span>
        </button>
      </div>
    </div>
  );
};
