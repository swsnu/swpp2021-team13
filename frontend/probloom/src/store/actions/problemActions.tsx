import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { SimpleProblem } from '../reducers/problemReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetProblemsAction {
  type: typeof actionTypes.GET_PROBLEMS;
  problems: SimpleProblem[];
}
  
export const getProblems_: (
  problems: SimpleProblem[]
) => GetProblemsAction = (problems) => ({
  type: actionTypes.GET_PROBLEMS,
  problems: problems,
});
  
export const getProblems: (
) => ThunkAction<void, RootState, null, GetProblemsAction> = () => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: SimpleProblem[] } = await axios.get(
      `/api/problem/`
    );
    dispatch(getProblems_(data));
  };
};
  
export type ProblemAction =
  | GetProblemsAction;
  