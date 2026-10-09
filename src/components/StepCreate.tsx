import React, { useState } from 'react';
import { 
  Hammer, 
  Volume2, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2,
  Eye,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';
import { ProjectState, BuildStepItem } from '../types';
import { speakText } from '../utils/speech';

interface StepCreateProps {
  project: ProjectState;
  updateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  onAdvanceToNext: () => void;
  onGoBack: () => void;
}

export const StepCreate: React.FC<StepCreateProps> = ({
  project,
  updateProject,
  onAdvanceToNext,
  onGoBack,
}) => {
  const { create, plan } = project;
  const [newStepText, setNewStepText] = useState('');
  const [showBlueprintPreview, setShowBlueprintPreview] = useState(false);

  // Initialize build steps if empty
  const buildSteps = create.buildSteps.length > 0
    ? create.buildSteps
    : [
        { id: 'bs_1', stepNumber: 1, text: 'Gather all materials from your blueprint checklist', completed: false },
        { id: 'bs_2', stepNumber: 2, text: 'Measure and cut pieces carefully according to dimensions', completed: false },
        { id: 'bs_3', stepNumber: 3, text: 'Assemble the main structure or base frame', completed: false },
        { id: 'bs_4', stepNumber: 4, text: 'Attach moving parts, supports, or fasteners securely', completed: false },
      ];

  // Validation
  const hasSafetyPledge = create.safetyPledged;
  const allMaterialsGathered = plan.materials.length > 0 && plan.materials.every((m) => m.gathered);
  const completedStepsCount = buildSteps.filter((s) => s.completed).length;
  const hasCompletedSteps = completedStepsCount >= 2;
  const isComplete = hasSafetyPledge && hasCompletedSteps;

  const handleReadInstructions = () => {
    const text = `Step 4: CREATE! Put on your engineer hard hat! 
    Follow your blueprint carefully as you build your prototype. 
    First, agree to the Safety Pledge. 
    Second, check off each material as you collect it from the STEAM station. 
    Third, follow your build steps one by one. 
    And if you have to change something while building, write it in your engineering notes!`;
    speakText(text);
  };

  const toggleMaterialGathered = (matId: string) => {
    updateProject((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        materials: prev.plan.materials.map((m) =>
          m.id === matId ? { ...m, gathered: !m.gathered } : m
        ),
      },
    }));
  };

  const toggleStepCompleted = (stepId: string) => {
    const updated = buildSteps.map((s) =>
      s.id === stepId ? { ...s, completed: !s.completed } : s
    );
    updateProject((prev) => ({
      ...prev,
      create: { ...prev.create, buildSteps: updated },
    }));
  };

  const handleAddStep = () => {
    if (!newStepText.trim()) return;
    const newStep: BuildStepItem = {
      id: `bs_${Date.now()}`,
      stepNumber: buildSteps.length + 1,
      text: newStepText.trim(),
      completed: false,
    };
    updateProject((prev) => ({
      ...prev,
      create: { ...prev.create, buildSteps: [...buildSteps, newStep] },
    }));
    setNewStepText('');
  };

  const handleRemoveStep = (stepId: string) => {
    const filtered = buildSteps.filter((s) => s.id !== stepId);
    // Renumber
    const renumbered = filtered.map((s, idx) => ({ ...s, stepNumber: idx + 1 }));
    updateProject((prev) => ({
      ...prev,
      create: { ...prev.create, buildSteps: renumbered },
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-xs font-bold tracking-wider uppercase">
              Step 4 of 6
            </span>
            <span className="text-emerald-100 text-xs">
              Prototype Fabrication
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display">
            CREATE: Build Your Prototype
          </h2>
          <p className="text-emerald-100 text-sm mt-1 max-w-xl">
            Bring your blueprint to life! Gather your materials safely, follow your building steps, and note any changes you make as you build.
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
            onClick={() => setShowBlueprintPreview(true)}
            className="px-3.5 py-2 bg-white text-emerald-950 hover:bg-emerald-50 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
          >
            <Eye className="w-4 h-4 text-emerald-600" />
            <span>View Blueprint</span>
          </button>
        </div>
      </div>

      {/* Safety First Pledge Card */}
      <div className={`p-5 rounded-2xl border-2 transition-all ${
        create.safetyPledged 
          ? 'bg-emerald-50/50 border-emerald-300' 
          : 'bg-amber-50 border-amber-300'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className={`w-6 h-6 mt-0.5 shrink-0 ${
              create.safetyPledged ? 'text-emerald-600' : 'text-amber-600'
            }`} />
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display">
                STEAM Engineer Safety Pledge
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                I promise to use tools safely, handle scissors with care, keep our workspace clean, and ask a teacher if anything feels dangerous.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer shrink-0 bg-white px-4 py-2 rounded-xl border border-slate-300 hover:border-slate-400 shadow-2xs">
            <input
              type="checkbox"
              checked={create.safetyPledged}
              onChange={(e) =>
                updateProject((prev) => ({
                  ...prev,
                  create: { ...prev.create, safetyPledged: e.target.checked },
                }))
              }
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-800 whitespace-nowrap">
              I Pledge Safe Building
            </span>
          </label>
        </div>
      </div>

      {/* Two Column Layout: Materials Checkoff & Build Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Materials Gathered Checkoff */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-slate-900 font-display">
              1. Materials Gathering Checklist
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              {plan.materials.filter((m) => m.gathered).length}/{plan.materials.length} Collected
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Check off each material from your blueprint as you pick it up from the supply table:
          </p>

          <div className="space-y-2">
            {plan.materials.map((mat) => (
              <div
                key={mat.id}
                onClick={() => toggleMaterialGathered(mat.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  mat.gathered
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  {mat.gathered ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-400" />
                  )}
                  <div>
                    <span className={`text-xs font-bold ${mat.gathered ? 'line-through opacity-80' : ''}`}>
                      {mat.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Quantity: {mat.quantity}
                    </span>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  mat.gathered ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                }`}>
                  {mat.gathered ? 'Ready' : 'Needed'}
                </span>
              </div>
            ))}

            {plan.materials.length === 0 && (
              <div className="text-center py-4 text-xs text-slate-400 border border-dashed rounded-xl">
                No materials listed yet. Go back to Step 3 to add them!
              </div>
            )}
          </div>
        </div>

        {/* Building Steps Progress */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-slate-900 font-display">
                2. Construction Steps Log
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {completedStepsCount}/{buildSteps.length} Steps Done
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Check off each build step as you assemble your creation:
            </p>

            <div className="space-y-2 mb-4">
              {buildSteps.map((step) => (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    step.completed
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div
                    onClick={() => toggleStepCompleted(step.id)}
                    className="flex items-center gap-3 cursor-pointer flex-1 mr-2"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-mono text-slate-500 shrink-0">
                        {step.stepNumber}
                      </div>
                    )}
                    <span className={`text-xs font-semibold ${step.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                      {step.text}
                    </span>
                  </div>

                  {buildSteps.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(step.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Step */}
          <div className="flex gap-2 pt-2 border-t border-slate-100">
            <input
              type="text"
              value={newStepText}
              onChange={(e) => setNewStepText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddStep();
              }}
              placeholder="Add another build step..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddStep}
              disabled={!newStepText.trim()}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
            >
              Add Step
            </button>
          </div>
        </div>
      </div>

      {/* Adjustments & Adaptations Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 font-display mb-1">
          3. Real Engineer Adjustments (Changes Made While Building)
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Things don't always go exactly as drawn! What did you have to change or add while putting it together?
        </p>

        <textarea
          rows={3}
          value={create.buildNotes}
          onChange={(e) =>
            updateProject((prev) => ({
              ...prev,
              create: { ...prev.create, buildNotes: e.target.value },
            }))
          }
          placeholder="e.g. The craft sticks were too long, so we trimmed them. We also added an extra piece of tape around the wheel axle because it kept sliding."
          className="w-full p-3 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 resize-none leading-relaxed"
        />
      </div>

      {/* Blueprint Quick Preview Modal */}
      {showBlueprintPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Your Blueprint Reference
                </h3>
                <p className="text-xs text-slate-500">
                  Follow the labels and parts you drew in Step 3
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBlueprintPreview(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="border rounded-xl overflow-hidden mb-4 bg-slate-50">
              {plan.blueprintDataUrl ? (
                <img
                  src={plan.blueprintDataUrl}
                  alt="Drawn Blueprint"
                  className="w-full h-auto max-h-[350px] object-contain"
                />
              ) : (
                <div className="p-8 text-center text-xs text-slate-400">
                  No blueprint drawing saved.
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {plan.blueprintLabels.map((lbl, idx) => (
                <span
                  key={lbl.id}
                  className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <span className="w-3.5 h-3.5 rounded bg-blue-600 text-white text-[9px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {lbl.text}
                </span>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowBlueprintPreview(false)}
                className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Validation Checklist & Next Button */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGoBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Review Step 3 (Plan)</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 ${hasSafetyPledge ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasSafetyPledge ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            Safety Pledged
          </span>
          <span className={`flex items-center gap-1 ${hasCompletedSteps ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasCompletedSteps ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            {completedStepsCount}/2+ Build Steps Done
          </span>
        </div>

        <button
          type="button"
          disabled={!isComplete}
          onClick={onAdvanceToNext}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            isComplete
              ? 'bg-violet-600 hover:bg-violet-700 text-white active:scale-98 cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Prototype Built & Unlock Test</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
