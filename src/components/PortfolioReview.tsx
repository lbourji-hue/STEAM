import React from 'react';
import { 
  Printer, 
  Download, 
  Upload, 
  ArrowLeft, 
  CheckCircle2, 
  Trophy, 
  FileText, 
  Calendar, 
  User, 
  Compass, 
  Tag, 
  Package, 
  Beaker, 
  Wrench,
  Sparkles
} from 'lucide-react';
import { ProjectState } from '../types';

interface PortfolioReviewProps {
  project: ProjectState;
  onClose: () => void;
  onImportProject: (imported: ProjectState) => void;
}

export const PortfolioReview: React.FC<PortfolioReviewProps> = ({
  project,
  onClose,
  onImportProject,
}) => {
  const { ask, imagine, plan, create, test, improve } = project;
  const chosenIdea = imagine.ideas.find((i) => i.id === imagine.chosenIdeaId);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${(project.title || 'STEAM_Engineering_Project').replace(/[^a-z0-9]/gi, '_')}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.ask && parsed.plan) {
          onImportProject(parsed);
          alert('Project loaded successfully!');
        } else {
          alert('Invalid project file format.');
        }
      } catch (err) {
        alert('Could not read project file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-4 sm:px-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>

        <div className="flex items-center gap-2">
          <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Load File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Backup File</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Portfolio Sheet */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">
                <span>STEAM Engineering Design Portfolio</span>
                <span>·</span>
                <span>Grades 2–5</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 font-display tracking-tight">
                {project.title || 'STEAM Engineering Challenge'}
              </h1>
            </div>

            <div className="flex flex-col text-xs text-slate-600 sm:text-right shrink-0">
              <span className="font-bold text-slate-900 text-sm">
                Engineer: {project.engineerName || 'Student Engineer'}
              </span>
              <span>{project.gradeLevel}</span>
              <span>Date: {new Date(project.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Step 1: ASK */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <span className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
              1
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              ASK: Define Problem, Constraints & Criteria
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <strong className="block text-slate-700 uppercase tracking-wider mb-1">
                The Problem & Goal:
              </strong>
              <p className="text-slate-800 leading-relaxed">
                {ask.problemStatement || 'Problem statement not entered.'}
              </p>
              {ask.targetUser && (
                <div className="mt-2 text-slate-500">
                  <strong>User:</strong> {ask.targetUser}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-rose-50/50 rounded-xl border border-rose-200">
                <strong className="block text-rose-800 uppercase tracking-wider mb-1">
                  Constraints & Rules ({ask.constraints.length}):
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                  {ask.constraints.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200">
                <strong className="block text-emerald-800 uppercase tracking-wider mb-1">
                  Success Criteria ({ask.criteria.length}):
                </strong>
                <ul className="list-disc list-inside space-y-0.5 text-slate-800">
                  {ask.criteria.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: IMAGINE */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold">
              2
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              IMAGINE: Brainstormed Ideas & Selection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {imagine.ideas.map((idea, idx) => (
              <div
                key={idea.id}
                className={`p-3 rounded-xl border ${
                  imagine.chosenIdeaId === idea.id
                    ? 'border-amber-500 bg-amber-50/60 font-medium'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900">{idea.title}</span>
                  {imagine.chosenIdeaId === idea.id && (
                    <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.5 rounded">
                      WINNER
                    </span>
                  )}
                </div>
                <p className="text-slate-600 line-clamp-3 mb-2">{idea.description}</p>
                {idea.pro && (
                  <p className="text-[11px] text-emerald-700">👍 {idea.pro}</p>
                )}
                {idea.challenge && (
                  <p className="text-[11px] text-rose-700">⚠️ {idea.challenge}</p>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs">
            <strong className="text-amber-900 block mb-0.5">
              Why the Winning Idea was Selected:
            </strong>
            <p className="text-amber-950">
              {imagine.selectionReason || 'No selection reason provided.'}
            </p>
          </div>
        </section>

        {/* Step 3: PLAN (Blueprint) */}
        <section className="space-y-3 break-inside-avoid">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <span className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              3
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              PLAN: Labelled Blueprint & Materials
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* The Blueprint Image */}
            <div className="md:col-span-2 border-2 border-slate-300 rounded-2xl overflow-hidden bg-slate-50">
              {plan.blueprintDataUrl ? (
                <img
                  src={plan.blueprintDataUrl}
                  alt="Student Blueprint"
                  className="w-full h-auto object-contain max-h-[360px]"
                />
              ) : (
                <div className="p-12 text-center text-xs text-slate-400">
                  No blueprint drawn yet.
                </div>
              )}
            </div>

            {/* Labels and Materials List */}
            <div className="space-y-4 text-xs">
              <div>
                <strong className="block text-slate-800 uppercase tracking-wider mb-1">
                  Labelled Parts ({plan.blueprintLabels.length}):
                </strong>
                <div className="space-y-1">
                  {plan.blueprintLabels.map((lbl, idx) => (
                    <div
                      key={lbl.id}
                      className="px-2 py-1 bg-slate-100 rounded-md font-medium text-slate-800 flex items-center gap-1.5"
                    >
                      <span className="w-4 h-4 rounded bg-blue-600 text-white text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{lbl.text}</span>
                    </div>
                  ))}
                  {plan.blueprintLabels.length === 0 && (
                    <span className="text-slate-400">None</span>
                  )}
                </div>
              </div>

              <div>
                <strong className="block text-slate-800 uppercase tracking-wider mb-1">
                  Materials Checklist ({plan.materials.length}):
                </strong>
                <div className="space-y-1">
                  {plan.materials.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[11px]"
                    >
                      <span>{m.name}</span>
                      <span className="text-slate-500 font-mono">{m.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {plan.dimensions && (
                <div className="p-2 bg-slate-50 rounded-md border border-slate-200 text-[11px]">
                  <strong>Dimensions:</strong> {plan.dimensions}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Step 4 & 5: CREATE & TEST */}
        <section className="space-y-3 break-inside-avoid">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
              4 & 5
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              CREATE & TEST: Building & Experimental Results
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Create summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <strong className="block text-slate-800 uppercase tracking-wider">
                Prototype Construction Log:
              </strong>
              <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Safety Pledge Acknowledged</span>
              </div>
              <ul className="space-y-1 text-slate-700">
                {create.buildSteps.map((s) => (
                  <li key={s.id} className="flex items-center gap-2">
                    <span className={s.completed ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                      {s.completed ? '✓' : '○'}
                    </span>
                    <span>{s.text}</span>
                  </li>
                ))}
              </ul>
              {create.buildNotes && (
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <strong>Changes made while building:</strong> {create.buildNotes}
                </div>
              )}
            </div>

            {/* Test summary */}
            <div className="p-3.5 bg-violet-50/50 rounded-xl border border-violet-200 space-y-2">
              <strong className="block text-violet-900 uppercase tracking-wider">
                Scientific Testing Results:
              </strong>
              {test.trials.map((tr) => (
                <div key={tr.id} className="border-b border-violet-100 pb-2 mb-2 last:border-none">
                  <span className="font-bold text-violet-950 block mb-1">
                    Trial 0{tr.trialNumber}
                  </span>
                  <div className="space-y-1 text-[11px]">
                    {ask.criteria.map((c) => {
                      const check = tr.criterionChecks[c];
                      return (
                        <div key={c} className="flex items-center justify-between">
                          <span className="text-slate-800">{c}</span>
                          <span className="font-bold">
                            {check?.status === 'yes' ? '✅ Passed' : check?.status === 'partial' ? '⚠️ Almost' : '❌ Needs Work'}
                            {check?.measurement ? ` (${check.measurement})` : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {tr.overallNotes && (
                    <p className="mt-1 text-[11px] text-slate-600 italic">
                      "{tr.overallNotes}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 6: IMPROVE */}
        <section className="space-y-3 break-inside-avoid">
          <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
            <span className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center text-xs font-bold">
              6
            </span>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              IMPROVE: Iteration, Redesign & Reflection
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div>
                <strong className="text-emerald-700 block">What Worked Well:</strong>
                <p className="text-slate-800">{improve.whatWorked || 'N/A'}</p>
              </div>
              <div>
                <strong className="text-rose-700 block">What Failed or Needed Work:</strong>
                <p className="text-slate-800">{improve.whatFailed || 'N/A'}</p>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2">
              <div>
                <strong className="text-indigo-900 block">Version 2.0 Redesign & Changes:</strong>
                <p className="text-slate-800">{improve.v2Changes || improve.improvementIdea || 'N/A'}</p>
              </div>
              {improve.v2TestOutcome && (
                <div>
                  <strong className="text-indigo-900 block">V2 Test Comparison:</strong>
                  <p className="text-slate-800">{improve.v2TestOutcome}</p>
                </div>
              )}
              {improve.reflectionLearned && (
                <div className="italic text-slate-600">
                  " {improve.reflectionLearned} "
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Certificate Stamp */}
        <div className="pt-6 border-t-2 border-slate-900 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-slate-900">
              Verified STEAM Engineering Design Portfolio
            </span>
          </div>
          <div>Teacher Sign-off: _____________________</div>
        </div>
      </div>
    </div>
  );
};
