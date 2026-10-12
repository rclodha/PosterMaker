export type AspectRatioType = '4:5' | '1:1' | '9:16' | '16:9' | '3:4' | '2:3';

export interface CanvasDimensions {
  width: number;
  height: number;
  aspectRatio: AspectRatioType;
  label: string;
}

export type ElementType = 'text' | 'image' | 'shape';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number; // In canvas coordinate units
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  zIndex: number;
  opacity: number; // 0 to 1
  locked?: boolean;
  hidden?: boolean;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string | number;
  fontStyle?: 'normal' | 'italic';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number; // em or px
  lineHeight: number; // multiplier e.g. 1.2
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  backgroundColor?: string;
  backgroundPadding?: number;
  borderRadius?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string; // data URL or SVG/image URL
  alt?: string;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
  objectFit?: 'contain' | 'cover';
}

export type ShapeKind = 'rectangle' | 'circle' | 'star' | 'badge' | 'line' | 'ribbon';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeKind: ShapeKind;
  fillColor: string;
  strokeColor?: string;
  strokeWidth?: number;
  borderRadius?: number;
}

export type CanvasElement = TextElement | ImageElement | ShapeElement;

export interface GradientStop {
  color: string;
  offset: number; // 0 to 1
}

export interface BackgroundConfig {
  type: 'color' | 'gradient' | 'pattern';
  color?: string;
  gradient?: {
    type: 'linear' | 'radial';
    angle?: number; // 0 - 360
    stops: GradientStop[];
  };
  pattern?: 'dots' | 'grid' | 'stripes' | 'none';
}

export interface PosterProject {
  id: string;
  title: string;
  canvas: {
    width: number;
    height: number;
    aspectRatio: AspectRatioType;
    background: BackgroundConfig;
  };
  elements: CanvasElement[];
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
  isTemplate?: boolean;
  category?: string;
  isPro?: boolean;
}

export interface PosterTemplate {
  id: string;
  title: string;
  category: string;
  aspectRatio: AspectRatioType;
  width: number;
  height: number;
  thumbnailSvg?: string;
  isPro?: boolean;
  background: BackgroundConfig;
  elements: CanvasElement[];
}

export type CategoryKey = 
  | 'all'
  | 'sale'
  | 'food'
  | 'music'
  | 'festival'
  | 'business'
  | 'fitness'
  | 'education'
  | 'birthday'
  | 'realestate';

export interface CategoryInfo {
  key: CategoryKey;
  label: string;
  description: string;
}
