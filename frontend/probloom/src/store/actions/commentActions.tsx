import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { Comment } from '../reducers/commentReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

export interface GetCommentsOfProblemSetAction {
  type: typeof actionTypes.GET_COMMENTS_OF_PROBLEMSET;
  comments: Comment[];
}

export const getCommentsOfProblemSet_: (
  comments: Comment[]
) => GetCommentsOfProblemSetAction = (comments) => ({
  type: actionTypes.GET_COMMENTS_OF_PROBLEMSET,
  comments: comments,
});

export const getCommentsOfProblemSet: (
  problemSetID: number
) => ThunkAction<void, RootState, null, GetCommentsOfProblemSetAction> = (
  problemSetID
) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: Comment[] } = await axios.get(
      `/api/problem/${problemSetID}/comment/`
    );
    dispatch(getCommentsOfProblemSet_(data));
  };
};

export interface CreateCommentAction {
  type: typeof actionTypes.CREATE_COMMENT;
  target: Comment;
}

export const createComment_: (comment: Comment) => CreateCommentAction = (
  comment
) => ({
  type: actionTypes.CREATE_COMMENT,
  target: comment,
});

export const createComment: (
  comment: any
) => ThunkAction<void, RootState, null, CreateCommentAction> = (comment) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: Comment } = await axios.post(
      `/api/comment/`,
      comment
    );
    dispatch(createComment_(data));
  };
};

export interface UpdateCommentAction {
  type: typeof actionTypes.UPDATE_COMMENT;
  targetID: number;
  content: string;
}

export const updateComment_: (comment: Comment) => UpdateCommentAction = (
  comment
) => ({
  type: actionTypes.UPDATE_COMMENT,
  targetID: comment.id,
  content: comment.content,
});

export const updateComment: (
  comment: any
) => ThunkAction<void, RootState, null, UpdateCommentAction> = (comment) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: Comment } = await axios.put(
      `/api/comment/${comment.id}/`,
      { content: comment.content }
    );
    dispatch(updateComment_(data));
  };
};

export interface DeleteCommentAction {
  type: typeof actionTypes.DELETE_COMMENT;
  targetID: number;
}

export const deleteComment_: (comment: Comment) => DeleteCommentAction = (
  comment
) => ({
  type: actionTypes.DELETE_COMMENT,
  targetID: comment.id,
});

export const deleteComment: (
  commentID: number
) => ThunkAction<void, RootState, null, DeleteCommentAction> = (commentID) => {
  return async (dispatch: AppDispatch) => {
    const { data }: { data: Comment } = await axios.delete(
      `/api/comment/${commentID}/`
    );
    dispatch(deleteComment_(data));
  };
};

export type CommentAction =
  | GetCommentsOfProblemSetAction
  | CreateCommentAction
  | UpdateCommentAction
  | DeleteCommentAction;
