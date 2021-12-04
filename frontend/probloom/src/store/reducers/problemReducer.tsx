import { ProblemSetAction } from '../actions/problemSetActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';
import * as interfaces from './problemReducerInterface';

export interface ProblemSetState {
  problemSets: interfaces.ProblemSetInterface[];
  solvers: interfaces.Solver[];
  selectedProblemSet: interfaces.ProblemSetInterface | null;
  selectedProblem: interfaces.ProblemType | null;
}

const initialState: ProblemSetState = {
  problemSets: [],
  solvers: [],
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
      if (state.selectedProblemSet === null) break;
      const afterCreateProblem = state.selectedProblemSet.problems;
      afterCreateProblem.push(action.newProblemID);
      return {
        ...state,
        selectedProblemSet: {
          ...state.selectedProblemSet,
          problems: afterCreateProblem,
        },
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
