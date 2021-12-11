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
  pset: r_interfaces.ProblemSetWithProblemsInterface;
}

export const getProblemSet_: (problemSet) => GetProblemSetAction = (
  problemSet: r_interfaces.ProblemSetWithProblemsInterface
) => ({
  type: actionTypes.GET_PROBLEMSET,
  pset: problemSet,
});

export const getProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetProblemSetAction> = (
  problemSetID: number
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: r_interfaces.ProblemSetWithProblemsInterface } =
      await axios.get(`/api/problem_set/${problemSetID}/`);
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
    const { data } = await axios.get(
      `/api/problem_set/${problemSetID}/solvers/`
    );
    dispatch(getAllSolvers_(data));
  };
};

export interface GetSolverAction {
  type: typeof actionTypes.GET_SOLVER;
  solver: r_interfaces.Solver;
}

export const getSolver_: (solver: r_interfaces.Solver) => GetSolverAction = (
  solver
) => ({
  type: actionTypes.GET_SOLVER,
  solver: solver,
});

export const getSolver: (
  idSet: any
) => ThunkAction<void, RootState, null, GetSolverAction> = (idSet) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get(
      `/api/problem_set/${idSet.problemSetID}/solvers/${idSet.userID}/`
    );
    dispatch(getSolver_(data));
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
}

export const updateRecommend_: () => UpdateRecommendAction = (
) => ({
  type: actionTypes.UPDATE_RECOMMEND,
});

export const updateRecommend: (
  problemSetID: number
) => ThunkAction<void, RootState, null, UpdateRecommendAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    await axios.put(
      `/api/problem_set/${problemSetID}/recommend/`,
      { recommend: true }
    );
    dispatch(updateRecommend_());
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
  scope: string,
  tag: string[],
  difficulty: number,
  content: string,
  problems: r_interfaces.CreateProblemType[]
) => ThunkAction<void, RootState, null, CreateProblemSetAction> = (
  title: string,
  scope: string,
  tag: string[],
  difficulty: number,
  content: string,
  problems: r_interfaces.CreateProblemType[]
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: r_interfaces.ProblemSetInterface } =
      await axios.post(`/api/problem_set/`, {
        title: title,
        scope: scope,
        tag: tag,
        difficulty: difficulty,
        content: content,
        problems: problems,
      });
    dispatch(createProblemSet_(data));
    dispatch(push(`/problem/${data.id}/detail/`));
  };
};

export interface UpdateProblemSetAction {
  type: typeof actionTypes.UPDATE_PROBLEMSET;
  pset: r_interfaces.ProblemSetWithProblemsInterface;
}

export const updateProblemSet_: (
  problemSet: r_interfaces.ProblemSetWithProblemsInterface
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
    const { data }: { data: r_interfaces.ProblemSetWithProblemsInterface } =
      await axios.put(`/api/problem_set/${problemSet.id}/`, problemSet);
    dispatch(updateProblemSet_(data));
  };
};

export interface DeleteProblemSetAction {
  type: typeof actionTypes.DELETE_PROBLEMSET;
  targetID: number;
}

export const deleteProblemSet_: (
  problemSetID: number
) => DeleteProblemSetAction = (problemSetID) => ({
  type: actionTypes.DELETE_PROBLEMSET,
  targetID: problemSetID,
});

export const deleteProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, DeleteProblemSetAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    await axios.delete(`/api/problem_set/${problemSetID}/`);
    dispatch(deleteProblemSet_(problemSetID));
  };
};

export interface CreateProblemAction {
  type: typeof actionTypes.CREATE_PROBLEM;
  newProblem: a_interfaces.GetProblemResponse;
}

export const createProblem_: (newProblem) => CreateProblemAction = (
  newProblem
) => ({
  type: actionTypes.CREATE_PROBLEM,
  newProblem: newProblem,
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
    dispatch(createProblem_(data));
  };
};

export interface GetProblemAction {
  type: typeof actionTypes.GET_PROBLEM;
  selectedProblem: a_interfaces.GetProblemResponse | null;
}

export const getProblem_: (problem) => GetProblemAction = (problem) => ({
  type: actionTypes.GET_PROBLEM,
  selectedProblem: problem,
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
  updatedProblem: a_interfaces.UpdateProblemRequest
) => ThunkAction<void, RootState, null, GetProblemAction> = (
  id: number,
  updatedProblem: a_interfaces.UpdateProblemRequest
) => {
  return async (dispatch: AppDispatch) => {
    await axios.put(`/api/problem/${id}/`, updatedProblem);
    dispatch(getProblem_(null));
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
    dispatch(deleteProblem_(id));
  };
};

export type ProblemSetAction =
  | GetAllProblemSetsAction
  | GetProblemSetAction
  | GetAllSolversAction
  | GetSolverAction
  | GetIsRecommenderAction
  | UpdateRecommendAction
  | CreateProblemSetAction
  | UpdateProblemSetAction
  | DeleteProblemSetAction
  | CreateProblemAction
  | GetProblemAction
  | DeleteProblemAction;
