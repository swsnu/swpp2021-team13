import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { push } from 'connected-react-router';

import { ProblemSet, Solver, NewProblemSet } from '../reducers/problemReducer';
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
  pset: ProblemSet;
  problems_list: any;
}

export const getProblemSet_: (problemSet) => GetProblemSetAction = (
  problemSet
) => ({
  type: actionTypes.GET_PROBLEMSET,
  pset: problemSet.pop('problems'),
  problems_list: problemSet.problems,
});

export const getProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetProblemSetAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(`/api/problem_set/${problemSetID}/`);
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
    try {
      const { data } = await axios.get(`/api/solved/${problemSetID}/`);
      dispatch(getAllSolvers_(data));
    } catch (err) {
      const { status } = (err as any).response;
      if (status === 404) {
        dispatch(getAllSolvers_([]));
      } else {
        throw err;
      }
    }
  };
};

export interface CreateProblemSetAction {
  type: typeof actionTypes.CREATE_PROBLEM_SET;
  problemSet: ProblemSet;
}

export const createProblemSet_: (
  problemSet: ProblemSet
) => CreateProblemSetAction = (problemSet: ProblemSet) => ({
  type: actionTypes.CREATE_PROBLEM_SET,
  problemSet: problemSet,
});

export const createProblemSet: (
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => ThunkAction<void, RootState, null, CreateProblemSetAction> = (
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet } = await axios.post(`/api/problem/`, {
      title: title,
      content: content,
      scope: scope,
      tag: tag,
      difficulty: difficulty,
      problems: problems,
    });
    dispatch(createProblemSet_(data));
    dispatch(push(`/problem/${data.id}/detail/`));
  };
};
export interface UpdateProblemSetAction {
  type: typeof actionTypes.UPDATE_PROBLEMSET;
  targetID: number;
}

export const updateProblemSet_: (
  problemSet: ProblemSet
) => DeleteProblemSetAction = (problemSet) => ({
  type: actionTypes.DELETE_PROBLEMSET,
  targetID: problemSet.id,
});

export const updateProblemSet: (
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
  | CreateProblemSetAction
  | UpdateProblemSetAction
  | DeleteProblemSetAction;
