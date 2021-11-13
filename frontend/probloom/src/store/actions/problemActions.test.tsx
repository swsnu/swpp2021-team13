import axios from 'axios';
import { getAllProblemSets } from '.';
import { ProblemSet } from '../reducers/problemReducer';
import store, { AppDispatch } from '../store';
import * as actionCreators from './problemActions';

const dispatch = store.dispatch as AppDispatch;

describe('Get Problem List', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
    spy.mockClear();
  });

  test('getProblems fetches problems correctly', async () => {
    const stubProblems: ProblemSet[] = [
      {
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
      },
      {
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
      },
    ];

    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: stubProblems,
    }));
    await dispatch(getAllProblemSets());
    expect(spy).toHaveBeenCalledWith('/api/problem/');
    expect(store.getState().problemset.problemSets).toEqual(stubProblems);
  });
});

describe('Create & Edit ProblemSet', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
    spy.mockClear();
  });

  it('Test createProblemSet', async () => {
    const stubProblemSet = {
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
    const stubNewProblemSet = {
      index: 4,
      problem_type: 'stub-type',
      problem_statement: 'stub-statement',
      choice: ['stub-choice1', 'stub-choice2', 'stub-choice3', 'stub-choice4'],
      solution: 'stub-solution',
      explanation: 'stub-explanation',
    };
    const stubProblemSetCreateState = {
      title: 'stub-title',
      content: 'stub-content',
      scope: 'stub-scope',
      tag: 'stub-tag',
      difficulty: 'stub-difficulty',
      problems: [stubNewProblemSet],
      numberOfProblems: 1,
    };

    spy = jest.spyOn(axios, 'post').mockImplementation(async () => {
      return {
        status: 200,
        data: stubProblemSetCreateState,
      };
    });

    try {
      dispatch(
        actionCreators.createProblemSet(
          'stub-title',
          'stub-content',
          'stub-scope',
          'stub-tag',
          'stub-difficulty',
          [
            {
              index: 4,
              problem_type: 'stub-type',
              problem_statement: 'stub-statement',
              choice: [
                'stub-choice1',
                'stub-choice2',
                'stub-choice3',
                'stub-choice4',
              ],
              solution: 'stub-solution',
              explanation: 'stub-explanation',
            },
          ]
        )
      );
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.problemSets[0]).toEqual(stubProblemSet);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Test editProblemSet', async () => {
    const stubProblemSet = {
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
    const stubNewProblemSet = {
      index: 4,
      problem_type: 'stub-type',
      problem_statement: 'stub-statement',
      choice: ['stub-choice1', 'stub-choice2', 'stub-choice3', 'stub-choice4'],
      solution: 'stub-solution',
      explanation: 'stub-explanation',
    };
    const stubProblemSetCreateState = {
      title: 'stub-title',
      content: 'stub-content',
      scope: 'stub-scope',
      tag: 'stub-tag',
      difficulty: 'stub-difficulty',
      problems: [stubNewProblemSet],
      numberOfProblems: 1,
    };

    spy = jest.spyOn(axios, 'put').mockImplementation(async (_) => {
      return {
        status: 200,
        data: stubProblemSetCreateState,
      };
    });

    try {
      await dispatch(
        actionCreators.editProblemSet(
          3,
          'stub-title',
          'stub-content',
          'stub-scope',
          'stub-tag',
          'stub-difficulty',
          [
            {
              index: 4,
              problem_type: 'stub-type',
              problem_statement: 'stub-statement',
              choice: [
                'stub-choice1',
                'stub-choice2',
                'stub-choice3',
                'stub-choice4',
              ],
              solution: 'stub-solution',
              explanation: 'stub-explanation',
            },
          ]
        )
      );
    } catch (err) {}

    const newState = store.getState();
    expect(newState.problemset.problemSets[0]).toEqual(stubProblemSet);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('/api/problem/3/', {
      content: 'stub-content',
      difficulty: 'stub-difficulty',
      id: 3,
      problems: [
        {
          choice: [
            'stub-choice1',
            'stub-choice2',
            'stub-choice3',
            'stub-choice4',
          ],
          explanation: 'stub-explanation',
          index: 4,
          problem_statement: 'stub-statement',
          problem_type: 'stub-type',
          solution: 'stub-solution',
        },
      ],
      scope: 'stub-scope',
      tag: 'stub-tag',
      title: 'stub-title',
    });
  });
});
