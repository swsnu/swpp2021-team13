import { ProblemSetAction } from '../actions/problemActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface ProblemSet {
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
      };
    case actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET:
      return { ...state, solvers: action.solvers };
    case actionTypes.CREATE_PROBLEM_SET:
      return {
        ...state,
        problemSets: [...state.problemSets, action.problemSet],
      };
    case actionTypes.UPDATE_PROBLEMSET:
      return {
        ...state,
        selectedProblemSet: action.pset,
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
