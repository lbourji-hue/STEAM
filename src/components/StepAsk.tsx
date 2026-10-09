import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Trash2, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Lightbulb, 
  Users, 
  ShieldAlert, 
  Target 
} from 'lucide-react';
import { ProjectState } from '../types';
import { speakText } from '../utils/speech';
import { SAMPLE_CHALLENGES } from '../data/sampleChallenges';

interface StepAskProps {
  project: ProjectState;
  updateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  onAdvanceToNext: () => void;
}

export const StepAsk: React.FC<StepAskProps> = ({
  project,
  updateProject,
  onAdvanceToNext,
}) => {
  const [newConstraint, setNewConstraint] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [showChallengePicker, setShowChallengePicker] = useState(false);

  const { ask } = project;

  // Validation
  const hasProblem = ask.problemStatement.trim().length >= 10;
  const hasConstraints = ask.constraints.length >= 1;
  const hasCriteria = ask.criteria.length >= 1;
  const isComplete = hasProblem && hasConstraints && hasCriteria;

  const handleReadInstructions = () => {
    const text = `Step 1: ASK! Every great engineer starts with a question. 
    First, what is the problem you need to solve? 
    Second, who is this design for? 
    Third, what are your constraints, like rules and materials? 
    And fourth, what are your success criteria? How will you test and know that your invention really worked?`;
    speakText(text);
  };

  const handleApplyTemplate = (challengeId: string) => {
    const template = SAMPLE_CHALLENGES.find((c) => c.id === challengeId);
    if (!template) return;

    updateProject((prev) => ({
      ...prev,
      title: template.title,
      ask: {
        problemStatement: template.problem,
        targetUser: template.targetUser,
        constraints: [...template.starterConstraints],
        criteria: [...template.starterCriteria],
      },
      plan: {
        ...prev.plan,
        materials: template.starterMaterials.map((m, i) => ({
          id: `mat_${i}`,
          name: m.name,
          quantity: m.quantity,
          gathered: false,
        })),
      },
    }));
    setShowChallengePicker(false);
  };

  const addConstraint = (text: string) => {
    if (!text.trim()) return;
    updateProject((prev) => ({
      ...prev,
      ask: {
        ...prev.ask,
        constraints: [...prev.ask.constraints, text.trim()],
      },
    }));
    setNewConstraint('');
  };

  const removeConstraint = (index: number) => {
    updateProject((prev) => ({
      ...prev,
      ask: {
        ...prev.ask,
        constraints: prev.ask.constraints.filter((_, i) => i !== index),
      },
    }));
  };

  const addCriterion = (text: string) => {
    if (!text.trim()) return;
    updateProject((prev) => ({
      ...prev,
      ask: {
        ...prev.ask,
        criteria: [...prev.ask.criteria, text.trim()],
      },
    }));
    setNewCriterion('');
  };

  const removeCriterion = (index: number) => {
    updateProject((prev) => ({
      ...prev,
      ask: {
        ...prev.ask,
        criteria: prev.ask.criteria.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSentenceStarter = (starter: string) => {
    const current = ask.problemStatement;
    const combined = current ? `${current} ${starter}` : starter;
    updateProject((prev) => ({
      ...prev,
      ask: { ...prev.ask, problemStatement: combined },
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Step Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-xs font-bold tracking-wider uppercase">
              Step 1 of 6
            </span>
            <span className="text-amber-100 text-xs">
              Engineering Design Process
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display">
            ASK: Define the Problem & Goal
          </h2>
          <p className="text-amber-100 text-sm mt-1 max-w-xl">
            Engineers don't start building until they know the exact problem, the rules (constraints), and how they will judge success!
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

          <button
            type="button"
            onClick={() => setShowChallengePicker(true)}
            className="px-3.5 py-2 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>STEAM Challenge Ideas</span>
          </button>
        </div>
      </div>

      {/* Challenge Title & Engineer Info */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Challenge / Project Title
          </label>
          <input
            type="text"
            value={project.title}
            onChange={(e) =>
              updateProject((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="e.g. The Super Strong Cardboard Bridge"
            className="w-full px-3.5 py-2.5 text-base font-bold text-slate-800 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Engineer's Name (or Team)
          </label>
          <input
            type="text"
            value={project.engineerName}
            onChange={(e) =>
              updateProject((prev) => ({ ...prev, engineerName: e.target.value }))
            }
            placeholder="e.g. Leo & Maya (Team Rockets)"
            className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-800 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Problem Definition & Sentence Starters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              1. What is the Problem we need to solve?
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            {ask.problemStatement.length} characters
          </span>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          Clearly describe what is happening, what challenge is faced, and what goal you want to accomplish.
        </p>

        {/* Helpful Sentence Starters for Grades 2-5 */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="text-xs font-bold text-slate-400 mr-1">Sentence starters:</span>
          {[
            'We need to build a...',
            'The problem is that...',
            'Our goal is to safely...',
            'It must be able to...',
          ].map((starter) => (
            <button
              key={starter}
              type="button"
              onClick={() => handleSentenceStarter(starter)}
              className="px-2.5 py-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-colors font-medium"
            >
              + "{starter}"
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          value={ask.problemStatement}
          onChange={(e) =>
            updateProject((prev) => ({
              ...prev,
              ask: { ...prev.ask, problemStatement: e.target.value },
            }))
          }
          placeholder="Example: Our toy cars cannot cross the river canyon. We need to design a lightweight bridge that spans 25 cm and holds weight without falling down."
          className="w-full p-3.5 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
        />

        {/* Who is it for? */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-slate-400" />
            Who is this design for? (Target User / Community)
          </label>
          <input
            type="text"
            value={ask.targetUser}
            onChange={(e) =>
              updateProject((prev) => ({
                ...prev,
                ask: { ...prev.ask, targetUser: e.target.value },
              }))
            }
            placeholder="e.g. Travelers crossing the canyon, classroom robots, astronauts landing on Mars"
            className="w-full px-3.5 py-2 text-sm border-2 border-slate-200 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Two Column Grid: Constraints & Success Criteria */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Constraints (Limits & Rules) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                2. Constraints (Rules & Limits)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              What limits us? (e.g. Size limits, allowed materials, time limit, budget)
            </p>

            {/* Quick constraint tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                'Must span 25 cm',
                'Only cardboard & tape',
                'Max height 35 cm',
                'Time limit: 45 min',
                'Cannot touch the ground',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addConstraint(chip)}
                  className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>

            {/* Constraints List */}
            <div className="space-y-2 mb-3">
              {ask.constraints.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeConstraint(idx)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {ask.constraints.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Add at least 1 rule or constraint (e.g., allowed materials).
                </div>
              )}
            </div>
          </div>

          {/* Add input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addConstraint(newConstraint);
              }}
              placeholder="Type a new rule/constraint..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={() => addConstraint(newConstraint)}
              disabled={!newConstraint.trim()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Success Criteria (How we test & judge success) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-5 h-5 text-emerald-500" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                3. Success Criteria (Goal Tests)
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              How will you know your design worked? Give a measurable target!
            </p>

            {/* Quick criteria tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                'Holds at least 20 coins',
                'Rolls 1.5 meters straight',
                'Egg does not crack on drop',
                'Stands strong for 15 seconds',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => addCriterion(chip)}
                  className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  + {chip}
                </button>
              ))}
            </div>

            {/* Criteria List */}
            <div className="space-y-2 mb-3">
              {ask.criteria.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-medium text-slate-800"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeCriterion(idx)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {ask.criteria.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Add at least 1 measurable test criteria (e.g., holds 20 coins).
                </div>
              )}
            </div>
          </div>

          {/* Add input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newCriterion}
              onChange={(e) => setNewCriterion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCriterion(newCriterion);
              }}
              placeholder="Type a success goal..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={() => addCriterion(newCriterion)}
              disabled={!newCriterion.trim()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Validation Checklist & Next Button (Enforces Constraint 1) */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 w-full sm:w-auto">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Step 1 Readiness Checklist:
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className={`flex items-center gap-1 ${hasProblem ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
              {hasProblem ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
              Problem Defined
            </span>
            <span className={`flex items-center gap-1 ${hasConstraints ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
              {hasConstraints ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
              {ask.constraints.length} Constraints
            </span>
            <span className={`flex items-center gap-1 ${hasCriteria ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
              {hasCriteria ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
              {ask.criteria.length} Success Criteria
            </span>
          </div>
        </div>

        <button
          type="button"
          disabled={!isComplete}
          onClick={onAdvanceToNext}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            isComplete
              ? 'bg-amber-600 hover:bg-amber-700 text-white active:scale-98 cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Complete Step 1 & Unlock Imagine</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Sample Challenges Modal */}
      {showChallengePicker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Select a STEAM Challenge
                </h3>
                <p className="text-xs text-slate-500">
                  Pick one of these classroom engineering challenges or write your own!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowChallengePicker(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SAMPLE_CHALLENGES.map((ch) => (
                <div
                  key={ch.id}
                  onClick={() => handleApplyTemplate(ch.id)}
                  className="p-4 rounded-xl border-2 border-slate-200 hover:border-amber-500 hover:bg-amber-50/40 transition-all cursor-pointer flex items-start gap-4"
                >
                  <span className="text-3xl p-2 bg-slate-100 rounded-xl shrink-0">
                    {ch.icon}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900">
                        {ch.title}
                      </h4>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {ch.grade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {ch.tagline}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
