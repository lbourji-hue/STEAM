import React, { useState } from 'react';
import { 
  Wrench, 
  Volume2, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Award, 
  TrendingUp, 
  Lightbulb, 
  RotateCw,
  Heart
} from 'lucide-react';
import { ProjectState } from '../types';
import { speakText } from '../utils/speech';

interface StepImproveProps {
  project: ProjectState;
  updateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  onOpenPortfolio: () => void;
  onGoBack: () => void;
}

export const StepImprove: React.FC<StepImproveProps> = ({
  project,
  updateProject,
  onOpenPortfolio,
  onGoBack,
}) => {
  const { improve, test } = project;

  // Validation
  const hasWorked = improve.whatWorked.trim().length >= 8;
  const hasFailed = improve.whatFailed.trim().length >= 8;
  const hasImprovementIdea = improve.improvementIdea.trim().length >= 8;
  const hasChanges = improve.v2Changes.trim().length >= 8;
  const isComplete = hasWorked && hasFailed && hasImprovementIdea && hasChanges;

  const handleReadInstructions = () => {
    const text = `Step 6: IMPROVE! In engineering, there is no such thing as failure, only learning! 
    Every invention in the world was redesigned and improved over and over. 
    Reflect on your test results: what worked, what broke, and what can you do to make Version 2 even better? 
    Record your improvements, celebrate your hard work, and view your complete Engineering Design Portfolio!`;
    speakText(text);
  };

  const handleSentenceStarter = (field: keyof typeof improve, text: string) => {
    const current = (improve[field] as string) || '';
    const updated = current ? `${current} ${text}` : text;
    updateProject((prev) => ({
      ...prev,
      improve: { ...prev.improve, [field]: updated },
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-xs font-bold tracking-wider uppercase">
              Step 6 of 6
            </span>
            <span className="text-rose-100 text-xs">
              Iterative Redesign & Reflection
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display">
            IMPROVE: Learn, Redesign & Iterate!
          </h2>
          <p className="text-rose-100 text-sm mt-1 max-w-xl">
            Real engineers never stop at Version 1! Look at your test results, figure out what failed, and make improvements to make it stronger and better.
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

      {/* Two Column Grid: What Worked vs What Needs Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* What Worked Well */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                1. What Worked Really Well?
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              What parts were sturdy, worked as planned, and should definitely stay in Version 2?
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {['The base stood firmly', 'The wheels rolled freely', 'The tape held tight'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSentenceStarter('whatWorked', s)}
                  className="px-2 py-0.5 text-[11px] bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200"
                >
                  + "{s}"
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={improve.whatWorked}
              onChange={(e) =>
                updateProject((prev) => ({
                  ...prev,
                  improve: { ...prev.improve, whatWorked: e.target.value },
                }))
              }
              placeholder="e.g. The cardboard pier pillars did not collapse at all. They supported the first 15 coins easily."
              className="w-full p-3 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* What Failed or Needs Work */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                2. What Broke, Bent, or Failed?
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Where did the design struggle? What caused it to fall short of your goal?
            </p>

            <div className="flex flex-wrap gap-1 mb-2">
              {['The center sagged', 'The joints separated', 'Too heavy on top'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSentenceStarter('whatFailed', s)}
                  className="px-2 py-0.5 text-[11px] bg-rose-50 text-rose-800 rounded-md border border-rose-200"
                >
                  + "{s}"
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={improve.whatFailed}
              onChange={(e) =>
                updateProject((prev) => ({
                  ...prev,
                  improve: { ...prev.improve, whatFailed: e.target.value },
                }))
              }
              placeholder="e.g. The middle of the span bent down into the river because we did not add diagonal triangles underneath."
              className="w-full p-3 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Redesign & Version 2 Changes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900 font-display">
            3. Your Version 2.0 Improvement Plan
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          How did you modify or rebuild your design to overcome the problem?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Your Big Improvement Idea
            </label>
            <textarea
              rows={3}
              value={improve.improvementIdea}
              onChange={(e) =>
                updateProject((prev) => ({
                  ...prev,
                  improve: { ...prev.improve, improvementIdea: e.target.value },
                }))
              }
              placeholder="e.g. Add 4 craft sticks in a triangle truss pattern right under the middle joint to distribute weight."
              className="w-full p-3 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Specific Changes Made to Prototype 2.0
            </label>
            <textarea
              rows={3}
              value={improve.v2Changes}
              onChange={(e) =>
                updateProject((prev) => ({
                  ...prev,
                  improve: { ...prev.improve, v2Changes: e.target.value },
                }))
              }
              placeholder="e.g. 1) Doubled the folded paper thickness. 2) Used cross-tape wraps instead of single strips. 3) Trimmed side weight."
              className="w-full p-3 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Re-test result outcome */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Version 2.0 Re-Test Result & Comparison
            </label>
            <input
              type="text"
              value={improve.v2TestOutcome}
              onChange={(e) =>
                updateProject((prev) => ({
                  ...prev,
                  improve: { ...prev.improve, v2TestOutcome: e.target.value },
                }))
              }
              placeholder="e.g. Version 1 held 22 coins. Version 2 held 38 coins without bending!"
              className="w-full px-3 py-2 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-rose-500" />
              Engineer Reflection: What did this process teach you?
            </label>
            <input
              type="text"
              value={improve.reflectionLearned}
              onChange={(e) =>
                updateProject((prev) => ({
                  ...prev,
                  improve: { ...prev.improve, reflectionLearned: e.target.value },
                }))
              }
              placeholder="e.g. Mistakes helped us discover where our structure needed extra support!"
              className="w-full px-3 py-2 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* STEAM Engineer Award Certificate Card */}
      {isComplete && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner shrink-0">
              🏆
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
                Official Engineering Achievement
              </span>
              <h3 className="text-xl font-black font-display">
                Certified STEAM Engineer!
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                Awarded to <strong>{project.engineerName || 'Super Engineer'}</strong> for completing all 6 steps of the Engineering Design Process.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPortfolio}
            className="px-6 py-3.5 bg-white text-amber-950 hover:bg-amber-50 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-sm shrink-0 active:scale-98"
          >
            <FileText className="w-4 h-4 text-amber-600" />
            <span>Open & Print Engineering Portfolio</span>
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGoBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Review Step 5 (Test)</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 ${isComplete ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {isComplete ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            Reflection & V2 Plan Complete
          </span>
        </div>

        <button
          type="button"
          onClick={onOpenPortfolio}
          className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
        >
          <FileText className="w-4 h-4" />
          <span>View Complete Design Portfolio</span>
        </button>
      </div>
    </div>
  );
};
