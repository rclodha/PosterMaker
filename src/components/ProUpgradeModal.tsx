import React from 'react';
import { Sparkles, Check, X, ShieldCheck } from 'lucide-react';

interface ProUpgradeModalProps {
  isPro: boolean;
  onClose: () => void;
  onTogglePro: (nextState: boolean) => void;
}

export const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({
  isPro,
  onClose,
  onTogglePro,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative p-6 text-center border-b border-slate-800 bg-amber-500/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30">
            <Sparkles className="w-6 h-6 text-slate-950" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">Poster Maker Pro</h2>
          <p className="text-xs text-amber-300 font-medium mt-1">
            Unlock Full Creative Power for Creators &amp; Small Businesses
          </p>
        </div>

        {/* Benefits List */}
        <div className="p-6 flex flex-col gap-3.5 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-white">Ultra-HD &amp; 300 DPI Print Export</div>
              <div className="text-slate-400 text-[11px]">
                Razor-sharp exports for storefront banners, vinyl flyers, and social media.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-white">100% Watermark-Free Downloads</div>
              <div className="text-slate-400 text-[11px]">
                Clean, professional outputs with your own brand mark and logos only.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-white">Full Access to All 50+ Template Categories</div>
              <div className="text-slate-400 text-[11px]">
                Modern Sale, Street Food, Festival greetings, Real Estate, and Music posters.
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="font-bold text-white">Commercial Rights &amp; Priority Cloud Storage</div>
              <div className="text-slate-400 text-[11px]">
                Full commercial usage permitted for business advertising and clients.
              </div>
            </div>
          </div>

          {/* Pricing Plan Selector */}
          <div className="mt-2 p-3 bg-slate-900 border border-amber-500/40 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-white font-bold text-sm">Annual VIP Plan</div>
              <div className="text-[10px] text-slate-400">$3.99 / month (billed annually)</div>
            </div>
            <span className="py-1 px-2.5 bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg">
              SAVE 60%
            </span>
          </div>
        </div>

        {/* Footer Action & Toggle Simulation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-2.5">
          <button
            onClick={() => {
              onTogglePro(!isPro);
              onClose();
            }}
            className={`w-full py-3 px-4 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
              isPro
                ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700'
                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 shadow-amber-400/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isPro ? 'Switch to Free Tier (Demo)' : 'Activate Pro Membership (Instant Demo)'}</span>
          </button>
          <p className="text-[10px] text-slate-500 text-center">
            Zero commitment · Cancel anytime · Instant activation
          </p>
        </div>
      </div>
    </div>
  );
};
