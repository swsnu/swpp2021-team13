import * as actionTypes from '../actions/actionTypes';
import problemReducer from './problemReducer';
import * as interfaces from './problemReducerInterface';

describe('Problem Reducer', () => {
  it('should return default state', () => {
    const stubInitialState = {
      problemSets: [],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    };
    const newState = problemReducer(undefined, {});
    expect(newState).toEqual(stubInitialState);
  });

  test('gets problemsets', () => {
    const problemset1: interfaces.ProblemSetInterface = {
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
      solverIDs: [1],
      recommendedNum: 1,
      problems: [1],
    };
    const problemset2: interfaces.ProblemSetInterface = {
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
    const problemSets: interfaces.ProblemSetInterface[] = [problemset1, problemset2];
    const state = problemReducer(undefined, {
      type: actionTypes.GET_ALL_PROBLEMSETS,
      problemSets: problemSets,
    });
    expect(state).toEqual({
      problemSets: problemSets,
      selectedProblemSet: null,
      solvers: [],
      selectedProblems: [],
    });
  });

  it('should GET_PROBLEMSET', () => {
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
    const stubInitialState = {
      problemSets: [],
      solvers: [],
      selectedProblemSet: stubProblemSet,
      selectedProblems: [stubNewProblemSet],
    };
    const currentState = problemReducer(stubInitialState, {
      type: actionTypes.GET_PROBLEMSET,
      pset: stubProblemSet,
      problems_list: [stubNewProblemSet],
    });
    expect(currentState).toEqual({
      problemSets: [],
      solvers: [],
      selectedProblemSet: stubProblemSet,
      selectedProblems: [stubNewProblemSet],
    });
  });

  it('should GET_ALL_SOLVER_OF_PROBLEMSET', () => {
    const stubSolver = {
      userID: 1,
      username: 'creator1',
      problemID: 1,
      problemtitle: 'problem1',
      result: true,
    };
    const stubInitialState = {
      problemSets: [],
      solvers: [stubSolver],
      selectedProblemSet: null,
      selectedProblems: [],
    };
    const currentState = problemReducer(stubInitialState, {
      type: actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET,
      solvers: [stubSolver],
    });
    expect(currentState).toEqual({
      problemSets: [],
      solvers: [stubSolver],
      selectedProblemSet: null,
      selectedProblems: [],
    });
  });

  it('should CREATE_PROBLEM_SET', () => {
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
    const stubProblemSetTrue = {
      id: 1,
      title: 'title1',
      created_time: 'create_time1',
      is_open: true,
      tag: 'math',
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solved_num: 1,
      recommended_num: 1,
    };
    const stubInitialState = {
      problemSets: [],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    };
    const newState = problemReducer(stubInitialState, {
      type: actionTypes.CREATE_PROBLEM_SET,
      problemSet: stubProblemSet,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    });
    const newStateTrue = problemReducer(stubInitialState, {
      type: actionTypes.CREATE_PROBLEM_SET,
      problemSet: stubProblemSetTrue,
    });
    expect(newStateTrue).toEqual({
      problemSets: [stubProblemSetTrue],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    });
  });

  it('should EDIT_PROBLEM_SET', () => {
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
    const newState = problemReducer(undefined, {
      type: actionTypes.EDIT_PROBLEM_SET,
      pset: stubProblemSet,
      problems_list: [stubNewProblemSet],
    });
    expect(newState).toEqual({
      problemSets: [],
      solvers: [],
      selectedProblemSet: stubProblemSet,
      selectedProblems: [],
    });
  });

  it('should DELETE_PROBLEMSET', () => {
    const stubProblemSet1 = {
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
    const stubProblemSet2 = {
      id: 2,
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
    const stubInitialState = {
      problemSets: [stubProblemSet1, stubProblemSet2],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    };
    let newState = problemReducer(stubInitialState, {
      type: actionTypes.DELETE_PROBLEMSET,
      targetID: 1,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet2],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    });
    newState = problemReducer(stubInitialState, {
      type: actionTypes.DELETE_PROBLEMSET,
      targetID: 2,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    });
  });
});
