import React, { useState } from 'react';
import { 
  X, Smartphone, Download, ExternalLink, CheckCircle2, 
  Terminal, ShieldCheck, Sparkles, Layers, ArrowRight, Github 
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwabuilder' | 'direct' | 'github_action'>('pwabuilder');

  if (!isOpen) return null;

  const currentAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-3hrqv2kmmegxjvixws5hgb-59919151281.europe-west2.run.app';
  const pwaBuilderUrl = `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentAppUrl)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div 
        className="w-full max-w-3xl bg-[#0e1015] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white flex items-center gap-2">
                <span>Download Android APK & App Install</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Options to install on Android as an APK or Progressive Web App
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-4 px-6 border-b border-zinc-800 bg-zinc-950/40 text-xs font-medium">
          {[
            { id: 'pwabuilder', label: '1. Instant APK Generator (Recommended)' },
            { id: 'direct', label: '2. Direct Android Install (No APK Needed)' },
            { id: 'github_action', label: '3. Build via Capacitor & GitHub' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as typeof activeTab)}
              className={`py-3.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === t.id
                  ? 'border-amber-400 text-amber-400 font-bold'
                  : 'border-transparent text-zinc-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-300">
          
          {/* Method 1: PWABuilder (Instant APK generator) */}
          {activeTab === 'pwabuilder' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant 1-Click APK with Microsoft PWABuilder</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Microsoft's official open-source tool <strong>PWABuilder</strong> takes your live SavorLocal PWA manifest and packages it into a ready-to-install Android <strong>.apk</strong> or Google Play Store <strong>.aab</strong> package in under 60 seconds.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h4 className="font-semibold text-white text-sm">Simple 3-Step Process:</h4>
                <ol className="space-y-3 list-decimal list-inside text-zinc-300">
                  <li className="leading-relaxed">
                    Click the button below to open PWABuilder with your live app URL pre-filled.
                  </li>
                  <li className="leading-relaxed">
                    Click <strong className="text-white">"Package for Stores"</strong> $\to$ select <strong className="text-emerald-400">Android</strong>.
                  </li>
                  <li className="leading-relaxed">
                    Click <strong className="text-white">"Generate Package"</strong> and download your <code className="text-amber-400">.apk</code> file! You can install it immediately on any Android device by enabling "Install from unknown sources".
                  </li>
                </ol>

                <div className="pt-2">
                  <a
                    href={pwaBuilderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs tracking-tight transition-all shadow-lg"
                  >
                    <span>Open PWABuilder to Generate APK</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Method 2: Direct PWA Install (No APK file required) */}
          {activeTab === 'direct' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Install Directly on Android Without Downloading an APK</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Modern Android phones support <strong>WebAPK</strong> natively. When you tap "Install App", Android automatically builds a real APK directly on your phone, placing the SavorLocal app icon on your home screen and app drawer with standalone fullscreen view.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                {isInstallable ? (
                  <div className="space-y-3">
                    <p className="text-zinc-200">
                      Your browser supports 1-tap installation right now:
                    </p>
                    <button
                      onClick={install}
                      className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>Install SavorLocal on This Device</span>
                    </button>
                  </div>
                ) : isInstalled ? (
                  <div className="p-3 rounded-lg bg-zinc-800 text-emerald-400 font-semibold">
                    ✓ SavorLocal is already installed in Standalone mode!
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h5 className="font-semibold text-white">How to install from your phone's browser:</h5>
                    <ol className="space-y-2 text-zinc-300 list-decimal list-inside">
                      <li>Open this web app URL in Google Chrome on your Android phone.</li>
                      <li>Tap the <strong>three dots menu (⋮)</strong> in Chrome's top right corner.</li>
                      <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                      <li>The app icon will appear alongside your other Android apps!</li>
                    </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Method 3: GitHub Actions & Capacitor */}
          {activeTab === 'github_action' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <Github className="w-4 h-4 text-amber-400" />
                  <span>Build APK via GitHub Actions or Capacitor</span>
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed">
                  Since your project is in your GitHub repository (<code>chere-collab/savorlocal-food-delivery</code>), you can wrap it with <strong>Capacitor</strong> to generate a native Android Studio project and compile a debug APK.
                </p>

                <div className="space-y-2 pt-2">
                  <h5 className="text-zinc-200 font-semibold">Local terminal commands:</h5>
                  <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-amber-300 overflow-x-auto">
{`# 1. Clone your repo
git clone https://github.com/chere-collab/savorlocal-food-delivery.git
cd savorlocal-food-delivery

# 2. Install dependencies & build Vite web assets
npm install
npm run build

# 3. Add Capacitor Android wrapper
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "SavorLocal" "com.savorlocal.app" --web-dir=dist
npx cap add android

# 4. Open in Android Studio & click "Build APK"
npx cap open android`}
                  </pre>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
