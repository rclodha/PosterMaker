import React, { useState, useEffect } from 'react';
import { PosterProject } from '../types/poster';
import { renderPosterToDataUrl } from '../utils/canvasRenderer';
import { Download, Share2, Printer, X, Check, Loader2, Sparkles } from 'lucide-react';

interface ExportModalProps {
  project: PosterProject;
  isPro: boolean;
  onClose: () => void;
  onUpgradePro: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isPro,
  onClose,
  onUpgradePro,
}) => {
  const [format, setFormat] = useState<'image/png' | 'image/jpeg'>('image/png');
  const [resolutionMultiplier, setResolutionMultiplier] = useState<number>(1);
  const [includeWatermark, setIncludeWatermark] = useState<boolean>(!isPro);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [copiedToast, setCopiedToast] = useState(false);

  // Re-generate preview whenever format, multiplier, or watermark changes
  useEffect(() => {
    let isCurrent = true;
    const generate = async () => {
      setIsGenerating(true);
      try {
        const url = await renderPosterToDataUrl(project, {
          format,
          multiplier: resolutionMultiplier,
          showWatermark: includeWatermark && !isPro,
        });
        if (isCurrent) {
          setPreviewUrl(url);
        }
      } catch (err) {
        console.error('Failed to generate export preview', err);
      } finally {
        if (isCurrent) setIsGenerating(false);
      }
    };

    generate();
    return () => {
      isCurrent = false;
    };
  }, [project, format, resolutionMultiplier, includeWatermark, isPro]);

  const handleDownload = () => {
    if (!previewUrl) return;
    const ext = format === 'image/png' ? 'png' : 'jpg';
    const cleanTitle = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const filename = `${cleanTitle || 'poster'}-${Date.now()}.${ext}`;

    const link = document.createElement('a');
    link.href = previewUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!previewUrl) return;

    if (navigator.share) {
      try {
        // Convert data URL to Blob for native sharing
        const res = await fetch(previewUrl);
        const blob = await res.blob();
        const ext = format === 'image/png' ? 'png' : 'jpg';
        const file = new File([blob], `${project.title}.${ext}`, { type: blob.type });

        await navigator.share({
          title: project.title,
          text: `Created with Poster Maker: ${project.title}`,
          files: [file],
        });
        return;
      } catch (e) {
        console.log('Share canceled or error', e);
      }
    }

    // Fallback: Copy to clipboard if available
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      }
    } catch {
      handleDownload();
    }
  };

  const handlePrint = () => {
    if (!previewUrl) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${project.title} - Print</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; background: #fff; }
            img { max-width: 100%; max-height: 100vh; object-fit: contain; }
          </style>
        </head>
        <body>
          <img src="${previewUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const outWidth = project.canvas.width * resolutionMultiplier;
  const outHeight = project.canvas.height * resolutionMultiplier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Export &amp; Share Poster</h2>
            <p className="text-xs text-slate-400">High-resolution render &amp; format settings</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-4 overflow-y-auto flex flex-col gap-4">
          {/* Live Preview Display */}
          <div className="relative w-full h-56 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center overflow-hidden p-2">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                <span className="text-xs">Rendering crisp raster image...</span>
              </div>
            ) : previewUrl ? (
              <img
                src={previewUrl}
                alt="Export preview"
                className="max-h-full max-w-full object-contain rounded shadow-lg"
              />
            ) : null}

            <div className="absolute bottom-2 right-2 bg-slate-900/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-800">
              {outWidth} × {outHeight} px
            </div>
          </div>

          {/* Format Selection (PNG vs JPG) */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-slate-300">File Format</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('image/png')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  format === 'image/png'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                PNG (Lossless High Quality)
              </button>
              <button
                onClick={() => setFormat('image/jpeg')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                  format === 'image/jpeg'
                    ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                JPG (Smaller File Size)
              </button>
            </div>
          </div>

          {/* Resolution Multiplier */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-slate-300">Resolution &amp; DPI</span>
              <span className="text-[11px] font-mono text-amber-400">
                {resolutionMultiplier === 2 ? 'Print Ready Ultra-HD' : 'Standard Digital'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setResolutionMultiplier(1)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                  resolutionMultiplier === 1
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="font-bold">Standard 1080p</div>
                <div className="text-[10px] text-slate-400">Perfect for Instagram &amp; Web</div>
              </button>

              <button
                onClick={() => setResolutionMultiplier(2)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium text-left transition-all relative ${
                  resolutionMultiplier === 2
                    ? 'bg-amber-400/15 border-amber-400 text-white'
                    : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <div className="font-bold flex items-center gap-1">
                  Ultra HD 2K / Print
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-[10px] text-slate-400">300 DPI high-res flyer</div>
              </button>
            </div>
          </div>

          {/* Watermark Notice & Pro Upgrade */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-200">
                {isPro ? 'Pro Member: No Watermark' : 'Watermark Badge'}
              </span>
              <span className="text-[10px] text-slate-400">
                {isPro
                  ? 'Watermark permanently removed on all your exports'
                  : 'Upgrade to Pro to remove watermark and unlock all premium assets'}
              </span>
            </div>

            {!isPro ? (
              <button
                onClick={onUpgradePro}
                className="py-1 px-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-lg text-xs hover:brightness-110 shrink-0"
              >
                Unlock Pro
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Clean
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-2 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Print"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span>Print</span>
            </button>
          </div>

          <button
            onClick={handleDownload}
            disabled={isGenerating || !previewUrl}
            className="flex-1 max-w-[220px] py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl transition-all flex items-center justify-center gap-2 text-xs shadow-lg shadow-amber-400/20 active:scale-[0.98] disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Save to Device</span>
          </button>
        </div>

        {copiedToast && (
          <div className="bg-emerald-500 text-slate-950 text-xs font-semibold py-1 px-3 text-center">
            Link copied to clipboard!
          </div>
        )}
      </div>
    </div>
  );
};
