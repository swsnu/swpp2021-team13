// GetProblemSets
export interface GetProblemSetResponse {
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

// CreateProblem
export type CreateProblemRequest =
  | CreateMultipleChoiceProblemRequest
  | CreateSubjectiveProblemRequest;

export interface CreateProblemRequestBase {
  problemType: string;
  problemSetID: number;
  problemNumber?: number;
  content: string;
}

export interface CreateMultipleChoiceProblemRequest extends CreateProblemRequestBase {
  problemType: 'multiple-choice';
  choices: string[];
}

export interface CreateSubjectiveProblemRequest extends CreateProblemRequestBase {
  problemType: 'subjective';
  solutions: string[];
}

// GetProblem
export type GetProblemResponse =
  | GetMultipleChoiceProblemResponse
  | GetSubjectiveProblemResponse;

export interface GetProblemResponseBase {
  id: number;
  problemType: string;
  problemSetID: number;
  problemNumber: number;
  creatorID: number;
  createdTime: string;
  content: string;
  solverIDs: number[];
}

export interface GetMultipleChoiceProblemResponse extends GetProblemResponseBase {
  problemType: 'multiple-choice'
  choices: string[];
  solution?: number[];
}

export interface GetSubjectiveProblemResponse extends GetProblemResponseBase {
  problemType: 'subjective';
  solutions?: string[];
}

// UpdateProblem
export type UpdateProblemRequest =
  | UpdateMultipleChoiceProblemRequest
  | UpdateSubjectiveProblemRequest

export interface UpdateProblemRequestBase {
  problemType: string;
  problemNumber?: number;
  content: string;
}

export interface UpdateMultipleChoiceProblemRequest extends UpdateProblemRequestBase {
  problemType: 'multiple-choice';
  choices: string[];
}

export interface UpdateSubjectiveProblemRequest extends UpdateProblemRequestBase {
  problemType: 'subjective';
  solutions: string[];
}
