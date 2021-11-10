import { ProblemAction } from '../actions/problemActions';
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
    userID: number,
    username: string;
    solved_num: number;
    recommended_num: number;
}


export interface ProblemState {
  problemsets: ProblemSet[];
}

const initialState: ProblemState = {
  problemsets: [],
};
  
export type ProblemReducer = Reducer<ProblemState, ProblemAction>;

const problemReducer: ProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROBLEMS:
      return { ...state, problemsets: action.problemsets };
    default:
      break;
  }
  return state;
};

export default problemReducer;
