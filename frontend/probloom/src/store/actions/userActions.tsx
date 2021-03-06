import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { User, UserProfile, UserStatistics } from '../reducers/userReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface SignInAction {
  type: typeof actionTypes.SIGN_IN;
  target: User | null;
}

export interface SignInRequest {
  id: string;
  password: string;
}

export const signInSuccess = (user) => {
  return {
    type: actionTypes.SIGN_IN,
    target: user,
  };
};

export const signInFail = (user:any) => {
  return {
    type: actionTypes.SIGN_IN,
    target: user,
  };
};

export const signIn = (request: SignInRequest) => {
  return (dispatch) => {
    return axios
      .post('/api/signin/', request)
      .then((res) => dispatch(signInSuccess(res.data)))
      .catch((error) => dispatch(signInFail(null)));
  };
};

export interface SignOutAction {
  type: typeof actionTypes.SIGN_OUT;
  target: User | null;
}

export const signOutSuccess = () => {
  return {
    type: actionTypes.SIGN_OUT,
    target: null,
  };
};

export const signOutFail = (user) => {
  return {
    type: actionTypes.SIGN_OUT,
    target: user,
  };
};

export const signOut = (user: any) => {
  return (dispatch) => {
    return axios
      .get('/api/signout/')
      .then((res) => dispatch(signOutSuccess()))
      .catch((error) => dispatch(signOutFail(user)));
  };
};

export interface SignUpAction {
  type: typeof actionTypes.SIGN_UP;
  target: User | null;
}

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
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

export const signUp = (request: SignUpRequest) => {
  return (dispatch) => {
    return axios
      .post('/api/signup/', request)
      .then((res) => dispatch(signUpSuccess(res.data)))
      .catch((error) => dispatch(signUpFail()));
  };
};

export const getCurrentUser: () => ThunkAction<
  void,
  RootState,
  null,
  SignInAction
> = () => {
  return async (dispatch: AppDispatch) => {
    try {
      const { data } = await axios.get<User>(`/api/user/current/`);
      dispatch(signInSuccess(data));
    } catch (error) {
      const pass =
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 404;
        // dispatch(signInFail({
        //   id: -1,
        //   username: 'dummy',
        //   email: 'dummy@dummy.com',
        //   logged_in: false,
        // }));
      if (!pass) {
        throw error;
      }
    }
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
    const { data }: { data: UserStatistics } = await axios.get(
      `/api/user/${id}/statistics/`
    );
    // console.log('*********** ACTION data', data);

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

export interface GetUserProfileResponse {
  introduction: string;
}

export const getUserProfile: (
  userId: number
) => ThunkAction<void, RootState, null, GetUserProfileAction> = (userId) => {
  return async (dispatch: AppDispatch) => {
    const { data } = await axios.get<GetUserProfileResponse>(
      `/api/user/${userId}/profile/`
    );
    const profile: UserProfile = { userId, ...data };
    dispatch(getUserProfile_(profile));
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
    await axios.put(`/api/user/${userId}/profile/`, {
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
  | SignInAction
  | SignOutAction;
