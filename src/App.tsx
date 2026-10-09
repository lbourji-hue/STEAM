/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProjectState, StepId } from './types';
import { Header } from './components/Header';
import { StepProgress } from './components/StepProgress';
import { StepAsk } from './components/StepAsk';
import { StepImagine } from './components/StepImagine';
import { StepPlan } from './components/StepPlan';
import { StepCreate } from './components/StepCreate';
import { StepTest } from './components/StepTest';
import { StepImprove } from './components/StepImprove';
import { PortfolioReview } from './components/PortfolioReview';
import { SAMPLE_CHALLENGES } from './data/sampleChallenges';

const STORAGE_KEY = 'steam_design_studio_project_v1';

const getInitialProject = (): ProjectState => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved project', e);
      }
    }
  }

  // Default to Bridge challenge starter for instant inspiration
  const starter = SAMPLE_CHALLENGES[0];

  return {
    id: 'proj_' + Date.now(),
    title: starter.title,
    engineerName: '',
    gradeLevel: 'Grade 3',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentStep: 1,
    maxUnlockedStep: 1,
    ask: {
      problemStatement: starter.problem,
      targetUser: starter.targetUser,
      constraints: [...starter.starterConstraints],
      criteria: [...starter.starterCriteria],
    },
    imagine: {
      ideas: [
        {
          id: 'idea_1',
          title: 'Idea 1: Triangle Truss Bridge',
          description: 'Use folded cardboard strips glued in triangles under the deck to spread weight.',
          pro: 'Triangles are the strongest shape in engineering.',
          challenge: 'Takes lots of careful folding and tape.',
          rating: 4,
        },
        {
          id: 'idea_2',
          title: 'Idea 2: Arch Bridge with Cup Piers',
          description: 'Curve a cardboard strip into an arch resting on two paper cups filled with paper.',
          pro: 'Arches push weight out to the sides.',
          challenge: 'Paper cups might slip apart if not taped.',
          rating: 4,
        },
        {
          id: 'idea_3',
          title: 'Idea 3: Flat Beam with Folded Accordion Core',
          description: 'Fold cardstock in zigzag accordion ribs between two flat roadway layers.',
          pro: 'Very quick and lightweight to make.',
          challenge: 'Might crush if we add too many heavy coins at once.',
          rating: 3,
        },
      ],
      chosenIdeaId: 'idea_1',
      selectionReason: 'The triangle truss is stiff and keeps the span from dipping when coins are placed in the middle.',
    },
    plan: {
      blueprintDataUrl: '',
      blueprintLabels: [],
      materials: starter.starterMaterials.map((m, idx) => ({
        id: `mat_${idx}`,
        name: m.name,
        quantity: m.quantity,
        gathered: false,
      })),
      dimensions: 'Length: 25 cm, Width: 8 cm, Height: 6 cm',
      notes: 'Make sure all triangle joints overlap by 1 cm.',
    },
    create: {
      safetyPledged: false,
      buildSteps: [
        { id: 'bs_1', stepNumber: 1, text: 'Cut 4 cardboard strips 25 cm long', completed: false },
        { id: 'bs_2', stepNumber: 2, text: 'Tape craft sticks into 6 sturdy triangles', completed: false },
        { id: 'bs_3', stepNumber: 3, text: 'Fasten triangles beneath the cardboard roadway', completed: false },
        { id: 'bs_4', stepNumber: 4, text: 'Test balance on the two side pier tables', completed: false },
      ],
      buildNotes: '',
    },
    test: {
      trials: [
        {
          id: 'tr_1',
          trialNumber: 1,
          criterionChecks: {},
          overallNotes: '',
        },
      ],
    },
    improve: {
      whatWorked: '',
      whatFailed: '',
      improvementIdea: '',
      v2Changes: '',
      v2TestOutcome: '',
      reflectionLearned: '',
      awardedBadge: false,
    },
  };
};

export default function App() {
  const [project, setProject] = useState<ProjectState>(getInitialProject);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (e) {
      console.error('LocalStorage write error', e);
    }
  }, [project]);

  const updateProject = (updater: (prev: ProjectState) => ProjectState) => {
    setProject((prev) => {
      const next = updater(prev);
      return {
        ...next,
        updatedAt: new Date().toISOString(),
      };
    });
  };

  const handleSelectStep = (step: StepId) => {
    // Only allow navigating to steps that are unlocked!
    if (step <= project.maxUnlockedStep) {
      updateProject((prev) => ({ ...prev, currentStep: step }));
    }
  };

  const advanceStep = (fromStep: StepId) => {
    const nextStep = Math.min(6, fromStep + 1) as StepId;
    updateProject((prev) => ({
      ...prev,
      currentStep: nextStep,
      maxUnlockedStep: Math.max(prev.maxUnlockedStep, nextStep) as StepId,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackStep = (fromStep: StepId) => {
    const prevStep = Math.max(1, fromStep - 1) as StepId;
    updateProject((prev) => ({
      ...prev,
      currentStep: prevStep,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetProject = () => {
    if (
      confirm(
        'Start a new engineering challenge? This will reset your current workspace.'
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      const fresh = getInitialProject();
      fresh.id = 'proj_' + Date.now();
      fresh.title = 'New Engineering Challenge';
      fresh.ask.problemStatement = '';
      fresh.ask.targetUser = '';
      fresh.ask.constraints = [];
      fresh.ask.criteria = [];
      fresh.imagine.ideas = [];
      fresh.imagine.chosenIdeaId = '';
      fresh.imagine.selectionReason = '';
      fresh.plan.blueprintDataUrl = '';
      fresh.plan.blueprintLabels = [];
      fresh.plan.materials = [];
      fresh.plan.dimensions = '';
      fresh.plan.notes = '';
      fresh.create.safetyPledged = false;
      fresh.create.buildSteps = [];
      fresh.create.buildNotes = '';
      fresh.test.trials = [{ id: 'tr_1', trialNumber: 1, criterionChecks: {}, overallNotes: '' }];
      fresh.improve = {
        whatWorked: '',
        whatFailed: '',
        improvementIdea: '',
        v2Changes: '',
        v2TestOutcome: '',
        reflectionLearned: '',
        awardedBadge: false,
      };
      fresh.currentStep = 1;
      fresh.maxUnlockedStep = 1;
      setProject(fresh);
    }
  };

  if (isPortfolioOpen) {
    return (
      <PortfolioReview
        project={project}
        onClose={() => setIsPortfolioOpen(false)}
        onImportProject={(imported) => {
          setProject(imported);
          setIsPortfolioOpen(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header bar */}
      <Header
        currentStep={project.currentStep}
        maxUnlockedStep={project.maxUnlockedStep}
        onSelectStep={handleSelectStep}
        onOpenPortfolio={() => setIsPortfolioOpen(true)}
        onResetProject={handleResetProject}
        projectTitle={project.title}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Step Progress Roadmap */}
        <StepProgress
          currentStep={project.currentStep}
          maxUnlockedStep={project.maxUnlockedStep}
          onSelectStep={handleSelectStep}
        />

        {/* Active Step Content */}
        {project.currentStep === 1 && (
          <StepAsk
            project={project}
            updateProject={updateProject}
            onAdvanceToNext={() => advanceStep(1)}
          />
        )}

        {project.currentStep === 2 && (
          <StepImagine
            project={project}
            updateProject={updateProject}
            onAdvanceToNext={() => advanceStep(2)}
            onGoBack={() => goBackStep(2)}
          />
        )}

        {project.currentStep === 3 && (
          <StepPlan
            project={project}
            updateProject={updateProject}
            onAdvanceToNext={() => advanceStep(3)}
            onGoBack={() => goBackStep(3)}
          />
        )}

        {project.currentStep === 4 && (
          <StepCreate
            project={project}
            updateProject={updateProject}
            onAdvanceToNext={() => advanceStep(4)}
            onGoBack={() => goBackStep(4)}
          />
        )}

        {project.currentStep === 5 && (
          <StepTest
            project={project}
            updateProject={updateProject}
            onAdvanceToNext={() => advanceStep(5)}
            onGoBack={() => goBackStep(5)}
          />
        )}

        {project.currentStep === 6 && (
          <StepImprove
            project={project}
            updateProject={updateProject}
            onOpenPortfolio={() => setIsPortfolioOpen(true)}
            onGoBack={() => goBackStep(6)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200 py-4 px-6 mt-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">STEAM Engineering Design Process</span>
            <span>·</span>
            <span>Ask → Imagine → Plan → Create → Test → Improve</span>
          </div>
          <div>
            100% Client-Side & Private · No Student Logins Required
          </div>
        </div>
      </footer>
    </div>
  );
}
