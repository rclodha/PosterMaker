import React, { useState } from 'react';
import { PosterTemplate, CategoryKey, AspectRatioType } from '../types/poster';
import { POSTER_TEMPLATES } from '../data/templates';
import { CATEGORIES } from '../utils/constants';
import { Search, Sparkles, SlidersHorizontal } from 'lucide-react';

interface TemplateGalleryProps {
  initialCategory?: CategoryKey;
  onSelectTemplate: (template: PosterTemplate) => void;
  onOpenCreateScratch: () => void;
}

export const TemplateGallery: React.FC<TemplateGalleryProps> = ({
  initialCategory = 'all',
  onSelectTemplate,
  onOpenCreateScratch,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [aspectFilter, setAspectFilter] = useState<'all' | AspectRatioType>('all');

  const filtered = POSTER_TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesAspect = aspectFilter === 'all' || t.aspectRatio === aspectFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesAspect && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 p-4 sm:p-6 pb-24">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">Poster Template Gallery</h1>
          <p className="text-xs text-slate-400">
            Professional high-contrast starter designs for businesses, sales, and events
          </p>
        </div>

        <button
          onClick={onOpenCreateScratch}
          className="py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
        >
          + Blank Poster
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates by keyword (e.g. food, discount, festival)..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Aspect Ratio Filter */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 ml-2" />
          <select
            value={aspectFilter}
            onChange={(e) => setAspectFilter(e.target.value as any)}
            className="bg-transparent text-xs text-slate-300 py-1 px-2 focus:outline-none"
          >
            <option value="all">All Sizes</option>
            <option value="4:5">Instagram 4:5</option>
            <option value="1:1">Square 1:1</option>
            <option value="9:16">Story 9:16</option>
            <option value="3:4">Flyer 3:4</option>
          </select>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`py-2 px-3 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isSelected
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((template) => (
          <div
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group flex flex-col bg-slate-900 border border-slate-800 hover:border-amber-400/60 rounded-2xl overflow-hidden transition-all hover:shadow-xl cursor-pointer"
          >
            <div
              className="relative w-full aspect-[4/5] p-4 flex flex-col justify-between overflow-hidden"
              style={{
                backgroundColor: template.background.color || '#18181B',
                background:
                  template.background.type === 'gradient' && template.background.gradient
                    ? `linear-gradient(${template.background.gradient.angle || 180}deg, ${template.background.gradient.stops.map((s) => `${s.color} ${s.offset * 100}%`).join(', ')})`
                    : template.background.color || '#18181B',
              }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center">
                <div className="text-white font-black text-2xl tracking-tight uppercase leading-none drop-shadow-md">
                  {template.elements.find((e) => e.type === 'text')?.text || template.title}
                </div>
                <div className="mt-2 text-[9px] text-white/80 font-bold uppercase tracking-widest bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  {template.category}
                </div>
              </div>

              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-mono text-slate-300 border border-slate-800">
                {template.aspectRatio}
              </div>

              {template.isPro && (
                <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-lg text-[9px] font-black flex items-center gap-1 shadow-md">
                  <Sparkles className="w-2.5 h-2.5" /> PRO
                </div>
              )}
            </div>

            <div className="p-3.5 flex items-center justify-between gap-2 border-t border-slate-800 bg-slate-950/60">
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                  {template.title}
                </span>
                <span className="text-[10px] text-slate-400 capitalize mt-0.5">
                  {template.category}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template);
                }}
                className="py-1.5 px-3 bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm hover:brightness-110 active:scale-95 transition-all shrink-0"
              >
                Customize
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
