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

export type CommentAction = GetCommentsOfProblemSetAction;
