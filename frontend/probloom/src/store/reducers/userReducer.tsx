import { UserAction } from '../actions/userActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface UserField {
  id: number;
  username: string;
  email: string;
  password: string;
  logged_in: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

export interface UserStatistics {
  userId: number;
  lastActiveDays: number;
  problemsCreated: number;
  problemsSolved: number;
  // TODO
}

export interface UserProfile {
  userId: number;
  introduction: string;
}

export interface UserState {
  users: UserField[];
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
    case actionTypes.GET_ALL_USERS:
      return { ...state, users: action.users };
    case actionTypes.GET_USER:
      return { ...state, selectedUser: action.target };
    case actionTypes.LOG_IN:
      const modifiedUser = state.users.map((user) => {
        if (user.id === action.targetID) {
          return { ...user, logged_in: true };
        } else {
          return { ...user };
        }
      });
      return { ...state, user: modifiedUser };
    case actionTypes.SIGN_UP:
      return { ...state, users: [...state.users, action.target] };
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
