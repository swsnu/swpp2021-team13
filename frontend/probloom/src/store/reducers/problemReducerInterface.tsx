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
  solverIDs: number[];
  recommendedNum: number;
  problems: number[];
}

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
