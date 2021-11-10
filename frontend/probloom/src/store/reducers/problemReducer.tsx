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

export interface NewProblemSet {
  index: number;
  type: string;
  problem: string;
  choice: string[];
  solution: string;
  explanation: string;
}

export interface ProblemSetCreateState {
  title: string;
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
}

const initialState: ProblemSetState = {
  problemSets: [],
  solvers: [],
  selectedProblemSet: null,
};

export type ProblemReducer = Reducer<ProblemSetState, ProblemSetAction>;

const problemReducer: ProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_PROBLEMSETS:
      return { ...state, problemSets: action.problemSets };
    case actionTypes.GET_PROBLEMSET:
      return { ...state, selectedProblemSet: action.target };
    case actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET:
      return { ...state, solvers: action.solvers };
    case actionTypes.CREATE_PROBLEM_SET:
      return { ...state, problemSets: action.problemSets };
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
