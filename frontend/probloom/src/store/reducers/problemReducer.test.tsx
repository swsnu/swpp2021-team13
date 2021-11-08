import {
    GET_PROBLEMS,
} from '../actions/actionTypes';
import problemReducer, { SimpleProblem } from './problemReducer';

describe('Problem Reducer', () => {
  test('gets problems', () => {
    const problem1: SimpleProblem = {
      id: 1,
      title: 'title1',
      date: 'date1',
      tag: 'math',
      creator: 'creator1',
      content: 'content1',
      solved: 1,
      recommended: 1,
    };
    const problem2: SimpleProblem = {
      id: 2,
      title: 'title2',
      date: 'date2',
      tag: 'math',
      creator: 'creator2',
      content: 'content2',
      solved: 2,
      recommended: 2,
    };
    const problems: SimpleProblem[] = [problem1, problem2];
    const state = problemReducer(undefined, {
      type: GET_PROBLEMS,
      problems: problems,
    });
    expect(state).toEqual({
      problems: problems,
    });
  });
});