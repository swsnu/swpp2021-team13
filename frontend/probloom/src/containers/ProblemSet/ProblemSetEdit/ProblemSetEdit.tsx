import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

import * as actionCreators from '../../../store/actions';
import * as r_interfaces from '../../../store/reducers/problemReducerInterface';
import * as a_interfaces from '../../../store/actions/problemActionInterface';
import MultipleChoiceProblemForm from '../../../components/ProblemForm/MultipleChoiceProblemForm';
import SubjectiveProblemForm from '../../../components/ProblemForm/SubjectiveProblemForm';

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetEditProps {
  history: any;
}

interface StateFromProps {
  selectedProblemSet: r_interfaces.ProblemSetWithProblemsInterface;
  selectedProblem: r_interfaces.ProblemType;
}

interface DispatchFromProps {
  onCreateProblem: (id: number, problemData: a_interfaces.CreateProblemRequest) => void;
  onGetProblem: (id: number) => void;
  onUpdateProblem: (id: number, problemData: a_interfaces.UpdateProblemRequest) => void;
  onDeleteProblem: (id: number) => void;
}

interface ProblemSetEditState {
  editingProblem: r_interfaces.ProblemType | null;
}

type Props = ProblemSetEditProps &
  MatchProps &
  typeof statePropTypes &
  typeof actionPropTypes;
type State = ProblemSetEditState;

class ProblemSetEdit extends Component<Props, State> {
  state = { editingProblem: null }

  onClickDeleteButton = () => {
    this.props.onDeleteProblem(this.props.selectedProblem.id)
  }

  onClickProblemNumberButton = (number: number) => {
    this.props.onGetProblem(this.props.selectedProblemSet.problems[number]);
    this.setState({ editingProblem: this.props.selectedProblem })
  }

  onClickNewProblemButton = (type: "multiple-choice" | "subjective") => {
    const newProblem  = {
      problemSetID: Number(this.props.match.params.id),
      content: 'new problem',
    }
    if (type === "multiple-choice") {
      const newMultipleChoiceProblem : a_interfaces.CreateMultipleChoiceProblemRequest= {
        ...newProblem, problemType: "multiple-choice", choices: []
      }
      this.props.onCreateProblem(
        Number(this.props.match.params.id), 
        newMultipleChoiceProblem
      );
    } else {
      const newSubjectiveProblem : a_interfaces.CreateSubjectiveProblemRequest= {
        ...newProblem, problemType: "subjective", solutions: []
      }
      this.props.onCreateProblem(
        Number(this.props.match.params.id), 
        newSubjectiveProblem
      );
    }
  }

  editProblemHandler = (
    target: string,
    content?: any,
    index?: any,
  ) => {
    const newProblem : any = this.state.editingProblem;
    switch (target) {
      case 'content':
        newProblem.content = content; break;
      case 'add_choice':
        newProblem.choices.push('new choice'); break;
      case 'choice_content':
        newProblem.choices[index] = content; break;
      case 'choice_solution':
        newProblem.solution.push(index); break;
      case 'choice_not_solution':
        newProblem.solution.splice(newProblem.solution.indexOf(index), 1); break;
      case 'add_solution':
        newProblem.solutions.push('new solution'); break;
      case 'solution_content':
        newProblem.solutions[index] = content; break;
    }
    this.setState({ editingProblem: newProblem })
  }

  onClickSaveButton = () => {
    const currentProblem : any = this.state.editingProblem;
    const updateProblem : any = {
      problemType: currentProblem.problemType,
      problemNumber: currentProblem.problemNumber,
      content: currentProblem.content,
    }
    if (updateProblem.problemType === 'multiple-choice') {
      updateProblem['choices'] = currentProblem.choices;
      updateProblem['solution'] = currentProblem.solution;
    } else {
      updateProblem['solutions'] = currentProblem.solutions;
    }
    this.props.onUpdateProblem(
      currentProblem.id, 
      updateProblem
    )
  };

  render() {
    const problemNumberButtons = this.props.selectedProblemSet.problems
      .map((_, index) => (
        <button
          key={index}
          id={`problemsetedit-p${index}`}
          onClick={() => this.onClickProblemNumberButton(index)}>
          {index}
        </button>
      ));

    let currentProblem;
    if (this.state.editingProblem == null) {
      currentProblem = null;
    } else {
      const editingProblem : any = this.state.editingProblem;
      currentProblem = 
      <div>
        <button id="problemsetedit-delete"
          onClick={() => this.onClickDeleteButton()}>Delete</button>
        {editingProblem.problemType === 'multiple-choice' ?
          <MultipleChoiceProblemForm 
            problem={this.state.editingProblem}
            editContent={this.editProblemHandler}
          />
        : <SubjectiveProblemForm
            problem={this.state.editingProblem}
            editContent={this.editProblemHandler}
          />
        }
        <button id="problemsetedit-save" 
          onClick={() => this.onClickSaveButton()}>Save</button>
      </div>
    }

    return (
      <div className="ProblemSetEdit">
        <h1>ProblemSetEdit Page</h1>

        <NavLink
          id="problemsetedit-back"
          to={`/problem/${this.props.match.params.id}/detail/`}
        >
          Back to problem set search
        </NavLink>

        <div>
          <button id="problemsetedit-newmcp"
            onClick={() => this.onClickNewProblemButton("multiple-choice")} />
          <button id="problemsetedit-newsp"
            onClick={() => this.onClickNewProblemButton("subjective")} />
        </div>

        {problemNumberButtons}
        {currentProblem}
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    selectedProblemSet: state.problemset.selectedProblemSet,
    selectedProblem: state.problemset.selectedProblem,
  }
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onCreateProblem: (id: number, problem: a_interfaces.CreateProblemRequest) => {
      dispatch(actionCreators.createProblem(id, problem)); 
    },
    onGetProblem: (id: number) => {
      dispatch(actionCreators.getProblem(id)); 
    },
    onUpdateProblem: (id: number, problem: a_interfaces.UpdateProblemRequest) => {
      dispatch(actionCreators.updateProblem(id, problem)); 
    },
    onDeleteProblem: (id: number) => {
      dispatch(actionCreators.deleteProblem(id));
    }
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetEdit);
