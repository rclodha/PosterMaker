import React from 'react';
import { Home, LayoutGrid, FolderHeart, Sparkles, Plus } from 'lucide-react';

interface BottomNavProps {
  currentView: 'home' | 'templates' | 'designs' | 'editor';
  onNavigate: (view: 'home' | 'templates' | 'designs') => void;
  onOpenCreateScratch: () => void;
  onOpenProModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentView,
  onNavigate,
  onOpenCreateScratch,
  onOpenProModal,
}) => {
  if (currentView === 'editor') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/90 backdrop-blur-md border-t border-slate-800 md:hidden pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-2 max-w-md mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'home' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onNavigate('templates')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'templates' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">Templates</span>
        </button>

        {/* Floating Android Center FAB */}
        <div className="flex items-center justify-center -translate-y-3">
          <button
            onClick={onOpenCreateScratch}
            className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 shadow-lg shadow-amber-500/30 flex items-center justify-center active:scale-95 transition-transform"
            title="Create New Poster"
          >
            <Plus className="w-6 h-6 stroke-[3]" />
          </button>
        </div>

        <button
          onClick={() => onNavigate('designs')}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            currentView === 'designs' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderHeart className="w-5 h-5 mb-1" />
          <span className="text-[10px] tracking-tight">My Designs</span>
        </button>

        <button
          onClick={onOpenProModal}
          className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <Sparkles className="w-5 h-5 mb-1 text-amber-400" />
          <span className="text-[10px] tracking-tight">Pro VIP</span>
        </button>
      </div>
    </nav>
  );
};
