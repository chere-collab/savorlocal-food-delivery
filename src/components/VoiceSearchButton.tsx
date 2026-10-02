import React from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  className = '',
}) => {
  const {
    isListening,
    interimTranscript,
    errorMessage,
    isSupported,
    startListening,
    stopListening,
    clearError,
  } = useVoiceSearch(onTranscript);

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Active Listening Animated Indicator / Wave */}
      {isListening && (
        <div className="absolute right-9 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-medium whitespace-nowrap shadow-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2" style={{ animationDelay: '0ms' }} />
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-3.5" style={{ animationDelay: '150ms' }} />
            <span className="w-1 bg-amber-400 rounded-full animate-pulse h-2.5" style={{ animationDelay: '300ms' }} />
          </div>
          <span className="text-[11px] font-semibold">
            {interimTranscript ? `"${interimTranscript}"` : 'Listening...'}
          </span>
        </div>
      )}

      {/* Mic Trigger Button */}
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? 'Stop voice search' : 'Search cuisines or dishes by voice'}
        title={
          !isSupported
            ? 'Voice search is not supported in this browser'
            : isListening
            ? 'Listening... Click to stop'
            : 'Search cuisines or dishes by voice (Web Speech API)'
        }
        className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
          isListening
            ? 'bg-amber-500 text-black shadow-md ring-2 ring-amber-400/50 animate-pulse'
            : !isSupported
            ? 'text-zinc-600 cursor-not-allowed opacity-50'
            : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/60'
        }`}
      >
        {isListening ? (
          <Mic className="w-4 h-4 fill-black text-black" />
        ) : !isSupported ? (
          <MicOff className="w-4 h-4" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>

      {/* Floating Error Toast */}
      {errorMessage && (
        <div className="absolute right-0 top-full mt-2 z-50 flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-red-500/40 text-red-400 text-xs shadow-xl min-w-[220px]">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span className="flex-1 text-[11px] leading-tight">{errorMessage}</span>
          <button
            onClick={clearError}
            className="text-zinc-500 hover:text-white p-0.5 text-xs font-bold"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};
