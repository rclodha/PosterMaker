import React from 'react';
import { CanvasElement } from '../../types/poster';
import {
  Type,
  Image as ImageIcon,
  Square,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Copy,
  Trash2,
} from 'lucide-react';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedElementId: string | null;
  onSelect: (id: string | null) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onToggleLock: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  elements,
  selectedElementId,
  onSelect,
  onReorder,
  onToggleLock,
  onToggleVisibility,
  onDuplicate,
  onDelete,
}) => {
  // Sort descending by zIndex so top layers appear first in list
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (elem: CanvasElement) => {
    if (elem.type === 'text') return <Type className="w-3.5 h-3.5 text-amber-400" />;
    if (elem.type === 'image') return <ImageIcon className="w-3.5 h-3.5 text-sky-400" />;
    return <Square className="w-3.5 h-3.5 text-emerald-400" />;
  };

  const getElementLabel = (elem: CanvasElement) => {
    if (elem.type === 'text') return `"${elem.text.slice(0, 24)}"`;
    if (elem.type === 'image') return elem.alt || 'Graphic / Logo';
    return `Shape (${elem.shapeKind})`;
  };

  return (
    <div className="flex flex-col gap-3 p-4 text-xs">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
          Layers Stack ({elements.length})
        </span>
        <span className="text-[10px] text-slate-400">Top to Bottom</span>
      </div>

      <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto pr-1">
        {sorted.map((elem, idx) => {
          const isSelected = selectedElementId === elem.id;

          return (
            <div
              key={elem.id}
              onClick={() => onSelect(elem.id)}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-amber-500/15 border-amber-400 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                <div className="p-1 rounded bg-slate-800/80 shrink-0">
                  {getElementIcon(elem)}
                </div>
                <span className="truncate text-[11px] font-medium">
                  {getElementLabel(elem)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(elem.id, 'up');
                  }}
                  disabled={idx === 0}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700"
                  title="Bring Forward"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorder(elem.id, 'down');
                  }}
                  disabled={idx === sorted.length - 1}
                  className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-700"
                  title="Send Backward"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLock(elem.id);
                  }}
                  className={`p-1 rounded hover:bg-slate-700 ${elem.locked ? 'text-amber-400' : 'text-slate-400 hover:text-white'}`}
                  title={elem.locked ? 'Unlock' : 'Lock'}
                >
                  {elem.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(elem.id);
                  }}
                  className={`p-1 rounded hover:bg-slate-700 ${elem.hidden ? 'text-slate-500' : 'text-slate-400 hover:text-white'}`}
                  title={elem.hidden ? 'Show' : 'Hide'}
                >
                  {elem.hidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(elem.id);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700"
                  title="Duplicate Layer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(elem.id);
                  }}
                  className="p-1 text-rose-400 hover:text-rose-300 rounded hover:bg-slate-700"
                  title="Delete Layer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
