import { connectRouter } from 'connected-react-router';
import {
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
} from 'redux';
import { UserState } from './store/reducers/userReducer';

import { history, middlewares } from './store/store';

interface GetMockStoreOptions {
  mockUserState?: UserState;
}

const defaultMockUserState: UserState = {
  users: [],
  selectedUser: null,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const getMockUserReducer = (initialState: UserState) =>
  jest.fn((state = initialState, _: AnyAction) => state);

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const getReducers = ({
  mockUserState = defaultMockUserState,
}: GetMockStoreOptions) => {
  const mockUserReducer = getMockUserReducer(mockUserState);
  return {
    user: mockUserReducer,
  };
};

export const getMockStore = (options: GetMockStoreOptions) => {
  const reducers = getReducers(options);
  const rootReducer = combineReducers(reducers);
  return createStore(
    rootReducer,
    composeEnhancers(applyMiddleware(...middlewares))
  );
};

export const getMockStoreWithRouter = (options: GetMockStoreOptions) => {
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
