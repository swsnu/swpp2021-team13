import { ProblemSetAction } from '../actions/problemActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface ProblemSet {
  id: number;
  title: string;
  date: string;
  is_open: boolean;
  tag: string;
  difficulty: number;
  content: string;
  userID: number;
  username: string;
  solved_num: number;
  recommended_num: number;
}

export interface ProblemSetState {
  problemSets: ProblemSet[];
  selectedProblemSet: ProblemSet | null;
}

const initialState: ProblemSetState = {
  problemSets: [],
  selectedProblemSet: null,
};

export type ProblemReducer = Reducer<ProblemSetState, ProblemSetAction>;

const problemReducer: ProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROBLEMSETS:
      return { ...state, problemSets: action.problemSets };
    default:
      break;
  }
  return state;
};

export default problemReducer;
