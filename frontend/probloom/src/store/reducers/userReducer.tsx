import * as actionTypes from '../actions/actionTypes';

interface UserField {
  id: number;
  username: string;
  email: string;
  password: string;
  logged_in: boolean;
}

interface UserStatistics {
  username: string;
  email: string;
  lastActiveDays: number;
  problemsCreated: number;
  problemsSolved: number;
  // TODO
}

interface initialState {
  users: UserField[];
  selectedUser: UserField | null;
  selectedUserStatistics: UserStatistics | null;
}

const UserState: initialState = {
  users: [],
  selectedUser: null,
  selectedUserStatistics: null,
};

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
