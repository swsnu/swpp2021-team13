import { UserAction } from '../actions/userActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface User {
  id: number;
  username: string;
  email: string;
  logged_in: boolean;
}

export interface UserStatisticsProblemSet {
  title: string;
  content: string;
  created_time: string;
  scope: boolean;
  tag: string;
  difficulty: number;
}

export interface UserStatistics {
  userId: number;
  lastActiveDays: number;
  createdProblems: UserStatisticsProblemSet[];
  // solvedProblems: number[];
  // recommendedProblems: number[];
  // createdExplanations: number[];
  // recommendedExplanations: number[];
}

export interface UserProfile {
  userId: number;
  introduction: string;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  selectedUserProfile: UserProfile | null;
  selectedUserStatistics: UserStatistics | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

export type UserReducer = Reducer<UserState, UserAction>;

const userReducer: UserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SIGN_IN:
      return { ...state, selectedUser: action.target };
    case actionTypes.SIGN_OUT:
      return { ...state, selectedUser: action.target };
    case actionTypes.SIGN_UP:
      return { ...state, selectedUser: action.target };
    case actionTypes.GET_USER_STATISTICS:
      return {
        ...state,
        selectedUserStatistics: action.selectedUserStatistics,
      };
    case actionTypes.GET_USER_PROFILE:
      return {
        ...state,
        selectedUserProfile: action.selectedUserProfile,
      };
    case actionTypes.UPDATE_USER_INTRODUCTION:
      if (state.selectedUserProfile === null) {
        break;
      }
      return {
        ...state,
        selectedUserProfile: {
          ...state.selectedUserProfile,
          introduction: action.newIntroduction,
        },
      };
    default:
      break;
  }
  return state;
};

export default userReducer;
