import axios from 'axios';
import { Comment } from '../reducers/commentReducer';
import store, { AppDispatch } from '../store';
import * as actionCreators from './commentActions';

const dispatch = store.dispatch as AppDispatch;

describe('Out of all comment action creators', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    spy.mockClear();
  });

  it('get comments of problem set', async () => {
    const stubComment: Comment = {
      id: 1,
      createdTime: 'TEST_DATE',
      content: 'TEST_CONTENT',
      userID: 1,
      username: 'TEST_USERNAME',
      problemSetID: 1,
    };

    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: [stubComment],
    }));

    try {
      await dispatch(
        actionCreators.getCommentsOfProblemSet(stubComment.problemSetID)
      );
    } catch (err) {}
    const newState = store.getState();

    expect(newState.comment.comments).toEqual([stubComment]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('create a new comment', async () => {
    const stubComment: Comment = {
      id: 1,
      createdTime: 'TEST_DATE',
      content: 'TEST_CONTENT',
      userID: 1,
      username: 'TEST_USERNAME',
      problemSetID: 1,
    };

    spy = jest.spyOn(axios, 'post').mockImplementation(async (_) => ({
      status: 200,
      data: stubComment,
    }));

    try {
      await dispatch(actionCreators.createComment(stubComment));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.comment.comments).toEqual([stubComment, stubComment]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('update a comment', async () => {
    const stubComment: Comment = {
      id: 1,
      createdTime: 'TEST_DATE',
      content: 'TEST_CONTENT',
      userID: 1,
      username: 'TEST_USERNAME',
      problemSetID: 1,
    };

    spy = jest.spyOn(axios, 'put').mockImplementation(async (_) => ({
      status: 200,
      data: stubComment,
    }));

    try {
      await dispatch(actionCreators.updateComment(stubComment));
    } catch (err) {}
    const newState = store.getState();

    expect(newState.comment.comments).toEqual([stubComment, stubComment]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('delete a comment', async () => {
    const stubComment: Comment = {
      id: 1,
      createdTime: 'TEST_DATE',
      content: 'TEST_CONTENT',
      userID: 1,
      username: 'TEST_USERNAME',
      problemSetID: 1,
    };
    
    spy = jest.spyOn(axios, 'delete').mockImplementation(async (_) => ({
      status: 200,
      data: 1,
    }));

    try {
      await dispatch(actionCreators.deleteComment(1));
    } catch (err) {}
    const newState = store.getState();

    expect(newState.comment.comments).toEqual([stubComment, stubComment]);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
