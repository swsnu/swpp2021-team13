import * as actionTypes from '../actions/actionTypes';

interface UserField {
  id: number;
  username: string;
  email: string;
  password: string;
  logged_in: boolean;
}

interface initialState {
  users: UserField[];
  selectedUser: UserField | null;
}

const UserState: initialState = {
  users: [],
  selectedUser: null,
};

const userReducer = (state = UserState, action) => {
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
      const newUser = {
        id: action.id,
        username: action.username,
        email: action.email,
        password: action.password,
        loggend_in: action.logged_in,
      };
      return { ...state, users: [...state.users, newUser] };
    default:
      return state;
  }
};
export default userReducer;
