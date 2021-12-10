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
      `/api/problem_set/${problemSetID}/comment/`
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
      `/api/problem_set/${comment.problemSetID}/comment/`,
      { content: comment.content }
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
      `/api/problem_set/${comment.problemSetID}/comment/${comment.id}/`,
      { content: comment.content }
    );
    dispatch(updateComment_(data));
  };
};

export interface DeleteCommentAction {
  type: typeof actionTypes.DELETE_COMMENT;
  targetID: number;
}

export const deleteComment_: (id: number) => DeleteCommentAction = (
  id
) => ({
  type: actionTypes.DELETE_COMMENT,
  targetID: id,
});

export const deleteComment: (
  idList: any
) => ThunkAction<void, RootState, null, DeleteCommentAction> = (idList) => {
  return async (dispatch: AppDispatch) => {
    await axios.delete(
      `/api/problem_set/${idList.problemSetID}/comment/${idList.id}/`
    );
    dispatch(deleteComment_(idList.id));
  };
};

export type CommentAction =
  | GetCommentsOfProblemSetAction
  | CreateCommentAction
  | UpdateCommentAction
  | DeleteCommentAction;
