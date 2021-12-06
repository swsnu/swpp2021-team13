import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { Redirect, RouteComponentProps } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Container, Button, Header } from 'semantic-ui-react';

import * as actionCreators from '../../../store/actions';
import * as r_interfaces from '../../../store/reducers/problemReducerInterface';
import * as a_interfaces from '../../../store/actions/problemActionInterface';
import MultipleChoiceProblemForm from '../../../components/ProblemForm/MultipleChoiceProblemForm';
import SubjectiveProblemForm from '../../../components/ProblemForm/SubjectiveProblemForm';
import { User } from '../../../store/reducers/userReducer';

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
  selectedUser: User
}

interface DispatchFromProps {
  onCreateProblem: (
    id: number,
    problemData: a_interfaces.CreateProblemRequest
  ) => void;
  onGetProblem: (id: number) => void;
  onUpdateProblem: (
    id: number,
    problemData: a_interfaces.UpdateProblemRequest
  ) => void;
  onDeleteProblem: (id: number) => void;
}

interface ProblemSetEditState {
  editingProblem: r_interfaces.ProblemType | null;
  needUpdate: boolean;
}

type Props = ProblemSetEditProps &
  MatchProps &
  typeof statePropTypes &
  typeof actionPropTypes;
type State = ProblemSetEditState;

class ProblemSetEdit extends Component<Props, State> {
  state = { editingProblem: null, needUpdate: false };

  componentDidUpdate() {
    if (this.props.selectedProblem && this.state.needUpdate) {
      this.setState({
        editingProblem: this.props.selectedProblem,
        needUpdate: false,
      });
    }
  }

  onClickDeleteButton = () => {
    this.props.onDeleteProblem(this.props.selectedProblem.id);
    this.setState({ editingProblem: null });
  };

  onClickProblemNumberButton = (number: number) => {
    this.props.onGetProblem(this.props.selectedProblemSet.problems[number]);
    this.setState({ needUpdate: true });
  }

  onClickNewProblemButton = (type: 'multiple-choice' | 'subjective') => {
    const newProblem = {
      problemSetID: Number(this.props.match.params.id),
      content: 'new problem',
    };
    if (type === 'multiple-choice') {
      const newMultipleChoiceProblem: a_interfaces.CreateMultipleChoiceProblemRequest =
        {
          ...newProblem,
          problemType: 'multiple-choice',
          choices: [],
          solution: [],
        };
      this.props.onCreateProblem(
        Number(this.props.match.params.id),
        newMultipleChoiceProblem
      );
    } else {
      const newSubjectiveProblem: a_interfaces.CreateSubjectiveProblemRequest =
        {
          ...newProblem,
          problemType: 'subjective',
          solutions: [],
        };
      this.props.onCreateProblem(
        Number(this.props.match.params.id),
        newSubjectiveProblem
      );
    }
  };

  editProblemHandler = (target: string, content?: any, index?: any) => {
    const newProblem: any = this.state.editingProblem;
    switch (target) {
      case 'content':
        newProblem.content = content;
        break;
      case 'add_choice':
        newProblem.choices.push('new choice');
        break;
      case 'choice_content':
        newProblem.choices[index] = content;
        break;
      case 'choice_solution':
        newProblem.solution.push(index);
        break;
      case 'choice_not_solution':
        newProblem.solution.splice(newProblem.solution.indexOf(index), 1);
        break;
      case 'choice_delete':
        newProblem.choices.splice(index, 1);
        break;
      case 'add_solution':
        newProblem.solutions.push('new solution');
        break;
      case 'solution_content':
        newProblem.solutions[index] = content;
        break;
      case 'solution_delete':
        newProblem.solutions.splice(index, 1);
        break;
    }
    this.setState({ editingProblem: newProblem });
  };

  onClickSaveButton = () => {
    const currentProblem: any = this.state.editingProblem;
    const updateProblem: any = {
      problemType: currentProblem.problemType,
      problemNumber: currentProblem.problemNumber,
      content: currentProblem.content,
    };
    if (updateProblem.problemType === 'multiple-choice') {
      updateProblem['choices'] = currentProblem.choices;
      updateProblem['solution'] = currentProblem.solution;
    } else {
      updateProblem['solutions'] = currentProblem.solutions;
    }
    this.props.onUpdateProblem(currentProblem.id, updateProblem);
    this.setState({ editingProblem: null });
  };

  render() {
    if (!this.props.selectedUser) {
      return <Redirect to="/" />;
    }

    const problemNumberButtons = this.props.selectedProblemSet.problems.map(
      (_, index) => (
        <Button
          key={index}
          primary
          size="mini"
          className={`P${index}Button`}
          onClick={() => this.onClickProblemNumberButton(index)}
        >
          {index+1}
        </Button>
      )
    );

    let currentProblem;
    if (this.state.editingProblem == null) {
      currentProblem = null;
    } else {
      const editingProblem: any = this.state.editingProblem;
      currentProblem = (
        <div>
          <Button
            primary
            size="small"
            className="DeleteButton"
            onClick={() => this.onClickDeleteButton()}
          >
            Delete
          </Button>
          {editingProblem.problemType === 'multiple-choice' ? (
            <MultipleChoiceProblemForm
              problem={this.state.editingProblem}
              editContent={this.editProblemHandler}
            />
          ) : (
            <SubjectiveProblemForm
              problem={this.state.editingProblem}
              editContent={this.editProblemHandler}
            />
          )}
          <Button
            primary
            size="small"
            className="SaveButton"
            onClick={() => this.onClickSaveButton()}
          >
            Save
          </Button>
        </div>
      );
    }

    return (
      <div className="ProblemSetEdit">
        <Container>
          <Header as="h1">ProblemSetEdit Page</Header>

          <NavLink
            id="problemsetedit-back"
            to={`/problem/${this.props.match.params.id}/detail/`}
          >
            Back to problem set detail
          </NavLink>

          <div>
            <Button
              primary
              size="small"
              className="NewMCPButton"
              onClick={() => this.onClickNewProblemButton('multiple-choice')}
            >
              new multiple choice problem
            </Button>
            <Button
              primary
              size="small"
              className="NewSPButton"
              onClick={() => this.onClickNewProblemButton('subjective')}
            >
              new subjective problem
            </Button>
          </div>

          {currentProblem ? currentProblem : problemNumberButtons}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    selectedProblemSet: state.problemset.selectedProblemSet,
    selectedProblem: state.problemset.selectedProblem,
    selectedUser: state.user.selectedUser,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onCreateProblem: (
      id: number,
      problem: a_interfaces.CreateProblemRequest
    ) => {
      dispatch(actionCreators.createProblem(id, problem));
    },
    onGetProblem: (id: number) => {
      dispatch(actionCreators.getProblem(id));
    },
    onUpdateProblem: (
      id: number,
      problem: a_interfaces.UpdateProblemRequest
    ) => {
      dispatch(actionCreators.updateProblem(id, problem));
    },
    onDeleteProblem: (id: number) => {
      dispatch(actionCreators.deleteProblem(id));
    },
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(ProblemSetEdit);
