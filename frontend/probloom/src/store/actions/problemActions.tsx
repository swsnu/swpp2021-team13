import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { ProblemSet } from '../reducers/problemReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetProblemsAction {
  type: typeof actionTypes.GET_PROBLEMS;
  problemsets: ProblemSet[];
}
  
export const getProblems_: (
  problemsets: ProblemSet[]
) => GetProblemsAction = (problemsets) => ({
  type: actionTypes.GET_PROBLEMS,
  problemsets: problemsets,
});
  
export const getProblems: (
) => ThunkAction<void, RootState, null, GetProblemsAction> = () => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet[] } = await axios.get(
      `/api/problem/`
    );
    dispatch(getProblems_(data));
  };
};
  
export type ProblemAction =
  | GetProblemsAction;
  