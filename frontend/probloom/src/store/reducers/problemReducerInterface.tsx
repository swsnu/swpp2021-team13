export interface ProblemSetInterface {
  id: number;
  title: string;
  createdTime: string;
  modifiedTime: string;
  isOpen: boolean;
  tag: string[][];
  difficulty: number;
  content: string;
  userID: number;
  username: string;
  solvedNum: number;
  recommendedNum: number;
}

export interface ProblemSetWithProblemsInterface extends ProblemSetInterface {
  problems: number[];
}

export type ProblemType =
  | MultipleChoiceProblemInterface
  | SubjectiveProblemInterface;

export interface ProblemInterface {
  id: number;
  problemType: string;
  problemSetID: number;
  problemNumber: number;
  creatorID: number;
  createdTime: string;
  content: string;
  solverIDs: number[];
}

export interface MultipleChoiceProblemInterface extends ProblemInterface {
  problemType: 'multiple-choice';
  choices: string[];
  solution?: number[];
}

export interface SubjectiveProblemInterface extends ProblemInterface {
  problemType: 'subjective';
  solutions?: string[];
}

export interface Solver {
  userID: number;
  username: string;
  result: boolean;
  problems: (boolean | null)[];
}

// ----------------------- ProblemSetCreate -----------------------
export interface CreateProblemSetRequest {
  title: string;
  scope: string;
  tag: string[];
  difficulty: number;
  content: string;
  problems: CreateProblemType[];
}

export type CreateProblemType =
  | CreateMultipleChoiceProblemInterface
  | CreateSubjectiveProblemInterface;

export interface CreateProblemInterface {
  problemType: string;
  problemSetID: number;
  problemNumber: number;
  content: string;
}

export interface CreateMultipleChoiceProblemInterface
  extends CreateProblemInterface {
  problemType: 'multiple-choice';
  choices: string[];
  solution: number[];
}

export interface CreateSubjectiveProblemInterface
  extends CreateProblemInterface {
  problemType: 'subjective';
  solutions: string[];
}
