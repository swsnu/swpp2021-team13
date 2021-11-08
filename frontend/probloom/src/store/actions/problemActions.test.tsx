import axios from 'axios';
import { getProblems } from '.';
import { SimpleProblem } from '../reducers/problemReducer';
import store, { AppDispatch } from '../store';

const dispatch = store.dispatch as AppDispatch;

describe('Get Problem List', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    spy.mockClear();
  });

  test('getProblems fetches problems correctly', async () => {
    const stubProblems: SimpleProblem[] = [{
        id: 1,
        title: 'title1',
        date: 'date1',
        tag: 'math',
        creator: 'creator1',
        content: 'content1',
        solved: 1,
        recommended: 1,
    }, {
        id: 2,
        title: 'title2',
        date: 'date2',
        tag: 'math',
        creator: 'creator2',
        content: 'content2',
        solved: 2,
        recommended: 2,
    }];
    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: stubProblems,
    }));
    await dispatch(getProblems());
    expect(spy).toHaveBeenCalledWith('/api/problem/');
    expect(store.getState().problem.problems).toEqual(stubProblems);
  });
});
