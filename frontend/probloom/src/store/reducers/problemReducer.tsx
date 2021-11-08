import { ProblemAction } from '../actions/problemActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface SimpleProblem {
    id: number;
    title: string;
    date: string;
    tag: string;
    creator: string;
    content: string;
    solved: number;
    recommended: number;
}

export interface ProblemState {
  problems: SimpleProblem[];
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
