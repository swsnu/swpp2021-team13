import * as actionTypes from '../actions/actionTypes';
import problemReducer, { ProblemSetState } from './problemReducer';
import * as interfaces from './problemReducerInterface';
import * as a_interfaces from '../actions/problemActionInterface';
import { ProblemSetAction } from '../actions/problemSetActions';

describe('Problem Reducer', () => {
  it('should return default state', () => {
    const stubInitialState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    };
    const newState = problemReducer(undefined, {} as ProblemSetAction);
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
      selectedSolver: null,
      isRecommender: false,
      selectedProblem: null,
    });
  });

  it('should GET_PROBLEMSET', () => {
    const stubProblemSet: interfaces.ProblemSetWithProblemsInterface = {
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
      solvedNum: 1,
      recommendedNum: 1,
      problems: [],
    };
    const stubInitialState: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: stubProblemSet,
      selectedProblem: null,
    };
    const currentState = problemReducer(stubInitialState, {
      type: actionTypes.GET_PROBLEMSET,
      pset: stubProblemSet,
    });
    expect(currentState).toEqual({
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: stubProblemSet,
      selectedProblem: null,
    });
  });

  it('should GET_ALL_SOLVER_OF_PROBLEMSET', () => {
    const stubSolver: interfaces.Solver = {
      userID: 1,
      username: 'creator1',
      result: true,
      problems: [null],
    };
    const stubInitialState: ProblemSetState = {
      problemSets: [],
      solvers: [stubSolver],
      selectedSolver: null,
      isRecommender: false,
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
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    });
  });

  it('should CREATE_PROBLEM_SET', () => {
    const stubProblemSet: interfaces.ProblemSetInterface = {
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
      solvedNum: 1,
      recommendedNum: 1,
    };
    const stubProblemSetTrue: interfaces.ProblemSetInterface = {
      id: 1,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: true,
      tag: [['math']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solvedNum: 1,
      recommendedNum: 1,
    };
    const stubInitialState: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
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
      selectedSolver: null,
      isRecommender: false,
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
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    });
  });

  it('should DELETE_PROBLEMSET', () => {
    const stubProblemSet1: interfaces.ProblemSetInterface = {
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
      solvedNum: 1,
      recommendedNum: 1,
    };
    const stubProblemSet2: interfaces.ProblemSetInterface = {
      id: 2,
      title: 'title1',
      createdTime: 'create_time1',
      modifiedTime: 'modified_time1',
      isOpen: false,
      tag: [['math']],
      difficulty: 1,
      content: 'content1',
      userID: 1,
      username: 'creator1',
      solvedNum: 1,
      recommendedNum: 1,
    };
    const stubInitialState: ProblemSetState = {
      problemSets: [stubProblemSet1, stubProblemSet2],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    };
    let newState = problemReducer(stubInitialState, {
      type: actionTypes.DELETE_PROBLEMSET,
      targetID: 1,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet2],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    });
    newState = problemReducer(stubInitialState, {
      type: actionTypes.DELETE_PROBLEMSET,
      targetID: 2,
    });
    expect(newState).toEqual({
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    });
  });

  it('should CREATE_PROBLEM', () => {
    const stubProblemSet1: interfaces.ProblemSetWithProblemsInterface = {
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
      solvedNum: 0,
      recommendedNum: 0,
      problems: [],
    };
    const stubProblemSet2: interfaces.ProblemSetWithProblemsInterface = {
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
      solvedNum: 0,
      recommendedNum: 0,
      problems: [1],
    };
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
    const stubInitialState: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: stubProblemSet1,
      selectedProblem: null,
    };
    let newState = problemReducer(stubInitialState, {
      type: actionTypes.CREATE_PROBLEM,
      newProblem: stubProblem,
    });
    expect(newState).toEqual({
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: stubProblemSet2,
      selectedProblem: stubProblem,
    });

    const stubInitialState2: ProblemSetState = {
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    };
    let newState2 = problemReducer(stubInitialState2, {
      type: actionTypes.CREATE_PROBLEM,
      newProblem: stubProblem,
    });
    expect(newState2).toEqual({
      problemSets: [stubProblemSet1],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
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
    const stubInitialState: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
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
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: stubProblem,
    });
  });

  it('should DELETE_PROBLEM', () => {
    const stubProblemSet1: interfaces.ProblemSetWithProblemsInterface = {
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
      solvedNum: 0,
      recommendedNum: 0,
      problems: [1],
    };
    const stubProblemSet2: interfaces.ProblemSetWithProblemsInterface = {
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
      solvedNum: 0,
      recommendedNum: 0,
      problems: [],
    };
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
    const stubInitialState: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: stubProblemSet1,
      selectedProblem: stubProblem,
    };
    let newState = problemReducer(stubInitialState, {
      type: actionTypes.DELETE_PROBLEM,
      targetProblemID: 1,
    });
    expect(newState).toEqual({
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: stubProblemSet2,
      selectedProblem: null,
    });

    const stubInitialState2: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    };
    let newState2 = problemReducer(stubInitialState2, {
      type: actionTypes.DELETE_PROBLEM,
      targetProblemID: 1,
    });
    expect(newState2).toEqual({
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    });
  });
});
