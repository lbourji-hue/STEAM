import React, { useState } from 'react';
import { 
  Lightbulb, 
  Plus, 
  Trash2, 
  Volume2, 
  ArrowRight, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  Trophy, 
  Sparkles,
  Layers,
  ChevronLeft
} from 'lucide-react';
import { ProjectState, BrainstormIdea } from '../types';
import { speakText } from '../utils/speech';

interface StepImagineProps {
  project: ProjectState;
  updateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  onAdvanceToNext: () => void;
  onGoBack: () => void;
}

export const StepImagine: React.FC<StepImagineProps> = ({
  project,
  updateProject,
  onAdvanceToNext,
  onGoBack,
}) => {
  const { imagine, ask } = project;

  // Initialize with 3 template ideas if empty
  const ideas = imagine.ideas.length >= 3 
    ? imagine.ideas 
    : [
        ...imagine.ideas,
        ...Array.from({ length: Math.max(0, 3 - imagine.ideas.length) }).map((_, i) => ({
          id: `idea_${Date.now()}_${i}`,
          title: `Idea ${imagine.ideas.length + i + 1}`,
          description: '',
          pro: '',
          challenge: '',
          rating: 4,
        })),
      ];

  // Validation
  const validIdeasCount = ideas.filter(
    (item) => item.title.trim() && item.description.trim().length >= 8
  ).length;
  const hasAtLeast3Ideas = validIdeasCount >= 3;
  const hasChosenWinner = Boolean(imagine.chosenIdeaId);
  const hasReason = imagine.selectionReason.trim().length >= 10;
  const isComplete = hasAtLeast3Ideas && hasChosenWinner && hasReason;

  const handleReadInstructions = () => {
    const text = `Step 2: IMAGINE! Never stop at just your very first idea. 
    Engineers brainstorm at least three different creative solutions! 
    Think outside the box. For each idea, write how it works, what makes it great, and what might be tricky. 
    Then, compare your ideas and select your winning design to build in the next step!`;
    speakText(text);
  };

  const handleUpdateIdea = (id: string, updates: Partial<BrainstormIdea>) => {
    const updated = ideas.map((idea) => (idea.id === id ? { ...idea, ...updates } : idea));
    updateProject((prev) => ({
      ...prev,
      imagine: { ...prev.imagine, ideas: updated },
    }));
  };

  const handleAddIdea = () => {
    const newIdea: BrainstormIdea = {
      id: `idea_${Date.now()}`,
      title: `Idea ${ideas.length + 1}`,
      description: '',
      pro: '',
      challenge: '',
      rating: 3,
    };
    const updated = [...ideas, newIdea];
    updateProject((prev) => ({
      ...prev,
      imagine: { ...prev.imagine, ideas: updated },
    }));
  };

  const handleRemoveIdea = (id: string) => {
    if (ideas.length <= 3) {
      alert('Engineers need at least 3 brainstormed ideas to compare!');
      return;
    }
    const updated = ideas.filter((idea) => idea.id !== id);
    const updatedWinner = imagine.chosenIdeaId === id ? '' : imagine.chosenIdeaId;
    updateProject((prev) => ({
      ...prev,
      imagine: { ...prev.imagine, ideas: updated, chosenIdeaId: updatedWinner },
    }));
  };

  const handleChooseWinner = (id: string) => {
    updateProject((prev) => ({
      ...prev,
      imagine: { ...prev.imagine, chosenIdeaId: id },
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 rounded-2xl p-6 text-slate-950 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-black/10 rounded-md text-xs font-bold tracking-wider uppercase text-slate-900">
              Step 2 of 6
            </span>
            <span className="text-amber-950/70 text-xs font-semibold">
              Brainstorming Solutions
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display">
            IMAGINE: Brainstorm Several Ideas
          </h2>
          <p className="text-amber-950/80 text-sm mt-1 max-w-xl">
            Great inventors don't just pick the very first thought. You must invent <strong>at least 3 different ways</strong> to solve the problem before choosing your best blueprint!
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={handleReadInstructions}
            className="px-3.5 py-2 bg-black/10 hover:bg-black/15 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors text-slate-900"
          >
            <Volume2 className="w-4 h-4" />
            <span>Read to Me</span>
          </button>
        </div>
      </div>

      {/* Quick Problem & Criteria Reminder Strip */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-blue-950">
        <div>
          <span className="font-bold text-blue-800 uppercase tracking-wider block">
            Remember the Problem from Step 1:
          </span>
          <p className="text-blue-900 line-clamp-1 italic mt-0.5">
            "{ask.problemStatement || 'Problem defined in Step 1'}"
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] shrink-0 font-medium">
          <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-lg">
            {ask.constraints.length} Constraints
          </span>
          <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
            {ask.criteria.length} Criteria to Meet
          </span>
        </div>
      </div>

      {/* Ideas Brainstorm Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>Your Brainstormed Ideas ({ideas.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Fill in each idea with how it works, what's great about it, and what could be tricky.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddIdea}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Another Idea</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ideas.map((idea, index) => {
            const isWinner = imagine.chosenIdeaId === idea.id;
            const isFilled = idea.title.trim() && idea.description.trim().length >= 8;

            return (
              <div
                key={idea.id}
                className={`bg-white rounded-2xl border-2 transition-all p-5 flex flex-col justify-between shadow-xs ${
                  isWinner
                    ? 'border-amber-500 ring-2 ring-amber-400/30'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Bar of Idea Card */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      IDEA 0{index + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      {/* Star Rating for Child Self-Assessment */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleUpdateIdea(idea.id, { rating: star })}
                            className="p-0.5"
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                star <= idea.rating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      {ideas.length > 3 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveIdea(idea.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                          title="Remove Idea"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Idea Title */}
                  <div className="mb-3">
                    <input
                      type="text"
                      value={idea.title}
                      onChange={(e) => handleUpdateIdea(idea.id, { title: e.target.value })}
                      placeholder={`e.g. Triangle Truss Bridge`}
                      className="w-full px-3 py-2 text-sm font-bold text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* How it works */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                      How does this idea work?
                    </label>
                    <textarea
                      rows={3}
                      value={idea.description}
                      onChange={(e) =>
                        handleUpdateIdea(idea.id, { description: e.target.value })
                      }
                      placeholder="Explain how it solves the challenge..."
                      className="w-full p-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 resize-none"
                    />
                  </div>

                  {/* Pro & Challenge */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-700 uppercase mb-0.5">
                        👍 What makes this great? (Pros)
                      </label>
                      <input
                        type="text"
                        value={idea.pro}
                        onChange={(e) => handleUpdateIdea(idea.id, { pro: e.target.value })}
                        placeholder="e.g. Triangles are very stiff and strong"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-rose-700 uppercase mb-0.5">
                        ⚠️ What might be tricky? (Cons)
                      </label>
                      <input
                        type="text"
                        value={idea.challenge}
                        onChange={(e) =>
                          handleUpdateIdea(idea.id, { challenge: e.target.value })
                        }
                        placeholder="e.g. Takes more tape and careful folding"
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Choose this Idea Button */}
                <button
                  type="button"
                  onClick={() => handleChooseWinner(idea.id)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    isWinner
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Trophy className="w-4 h-4" />
                  <span>{isWinner ? '★ Selected Winning Idea' : 'Choose this Solution'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Decision Section: Why was this chosen? */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-900 font-display">
            Selected Solution & Engineering Justification
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Real engineers must explain their design choice with evidence from their criteria and constraints.
        </p>

        {imagine.chosenIdeaId ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Chosen Solution:
              </span>
              <span className="text-sm font-bold text-amber-950">
                {ideas.find((i) => i.id === imagine.chosenIdeaId)?.title || 'Selected Design'}
              </span>
            </div>
            <span className="text-xs font-semibold text-amber-800 bg-amber-200/60 px-3 py-1 rounded-full">
              Ready for Blueprint
            </span>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-400 mb-4">
            Click "Choose this Solution" on one of your brainstormed cards above!
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Why did you pick this idea over the others?
          </label>
          <textarea
            rows={3}
            value={imagine.selectionReason}
            onChange={(e) =>
              updateProject((prev) => ({
                ...prev,
                imagine: { ...prev.imagine, selectionReason: e.target.value },
              }))
            }
            placeholder="Explain how this idea best fits your constraints and will achieve your success criteria. (e.g. We chose this because the triangle supports will distribute weight evenly without using too much tape.)"
            className="w-full p-3 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Bottom Navigation & Validation Checklist (Constraint 1) */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGoBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Review Step 1 (Ask)</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 ${hasAtLeast3Ideas ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasAtLeast3Ideas ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            {validIdeasCount}/3 Ideas Detailed
          </span>
          <span className={`flex items-center gap-1 ${hasChosenWinner ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasChosenWinner ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            Winner Selected
          </span>
          <span className={`flex items-center gap-1 ${hasReason ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasReason ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            Reason Explained
          </span>
        </div>

        <button
          type="button"
          disabled={!isComplete}
          onClick={onAdvanceToNext}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            isComplete
              ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-98 cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Complete Step 2 & Unlock Plan (Blueprint)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
