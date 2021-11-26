import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';

import * as actionCreators from '../../../store/actions/index';
import * as interfaces from '../../../store/reducers/problemReducerInterface';
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
  selectedProblemSet: interfaces.GetProblemSetResponse;
  selectedProblem: interfaces.GetProblemResponse;
}

interface DispatchFromProps {
  onCreateProblem: (id: number, problemData: interfaces.CreateProblemRequest) => void;
  onGetProblem: (id: number) => void;
  onUpdateProblem: (id: number, problemData: interfaces.UpdateProblemRequest) => void;
}

interface ProblemSetEditState {
  editingProblem: interfaces.GetProblemResponse | null;
}

type Props = ProblemSetEditProps &
  MatchProps &
  typeof statePropTypes &
  typeof actionPropTypes;
type State = ProblemSetEditState;

class ProblemSetEdit extends Component<Props, State> {
  state = { editingProblem: null }

  onClickProblemNumberButton = (number: number) => {
    this.props.onGetProblem(this.props.selectedProblemSet.problems[number]);
    this.setState({ editingProblem: this.props.selectedProblem })
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
    } else if (updateProblem.problemType === 'subjective') {
      updateProblem['solutions'] = currentProblem.solutions;
    }
    this.props.onUpdateProblem(
      currentProblem.id, 
      updateProblem
    )
  };

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
        newProblem.choices.push({ content: 'new choice' }); break;
      case 'choice_content':
        newProblem.choices[index].content = content; break;
      case 'choice_solution':
        newProblem.solution.push(index); break;
      case 'choice_not_solution':
        newProblem.solution.splice(newProblem.solutions.indexOf(index), 1); break;
      case 'add_solution':
        newProblem.solutions.push({ content: 'new solution' }); break;
      case 'solution_content':
        newProblem.solutions[index].content = content; break;
    }
    this.setState({ editingProblem: newProblem })
  }

  render() {
    const problemNumberButtons = this.props.selectedProblemSet.problems
      .map((_, index) => <button onClick={() => this.onClickProblemNumberButton(index)} />);

    let currentProblem;
    if (this.state.editingProblem == null) {
      currentProblem = null;
    } else {
      const editingProblem : any = this.state.editingProblem;
      currentProblem = editingProblem.problemType === 'multiple-choice' ?
        <MultipleChoiceProblemForm 
          problem={this.state.editingProblem}
          editContent={this.editProblemHandler}
        />
      : <SubjectiveProblemForm
          problem={this.state.editingProblem}
          editContent={this.editProblemHandler}
        />
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
        {problemNumberButtons}

        {currentProblem}

        <div className="SubmitProblemSetButton">
          <button
            id="problemsetedit-submit"
            onClick={() => this.onClickSaveButton()}
          >
            Save
          </button>
        </div>
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
    onCreateProblem: (id: number, problem: interfaces.CreateProblemRequest) => {
      dispatch(actionCreators.createProblem(id, problem)); 
    },
    onGetProblem: (id: number) => {
      dispatch(actionCreators.getProblem(id)); 
    },
    onUpdateProblem: (id: number, problem: interfaces.UpdateProblemRequest) => {
      dispatch(actionCreators.updateProblem(id, problem)); 
    },
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetEdit);
