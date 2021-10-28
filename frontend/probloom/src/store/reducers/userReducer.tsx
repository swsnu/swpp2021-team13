import { UserAction } from '../actions/userActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface UserField {
  id: number;
  username: string;
  email: string;
  logged_in: boolean;
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
  selectedUser: UserField | null;
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
