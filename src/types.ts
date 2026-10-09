export type StepId = 1 | 2 | 3 | 4 | 5 | 6;

export interface BrainstormIdea {
  id: string;
  title: string;
  description: string;
  pro: string;
  challenge: string;
  rating: number; // 1 to 5 stars
  quickSketch?: string;
}

export interface BlueprintLabel {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  color?: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  quantity: string;
  gathered: boolean;
}

export interface BuildStepItem {
  id: string;
  stepNumber: number;
  text: string;
  completed: boolean;
}

export interface TrialResult {
  id: string;
  trialNumber: number;
  criterionChecks: Record<string, {
    status: 'yes' | 'partial' | 'no';
    measurement: string;
    notes: string;
  }>;
  overallNotes: string;
}

export interface ProjectState {
  id: string;
  title: string;
  engineerName: string;
  gradeLevel: 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';
  createdAt: string;
  updatedAt: string;
  currentStep: StepId;
  maxUnlockedStep: StepId;
  
  // Step 1: ASK
  ask: {
    problemStatement: string;
    targetUser: string;
    constraints: string[];
    criteria: string[];
  };

  // Step 2: IMAGINE
  imagine: {
    ideas: BrainstormIdea[];
    chosenIdeaId: string;
    selectionReason: string;
  };

  // Step 3: PLAN
  plan: {
    blueprintDataUrl: string;
    blueprintLabels: BlueprintLabel[];
    materials: MaterialItem[];
    dimensions: string;
    notes: string;
  };

  // Step 4: CREATE
  create: {
    safetyPledged: boolean;
    buildSteps: BuildStepItem[];
    buildNotes: string;
    photoDataUrl?: string;
  };

  // Step 5: TEST
  test: {
    trials: TrialResult[];
  };

  // Step 6: IMPROVE
  improve: {
    whatWorked: string;
    whatFailed: string;
    improvementIdea: string;
    v2Changes: string;
    v2TestOutcome: string;
    reflectionLearned: string;
    awardedBadge: boolean;
  };
}

export interface ChallengeTemplate {
  id: string;
  title: string;
  grade: string;
  icon: string;
  tagline: string;
  problem: string;
  targetUser: string;
  starterConstraints: string[];
  starterCriteria: string[];
  starterMaterials: { name: string; quantity: string }[];
}
