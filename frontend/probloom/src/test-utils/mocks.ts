import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';

import { history, middlewares } from '../store/store';
import { UserState } from '../store/reducers/userReducer';
import { ProblemState } from '../store/reducers/problemReducer';

const getMockReducer = jest.fn(
  (initialState) =>
    (state = initialState, action) => {
      switch (action.type) {
        default:
          break;
      }
      return state;
    }
);

const defaultUserState = {
  users: [],
  selectedUser: null,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const defaultProblemState = {
  problems: [],
};

export const getMockStore = (
  initialUserState: UserState = defaultUserState, 
  initialProblemState: ProblemState = defaultProblemState
 ) => {
  const mockUserReducer = getMockReducer(initialUserState);
  const mockProblemReducer = getMockReducer(initialProblemState)

  const rootReducer = combineReducers({
    user: mockUserReducer,
    problem: mockProblemReducer,
    router: connectRouter(history),
  });

  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const mockStore = createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );

  return mockStore;
};
