import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter } from 'connected-react-router';

import { history, middlewares } from '../store/store';
import { UserState } from '../store/reducers/userReducer';
import { ProblemSetState } from '../store/reducers/problemReducer';
import { CommentState } from '../store/reducers/commentReducer';

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

const defaultProblemSetState = {
  problemSets: [],
  solvers: [],
  selectedProblemSet: null,
};

const defaultCommentState = {
  comments: [],
  selectedComment: null,
};

export const getMockStore = (
  initialUserState: UserState = defaultUserState,
  initialProblemSetState: ProblemSetState = defaultProblemSetState,
  initailCommentState: CommentState = defaultCommentState
) => {
  const mockUserReducer = getMockReducer(initialUserState);
  const mockProblemReducer = getMockReducer(initialProblemSetState);
  const mockCommentReducer = getMockReducer(initailCommentState);

  const rootReducer = combineReducers({
    user: mockUserReducer,
    problemset: mockProblemReducer,
    comment: mockCommentReducer,
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
