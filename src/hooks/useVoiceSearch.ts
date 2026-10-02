import { useState, useEffect, useRef, useCallback } from 'react';
import { soundManager } from '../utils/soundEffects';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognitionInstance, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognitionInstance, ev: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceSearch(onFinalTranscript: (text: string) => void) {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const callbackRef = useRef(onFinalTranscript);

  useEffect(() => {
    callbackRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  const initRecognition = useCallback(() => {
    const SpeechRecognitionAPI =
      typeof window !== 'undefined'
        ? window.SpeechRecognition || window.webkitSpeechRecognition
        : null;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      return null;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
        setIsPermissionDenied(false);
        setInterimTranscript('');
        soundManager.playMicStart();
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentInterim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          const transcript = item[0].transcript;
          if (item.isFinal) {
            final += transcript;
          } else {
            currentInterim += transcript;
          }
        }

        if (currentInterim) {
          setInterimTranscript(currentInterim);
        }

        if (final) {
          const cleaned = final.trim();
          setInterimTranscript('');
          if (cleaned) {
            callbackRef.current(cleaned);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('Microphone access blocked. Click to see how to enable.');
          setIsPermissionDenied(true);
        } else if (event.error === 'no-speech') {
          setErrorMessage('No speech detected. Try again.');
        } else if (event.error === 'network') {
          setErrorMessage('Network connection issue for voice recognition.');
        } else {
          setErrorMessage('Voice search unavailable.');
        }
        setIsListening(false);
        setInterimTranscript('');
        soundManager.playMicStop();
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
        soundManager.playMicStop();
      };

      recognitionRef.current = recognition;
      return recognition;
    } catch {
      setIsSupported(false);
      return null;
    }
  }, []);

  useEffect(() => {
    initRecognition();

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [initRecognition]);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setErrorMessage('Voice search is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      return;
    }

    // Attempt to explicitly trigger user permission prompt via getUserMedia if available
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Close audio track immediately, as SpeechRecognition uses its own input pipeline
        stream.getTracks().forEach((track) => track.stop());
        setIsPermissionDenied(false);
        setErrorMessage(null);
      } catch (err: unknown) {
        console.warn('Microphone permission check error:', err);
        const error = err as { name?: string };
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError' || error.name === 'SecurityError') {
          setIsPermissionDenied(true);
          setErrorMessage('Microphone access blocked. Click here to allow.');
          return;
        }
      }
    }

    // Ensure recognition instance is ready
    if (!recognitionRef.current) {
      initRecognition();
    }

    if (recognitionRef.current) {
      try {
        setErrorMessage(null);
        recognitionRef.current.start();
      } catch (err: unknown) {
        console.warn('Failed to start speech recognition:', err);
        const error = err as { name?: string };
        if (error?.name === 'InvalidStateError') {
          // Already running, abort and retry
          try {
            recognitionRef.current.abort();
            setTimeout(() => recognitionRef.current?.start(), 100);
          } catch {
            // ignore
          }
        }
      }
    }
  }, [isSupported, isListening, initRecognition]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
  }, [isListening]);

  return {
    isListening,
    interimTranscript,
    errorMessage,
    isSupported,
    isPermissionDenied,
    startListening,
    stopListening,
    clearError: () => setErrorMessage(null),
    setIsPermissionDenied,
  };
}
