import React, { useState } from 'react';
import { 
  Beaker, 
  Volume2, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Check, 
  X, 
  Minus, 
  Plus, 
  ClipboardCheck, 
  BarChart2, 
  Trophy 
} from 'lucide-react';
import { ProjectState, TrialResult } from '../types';
import { speakText } from '../utils/speech';

interface StepTestProps {
  project: ProjectState;
  updateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  onAdvanceToNext: () => void;
  onGoBack: () => void;
}

export const StepTest: React.FC<StepTestProps> = ({
  project,
  updateProject,
  onAdvanceToNext,
  onGoBack,
}) => {
  const { test, ask } = project;
  const [activeTrialIdx, setActiveTrialIdx] = useState(0);

  // Initialize first trial if trials array is empty
  const trials: TrialResult[] = test.trials.length > 0
    ? test.trials
    : [
        {
          id: `tr_${Date.now()}_1`,
          trialNumber: 1,
          criterionChecks: {},
          overallNotes: '',
        },
      ];

  const currentTrial = trials[activeTrialIdx] || trials[0];

  // Validation
  // Check if at least 1 trial has checks for all criteria
  const hasTrialResults = trials.some((tr) => {
    return ask.criteria.length > 0 && ask.criteria.every((c) => tr.criterionChecks[c]?.status);
  });

  const isComplete = hasTrialResults;

  const handleReadInstructions = () => {
    const text = `Step 5: TEST! It is experiment time! 
    Test your prototype against the success criteria you decided in Step 1. 
    Did it pass? Measure your results carefully with real numbers, like how many coins it held, or how many centimeters it traveled. 
    Record what happened in Trial 1, and you can even run Trial 2 and 3!`;
    speakText(text);
  };

  const handleUpdateCheck = (
    criterion: string,
    status: 'yes' | 'partial' | 'no',
    measurement?: string,
    notes?: string
  ) => {
    const updatedTrials = trials.map((tr, idx) => {
      if (idx !== activeTrialIdx) return tr;
      const existing = tr.criterionChecks[criterion] || { status: 'yes', measurement: '', notes: '' };
      return {
        ...tr,
        criterionChecks: {
          ...tr.criterionChecks,
          [criterion]: {
            ...existing,
            status,
            ...(measurement !== undefined ? { measurement } : {}),
            ...(notes !== undefined ? { notes } : {}),
          },
        },
      };
    });

    updateProject((prev) => ({
      ...prev,
      test: { ...prev.test, trials: updatedTrials },
    }));
  };

  const handleUpdateOverallNotes = (notes: string) => {
    const updatedTrials = trials.map((tr, idx) =>
      idx === activeTrialIdx ? { ...tr, overallNotes: notes } : tr
    );
    updateProject((prev) => ({
      ...prev,
      test: { ...prev.test, trials: updatedTrials },
    }));
  };

  const handleAddTrial = () => {
    if (trials.length >= 5) return;
    const newTrial: TrialResult = {
      id: `tr_${Date.now()}_${trials.length + 1}`,
      trialNumber: trials.length + 1,
      criterionChecks: {},
      overallNotes: '',
    };
    const updatedTrials = [...trials, newTrial];
    updateProject((prev) => ({
      ...prev,
      test: { ...prev.test, trials: updatedTrials },
    }));
    setActiveTrialIdx(updatedTrials.length - 1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-xs font-bold tracking-wider uppercase">
              Step 5 of 6
            </span>
            <span className="text-violet-100 text-xs">
              Scientific Testing Laboratory
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display">
            TEST: Check Against Success Criteria
          </h2>
          <p className="text-violet-100 text-sm mt-1 max-w-xl">
            Test your invention fairly! Record real measurements, see where it was strong, and discover where it can be made better.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleReadInstructions}
            className="px-3.5 py-2 bg-white/15 hover:bg-white/25 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-white/20"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read to Me</span>
          </button>
        </div>
      </div>

      {/* Trial Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto">
          {trials.map((tr, idx) => (
            <button
              key={tr.id}
              type="button"
              onClick={() => setActiveTrialIdx(idx)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTrialIdx === idx
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>Test Trial 0{tr.trialNumber}</span>
              {ask.criteria.every((c) => tr.criterionChecks[c]?.status) && (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
          ))}
        </div>

        {trials.length < 5 && (
          <button
            type="button"
            onClick={handleAddTrial}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 ml-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Trial</span>
          </button>
        )}
      </div>

      {/* Criteria Testing Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-violet-600" />
            <span>Success Criteria Testing: Trial 0{currentTrial.trialNumber}</span>
          </h3>
          <span className="text-xs text-slate-500">
            Defined in Step 1 (Ask)
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-5">
          Mark whether your prototype achieved each goal, and write down your exact measured result!
        </p>

        {ask.criteria.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400 border border-dashed rounded-xl">
            No success criteria were set in Step 1. Please go back to Step 1 to add what you are testing!
          </div>
        ) : (
          <div className="space-y-4">
            {ask.criteria.map((criterion, idx) => {
              const checkData = currentTrial.criterionChecks[criterion] || {
                status: undefined,
                measurement: '',
                notes: '',
              };

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  {/* Criterion Title */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {criterion}
                      </span>
                    </div>

                    {/* Notes on what happened */}
                    <div className="mt-2">
                      <input
                        type="text"
                        value={checkData.notes || ''}
                        onChange={(e) =>
                          handleUpdateCheck(
                            criterion,
                            checkData.status || 'yes',
                            checkData.measurement,
                            e.target.value
                          )
                        }
                        placeholder="What happened during testing? (e.g. slight wobble, held firmly)"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  {/* Measurement input */}
                  <div className="w-full md:w-44 shrink-0">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      Measurement / Score
                    </label>
                    <input
                      type="text"
                      value={checkData.measurement || ''}
                      onChange={(e) =>
                        handleUpdateCheck(
                          criterion,
                          checkData.status || 'yes',
                          e.target.value,
                          checkData.notes
                        )
                      }
                      placeholder="e.g. 24 coins / 1.8 m"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-violet-500 font-mono font-medium"
                    />
                  </div>

                  {/* Status Buttons: Pass / Almost / Needs Work */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateCheck(
                          criterion,
                          'yes',
                          checkData.measurement,
                          checkData.notes
                        )
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        checkData.status === 'yes'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Passed!</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateCheck(
                          criterion,
                          'partial',
                          checkData.measurement,
                          checkData.notes
                        )
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        checkData.status === 'partial'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Minus className="w-3.5 h-3.5" />
                      <span>Almost</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateCheck(
                          criterion,
                          'no',
                          checkData.measurement,
                          checkData.notes
                        )
                      }
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        checkData.status === 'no'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Needs Work</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Trial Scientific Observations */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 font-display mb-1">
          Trial 0{currentTrial.trialNumber} Observations & Data Notes
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          What did you observe with your eyes and ears? Where did the structure bend, slide, or hold tightest?
        </p>

        <textarea
          rows={3}
          value={currentTrial.overallNotes}
          onChange={(e) => handleUpdateOverallNotes(e.target.value)}
          placeholder="e.g. When we added coin #18, the bridge began bowing down. At coin #22, the center joint snapped. The side piers held strong without slipping."
          className="w-full p-3 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
        />
      </div>

      {/* Validation Checklist & Next Button */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGoBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Review Step 4 (Create)</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 ${hasTrialResults ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasTrialResults ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            Criteria Evaluated in Trial 0{currentTrial.trialNumber}
          </span>
        </div>

        <button
          type="button"
          disabled={!isComplete}
          onClick={onAdvanceToNext}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            isComplete
              ? 'bg-rose-600 hover:bg-rose-700 text-white active:scale-98 cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Testing Complete & Unlock Improve</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
