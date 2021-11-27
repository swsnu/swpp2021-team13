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