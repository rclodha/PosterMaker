import React, { useState } from 'react';
import { PosterProject } from '../types/poster';
import {
  FolderHeart,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Download,
  Calendar,
  Layers,
} from 'lucide-react';

interface MyDesignsScreenProps {
  projects: PosterProject[];
  onOpenProject: (project: PosterProject) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onRenameProject: (id: string, newTitle: string) => void;
  onOpenCreateScratch: () => void;
  onExportProjectDirect: (project: PosterProject) => void;
}

export const MyDesignsScreen: React.FC<MyDesignsScreenProps> = ({
  projects,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onRenameProject,
  onOpenCreateScratch,
  onExportProjectDirect,
}) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');

  const startRename = (proj: PosterProject) => {
    setRenamingId(proj.id);
    setNewTitle(proj.title);
  };

  const submitRename = (id: string) => {
    if (newTitle.trim()) {
      onRenameProject(id, newTitle.trim());
    }
    setRenamingId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 sm:p-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400">
            <FolderHeart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">My Saved Designs</h1>
            <p className="text-xs text-slate-400">
              {projects.length} posters stored locally on your device for fast editing
            </p>
          </div>
        </div>

        <button
          onClick={onOpenCreateScratch}
          className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Poster</span>
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => {
            const dateStr = new Date(proj.updatedAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={proj.id}
                className="group flex flex-col bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-2xl overflow-hidden transition-all shadow-lg"
              >
                {/* Visual Preview Swatch */}
                <div
                  onClick={() => onOpenProject(proj)}
                  className="relative w-full aspect-[4/3] p-4 flex flex-col justify-between cursor-pointer overflow-hidden group-hover:brightness-105 transition-all"
                  style={{
                    backgroundColor: proj.canvas.background.color || '#18181B',
                    background:
                      proj.canvas.background.type === 'gradient' && proj.canvas.background.gradient
                        ? `linear-gradient(${proj.canvas.background.gradient.angle || 180}deg, ${proj.canvas.background.gradient.stops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ')})`
                        : proj.canvas.background.color || '#18181B',
                  }}
                >
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center">
                    <span className="text-white font-black text-2xl tracking-tight uppercase leading-snug drop-shadow-md truncate max-w-full">
                      {proj.title}
                    </span>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-mono text-slate-300 border border-slate-800">
                    {proj.canvas.aspectRatio} · {proj.canvas.width}×{proj.canvas.height}
                  </div>
                </div>

                {/* Info & Rename */}
                <div className="p-4 flex flex-col gap-3 bg-slate-950/60 border-t border-slate-800">
                  {renamingId === proj.id ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitRename(proj.id)}
                        autoFocus
                        className="flex-1 p-1.5 bg-slate-900 border border-amber-400 rounded-lg text-white text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => submitRename(proj.id)}
                        className="py-1 px-2.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white truncate max-w-[200px]">
                        {proj.title}
                      </span>
                      <button
                        onClick={() => startRename(proj)}
                        className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                        title="Rename Project"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-amber-400" /> {dateStr}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-sky-400" /> {proj.elements.length} elements
                    </span>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => onOpenProject(proj)}
                      className="col-span-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all text-center"
                    >
                      Open &amp; Edit
                    </button>
                    <button
                      onClick={() => onDuplicateProject(proj.id)}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-all flex items-center justify-center"
                      title="Duplicate Project (Reuse Design)"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${proj.title}"?`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="p-2 bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 rounded-xl transition-all flex items-center justify-center"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-3">
          <FolderHeart className="w-12 h-12 text-slate-600 mb-2" />
          <h3 className="text-base font-bold text-white">No saved projects yet</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Choose a starter template or start from scratch to build your first promotional poster!
          </p>
          <button
            onClick={onOpenCreateScratch}
            className="mt-2 py-2.5 px-5 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md"
          >
            Create Your First Poster
          </button>
        </div>
      )}
    </div>
  );
};
