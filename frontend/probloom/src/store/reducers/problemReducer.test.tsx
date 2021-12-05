import * as actionTypes from '../actions/actionTypes';
import problemReducer from './problemReducer';
import * as interfaces from './problemReducerInterface';
import * as a_interfaces from '../actions/problemActionInterface';

describe('Problem Reducer', () => {
  it('should return default state', () => {
    const stubInitialState = {
      problemSets: [],
      solvers: [],
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
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
      solvedNum: 1,
      recommendedNum: 1,
      problems: [1],
    };
    const problemset2: interfaces.ProblemSetInterface = {
      id: 2,
      title: 'title2',
      createdTime: 'create_time2',
      modifiedTime: 'modified_time',
      isOpen: false,
      tag: [['math']],
      difficulty: 2,
      content: 'content2',
      userID: 2,
      username: 'creator2',
      solvedNum: 1,
      recommendedNum: 2,
      problems: [2],
    };
    const problemSets: interfaces.ProblemSetInterface[] = [
      problemset1,
      problemset2,
    ];
    const state = problemReducer(undefined, {
      type: actionTypes.GET_ALL_PROBLEMSETS,
      problemSets: problemSets,
    });
    expect(state).toEqual({
      problemSets: problemSets,
      selectedProblemSet: null,
      solvers: [],
      isRecommender: false,
      selectedProblem: null,
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
      selectedProblem: null,
    };
    const currentState = problemReducer(stubInitialState, {
      type: actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET,
      solvers: [stubSolver],
    });
    expect(currentState).toEqual({
      problemSets: [],
      solvers: [stubSolver],
      selectedProblemSet: null,
      selectedProblem: null,
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
      selectedProblem: null,
    };
    const newState = problemReducer(stubInitialState, {
      type: actionTypes.CREATE_PROBLEM_SET,
      problemSet: stubProblemSet,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: null,
    });
    const newStateTrue = problemReducer(stubInitialState, {
      type: actionTypes.CREATE_PROBLEM_SET,
      problemSet: stubProblemSetTrue,
    });
    expect(newStateTrue).toEqual({
      problemSets: [stubProblemSetTrue],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: null,
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

  it('should CREATE_PROBLEM', () => {
    const stubProblemSet1 = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['math']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solverIDs: [],
      recommendedNum: 0,
      problems: [],
    };
    const stubProblemSet2 = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['math']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solverIDs: [],
      recommendedNum: 0,
      problems: [1],
    };
    const stubInitialState = {
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedProblemSet: stubProblemSet1,
      selectedProblem: null,
    };
    let newState = problemReducer(stubInitialState, {
      type: actionTypes.CREATE_PROBLEM,
      newProblemID: 1,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet2],
      solvers: [],
      selectedProblemSet: stubProblemSet2,
      selectedProblem: null,
    });

    const stubInitialState2 = {
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: null,
    };
    let newState2 = problemReducer(stubInitialState2, {
      type: actionTypes.CREATE_PROBLEM,
      newProblemID: 1,
    });
    expect(newState2).toEqual({
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: null,
    });
  });

  it('should GET_PROBLEM', () => {
    const stubProblem: a_interfaces.GetMultipleChoiceProblemResponse = {
      id: 1,
      problemType: 'multiple-choice',
      problemSetID: 1,
      problemNumber: 1,
      creatorID: 1,
      createdTime: 'created_time',
      content: 'content',
      solverIDs: [],
      choices: [],
    };
    const stubInitialState = {
      problemSets: [],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: null,
    };
    let newState = problemReducer(stubInitialState, {
      type: actionTypes.GET_PROBLEM,
      selectedProblem: stubProblem,
    });
    expect(newState).toEqual({
      problemSets: [],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: stubProblem,
    });
  });

  it('should DELETE_PROBLEM', () => {
    const stubProblemSet1 = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['math']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solverIDs: [],
      recommendedNum: 0,
      problems: [1],
    };
    const stubProblemSet2 = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['math']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solverIDs: [],
      recommendedNum: 0,
      problems: [],
    };
    const stubInitialState = {
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedProblemSet: stubProblemSet1,
      selectedProblem: null,
    };
    let newState = problemReducer(stubInitialState, {
      type: actionTypes.DELETE_PROBLEM,
      targetProblemID: 1,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet2],
      solvers: [],
      selectedProblemSet: stubProblemSet2,
      selectedProblem: null,
    });

    const stubInitialState2 = {
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: null,
    };
    let newState2 = problemReducer(stubInitialState2, {
      type: actionTypes.DELETE_PROBLEM,
      targetProblemID: 1,
    });
    expect(newState2).toEqual({
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedProblemSet: null,
      selectedProblem: null,
    });
  });
});
