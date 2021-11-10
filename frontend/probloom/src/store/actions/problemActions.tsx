import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { ProblemSet } from '../reducers/problemReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetAllProblemSetsAction {
  type: typeof actionTypes.GET_ALL_PROBLEMSETS;
  problemSets: ProblemSet[];
}

export const getAllProblemSets_: (
  problemSets: ProblemSet[]
) => GetAllProblemSetsAction = (problemSets) => ({
  type: actionTypes.GET_ALL_PROBLEMSETS,
  problemSets: problemSets,
});

export const getAllProblemSets: () => ThunkAction<
  void,
  RootState,
  null,
  GetAllProblemSetsAction
> = () => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet[] } = await axios.get(`/api/problem/`);
    dispatch(getAllProblemSets_(data));
  };
};

export interface GetProblemSetAction {
  type: typeof actionTypes.GET_PROBLEMSET;
  target: ProblemSet;
}

export const getProblemSet_: (problemSet: ProblemSet) => GetProblemSetAction = (
  problemSet
) => ({
  type: actionTypes.GET_PROBLEMSET,
  target: problemSet,
});

export const getProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetProblemSetAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const data: ProblemSet = await axios.get(`/api/problem/${problemSetID}/`);
    dispatch(getProblemSet_(data));
  };
};

export type ProblemSetAction = GetAllProblemSetsAction | GetProblemSetAction;
