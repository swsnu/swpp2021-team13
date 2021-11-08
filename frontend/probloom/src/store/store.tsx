import {
  createStore,
  combineReducers,
  applyMiddleware,
  compose,
  AnyAction,
} from 'redux';
import thunk, { ThunkDispatch } from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import userReducer from './reducers/userReducer';
import problemReducer from './reducers/problemReducer';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  user: userReducer,
  problem: problemReducer,
  router: connectRouter(history),
});

export const middlewares = [thunk, routerMiddleware(history)];

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch &
  ThunkDispatch<RootState, any, AnyAction>;

export default store;
