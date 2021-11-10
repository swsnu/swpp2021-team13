import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { NewProblemSet, ProblemSet } from '../reducers/problemReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetProblemsAction {
  type: typeof actionTypes.GET_PROBLEMS;
  problemsets: ProblemSet[];
}

export const getProblems_: (problemsets: ProblemSet[]) => GetProblemsAction = (
  problemsets
) => ({
  type: actionTypes.GET_PROBLEMS,
  problemsets: problemsets,
});

export const getProblems: () => ThunkAction<
  void,
  RootState,
  null,
  GetProblemsAction
> = () => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet[] } = await axios.get(`/api/problem/`);
    dispatch(getProblems_(data));
  };
};

export interface CreateProblemSetAction {
  type: typeof actionTypes.CREATE_PROBLEM_SET;
  problems: ProblemSet[];
}

export const createProblemSet_: (
  problems: ProblemSet[]
) => CreateProblemSetAction = (problems: ProblemSet[]) => ({
  type: actionTypes.CREATE_PROBLEM_SET,
  problems: problems,
});

export const createProblemSet: (
  title: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => ThunkAction<void, RootState, null, CreateProblemSetAction> = (
  title: string,
  scope: string,
  tag: string,
  difficulty: string,
  problems: NewProblemSet[]
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: ProblemSet[] } = await axios.post(`/api/problem/`, {
      title: title,
      scope: scope,
      tag: tag,
      difficulty: difficulty,
      problems: problems,
    });
    dispatch(createProblemSet_(data));
  };
};

export type ProblemAction = GetProblemsAction | CreateProblemSetAction;
