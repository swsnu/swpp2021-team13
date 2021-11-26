import { ProblemSetAction } from '../actions/problemActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface ProblemSet {
  id: number;
  title: string;
  created_time: string;
  is_open: boolean;
  tag: string;
  difficulty: number;
  content: string;
  userID: number;
  username: string;
  solved_num: number;
  recommended_num: number;
}

export interface Solver {
  userID: number;
  username: string;
  problemID: number;
  problemtitle: string;
  result: boolean;
}

// <------------ Deprecated : will be removed later
export interface NewProblemSet {
  problem_type: string;
  index: number;
  problem_statement: string;
  choice: string[];
  solution: string;
}

export interface ProblemSetCreateState {
  title: string;
  scope: string;
  tag: string;
  difficulty: string;
  content: string;
  problems: NewProblemSet[];
  numberOfProblems: number;
}
// Deprecated : will be removed later ------------>

export type CreateProblemRequest =
  | CreateMultipleChoiceProblemRequest
  | CreateSubjectiveProblemRequest;

interface CreateProblemRequestBase {
  problemType: string;
  problemSetID: number;
  problemNumber: number;
  content: string;
}

interface CreateMultipleChoiceProblemRequest extends CreateProblemRequestBase {
  problemType: 'multiple-choice';
  choices: string[];
  solutions?: number[];
}

interface CreateSubjectiveProblemRequest extends CreateProblemRequestBase {
  problemType: 'subjective';
  solutions?: string[];
}

export interface CreateProblemSetRequest {
  title: string;
  scope: string;
  tag: string[];
  difficulty: number;
  content: string;
  problems: CreateProblemRequest[];
}

export interface ProblemSetState {
  problemSets: ProblemSet[];
  solvers: Solver[];
  selectedProblemSet: ProblemSet | null;
  selectedProblems: NewProblemSet[];
}

const initialState: ProblemSetState = {
  problemSets: [],
  solvers: [],
  selectedProblemSet: null,
  selectedProblems: [],
};

export type ProblemReducer = Reducer<ProblemSetState, ProblemSetAction>;

const problemReducer: ProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_PROBLEMSETS:
      return { ...state, problemSets: action.problemSets };
    case actionTypes.GET_PROBLEMSET:
      return {
        ...state,
        selectedProblemSet: action.pset,
        selectedProblems: action.problems_list,
      };
    case actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET:
      return { ...state, solvers: action.solvers };
    case actionTypes.CREATE_PROBLEM_SET:
      return {
        ...state,
        problemSets: [...state.problemSets, action.problemSet],
      };
    case actionTypes.EDIT_PROBLEM_SET:
      // const otherProblemSets = state.problemSets.filter((problemSet) => {
      //   return problemSet.id !== action.pset.id;
      // });
      const editProblemSets = {
        id: action.pset.id,
        title: action.pset.title,
        created_time: action.pset.created_time,
        is_open: action.pset.is_open,
        tag: action.pset.tag,
        difficulty: action.pset.difficulty,
        content: action.pset.content,
        userID: action.pset.userID,
        username: action.pset.username,
        solved_num: action.pset.solved_num,
        recommended_num: action.pset.recommended_num,
      };
      // const editProblems: NewProblemSet[] = [];
      // action.problems_list.forEach((problem) => {
      //   editProblems.push({
      //     index: problem.index,
      //     problem_type: problem.problem_type,
      //     problem_statement: problem.problem_statement,
      //     choice: problem.choice,
      //     solution: problem.solution,
      //     explanation: problem.explanation,
      //   });
      // });

      return {
        ...state,
        selectedProblemSet: editProblemSets,
      };

    case actionTypes.DELETE_PROBLEMSET:
      const remainProblemSet = state.problemSets.filter((problemset) => {
        return problemset.id !== action.targetID;
      });
      return { ...state, problemSets: remainProblemSet };
    default:
      break;
  }
  return state;
};

export default problemReducer;
