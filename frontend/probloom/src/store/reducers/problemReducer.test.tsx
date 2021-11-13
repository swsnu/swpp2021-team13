import { GET_ALL_PROBLEMSETS } from '../actions/actionTypes';
import problemReducer, { ProblemSet } from './problemReducer';

describe('Problem Reducer', () => {
  test('gets problemsets', () => {
    const problemset1: ProblemSet = {
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
    };
    const problemset2: ProblemSet = {
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
    };
    const problemSets: ProblemSet[] = [problemset1, problemset2];
    const state = problemReducer(undefined, {
      type: GET_ALL_PROBLEMSETS,
      problemSets: problemSets,
    });
    expect(state).toEqual({
      problemSets: problemSets,
      selectedProblemSet: null,
      solvers: [],
      selectedProblems: [],
    });
  });
});
