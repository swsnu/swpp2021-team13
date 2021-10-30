import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import {
  UserField,
  UserProfile,
  UserStatistics,
} from '../reducers/userReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSFRToken';
export interface GetAllUsersAction {
  type: typeof actionTypes.GET_ALL_USERS;
  users: UserField[];
}

export const getAllUsers_ = (users) => {
  return {
    type: actionTypes.GET_ALL_USERS,
    users: users,
  };
};

export const getAllUsers = () => {
  return (dispatch) => {
    return axios
      .get('/api/user/')
      .then((res) => dispatch(getAllUsers_(res.data)));
  };
};

export interface GetUserAction {
  type: typeof actionTypes.GET_USER;
  target: UserField;
}

export const getUser_ = (user) => {
  return {
    type: actionTypes.GET_USER,
    target: user,
  };
};

export const getUser = (id) => {
  return (dispatch) => {
    return axios
      .get(`/api/user/${id}/`)
      .then((res) => dispatch(getUser_(res.data)));
  };
};

export interface LogInAction {
  type: typeof actionTypes.LOG_IN;
  targetID: number;
}

export const logIn_ = (user: any) => {
  return {
    type: actionTypes.LOG_IN,
    targetID: user.id,
  };
};

export const logIn = (user: any) => {
  return (dispatch) => {
    return axios
      .put(`/api/user/${user.id}/`, { ...user, logged_in: true })
      .then((res) => dispatch(logIn_(res.data)));
  };
};

export interface SignUpAction {
  type: typeof actionTypes.SIGN_UP;
  target: UserField;
}

export const signUp_ = (user: any) => {
  return {
    type: actionTypes.SIGN_UP,
    target: user,
  };
};

export const signUp = (user: any) => {
  return (dispatch) => {
    return axios
      .post(`/api/user/`, user)
      .then((res) => dispatch(signUp_(res.data)));
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
  | LogInAction
  | GetUserAction
  | GetAllUsersAction;
