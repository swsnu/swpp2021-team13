import { UserAction } from '../actions/userActions';
import * as actionTypes from '../actions/actionTypes';

export interface UserField {
  id: number;
  username: string;
  email: string;
  password: string;
  logged_in: boolean;
}

export interface UserStatistics {
  username: string;
  email: string;
  lastActiveDays: number;
  problemsCreated: number;
  problemsSolved: number;
  // TODO
}

export interface UserState {
  users: UserField[];
  selectedUser: UserField | null;
  selectedUserStatistics: UserStatistics | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  selectedUserStatistics: null,
};

const reducer = (state = initialState, action: UserAction) => {
  switch (action.type) {
    case actionTypes.GET_USER_STATISTICS:
      return {
        ...state,
        selectedUserStatistics: action.selectedUserStatistics,
      };

    default:
      break;
  }
  return state;
};

export default reducer;
