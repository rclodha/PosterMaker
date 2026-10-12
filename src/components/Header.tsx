import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Download,
  ArrowLeft,
  Sparkles,
  Check,
  Edit2,
  Palette,
} from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'templates' | 'designs' | 'editor';
  projectTitle?: string;
  canUndo?: boolean;
  canRedo?: boolean;
  isSaved?: boolean;
  isPro?: boolean;
  onNavigate: (view: 'home' | 'templates' | 'designs') => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onExport?: () => void;
  onOpenProModal?: () => void;
  onUpdateTitle?: (title: string) => void;
  onOpenCreateScratch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  projectTitle = 'Untitled Poster',
  canUndo = false,
  canRedo = false,
  isSaved = true,
  isPro = false,
  onNavigate,
  onUndo,
  onRedo,
  onExport,
  onOpenProModal,
  onUpdateTitle,
  onOpenCreateScratch,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(projectTitle);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (tempTitle.trim() && onUpdateTitle) {
      onUpdateTitle(tempTitle.trim());
    }
  };

  if (currentView === 'editor') {
    return (
      <header className="w-full h-14 bg-slate-900 border-b border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-3 shrink-0 select-none z-30">
        {/* Left: Back & Project Title */}
        <div className="flex items-center gap-2 overflow-hidden flex-1 max-w-sm">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors shrink-0"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {isEditingTitle ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              autoFocus
              className="px-2 py-1 bg-slate-950 border border-amber-400 rounded-lg text-white text-xs font-semibold focus:outline-none w-full"
            />
          ) : (
            <button
              onClick={() => {
                setTempTitle(projectTitle);
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 px-2 py-1 text-xs font-bold text-white hover:bg-slate-800/80 rounded-lg truncate text-left transition-colors"
              title="Click to rename"
            >
              <span className="truncate">{projectTitle}</span>
              <Edit2 className="w-3 h-3 text-slate-500 shrink-0" />
            </button>
          )}

          {isSaved && (
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium shrink-0 ml-1">
              <Check className="w-3 h-3" /> Saved
            </span>
          )}
        </div>

        {/* Center: Undo & Redo */}
        <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg transition-colors hover:bg-slate-800"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="p-1.5 text-slate-300 hover:text-white disabled:opacity-30 rounded-lg transition-colors hover:bg-slate-800"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Pro Badge & Export Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenProModal}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 ${
              isPro
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{isPro ? 'Pro Active' : 'Get Pro'}</span>
          </button>

          <button
            onClick={onExport}
            className="py-2 px-3.5 sm:px-4 bg-amber-400 hover:bg-amber-300 active:scale-95 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-400/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </header>
    );
  }

  // Standard Header for Home, Templates, My Designs
  return (
    <header className="w-full h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-8 flex items-center justify-between gap-6 shrink-0 select-none z-30">
      {/* Zone 1: Single text element wordmark */}
      <div
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 cursor-pointer shrink-0"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 shadow-md">
          <Palette className="w-4 h-4" />
        </div>
        <span className="text-base sm:text-lg font-black tracking-tight text-white whitespace-nowrap">
          Poster Maker
        </span>
      </div>

      {/* Zone 2: Navigation Links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-400">
        <button
          onClick={() => onNavigate('home')}
          className={`hover:text-white transition-colors whitespace-nowrap ${currentView === 'home' ? 'text-amber-400' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('templates')}
          className={`hover:text-white transition-colors whitespace-nowrap ${currentView === 'templates' ? 'text-amber-400' : ''}`}
        >
          Template Gallery
        </button>
        <button
          onClick={() => onNavigate('designs')}
          className={`hover:text-white transition-colors whitespace-nowrap ${currentView === 'designs' ? 'text-amber-400' : ''}`}
        >
          My Saved Designs
        </button>
      </nav>

      {/* Zone 3: Primary Action & Pro status */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={onOpenProModal}
          className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isPro
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isPro ? 'Pro Member' : 'Upgrade'}</span>
        </button>

        <button
          onClick={onOpenCreateScratch}
          className="py-2 px-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-transform active:scale-95"
        >
          + Create Poster
        </button>
      </div>
    </header>
  );
};
