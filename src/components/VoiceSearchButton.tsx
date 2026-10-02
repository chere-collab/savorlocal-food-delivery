import React, { useState } from 'react';
import { Mic, MicOff, AlertCircle, HelpCircle } from 'lucide-react';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { MicrophonePermissionModal } from './MicrophonePermissionModal';

interface VoiceSearchButtonProps {
  onTranscript: (text: string) => void;
  className?: string;
}

export const VoiceSearchButton: React.FC<VoiceSearchButtonProps> = ({
  onTranscript,
  className = '',
}) => {
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  const {
    isListening,
    interimTranscript,
    errorMessage,
    isSupported,
    isPermissionDenied,
    startListening,
    stopListening,
    clearError,
  } = useVoiceSearch(onTranscript);

  const handleMicClick = () => {
    if (isPermissionDenied) {
      setIsHelpModalOpen(true);
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <>
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
          onClick={handleMicClick}
          aria-label={
            isListening 
              ? 'Stop voice search' 
              : isPermissionDenied 
              ? 'Microphone blocked - click to view instructions' 
              : 'Search cuisines or dishes by voice'
          }
          title={
            !isSupported
              ? 'Voice search is not supported in this browser'
              : isPermissionDenied
              ? 'Microphone blocked - click to view how to enable'
              : isListening
              ? 'Listening... Click to stop'
              : 'Search cuisines or dishes by voice (Web Speech API)'
          }
          className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
            isListening
              ? 'bg-amber-500 text-black shadow-md ring-2 ring-amber-400/50 animate-pulse'
              : isPermissionDenied
              ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
              : !isSupported
              ? 'text-zinc-600 cursor-not-allowed opacity-50'
              : 'text-zinc-400 hover:text-amber-400 hover:bg-zinc-800/60'
          }`}
        >
          {isListening ? (
            <Mic className="w-4 h-4 fill-black text-black" />
          ) : isPermissionDenied ? (
            <MicOff className="w-4 h-4 text-red-400" />
          ) : !isSupported ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        {/* Floating Error / Permission Notification Toast */}
        {errorMessage && (
          <div className="absolute right-0 top-full mt-2 z-50 flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-amber-500/40 text-amber-300 text-xs shadow-xl min-w-[240px]">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <button
              type="button"
              onClick={() => setIsHelpModalOpen(true)}
              className="flex-1 text-left text-[11px] leading-tight hover:underline cursor-pointer"
            >
              {errorMessage}
            </button>
            <button
              type="button"
              onClick={clearError}
              className="text-zinc-500 hover:text-white p-0.5 text-xs font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        )}
      </div>

      {/* Permission Guidance & Simulation Modal */}
      <MicrophonePermissionModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onSimulateVoice={(query) => {
          onTranscript(query);
          clearError();
        }}
      />
    </>
  );
};
