export interface GraphicAsset {
  id: string;
  name: string;
  category: 'badges' | 'sale' | 'decorative' | 'icons';
  svgDataUri: string;
  defaultWidth: number;
  defaultHeight: number;
}

// Helper to make SVG Data URIs
const svgToUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

export const GRAPHIC_ASSETS: GraphicAsset[] = [
  {
    id: 'badge-50-off',
    name: '50% OFF Starburst',
    category: 'sale',
    defaultWidth: 260,
    defaultHeight: 260,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <polygon points="100,0 122,35 164,22 165,65 200,88 178,124 191,165 149,173 133,200 96,182 60,200 48,168 5,160 22,121 0,84 37,65 37,22 79,35" fill="#EF4444" stroke="#FFFFFF" stroke-width="6"/>
        <text x="100" y="85" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="900" font-size="28">UP TO</text>
        <text x="100" y="130" text-anchor="middle" fill="#FACC15" font-family="Arial, sans-serif" font-weight="900" font-size="46">50%</text>
        <text x="100" y="160" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="800" font-size="24">OFF</text>
      </svg>
    `),
  },
  {
    id: 'badge-mega-sale',
    name: 'Mega Sale Stamp',
    category: 'sale',
    defaultWidth: 320,
    defaultHeight: 140,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 140">
        <rect x="5" y="5" width="310" height="130" rx="20" fill="#F97316" stroke="#FFFFFF" stroke-width="6"/>
        <rect x="15" y="15" width="290" height="110" rx="14" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="8 6"/>
        <text x="160" y="60" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="900" font-size="34" letter-spacing="4">MEGA SALE</text>
        <text x="160" y="100" text-anchor="middle" fill="#FEF08A" font-family="Arial, sans-serif" font-weight="800" font-size="22">LIMITED TIME ONLY</text>
      </svg>
    `),
  },
  {
    id: 'badge-special-offer',
    name: 'Special Offer Banner',
    category: 'badges',
    defaultWidth: 340,
    defaultHeight: 110,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 110">
        <path d="M10,15 L330,15 L310,55 L330,95 L10,95 L30,55 Z" fill="#E11D48"/>
        <path d="M15,22 L320,22 L302,55 L320,88 L15,88 L33,55 Z" fill="none" stroke="#FFFFFF" stroke-width="3"/>
        <text x="170" y="65" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="900" font-size="28" letter-spacing="3">SPECIAL OFFER</text>
      </svg>
    `),
  },
  {
    id: 'badge-best-quality',
    name: '100% Quality Guaranteed',
    category: 'badges',
    defaultWidth: 220,
    defaultHeight: 220,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="92" fill="#0284C7" stroke="#38BDF8" stroke-width="6"/>
        <circle cx="100" cy="100" r="78" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 4"/>
        <text x="100" y="80" text-anchor="middle" fill="#F0F9FF" font-family="Arial, sans-serif" font-weight="800" font-size="20">PREMIUM</text>
        <text x="100" y="118" text-anchor="middle" fill="#FACC15" font-family="Arial, sans-serif" font-weight="900" font-size="34">100%</text>
        <text x="100" y="145" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="700" font-size="16">GUARANTEED</text>
      </svg>
    `),
  },
  {
    id: 'badge-new-arrival',
    name: 'New Arrival Pill',
    category: 'sale',
    defaultWidth: 280,
    defaultHeight: 90,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 90">
        <rect x="5" y="5" width="270" height="80" rx="40" fill="#10B981" stroke="#FFFFFF" stroke-width="5"/>
        <text x="140" y="54" text-anchor="middle" fill="#FFFFFF" font-family="Arial, sans-serif" font-weight="900" font-size="26" letter-spacing="2">NEW ARRIVAL</text>
      </svg>
    `),
  },
  {
    id: 'badge-diya-festival',
    name: 'Golden Diya Lamp',
    category: 'decorative',
    defaultWidth: 240,
    defaultHeight: 240,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <!-- Flame glow -->
        <circle cx="100" cy="70" r="35" fill="#F59E0B" opacity="0.3"/>
        <path d="M100,25 C115,55 120,75 100,90 C80,75 85,55 100,25 Z" fill="#FBBF24"/>
        <path d="M100,45 C108,60 110,75 100,85 C90,75 92,60 100,45 Z" fill="#EF4444"/>
        <!-- Diya Bowl -->
        <path d="M30,105 C30,160 170,160 170,105 C140,120 60,120 30,105 Z" fill="#D97706" stroke="#FDE68A" stroke-width="4"/>
        <!-- Base Stand -->
        <path d="M75,150 L125,150 L135,170 L65,170 Z" fill="#B45309"/>
        <!-- Ornaments -->
        <circle cx="100" cy="130" r="8" fill="#FEF08A"/>
        <circle cx="75" cy="125" r="5" fill="#FEF08A"/>
        <circle cx="125" cy="125" r="5" fill="#FEF08A"/>
      </svg>
    `),
  },
  {
    id: 'badge-music-equalizer',
    name: 'Neon Music Soundwave',
    category: 'decorative',
    defaultWidth: 320,
    defaultHeight: 160,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 160">
        <rect x="20" y="80" width="16" height="50" rx="8" fill="#EC4899"/>
        <rect x="50" y="40" width="16" height="90" rx="8" fill="#A855F7"/>
        <rect x="80" y="20" width="16" height="110" rx="8" fill="#6366F1"/>
        <rect x="110" y="60" width="16" height="70" rx="8" fill="#3B82F6"/>
        <rect x="140" y="10" width="16" height="120" rx="8" fill="#06B6D4"/>
        <rect x="170" y="45" width="16" height="85" rx="8" fill="#10B981"/>
        <rect x="200" y="15" width="16" height="115" rx="8" fill="#F59E0B"/>
        <rect x="230" y="55" width="16" height="75" rx="8" fill="#EF4444"/>
        <rect x="260" y="30" width="16" height="100" rx="8" fill="#EC4899"/>
        <rect x="290" y="70" width="16" height="60" rx="8" fill="#8B5CF6"/>
      </svg>
    `),
  },
  {
    id: 'badge-spicy-chili',
    name: 'Spicy Chili Food Badge',
    category: 'decorative',
    defaultWidth: 200,
    defaultHeight: 200,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="90" fill="#991B1B" stroke="#F87171" stroke-width="5"/>
        <path d="M120,40 C125,30 140,25 150,28" stroke="#16A34A" stroke-width="8" stroke-linecap="round" fill="none"/>
        <path d="M125,40 C140,70 140,110 110,145 C80,180 50,140 70,100 C85,70 110,50 125,40 Z" fill="#DC2626"/>
        <text x="100" y="170" text-anchor="middle" fill="#FEF08A" font-family="Arial, sans-serif" font-weight="900" font-size="18">HOT &amp; SPICY</text>
      </svg>
    `),
  },
  {
    id: 'badge-open-house',
    name: 'Open House Tag',
    category: 'badges',
    defaultWidth: 320,
    defaultHeight: 120,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 120">
        <rect x="6" y="6" width="308" height="108" rx="8" fill="#0F172A" stroke="#E2E8F0" stroke-width="3"/>
        <text x="160" y="52" text-anchor="middle" fill="#F8FAFC" font-family="Georgia, serif" font-weight="700" font-size="28" letter-spacing="4">OPEN HOUSE</text>
        <line x1="40" y1="68" x2="280" y2="68" stroke="#94A3B8" stroke-width="1.5"/>
        <text x="160" y="96" text-anchor="middle" fill="#38BDF8" font-family="Arial, sans-serif" font-weight="700" font-size="18" letter-spacing="3">THIS WEEKEND</text>
      </svg>
    `),
  },
  {
    id: 'badge-vip-pass',
    name: 'VIP Golden Access',
    category: 'badges',
    defaultWidth: 260,
    defaultHeight: 130,
    svgDataUri: svgToUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 260 130">
        <rect x="5" y="5" width="250" height="120" rx="16" fill="#18181B" stroke="#EAB308" stroke-width="4"/>
        <text x="130" y="62" text-anchor="middle" fill="#FACC15" font-family="Arial, sans-serif" font-weight="900" font-size="44" letter-spacing="6">VIP</text>
        <text x="130" y="100" text-anchor="middle" fill="#FAFAF9" font-family="Arial, sans-serif" font-weight="600" font-size="16" letter-spacing="4">ALL ACCESS PASS</text>
      </svg>
    `),
  }
];
