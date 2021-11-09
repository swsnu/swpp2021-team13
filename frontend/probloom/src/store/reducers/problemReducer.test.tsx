import {
  GET_PROBLEMS,
} from '../actions/actionTypes';
import problemReducer, { Problem } from './problemReducer';

describe('Problem Reducer', () => {
test('gets problems', () => {
  const problem1: Problem = {
    id: 1,
    title: 'title1',
    date: 'date1',
    is_open: false,
    tag: 'math',
    difficulty: 1,
    content: 'content1',
    userID: 1,
    username: 'creator1',
    solved_num: 1,
    recommended_num: 1,
  };
  const problem2: Problem = {
    id: 2,
    title: 'title2',
    date: 'date2',
    is_open: false,
    tag: 'math',
    difficulty: 2,
    content: 'content2',
    userID: 2,
    username: 'creator2',
    solved_num: 2,
    recommended_num: 2,
  };
  const problems: Problem[] = [problem1, problem2];
  const state = problemReducer(undefined, {
    type: GET_PROBLEMS,
    problems: problems,
  });
  expect(state).toEqual({
    problems: problems,
  });
});
});