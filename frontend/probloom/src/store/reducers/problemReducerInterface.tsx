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
  problemType: 'multiple-choice'
  choices: string[];
  solution?: number[];
}

export interface SubjectiveProblemInterface extends ProblemInterface {
  problemType: 'subjective';
  solutions?: string[];
}

// to modify
export interface Solver {
  userID: number;
  username: string;
  problemID: number;
  problemtitle: string;
  result: boolean;
}
  
export interface NewProblemSet {
  index: number;
  problem_type: string;
  problem_statement: string;
  choice: string[];
  solution: string;
  explanation: string;
}
  
export interface ProblemSetCreateState {
  title: string;
  content: string;
  scope: string;
  tag: string;
  difficulty: string;
  problems: NewProblemSet[];
  numberOfProblems: number;
}
