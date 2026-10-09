// Accessible speech synthesis helper for Grade 2-5 students

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = (text: string, onEnd?: () => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  if (!text || text.trim() === '') {
    return;
  }

  // Clean text from Markdown or special symbols for friendly reading
  const clean = text
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 0.95; // Slightly slower, very friendly and easy for children to follow
  utterance.pitch = 1.05;

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeaking = (): boolean => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};
