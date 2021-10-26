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

export interface InitialState {
  users: UserField[];
  selectedUser: UserField | null;
  selectedUserStatistics: UserStatistics | null;
}

const UserState: InitialState = {
  users: [],
  selectedUser: null,
  selectedUserStatistics: null,
};

export interface ProfileStatisticsProps {
  selectedUser: UserField;
  onGetUserStatistics: (number) => void;
}

export interface ProfileStatisticsState {
  // TODO
}

const reducer = (state = UserState, action) => {
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
