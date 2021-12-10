import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  GET_COMMENTS_OF_PROBLEMSET,
} from '../actions/actionTypes';

import commentReducer, { CommentState } from './commentReducer';

describe('Comment Reducer', () => {
  it('Comment reducer update state of comment', () => {
    const initialState: CommentState = {
      comments: [
        {
          id: 1,
          createdTime: 'TEST_DATE',
          content: 'TEST_CONTENT',
          userID: 1,
          username: 'TEST_USERNAME',
          problemSetID: 1,
        },
      ],
    };

    const comment = {
      id: 2,
      createdTime: 'TEST_DATE',
      content: 'TEST_CONTENT',
      userID: 2,
      username: 'TEST_USERNAME',
      problemSetID: 2,
    };

    let state = commentReducer(initialState, {
      type: CREATE_COMMENT,
      target: comment,
    });

    expect(state).toEqual({
      comments: [ ...initialState.comments, comment],
    });

    let state2 = commentReducer(state, {
      type: GET_COMMENTS_OF_PROBLEMSET,
      comments: [initialState.comments[0], comment],
    });

    expect(state2).toEqual({
      comments: [initialState.comments[0], comment],
    });

    let state3 = commentReducer(state2, {
      type: UPDATE_COMMENT,
      targetID: comment.id,
      content: comment.content,
    });

    expect(state3).toEqual({
      comments: [initialState.comments[0], comment],
    });

    let state4 = commentReducer(state3, {
      type: DELETE_COMMENT,
      targetID: comment.id,
    });

    expect(state4).toEqual({
      comments: initialState.comments,
    });
  });
});
