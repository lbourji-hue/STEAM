import React from 'react';
import { Check, Lock, ArrowRight, HelpCircle, Lightbulb, Compass, Hammer, Beaker, Wrench } from 'lucide-react';
import { StepId } from '../types';

interface StepProgressProps {
  currentStep: StepId;
  maxUnlockedStep: StepId;
  onSelectStep: (step: StepId) => void;
}

interface StepInfo {
  id: StepId;
  name: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const STEPS: StepInfo[] = [
  { id: 1, name: 'ASK', tagline: 'Define the Problem', icon: HelpCircle, color: 'text-amber-500' },
  { id: 2, name: 'IMAGINE', tagline: 'Brainstorm 3+ Ideas', icon: Lightbulb, color: 'text-amber-400' },
  { id: 3, name: 'PLAN', tagline: 'Labelled Blueprint', icon: Compass, color: 'text-blue-500' },
  { id: 4, name: 'CREATE', tagline: 'Build Prototype', icon: Hammer, color: 'text-emerald-500' },
  { id: 5, name: 'TEST', tagline: 'Check Success Criteria', icon: Beaker, color: 'text-violet-500' },
  { id: 6, name: 'IMPROVE', tagline: 'Iterate & Redesign', icon: Wrench, color: 'text-rose-500' },
];

export const StepProgress: React.FC<StepProgressProps> = ({
  currentStep,
  maxUnlockedStep,
  onSelectStep,
}) => {
  const completedCount = STEPS.filter((s) => s.id < currentStep || (s.id === 6 && maxUnlockedStep === 6)).length;
  const progressPercent = Math.round(((maxUnlockedStep - 1) / 5) * 100);

  return (
    <div className="no-print bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Engineering Design Process
          </span>
          <span className="text-xs text-slate-400">·</span>
          <span className="text-xs font-bold text-indigo-600">
            Step {currentStep} of 6
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-24 sm:w-36 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-bold text-slate-600">
            {progressPercent}% Unlocked
          </span>
        </div>
      </div>

      {/* Grid of Steps for iPad Touch Targets */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {STEPS.map((s) => {
          const isCompleted = s.id < currentStep;
          const isCurrent = s.id === currentStep;
          const isUnlocked = s.id <= maxUnlockedStep;
          const Icon = s.icon;

          return (
            <button
              key={s.id}
              type="button"
              disabled={!isUnlocked}
              onClick={() => onSelectStep(s.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[76px] ${
                isCurrent
                  ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                  : isUnlocked
                  ? 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                  : 'border-slate-100 bg-slate-50 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400">
                  0{s.id}
                </span>

                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                    ★
                  </div>
                ) : isUnlocked ? (
                  <Icon className={`w-4 h-4 ${s.color}`} />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                )}
              </div>

              <div>
                <div className={`text-xs font-bold ${isCurrent ? 'text-indigo-950 font-display' : 'text-slate-800'}`}>
                  {s.name}
                </div>
                <div className="text-[10px] text-slate-500 truncate">
                  {s.tagline}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
