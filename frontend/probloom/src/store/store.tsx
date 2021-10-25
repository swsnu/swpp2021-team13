import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import userReducer from './reducers/userReducer';

export const history = createBrowserHistory();
const rootReducer = combineReducers({
  user: userReducer,
  router: connectRouter(history),
});
export const middlewares = [thunk, routerMiddleware(history)];

export type AppState = ReturnType<typeof rootReducer>;

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middlewares))
);

export default store;
