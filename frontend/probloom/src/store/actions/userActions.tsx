import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { User, UserProfile, UserStatistics } from '../reducers/userReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface LogInAction {
  type: typeof actionTypes.LOG_IN;
  target: User | null;
}

export const logInSuccess = (user) => {
  return {
    type: actionTypes.LOG_IN,
    target: user,
  };
};

export const logInFail = () => {
  return {
    type: actionTypes.LOG_IN,
    target: null,
  };
};

export const logIn = (user: any) => {
  return (dispatch) => {
    return axios
      .post('/api/signin/', user)
      .then((res) => dispatch(logInSuccess(res.data)))
      .catch((error) => dispatch(logInFail()));
  };
};

export interface SignUpAction {
  type: typeof actionTypes.SIGN_UP;
  target: User | null;
}

export const signUpSuccess = (user: any) => {
  return {
    type: actionTypes.SIGN_UP,
    target: user,
  };
};

export const signUpFail = () => {
  return {
    type: actionTypes.SIGN_UP,
    target: null,
  };
};

export const signUp = (user: any) => {
  return (dispatch) => {
    return axios
      .post('/api/signup/', user)
      .then((res) => dispatch(signUpSuccess(res.data)))
      .catch((error) => dispatch(signUpFail()));
  };
};

export interface GetUserStatisticsAction {
  type: typeof actionTypes.GET_USER_STATISTICS;
  selectedUserStatistics: UserStatistics;
}

export const getUserStatistics_: (
  statistics: UserStatistics
) => GetUserStatisticsAction = (statistics) => ({
  type: actionTypes.GET_USER_STATISTICS,
  selectedUserStatistics: statistics,
});

export const getUserStatistics: (
  id: number
) => ThunkAction<void, RootState, null, GetUserStatisticsAction> = (id) => {
  return async (dispatch: AppDispatch) => {
    const data: UserStatistics = await axios.get(`/api/user/${id}/statistics`);
    dispatch(getUserStatistics_(data));
  };
};

export interface GetUserProfileAction {
  type: typeof actionTypes.GET_USER_PROFILE;
  selectedUserProfile: UserProfile;
}

export const getUserProfile_: (profile: UserProfile) => GetUserProfileAction = (
  profile
) => ({
  type: actionTypes.GET_USER_PROFILE,
  selectedUserProfile: profile,
});

export const getUserProfile: (
  userId: number
) => ThunkAction<void, RootState, null, GetUserProfileAction> = (userId) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: UserProfile } = await axios.get(
      `/api/user/${userId}/profile`
    );
    dispatch(getUserProfile_(data));
  };
};

export interface UpdateUserIntroductionAction {
  type: typeof actionTypes.UPDATE_USER_INTRODUCTION;
  newIntroduction: string;
}

export const updateUserIntroduction_: (
  newIntroduction: string
) => UpdateUserIntroductionAction = (newIntroduction) => ({
  type: actionTypes.UPDATE_USER_INTRODUCTION,
  newIntroduction,
});

export const updateUserIntroduction: (
  userId: number,
  pendingIntroduction: string
) => ThunkAction<void, RootState, null, GetUserProfileAction> = (
  userId,
  pendingIntroduction
) => {
  return async (dispatch: AppDispatch) => {
    await axios.put(`/api/user/${userId}/profile`, {
      introduction: pendingIntroduction,
    });
    const newIntroduction = pendingIntroduction;
    dispatch(updateUserIntroduction_(newIntroduction));
  };
};

export type UserAction =
  | GetUserStatisticsAction
  | GetUserProfileAction
  | UpdateUserIntroductionAction
  | SignUpAction
  | LogInAction;
