import { ProblemSetAction } from '../actions/problemSetActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';
import * as interfaces from './problemReducerInterface';

export interface ProblemSetState {
  problemSets: interfaces.ProblemSetInterface[];
  solvers: interfaces.Solver[];
  selectedSolver: interfaces.Solver | null;
  isRecommender: boolean;
  selectedProblemSet: interfaces.ProblemSetWithProblemsInterface | null;
  selectedProblem: interfaces.ProblemType | null;
}

const initialState: ProblemSetState = {
  problemSets: [],
  solvers: [],
  selectedSolver: null,
  isRecommender: false,
  selectedProblemSet: null,
  selectedProblem: null,
};

export type ProblemReducer = Reducer<ProblemSetState, ProblemSetAction>;

const problemReducer: ProblemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_ALL_PROBLEMSETS:
      return { ...state, problemSets: action.problemSets };
    case actionTypes.GET_PROBLEMSET:
      return {
        ...state,
        selectedProblemSet: action.pset,
      };
    case actionTypes.GET_ALL_SOLVER_OF_PROBLEMSET:
      return { ...state, solvers: action.solvers };
    case actionTypes.GET_SOLVER:
      return { ...state, selectedSolver: action.solver };
    case actionTypes.GET_IS_RECOMMENDER:
    case actionTypes.UPDATE_RECOMMEND:
      return { ...state, isRecommender: action.isRecommender };
    case actionTypes.CREATE_PROBLEM_SET:
      return {
        ...state,
        problemSets: [...state.problemSets, action.problemSet],
      };
    case actionTypes.UPDATE_PROBLEMSET:
      return {
        ...state,
        selectedProblemSet: action.pset,
      };
    case actionTypes.DELETE_PROBLEMSET:
      const remainProblemSet = state.problemSets.filter((problemset) => {
        return problemset.id !== action.targetID;
      });
      return { ...state, problemSets: remainProblemSet };

    case actionTypes.CREATE_PROBLEM:
      if (state.selectedProblemSet === null) {
        break;
      }
      const afterCreateProblem = state.selectedProblemSet.problems;
      afterCreateProblem.push(action.newProblem.id);
      return {
        ...state,
        selectedProblemSet: {
          ...state.selectedProblemSet,
          problems: afterCreateProblem,
        },
        selectedProblem: action.newProblem,
      };

    case actionTypes.GET_PROBLEM:
      return { ...state, selectedProblem: action.selectedProblem };

    case actionTypes.DELETE_PROBLEM:
      if (state.selectedProblemSet === null) break;
      const afterDeleteProblem = state.selectedProblemSet.problems;
      afterDeleteProblem.splice(
        afterDeleteProblem.indexOf(action.targetProblemID),
        1
      );
      return {
        ...state,
        selectedProblemSet: {
          ...state.selectedProblemSet,
          problems: afterDeleteProblem,
        },
        selectedProblem: null,
      };

    default:
      break;
  }
  return state;
};

export default problemReducer;
