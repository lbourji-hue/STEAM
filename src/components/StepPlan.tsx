import React, { useState } from 'react';
import { 
  Compass, 
  Volume2, 
  ArrowRight, 
  ChevronLeft, 
  CheckCircle2, 
  AlertCircle, 
  Package, 
  Tag, 
  Ruler, 
  Plus, 
  Trash2,
  Sparkles,
  Info
} from 'lucide-react';
import { ProjectState, BlueprintLabel, MaterialItem } from '../types';
import { DrawingCanvas } from './DrawingCanvas';
import { speakText } from '../utils/speech';

interface StepPlanProps {
  project: ProjectState;
  updateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  onAdvanceToNext: () => void;
  onGoBack: () => void;
}

export const StepPlan: React.FC<StepPlanProps> = ({
  project,
  updateProject,
  onAdvanceToNext,
  onGoBack,
}) => {
  const { plan, imagine } = project;

  const [newMatName, setNewMatName] = useState('');
  const [newMatQty, setNewMatQty] = useState('');

  // Find chosen idea title
  const chosenIdea = imagine.ideas.find((i) => i.id === imagine.chosenIdeaId);

  // Validation
  // 1. Must have drawn something on canvas (or blueprintDataUrl exists and is not empty)
  const hasDrawnBlueprint = Boolean(plan.blueprintDataUrl && plan.blueprintDataUrl.length > 500);
  // 2. Must have at least 2 labeled parts
  const hasLabels = plan.blueprintLabels.length >= 2;
  // 3. Must have at least 2 materials listed
  const hasMaterials = plan.materials.length >= 2;

  const isComplete = hasDrawnBlueprint && hasLabels && hasMaterials;

  const handleReadInstructions = () => {
    const text = `Step 3: PLAN! Before any builder touches wood, bricks, or tape, they draw a labelled blueprint! 
    Use the drawing tools to draw your chosen design. 
    Use the Label Pin tool to point to and name the important parts of your creation. 
    Then, list every material and tool you need, along with the quantity. 
    Once your blueprint is complete and labelled, you will unlock Step 4 to build!`;
    speakText(text);
  };

  const handleSaveCanvas = (dataUrl: string, labels: BlueprintLabel[]) => {
    updateProject((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        blueprintDataUrl: dataUrl,
        blueprintLabels: labels,
      },
    }));
  };

  const handleAddMaterial = () => {
    if (!newMatName.trim()) return;
    const item: MaterialItem = {
      id: `mat_${Date.now()}`,
      name: newMatName.trim(),
      quantity: newMatQty.trim() || '1 item',
      gathered: false,
    };
    updateProject((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        materials: [...prev.plan.materials, item],
      },
    }));
    setNewMatName('');
    setNewMatQty('');
  };

  const handleRemoveMaterial = (id: string) => {
    updateProject((prev) => ({
      ...prev,
      plan: {
        ...prev.plan,
        materials: prev.plan.materials.filter((m) => m.id !== id),
      },
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 bg-white/20 rounded-md text-xs font-bold tracking-wider uppercase">
              Step 3 of 6
            </span>
            <span className="text-blue-100 text-xs">
              Architectural & Engineering Drafting
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight font-display">
            PLAN: Draw a Labelled Blueprint
          </h2>
          <p className="text-blue-100 text-sm mt-1 max-w-xl">
            Draw your design with clear lines. Add <strong>labels to important parts</strong> and create your exact <strong>materials list</strong> before building starts!
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

      {/* Chosen Design Callout Banner */}
      {chosenIdea && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-1.5 bg-amber-100 rounded-xl">📐</span>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Blueprint Blueprint Target:
              </span>
              <span className="text-sm font-bold text-amber-950">
                {chosenIdea.title}
              </span>
              <p className="text-xs text-amber-900 mt-0.5 line-clamp-1">
                {chosenIdea.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Blueprint Canvas Studio */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900 font-display">
              1. Interactive Blueprint Drawing Area
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            Draw with finger or stylus. Tap <strong>+ Label Pin</strong> to label parts.
          </span>
        </div>

        {/* The Drawing Canvas */}
        <DrawingCanvas
          initialDataUrl={plan.blueprintDataUrl}
          labels={plan.blueprintLabels}
          onSave={handleSaveCanvas}
        />
      </div>

      {/* Two Column Grid: Labeled Parts & Materials List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Labeled Parts Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Tag className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                2. Important Parts & Labels ({plan.blueprintLabels.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Engineers label every part so anyone knows what it does. (Need at least 2).
            </p>

            <div className="space-y-2 mb-3">
              {plan.blueprintLabels.map((lbl, idx) => (
                <div
                  key={lbl.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-5 h-5 rounded-md text-white flex items-center justify-center text-[10px] font-bold"
                      style={{ backgroundColor: lbl.color || '#1e3a8a' }}
                    >
                      {idx + 1}
                    </span>
                    <span>{lbl.text}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Pos: ({lbl.x}%, {lbl.y}%)
                  </span>
                </div>
              ))}

              {plan.blueprintLabels.length === 0 && (
                <div className="p-4 border border-dashed border-amber-300 bg-amber-50/50 rounded-xl text-center text-xs text-amber-900">
                  👉 Click the <strong>"+ Label Pin"</strong> button on the canvas toolbar and tap on a part of your drawing!
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            💡 Label parts like: <em>"Support Beam"</em>, <em>"Wheel Axle"</em>, <em>"Tension Cable"</em>, <em>"Pillow Cushion"</em>
          </div>
        </div>

        {/* Materials & Tools List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900 font-display">
                3. Materials & Quantities ({plan.materials.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              What supplies and how much of each do you need? (Need at least 2).
            </p>

            {/* Quick Material Presets */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[
                { name: 'Cardboard', qty: '2 sheets' },
                { name: 'Craft Sticks', qty: '10 sticks' },
                { name: 'Masking Tape', qty: '30 cm' },
                { name: 'Scissors', qty: '1 pair' },
                { name: 'Straws', qty: '4 pieces' },
              ].map((m) => (
                <button
                  key={m.name}
                  type="button"
                  onClick={() => {
                    setNewMatName(m.name);
                    setNewMatQty(m.qty);
                  }}
                  className="px-2 py-0.5 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                >
                  + {m.name}
                </button>
              ))}
            </div>

            {/* List */}
            <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
              {plan.materials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{mat.name}</span>
                    <span className="text-slate-400 font-normal">({mat.quantity})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMaterial(mat.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {plan.materials.length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                  Add at least 2 materials to your blueprint list.
                </div>
              )}
            </div>
          </div>

          {/* Add input */}
          <div className="flex gap-2 pt-2">
            <input
              type="text"
              value={newMatName}
              onChange={(e) => setNewMatName(e.target.value)}
              placeholder="Material name (e.g. Paper cups)"
              className="flex-2 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <input
              type="text"
              value={newMatQty}
              onChange={(e) => setNewMatQty(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddMaterial();
              }}
              placeholder="Quantity (e.g. 3 cups)"
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddMaterial}
              disabled={!newMatName.trim()}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Dimensions & Construction Notes */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Ruler className="w-4 h-4 text-slate-400" />
            Estimated Dimensions & Measurements
          </label>
          <input
            type="text"
            value={plan.dimensions}
            onChange={(e) =>
              updateProject((prev) => ({
                ...prev,
                plan: { ...prev.plan, dimensions: e.target.value },
              }))
            }
            placeholder="e.g. Length: 25 cm, Height: 12 cm, Base: 10x10 cm"
            className="w-full px-3 py-2 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-slate-400" />
            Important Build Notes / Secret of the Design
          </label>
          <input
            type="text"
            value={plan.notes}
            onChange={(e) =>
              updateProject((prev) => ({
                ...prev,
                plan: { ...prev.plan, notes: e.target.value },
              }))
            }
            placeholder="e.g. Double-fold the cardboard edge to stop bending"
            className="w-full px-3 py-2 text-xs border-2 border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Validation Checklist & Next Button (Enforces Constraint 2) */}
      <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={onGoBack}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Review Step 2 (Imagine)</span>
        </button>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={`flex items-center gap-1 ${hasDrawnBlueprint ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasDrawnBlueprint ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            Blueprint Drawn
          </span>
          <span className={`flex items-center gap-1 ${hasLabels ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasLabels ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            {plan.blueprintLabels.length}/2+ Labelled Parts
          </span>
          <span className={`flex items-center gap-1 ${hasMaterials ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>
            {hasMaterials ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4" />}
            {plan.materials.length}/2+ Materials Listed
          </span>
        </div>

        <button
          type="button"
          disabled={!isComplete}
          onClick={onAdvanceToNext}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
            isComplete
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-98 cursor-pointer'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>Blueprint Approved & Unlock Create</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
