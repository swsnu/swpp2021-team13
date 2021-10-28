import { connectRouter } from 'connected-react-router';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import userReducer, { UserReducer } from './store/reducers/userReducer';

import { history, middlewares } from './store/store';

interface GetMockStoreOptions {
  // mockUserState?: UserState;
  mockUserReducer?: UserReducer;
}

// const defaultMockUserState: UserState = {
//   users: [],
//   selectedUser: null,
//   selectedUserProfile: null,
//   selectedUserStatistics: null,
// };

// const getMockUserReducer = (initialState: UserState) =>
//   jest.fn((state = initialState, _) => state);

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const getReducers = ({
  mockUserReducer = jest.fn(userReducer),
}: GetMockStoreOptions) => {
  return {
    user: mockUserReducer,
  };
};

export const getMockStore = (options: GetMockStoreOptions = {}) => {
  const reducers = getReducers(options);
  const rootReducer = combineReducers(reducers);
  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

export const getMockStoreWithRouter = (options: GetMockStoreOptions = {}) => {
  const reducers = getReducers(options);
  const rootReducer = combineReducers({
    ...reducers,
    router: connectRouter(history),
  });
  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};
