import axios from 'axios';
import { getAllProblemSets } from '.';
import { ProblemSetInterface, ProblemSetWithProblemsInterface } from '../reducers/problemReducerInterface';
import * as a_interfaces from './problemActionInterface';
import store, { AppDispatch } from '../store';
import * as actionCreators from './problemSetActions';

const dispatch = store.dispatch as AppDispatch;

describe('Get Problem List', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
    spy.mockClear();
  });

  test('getProblems fetches problems correctly', async () => {
    const stubProblems: ProblemSetInterface[] = [
      {
        id: 1,
        title: 'title1',
        createdTime: 'create_time1',
        modifiedTime: 'modified_time1',
        isOpen: false,
        tag: [['tag1'], ['tag2']],
        difficulty: 1,
        content: 'content1',
        userID: 1,
        username: 'creator1',
        solvedNum: 1,
        recommendedNum: 1,
      },
      {
        id: 2,
        title: 'title2',
        createdTime: 'create_time2',
        modifiedTime: 'modified_time2',
        isOpen: false,
        tag: [['tag1'], ['tag2']],
        difficulty: 2,
        content: 'content2',
        userID: 2,
        username: 'creator2',
        solvedNum: 1,
        recommendedNum: 2,
      },
    ];

    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: stubProblems,
    }));
    await dispatch(getAllProblemSets());
    expect(spy).toHaveBeenCalledWith('/api/problem_set/');
    expect(store.getState().problemset.problemSets).toEqual(stubProblems);
  });

  it('Test getProblemSet', async () => {
    const stubProblemSet : ProblemSetWithProblemsInterface = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['tag1'], ['tag2']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solvedNum: 1,
      recommendedNum: 1,
      problems: [1],
    };

    spy = jest.spyOn(axios, 'get').mockImplementation(async () => {
      return {
        status: 200,
        data: stubProblemSet,
      };
    });

    try {
      await dispatch(actionCreators.getProblemSet(0));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.selectedProblemSet).toEqual(stubProblemSet);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Test getAllSolvers', async () => {
    const stubSolver = {
      userID: 1,
      username: 'creator1',
      problemID: 1,
      problemtitle: 'problem1',
      result: true,
    };

    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: [stubSolver],
    }));

    try {
      await dispatch(actionCreators.getAllSolvers(0));
    } catch (err) {}

    const newState = store.getState();
    // console.log('newState.problemset', newState.problemset);

    expect(newState.problemset.solvers[0]).toEqual(stubSolver);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('/api/problem_set/0/solvers/');
  });
});

describe('Create & Edit ProblemSet', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
    spy.mockClear();
  });

  it('Test createProblemSet', async () => {
    const stubProblemSet : ProblemSetWithProblemsInterface = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['tag1'], ['tag2']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solvedNum: 1,
      recommendedNum: 1,
      problems: [1],
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
      await dispatch(
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
    expect(newState.problemset.problemSets.length).toEqual(3);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Delete ProblemSet', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
    spy.mockClear();
  });

  it('Test updateProblemSet', async () => {
    const stubProblemSet : ProblemSetWithProblemsInterface = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['tag1'], ['tag2']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solvedNum: 1,
      recommendedNum: 1,
      problems: [1],
    };

    spy = jest.spyOn(axios, 'put').mockImplementation(async () => {
      return {
        status: 200,
        data: stubProblemSet,
      };
    });

    try {
      await dispatch(actionCreators.updateProblemSet(0));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.selectedProblemSet).toEqual(stubProblemSet);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Test deleteProblemSet', async () => {
    const stubProblemSet = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['tag1'], ['tag2']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solvedNum: 1,
      recommendedNum: 1,
      problems: [1],
    };

    spy = jest.spyOn(axios, 'delete').mockImplementation(async () => {
      return {
        status: 200,
        data: 0,
      };
    });

    try {
      dispatch(actionCreators.deleteProblemSet(0));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.selectedProblemSet).toEqual(stubProblemSet);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('Problem', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    jest.clearAllMocks();
    spy.mockClear();
  });

  it('Test getProblem', async () => {
    const stubProblem : a_interfaces.GetMultipleChoiceProblemResponse = {
      id: 1,
      problemType: 'multiple-choice',
      problemSetID: 1,
      problemNumber: 1,
      creatorID: 1,
      createdTime: 'createdTime',
      content: 'content',
      solverIDs: [],
      choices: [],
    }

    spy = jest.spyOn(axios, 'get').mockImplementation(async () => {
      return {
        status: 200,
        data: stubProblem,
      };
    });

    try {
      await dispatch(actionCreators.getProblem(1));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.selectedProblem).toEqual(stubProblem);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Test updateProblem', async () => {
    const stubProblem : a_interfaces.GetMultipleChoiceProblemResponse = {
      id: 1,
      problemType: 'multiple-choice',
      problemSetID: 1,
      problemNumber: 1,
      creatorID: 1,
      createdTime: 'createdTime',
      content: 'stub_content',
      solverIDs: [],
      choices: [],
    }

    const stubUpdateMultipleChoiceProblemRequest : a_interfaces.UpdateMultipleChoiceProblemRequest = {
      problemType: 'multiple-choice',
      content: 'stub_content',
      choices: []
    }

    spy = jest.spyOn(axios, 'put').mockImplementation(async () => {
      return {
        status: 200,
        data: stubProblem,
      };
    });

    try {
      await dispatch(actionCreators.updateProblem(1, stubUpdateMultipleChoiceProblemRequest));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.selectedProblem).toEqual(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Test createProblem', async () => {
    const stubProblem : a_interfaces.GetMultipleChoiceProblemResponse = {
      id: 2,
      problemType: 'multiple-choice',
      problemSetID: 1,
      problemNumber: 2,
      creatorID: 1,
      createdTime: 'createdTime',
      content: 'content',
      solverIDs: [],
      choices: [],
    }
    const stubCreateProblemRequest : a_interfaces.CreateMultipleChoiceProblemRequest= {
      problemType: 'multiple-choice',
      problemSetID: 2,
      problemNumber: 2,
      content: 'stub_content',
      choices: [],
    }

    spy = jest.spyOn(axios, 'post').mockImplementation(async () => {
      return {
        status: 200,
        data: stubProblem,
      };
    });

    try {
      await dispatch(actionCreators.createProblem(1, stubCreateProblemRequest));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.selectedProblemSet?.problems).toEqual([1, 2]);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('Test deleteProblem', async () => {
    spy = jest.spyOn(axios, 'delete').mockImplementation(async () => {
      return {
        status: 200,
      };
    });

    try {
      await dispatch(actionCreators.deleteProblem(2));
    } catch (err) {}
    const newState = store.getState();
    expect(newState.problemset.selectedProblemSet?.problems).toEqual([1]);
    expect(newState.problemset.selectedProblem).toEqual(null);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
