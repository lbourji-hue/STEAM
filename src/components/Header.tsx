import React from 'react';
import { Sparkles, Printer, FileText, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { StepId } from '../types';
import { isSpeaking, stopSpeech } from '../utils/speech';

interface HeaderProps {
  currentStep: StepId;
  maxUnlockedStep: StepId;
  onSelectStep: (step: StepId) => void;
  onOpenPortfolio: () => void;
  onResetProject: () => void;
  projectTitle: string;
}

const STEP_NAMES: { step: StepId; label: string }[] = [
  { step: 1, label: 'Ask' },
  { step: 2, label: 'Imagine' },
  { step: 3, label: 'Plan' },
  { step: 4, label: 'Create' },
  { step: 5, label: 'Test' },
  { step: 6, label: 'Improve' },
];

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  maxUnlockedStep,
  onSelectStep,
  onOpenPortfolio,
  onResetProject,
  projectTitle,
}) => {
  const [speaking, setSpeaking] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setSpeaking(isSpeaking());
    }, 500);
    return () => clearInterval(timer);
  }, []);

  const handleStopSpeech = () => {
    stopSpeech();
    setSpeaking(false);
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
            ⚙️
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap block leading-tight font-display">
              STEAM Design Studio
            </span>
            <span className="text-[11px] text-slate-500 block truncate max-w-[200px] sm:max-w-xs">
              {projectTitle || 'Grade 2–5 Engineering Process'}
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Steps (Clean single-line text links) */}
        <nav className="hidden lg:flex items-center gap-2 text-xs font-semibold">
          {STEP_NAMES.map(({ step, label }) => {
            const isUnlocked = step <= maxUnlockedStep;
            const isActive = currentStep === step;

            return (
              <button
                key={step}
                type="button"
                disabled={!isUnlocked}
                onClick={() => onSelectStep(step)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isUnlocked
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'text-slate-300 cursor-not-allowed'
                }`}
              >
                <span className="font-mono text-[11px]">{step}.</span>
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {speaking && (
            <button
              type="button"
              onClick={handleStopSpeech}
              title="Stop voice read aloud"
              className="px-2.5 py-1.5 bg-rose-100 text-rose-700 hover:bg-rose-200 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stop Voice</span>
            </button>
          )}

          <button
            type="button"
            onClick={onResetProject}
            title="Start New Challenge"
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenPortfolio}
            className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap active:scale-98"
          >
            <FileText className="w-4 h-4" />
            <span>Design Portfolio</span>
          </button>
        </div>
      </div>
    </header>
  );
};
