import { ProblemAction } from '../actions/problemActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface Problem {
    id: number;
    title: string;
    date: string;
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
  problems: Problem[];
}
    
const initialState: ProblemState = {
  problems: [],
};
  
export type ProblemReducer = Reducer<ProblemState, ProblemAction>;

const problemReducer: ProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_PROBLEMS:
      return { ...state, problems: action.problems };
    default:
      break;
  }
  return state;
};

export default problemReducer;
