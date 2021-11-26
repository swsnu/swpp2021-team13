import { ProblemSetAction, updateProblem } from '../actions/problemActions';
import * as actionTypes from '../actions/actionTypes';
import { Reducer } from 'redux';
import * as interfaces from './problemReducerInterface';

export interface ProblemSetState {
  problemSets: ProblemSetInterface[];
  solvers: Solver[];
  selectedProblemSet: interfaces.GetProblemSetResponse | null;
  selectedProblem: interfaces.GetProblemResponse | null;
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
    case actionTypes.EDIT_PROBLEM_SET:
      // const otherProblemSets = state.problemSets.filter((problemSet) => {
      //   return problemSet.id !== action.pset.id;
      // });
      const editProblemSets = {
        id: action.pset.id,
        title: action.pset.title,
        created_time: action.pset.created_time,
        is_open: action.pset.is_open,
        tag: action.pset.tag,
        difficulty: action.pset.difficulty,
        content: action.pset.content,
        userID: action.pset.userID,
        username: action.pset.username,
        solved_num: action.pset.solved_num,
        recommended_num: action.pset.recommended_num,
      };
      // const editProblems: NewProblemSet[] = [];
      // action.problems_list.forEach((problem) => {
      //   editProblems.push({
      //     index: problem.index,
      //     problem_type: problem.problem_type,
      //     problem_statement: problem.problem_statement,
      //     choice: problem.choice,
      //     solution: problem.solution,
      //     explanation: problem.explanation,
      //   });
      // });

      return {
        ...state,
        selectedProblemSet: editProblemSets,
      };

    case actionTypes.DELETE_PROBLEMSET:
      const remainProblemSet = state.problemSets.filter((problemset) => {
        return problemset.id !== action.targetID;
      });
      return { ...state, problemSets: remainProblemSet };

    case actionTypes.CREATE_PROBLEM:
      break;
    
    case actionTypes.GET_PROBLEM:
      return { ...state, selectedProblem: action.selectedProblem }

    case actionTypes.UPDATE_PROBLEM:
      const updatedProblem = {
        ...state.selectedProblem,
        problemType: action.selectedProblem.problemType,
        problemNumber: action.selectedProblem.problemNumber,
        content: action.selectedProblem.content
      }
      if (updatedProblem.problemType === 'multiple-choice') {
        const updatedMultipleChoiceProblem : any = action.selectedProblem;
        updatedProblem['choices'] = updatedMultipleChoiceProblem.choices;
      } else if (updatedProblem.problemType === 'subjective') {
        const updatedSubjectiveProblem : any = action.selectedProblem;
        updatedProblem['solutions'] = updatedSubjectiveProblem.solutions;
      }
      return { ...state, selectedProblem: updatedProblem }

    default:
      break;
  }
  return state;
};

export default problemReducer;
