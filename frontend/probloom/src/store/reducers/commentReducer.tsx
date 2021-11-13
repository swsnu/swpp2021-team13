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
    case actionTypes.CREATE_COMMENT:
      return { ...state, selectedComment: action.target };
    case actionTypes.UPDATE_COMMENT:
      const modifiedComments = state.comments.map((com) => {
        if (com.id === action.targetID) {
          return { ...com, content: com.content };
        } else {
          return { ...com };
        }
      });
      return { ...state, comments: modifiedComments };
    case actionTypes.DELETE_COMMENT:
      const remainComment = state.comments.filter((com) => {
        return com.id !== action.targetID;
      });
      return { ...state, comments: remainComment };
    default:
      break;
  }
  return state;
};

export default commentReducer;
