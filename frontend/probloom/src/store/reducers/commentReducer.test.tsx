import {
  CREATE_COMMENT,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  GET_COMMENTS_OF_PROBLEMSET,
} from '../actions/actionTypes';

import commentReducer from './commentReducer';

describe('Comment Reducer', () => {
  it('Comment reducer update state of comment', () => {
    const initialState = {
      comments: [
        {
          id: 1,
          date: 'TEST_DATE',
          content: 'TEST_CONTENT',
          userID: 1,
          username: 'TEST_USERNAME',
          problemSetID: 1,
        },
      ],
      selectedComment: null,
    };

    const comment = {
      id: 2,
      date: 'TEST_DATE',
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
      comments: initialState.comments,
      selectedComment: comment,
    });

    let state2 = commentReducer(state, {
      type: GET_COMMENTS_OF_PROBLEMSET,
      comments: [initialState.comments[0], comment],
    });

    expect(state2).toEqual({
      comments: [initialState.comments[0], comment],
      selectedComment: comment,
    });

    let state3 = commentReducer(state2, {
      type: UPDATE_COMMENT,
      targetID: comment.id,
      content: comment.content,
    });

    expect(state3).toEqual({
      comments: [initialState.comments[0], comment],
      selectedComment: comment,
    });

    let state4 = commentReducer(state3, {
      type: DELETE_COMMENT,
      targetID: comment.id,
    });

    expect(state4).toEqual({
      comments: initialState.comments,
      selectedComment: comment,
    });
  });
});
