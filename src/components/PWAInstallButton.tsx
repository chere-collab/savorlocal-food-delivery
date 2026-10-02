import React, { useState } from 'react';
import { Smartphone, Download, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  onOpenApkModal: () => void;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ onOpenApkModal }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed in standalone mode
  if (isInstalled) {
    return null;
  }

  // Chromium / Android beforeinstallprompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-black text-xs font-semibold transition-all cursor-pointer shadow-xs"
        title="Install as Android App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-[#12141a] border border-zinc-800 p-6 shadow-2xl space-y-4">
              <h3 className="text-base font-display font-bold text-white">Install on iPhone / iPad</h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                1. Tap the <strong className="text-white">Share</strong> button in Safari's bottom toolbar.<br />
                2. Scroll down and tap <strong className="text-amber-400">Add to Home Screen</strong>.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Default button to open APK & install modal
  return (
    <button
      onClick={onOpenApkModal}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/90 text-zinc-300 hover:border-amber-500/40 hover:text-amber-400 text-xs font-medium transition-colors cursor-pointer"
      title="Download Android APK or install app"
    >
      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
      <span className="hidden sm:inline">Get APK / App</span>
    </button>
  );
};
