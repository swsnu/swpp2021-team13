import { CommentAction } from '../actions/commentActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';

export interface Comment {
  id: number;
  date: string;
  content: string;
  userID: number;
  username: string;
  problemSetID: number;
}

export interface CommentState {
  comments: Comment[];
  selectedComment: Comment | null;
}

const initialState: CommentState = {
  comments: [],
  selectedComment: null,
};

export type CommentReducer = Reducer<CommentState, CommentAction>;

const commentReducer: CommentReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COMMENTS_OF_PROBLEMSET:
      return { ...state, comments: action.comments };
    default:
      break;
  }
  return state;
};

export default commentReducer;
