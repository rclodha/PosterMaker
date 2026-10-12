import { PosterProject, CanvasElement, TextElement, ImageElement, ShapeElement } from '../types/poster';

export interface RenderExportOptions {
  multiplier?: number; // 1 for standard, 2 for ultra-HD print
  format?: 'image/png' | 'image/jpeg';
  quality?: number; // 0.92
  showWatermark?: boolean;
}

export async function renderPosterToDataUrl(
  project: PosterProject,
  options: RenderExportOptions = {}
): Promise<string> {
  const { multiplier = 1, format = 'image/png', quality = 0.95, showWatermark = false } = options;

  // Wait for web fonts to load
  if ('fonts' in document) {
    try {
      await document.fonts.ready;
    } catch {
      // continue
    }
  }

  const canvas = document.createElement('canvas');
  const width = project.canvas.width * multiplier;
  const height = project.canvas.height * multiplier;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas 2D context');

  // Scale context by multiplier
  ctx.scale(multiplier, multiplier);

  // 1. Draw Background
  drawBackground(ctx, project.canvas.width, project.canvas.height, project.canvas.background);

  // 2. Draw elements in zIndex order
  const sortedElements = [...project.elements]
    .filter((el) => !el.hidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  for (const el of sortedElements) {
    ctx.save();
    ctx.globalAlpha = el.opacity ?? 1;

    // Apply element transform (translation + rotation around center)
    const centerX = el.x + el.width / 2;
    const centerY = el.y + el.height / 2;
    ctx.translate(centerX, centerY);
    if (el.rotation) {
      ctx.rotate((el.rotation * Math.PI) / 180);
    }
    ctx.translate(-centerX, -centerY);

    if (el.type === 'shape') {
      drawShape(ctx, el);
    } else if (el.type === 'image') {
      await drawImage(ctx, el);
    } else if (el.type === 'text') {
      drawText(ctx, el);
    }

    ctx.restore();
  }

  // 3. Optional Watermark
  if (showWatermark) {
    ctx.save();
    ctx.globalAlpha = 0.65;
    ctx.fillStyle = '#000000';
    ctx.fillRect(project.canvas.width - 240, project.canvas.height - 48, 220, 36);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Poster Maker MVP', project.canvas.width - 130, project.canvas.height - 25);
    ctx.restore();
  }

  return canvas.toDataURL(format, quality);
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  bg: PosterProject['canvas']['background']
) {
  if (bg.type === 'color') {
    ctx.fillStyle = bg.color || '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  } else if (bg.type === 'gradient' && bg.gradient) {
    let grad: CanvasGradient;
    if (bg.gradient.type === 'linear') {
      const angleRad = ((bg.gradient.angle || 180) * Math.PI) / 180;
      const x2 = Math.cos(angleRad) * width;
      const y2 = Math.sin(angleRad) * height;
      grad = ctx.createLinearGradient(0, 0, Math.max(0, x2), Math.max(0, y2));
    } else {
      grad = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.max(width, height) / 2);
    }
    bg.gradient.stops.forEach((stop) => {
      grad.addColorStop(stop.offset, stop.color);
    });
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
  }
}

function drawShape(ctx: CanvasRenderingContext2D, el: ShapeElement) {
  ctx.fillStyle = el.fillColor;
  if (el.strokeColor && el.strokeWidth) {
    ctx.strokeStyle = el.strokeColor;
    ctx.lineWidth = el.strokeWidth;
  }

  ctx.beginPath();
  if (el.shapeKind === 'rectangle') {
    const r = el.borderRadius || 0;
    if (r > 0 && typeof ctx.roundRect === 'function') {
      ctx.roundRect(el.x, el.y, el.width, el.height, r);
    } else {
      ctx.rect(el.x, el.y, el.width, el.height);
    }
  } else if (el.shapeKind === 'circle') {
    const radius = Math.min(el.width, el.height) / 2;
    ctx.arc(el.x + el.width / 2, el.y + el.height / 2, radius, 0, Math.PI * 2);
  } else if (el.shapeKind === 'line') {
    ctx.rect(el.x, el.y, el.width, el.height || 4);
  } else if (el.shapeKind === 'star') {
    drawStar(ctx, el.x + el.width / 2, el.y + el.height / 2, 5, el.width / 2, el.width / 4);
  } else {
    ctx.rect(el.x, el.y, el.width, el.height);
  }

  ctx.fill();
  if (el.strokeColor && el.strokeWidth) {
    ctx.stroke();
  }
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

async function drawImage(ctx: CanvasRenderingContext2D, el: ImageElement): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (el.borderRadius && typeof ctx.roundRect === 'function') {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.width, el.height, el.borderRadius);
        ctx.clip();
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
        ctx.restore();
      } else {
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
      }

      if (el.borderColor && el.borderWidth) {
        ctx.strokeStyle = el.borderColor;
        ctx.lineWidth = el.borderWidth;
        if (el.borderRadius && typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(el.x, el.y, el.width, el.height, el.borderRadius);
          ctx.stroke();
        } else {
          ctx.strokeRect(el.x, el.y, el.width, el.height);
        }
      }
      resolve();
    };
    img.onerror = () => {
      // Fallback placeholder rectangle so export does not break
      ctx.fillStyle = '#E2E8F0';
      ctx.fillRect(el.x, el.y, el.width, el.height);
      resolve();
    };
    img.src = el.src;
  });
}

function drawText(ctx: CanvasRenderingContext2D, el: TextElement) {
  let displayContent = el.text;
  if (el.textTransform === 'uppercase') displayContent = displayContent.toUpperCase();
  if (el.textTransform === 'lowercase') displayContent = displayContent.toLowerCase();

  const fontStyle = el.fontStyle === 'italic' ? 'italic' : 'normal';
  const fontWeight = el.fontWeight || 'normal';
  const fontSize = el.fontSize || 32;
  const fontFamily = el.fontFamily || 'Outfit, sans-serif';

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", sans-serif`;

  // Background pill / highlight if defined
  if (el.backgroundColor) {
    ctx.fillStyle = el.backgroundColor;
    const padding = el.backgroundPadding || 8;
    const radius = el.borderRadius || 8;
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(el.x - padding, el.y - padding, el.width + padding * 2, el.height + padding * 2, radius);
      ctx.fill();
    } else {
      ctx.fillRect(el.x - padding, el.y - padding, el.width + padding * 2, el.height + padding * 2);
    }
  }

  // Text Shadow
  if (el.shadowColor) {
    ctx.shadowColor = el.shadowColor;
    ctx.shadowBlur = el.shadowBlur || 8;
    ctx.shadowOffsetX = el.shadowOffsetX || 0;
    ctx.shadowOffsetY = el.shadowOffsetY || 4;
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }

  ctx.fillStyle = el.color || '#FFFFFF';
  ctx.textAlign = el.textAlign || 'center';
  ctx.textBaseline = 'top';

  const lines = displayContent.split('\n');
  const lineHeight = fontSize * (el.lineHeight || 1.2);

  let startX = el.x;
  if (el.textAlign === 'center') {
    startX = el.x + el.width / 2;
  } else if (el.textAlign === 'right') {
    startX = el.x + el.width;
  }

  lines.forEach((line, index) => {
    ctx.fillText(line, startX, el.y + index * lineHeight);
  });
}
