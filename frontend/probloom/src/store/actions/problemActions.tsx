import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { ProblemSet, Solver } from '../reducers/problemReducer';
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
    const { data }: { data: ProblemSet } = await axios.get(
      `/api/problem/${problemSetID}/`
    );
    dispatch(getProblemSet_(data));
  };
};

export interface GetAllSolversAction {
  type: typeof actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET;
  solvers: Solver[];
}

export const getAllSolvers_: (solvers: Solver[]) => GetAllSolversAction = (
  solvers
) => ({
  type: actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET,
  solvers: solvers,
});

export const getAllSolvers: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetAllSolversAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: Solver[] } = await axios.get(
      `/api/solved/${problemSetID}/`
    );
    dispatch(getAllSolvers_(data));
  };
};

export interface DeleteProblemSetAction {
  type: typeof actionTypes.DELETE_PROBLEMSET;
  targetID: number;
}

export const deleteProblemSet_: (
  problemSet: ProblemSet
) => DeleteProblemSetAction = (problemSet) => ({
  type: actionTypes.DELETE_PROBLEMSET,
  targetID: problemSet.id,
});

export const deleteProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, DeleteProblemSetAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet } = await axios.delete(
      `/api/problem/${problemSetID}/`
    );
    dispatch(deleteProblemSet_(data));
  };
};

export type ProblemSetAction =
  | GetAllProblemSetsAction
  | GetProblemSetAction
  | GetAllSolversAction
  | DeleteProblemSetAction;
