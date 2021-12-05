import axios from 'axios';
import { ThunkAction } from 'redux-thunk';
import { push } from 'connected-react-router';

import * as r_interfaces from '../reducers/problemReducerInterface';
import * as a_interfaces from './problemActionInterface';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetAllProblemSetsAction {
  type: typeof actionTypes.GET_ALL_PROBLEMSETS;
  problemSets: r_interfaces.ProblemSetInterface[];
}

export const getAllProblemSets_: (
  problemSets: r_interfaces.ProblemSetInterface[]
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
    const { data }: { data: r_interfaces.ProblemSetInterface[] } =
      await axios.get(`/api/problem_set/`);
    dispatch(getAllProblemSets_(data));
  };
};

export interface GetProblemSetAction {
  type: typeof actionTypes.GET_PROBLEMSET;
  pset: r_interfaces.ProblemSetInterface;
}

export const getProblemSet_: (problemSet) => GetProblemSetAction = (
  problemSet
) => ({
  type: actionTypes.GET_PROBLEMSET,
  pset: problemSet,
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
  solvers: r_interfaces.Solver[];
}

export const getAllSolvers_: (
  solvers: r_interfaces.Solver[]
) => GetAllSolversAction = (solvers) => ({
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
      const { data } = await axios.get(
        `/api/problem_set/${problemSetID}/solvers/`
      );
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

export interface GetIsRecommenderAction {
  type: typeof actionTypes.GET_IS_RECOMMENDER;
  isRecommender: boolean;
}

export const getIsRecommender_: (
  isRecommender: boolean
) => GetIsRecommenderAction = (isRecommender) => ({
  type: actionTypes.GET_IS_RECOMMENDER,
  isRecommender: isRecommender,
});

export const getIsRecommender: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetIsRecommenderAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(
      `/api/problem_set/${problemSetID}/recommend/`
    );
    dispatch(getIsRecommender_(data));
  };
};

export interface UpdateRecommendAction {
  type: typeof actionTypes.UPDATE_RECOMMEND;
  isRecommender: boolean;
}

export const updateRecommend_: (data: any) => UpdateRecommendAction = (
  isRecommender
) => ({
  type: actionTypes.UPDATE_RECOMMEND,
  isRecommender: true,
});

export const updateRecommend: (
  problemSetID: number
) => ThunkAction<void, RootState, null, UpdateRecommendAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.put(
      `/api/problem_set/${problemSetID}/recommend/`,
      { recommend: true }
    );
    dispatch(updateRecommend_(data));
  };
};

export interface CreateProblemSetAction {
  type: typeof actionTypes.CREATE_PROBLEM_SET;
  problemSet: r_interfaces.ProblemSetInterface;
}

export const createProblemSet_: (
  problemSet: r_interfaces.ProblemSetInterface
) => CreateProblemSetAction = (
  problemSet: r_interfaces.ProblemSetInterface
) => ({
  type: actionTypes.CREATE_PROBLEM_SET,
  problemSet: problemSet,
});

export const createProblemSet: (
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: r_interfaces.NewProblemSet[]
) => ThunkAction<void, RootState, null, CreateProblemSetAction> = (
  title: string,
  content: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: r_interfaces.NewProblemSet[]
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: r_interfaces.ProblemSetInterface } =
      await axios.post(`/api/problem/`, {
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
  pset: r_interfaces.ProblemSetInterface;
}

export const updateProblemSet_: (
  problemSet: r_interfaces.ProblemSetInterface
) => UpdateProblemSetAction = (problemSet) => ({
  type: actionTypes.UPDATE_PROBLEMSET,
  pset: problemSet,
});

export const updateProblemSet: (
  problemSet: any
) => ThunkAction<void, RootState, null, UpdateProblemSetAction> = (
  problemSet
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: r_interfaces.ProblemSetInterface } =
      await axios.put(`/api/problem_set/${problemSet.id}/`, problemSet);
    dispatch(updateProblemSet_(data));
  };
};

export interface DeleteProblemSetAction {
  type: typeof actionTypes.DELETE_PROBLEMSET;
  targetID: number;
}

export const deleteProblemSet_: (
  problemSet: r_interfaces.ProblemSetInterface
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
    const { data }: { data: r_interfaces.ProblemSetInterface } =
      await axios.delete(`/api/problem_set/${problemSetID}/`);
    dispatch(deleteProblemSet_(data));
  };
};

export interface CreateProblemAction {
  type: typeof actionTypes.CREATE_PROBLEM;
  newProblemID: number;
}

export const createProblem_: (id) => CreateProblemAction = (id) => ({
  type: actionTypes.CREATE_PROBLEM,
  newProblemID: id,
});

export const createProblem: (
  ps_id: number,
  problemData: a_interfaces.CreateProblemRequest
) => ThunkAction<void, RootState, null, CreateProblemAction> = (
  ps_id: number,
  problemData: a_interfaces.CreateProblemRequest
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.post(
      `/api/problem_set/${ps_id}/`,
      problemData
    );
    dispatch(createProblem_(data.id));
  };
};

export interface GetProblemAction {
  type: typeof actionTypes.GET_PROBLEM;
  selectedProblem: a_interfaces.GetProblemResponse;
}

export const getProblem_: (problemData) => GetProblemAction = (
  problemData
) => ({
  type: actionTypes.GET_PROBLEM,
  selectedProblem: problemData,
});

export const getProblem: (
  id: number
) => ThunkAction<void, RootState, null, GetProblemAction> = (id: number) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(`/api/problem/${id}/`);
    dispatch(getProblem_(data));
  };
};

export const updateProblem: (
  id: number,
  problemData: a_interfaces.UpdateProblemRequest
) => ThunkAction<void, RootState, null, GetProblemAction> = (
  id: number,
  problemData: a_interfaces.UpdateProblemRequest
) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.put(`/api/problem/${id}/`, problemData);
    dispatch(getProblem_(data));
  };
};

export interface DeleteProblemAction {
  type: typeof actionTypes.DELETE_PROBLEM;
  targetProblemID: number;
}

export const deleteProblem_: (id) => DeleteProblemAction = (id) => ({
  type: actionTypes.DELETE_PROBLEM,
  targetProblemID: id,
});

export const deleteProblem: (
  id: number
) => ThunkAction<void, RootState, null, GetProblemAction> = (id: number) => {
  return async (dispatch: AppDispatch) => {
    await axios.delete(`/api/problem/${id}/`);
    dispatch(getProblem_(id));
  };
};

export type ProblemSetAction =
  | GetAllProblemSetsAction
  | GetProblemSetAction
  | GetAllSolversAction
  | GetIsRecommenderAction
  | UpdateRecommendAction
  | CreateProblemSetAction
  | UpdateProblemSetAction
  | DeleteProblemSetAction
  | CreateProblemAction
  | GetProblemAction
  | DeleteProblemAction;
