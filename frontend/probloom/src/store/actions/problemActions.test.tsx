import axios from 'axios';
import { getProblems } from '.';
import { ProblemSet } from '../reducers/problemReducer';
import store, { AppDispatch } from '../store';

const dispatch = store.dispatch as AppDispatch;

describe('Get Problem List', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    spy.mockClear();
  });

  test('getProblems fetches problems correctly', async () => {
    const stubProblems: ProblemSet[] = [{
      id: 1,
      title: 'title1',
      created_time: 'create_time1',
      is_open: false,
      tag: 'math',
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solved_num: 1,
      recommended_num: 1,
    },{
      id: 2,
      title: 'title2',
      created_time: 'create_time2',
      is_open: false,
      tag: 'math',
      difficulty: 2,
      content: 'content2',
      userID: 2,
      username: 'creator2',
      solved_num: 2,
      recommended_num: 2,
    }];
    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: stubProblems,
    }));
    await dispatch(getProblems());
    expect(spy).toHaveBeenCalledWith('/api/problem/');
    expect(store.getState().problem.problemsets).toEqual(stubProblems);
  });
});
