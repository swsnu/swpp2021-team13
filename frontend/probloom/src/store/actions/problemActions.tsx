import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { ProblemSet } from '../reducers/problemReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetProblemSetsAction {
  type: typeof actionTypes.GET_PROBLEMSETS;
  problemSets: ProblemSet[];
}

export const getProblemSets_: (
  problemSets: ProblemSet[]
) => GetProblemSetsAction = (problemSets) => ({
  type: actionTypes.GET_PROBLEMSETS,
  problemSets: problemSets,
});

export const getProblemSets: () => ThunkAction<
  void,
  RootState,
  null,
  GetProblemSetsAction
> = () => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet[] } = await axios.get(`/api/problem/`);
    dispatch(getProblemSets_(data));
  };
};

export type ProblemSetAction = GetProblemSetsAction;
