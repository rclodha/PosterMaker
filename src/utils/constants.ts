import { CanvasDimensions, CategoryInfo } from '../types/poster';

export const CANVAS_PRESETS: CanvasDimensions[] = [
  { width: 1080, height: 1350, aspectRatio: '4:5', label: 'Instagram Portrait (4:5)' },
  { width: 1080, height: 1080, aspectRatio: '1:1', label: 'Square Post (1:1)' },
  { width: 1080, height: 1920, aspectRatio: '9:16', label: 'Story & Reels (9:16)' },
  { width: 1080, height: 1440, aspectRatio: '3:4', label: 'Print Flyer (3:4)' },
  { width: 1200, height: 1800, aspectRatio: '2:3', label: 'Event Poster (2:3)' },
  { width: 1920, height: 1080, aspectRatio: '16:9', label: 'Landscape Banner (16:9)' },
];

export const CATEGORIES: CategoryInfo[] = [
  { key: 'all', label: 'All Posters', description: 'Browse all curated templates' },
  { key: 'sale', label: 'Sale & Promo', description: 'Discount offers and product announcements' },
  { key: 'food', label: 'Food & Dining', description: 'Restaurant menus, street food & specials' },
  { key: 'music', label: 'Music & Festivals', description: 'Concerts, indie gigs & DJ nights' },
  { key: 'festival', label: 'Diwali & Festivals', description: 'Cultural greetings, Diwali & celebrations' },
  { key: 'realestate', label: 'Real Estate', description: 'Property listings & open house flyers' },
  { key: 'fitness', label: 'Fitness & Gym', description: 'Workout challenges & club memberships' },
  { key: 'education', label: 'Education', description: 'Academies, coaching & workshops' },
  { key: 'birthday', label: 'Party & Birthday', description: 'Birthday bash & celebration invitations' },
];

export const FONT_OPTIONS = [
  { name: 'Bebas Neue', label: 'Bebas Neue (Ultra Bold Display)', sample: 'SUPER SALE 50%' },
  { name: 'Montserrat', label: 'Montserrat (Modern & Clean)', sample: 'MODERN DESIGNS' },
  { name: 'Outfit', label: 'Outfit (Geometric High Tech)', sample: 'Innovative Graphics' },
  { name: 'Playfair Display', label: 'Playfair Display (Luxury Serif)', sample: 'Elegant Dining' },
  { name: 'Cinzel', label: 'Cinzel (Classical & Festive)', sample: 'ROYAL HERITAGE' },
  { name: 'Poppins', label: 'Poppins (Friendly & Bold)', sample: 'Creative Studio' },
  { name: 'Caveat', label: 'Caveat (Handwritten Script)', sample: 'Handcrafted with Love' },
];

export const PALETTE_PRESETS = [
  '#EA580C', // Orange
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#18181B', // Zinc dark
  '#0F172A', // Slate dark
  '#FFFFFF', // White
  '#FBBF24', // Yellow
  '#84CC16', // Lime
  '#991B1B', // Dark red
  '#1E293B', // Slate 800
];

export const GRADIENT_PRESETS = [
  {
    name: 'Sunset Glow',
    gradient: {
      type: 'linear' as const,
      angle: 135,
      stops: [
        { color: '#FF512F', offset: 0 },
        { color: '#F09819', offset: 1 },
      ],
    },
  },
  {
    name: 'Midnight Electric',
    gradient: {
      type: 'linear' as const,
      angle: 180,
      stops: [
        { color: '#0F172A', offset: 0 },
        { color: '#1E1B4B', offset: 0.5 },
        { color: '#311042', offset: 1 },
      ],
    },
  },
  {
    name: 'Neon Horizon',
    gradient: {
      type: 'linear' as const,
      angle: 135,
      stops: [
        { color: '#09090B', offset: 0 },
        { color: '#831843', offset: 0.5 },
        { color: '#030712', offset: 1 },
      ],
    },
  },
  {
    name: 'Deep Oceanic',
    gradient: {
      type: 'linear' as const,
      angle: 180,
      stops: [
        { color: '#0C4A6E', offset: 0 },
        { color: '#082F49', offset: 1 },
      ],
    },
  },
  {
    name: 'Golden Luxury',
    gradient: {
      type: 'linear' as const,
      angle: 135,
      stops: [
        { color: '#27272A', offset: 0 },
        { color: '#78350F', offset: 0.6 },
        { color: '#B45309', offset: 1 },
      ],
    },
  },
  {
    name: 'Mint Fresh',
    gradient: {
      type: 'linear' as const,
      angle: 135,
      stops: [
        { color: '#064E3B', offset: 0 },
        { color: '#022C22', offset: 1 },
      ],
    },
  },
];
