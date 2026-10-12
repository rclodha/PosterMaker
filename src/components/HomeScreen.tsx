import React, { useState } from 'react';
import { PosterProject, PosterTemplate, CategoryKey } from '../types/poster';
import { POSTER_TEMPLATES } from '../data/templates';
import { CATEGORIES } from '../utils/constants';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Search,
  Zap,
  TrendingUp,
} from 'lucide-react';

interface HomeScreenProps {
  recentProjects: PosterProject[];
  isPro: boolean;
  onOpenProject: (project: PosterProject) => void;
  onOpenTemplate: (template: PosterTemplate) => void;
  onOpenCreateScratch: () => void;
  onNavigateToTemplates: (category?: CategoryKey) => void;
  onOpenProModal: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  recentProjects,
  isPro,
  onOpenProject,
  onOpenTemplate,
  onOpenCreateScratch,
  onNavigateToTemplates,
  onOpenProModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');

  const filteredTemplates = POSTER_TEMPLATES.filter((t) => {
    const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 sm:p-6 pb-24">
      {/* Hero Quick Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-6 sm:p-8 text-slate-950 shadow-xl">
        <div className="relative z-10 max-w-xl flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full text-xs font-bold text-white w-fit">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Create High-Converting Posters in Under 3 Minutes</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Design Bold Posters &amp; Flyers Without Design Skills
          </h1>

          <p className="text-xs sm:text-sm text-white/90 font-medium">
            Customize typographic sale announcements, restaurant menus, festival wishes, and event posters instantly with crisp high-res export.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onOpenCreateScratch}
              className="py-3 px-5 bg-slate-950 hover:bg-slate-900 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Create From Scratch</span>
            </button>
            <button
              onClick={() => onNavigateToTemplates('sale')}
              className="py-3 px-5 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-bold rounded-2xl text-xs sm:text-sm backdrop-blur-md transition-colors"
            >
              <span>Explore Super Sale Templates</span>
            </button>
          </div>
        </div>

        {/* Decorative background geometric shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-12 top-6 hidden md:flex items-center justify-center pointer-events-none opacity-20 text-white font-black text-9xl select-none rotate-12">
          POSTER
        </div>
      </div>

      {/* Recent Projects Strip (Journey C) */}
      {recentProjects.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm sm:text-base font-bold text-white">Recent Projects</h2>
            </div>
            <span className="text-xs text-slate-400">{recentProjects.length} saved designs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentProjects.slice(0, 3).map((proj) => {
              const dateStr = new Date(proj.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={proj.id}
                  onClick={() => onOpenProject(proj)}
                  className="group flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-amber-400/50 rounded-2xl transition-all cursor-pointer shadow-md"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {/* Canvas mini preview swatch */}
                    <div
                      className="w-12 h-14 rounded-xl border border-slate-700 shrink-0 flex items-center justify-center shadow-inner overflow-hidden"
                      style={{
                        backgroundColor: proj.canvas.background.color || '#1E293B',
                      }}
                    >
                      <span className="text-[10px] font-mono text-white/70 uppercase">
                        {proj.canvas.aspectRatio}
                      </span>
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                        {proj.title}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {proj.elements.length} elements · Edited {dateStr}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-800 text-slate-300 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Category Filter Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm sm:text-base font-bold text-white">Starter Templates Library</h2>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sale, food, festival..."
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Categories Horizontal Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md font-bold'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Template Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template) => {
          return (
            <div
              key={template.id}
              onClick={() => onOpenTemplate(template)}
              className="group flex flex-col bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-2xl overflow-hidden transition-all hover:shadow-xl cursor-pointer"
            >
              {/* Template Graphic Preview Box */}
              <div
                className="relative w-full aspect-[4/5] p-3 flex flex-col justify-between overflow-hidden"
                style={{
                  backgroundColor: template.background.color || '#18181B',
                  background:
                    template.background.type === 'gradient' && template.background.gradient
                      ? `linear-gradient(${template.background.gradient.angle || 180}deg, ${template.background.gradient.stops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ')})`
                      : template.background.color || '#18181B',
                }}
              >
                {/* Visual miniature representation */}
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <div className="text-white font-black text-2xl sm:text-3xl tracking-tight uppercase leading-none drop-shadow-md">
                    {template.elements.find((e) => e.type === 'text')?.text || template.title}
                  </div>
                  <div className="mt-2 text-[10px] text-white/80 font-bold uppercase tracking-widest bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {template.category}
                  </div>
                </div>

                {/* Aspect ratio and tag badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-mono text-slate-300 border border-slate-800">
                  {template.aspectRatio}
                </div>

                {template.isPro && (
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-md">
                    <Sparkles className="w-2.5 h-2.5" /> PRO
                  </div>
                )}
              </div>

              {/* Card Meta & Use CTA */}
              <div className="p-3.5 flex items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/60">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {template.title}
                  </span>
                  <span className="text-[10px] text-slate-400 capitalize mt-0.5">
                    {template.category} · {template.elements.length} editable elements
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTemplate(template);
                  }}
                  className="py-1.5 px-3 bg-amber-400/10 hover:bg-amber-400 text-amber-300 hover:text-slate-950 font-bold text-xs rounded-xl border border-amber-400/30 transition-all shrink-0"
                >
                  Use
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl flex flex-col items-center gap-2">
          <p className="text-xs text-slate-400">No templates found for this search.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="text-xs text-amber-400 font-bold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Freemium Upgrade Card */}
      {!isPro && (
        <div className="p-5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 to-amber-950/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Upgrade to Poster Maker Pro</h3>
              <p className="text-xs text-slate-400">
                Export at Ultra-HD 300 DPI, remove watermark, and unlock commercial licensing.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenProModal}
            className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 shrink-0"
          >
            View Pro Perks
          </button>
        </div>
      )}
    </div>
  );
};
