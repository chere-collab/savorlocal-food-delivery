import React from 'react';
import { 
  X, Mic, MicOff, ExternalLink, ShieldAlert, Sparkles, CheckCircle2 
} from 'lucide-react';

interface MicrophonePermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateVoice: (query: string) => void;
}

export const MicrophonePermissionModal: React.FC<MicrophonePermissionModalProps> = ({
  isOpen,
  onClose,
  onSimulateVoice,
}) => {
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isIframe = typeof window !== 'undefined' && window.self !== window.top;

  const sampleVoiceQueries = [
    'Woodfire Margherita Pizza',
    'Vegan Buddha Bowl',
    'Spicy Bluefin Tuna',
    'Birria Tacos with Consomé',
    'Gluten-Free Truffle Pasta',
  ];

  return (
    <div 
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#0e1015] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                Microphone Access Blocked
              </h3>
              <p className="text-xs text-zinc-400">
                How to allow microphone permissions in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-zinc-300 max-h-[75vh] overflow-y-auto">
          
          {/* Reason explanation */}
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 space-y-1.5">
            <p className="text-amber-300 font-semibold flex items-center gap-1.5">
              <span>Why this happens:</span>
            </p>
            <p className="text-zinc-300 leading-relaxed">
              {isIframe
                ? 'Your browser blocks microphone access inside embedded preview frames for security, or microphone permission was previously denied.'
                : 'Microphone permission was previously denied or restricted in your browser settings for this site.'}
            </p>
          </div>

          {/* Step-by-step instructions */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">How to unblock microphone in 10 seconds:</h4>
            
            <div className="space-y-2.5 pl-1">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <p className="leading-snug">
                  Look at your browser's address bar at the top and click the <strong className="text-white">Tune icon (🎛️)</strong> or <strong className="text-white">Lock icon (🔒)</strong> right beside the URL.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <p className="leading-snug">
                  Find <strong className="text-white">Microphone</strong> and toggle it from <em>Blocked</em> to <strong className="text-emerald-400">Allow</strong>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-zinc-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <p className="leading-snug">
                  Refresh the page and click the microphone icon again!
                </p>
              </div>
            </div>
          </div>

          {/* If inside iframe: Open in full tab option */}
          {isIframe && (
            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
              <p className="text-white font-semibold">Running in an embedded preview?</p>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                Embedded iframe security policies frequently restrict hardware microphone capture. Open the application directly in a dedicated browser tab to grant permissions without iframe barriers.
              </p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-colors shadow-xs"
              >
                <span>Open in Dedicated Browser Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Simulated Voice Search Test */}
          <div className="pt-2 border-t border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Test Voice Search Right Now (Simulation):</span>
              </span>
            </div>
            <p className="text-zinc-400 text-[11px]">
              Tap any sample spoken phrase below to test how the voice search parses dishes and filters the menus:
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {sampleVoiceQueries.map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => {
                    onSimulateVoice(query);
                    onClose();
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-amber-500/20 hover:border-amber-500/50 hover:text-amber-300 border border-zinc-700 text-zinc-300 text-[11px] font-medium transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Mic className="w-3 h-3 text-amber-400" />
                  <span>"{query}"</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
