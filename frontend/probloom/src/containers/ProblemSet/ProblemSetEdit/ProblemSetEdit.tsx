import { Component } from 'react';
import { connect } from 'react-redux';
import { returntypeof } from 'react-redux-typescript';
import { Redirect, RouteComponentProps } from 'react-router';
import { Container, Button, Header, Menu } from 'semantic-ui-react';

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
      const problemBuffer = Object.assign({}, this.props.selectedProblem);
      this.setState({
        editingProblem: problemBuffer,
        needUpdate: false,
      });
    }
  }

  onClickDeleteButton = () => {
    if (this.props.selectedProblemSet.problems.length === 1) {
      alert("Each problem set must have at least one problem");
      return;
    }
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
          choices: ["new choice"],
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
          solutions: ["new solution"],
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
        newProblem.choices[index-1] = content;
        break;
      case 'choice_solution':
        newProblem.solution.push(index);
        break;
      case 'choice_not_solution':
        newProblem.solution.splice(newProblem.solution.indexOf(index), 1);
        break;
      case 'choice_delete':
        if (newProblem.choices.length === 1) {
          alert("Multiple choice problem must have at least one choice");
          break;
        }
        newProblem.choices.splice(index-1, 1);
        newProblem.solution.splice(newProblem.solution.indexOf(index), 1);
        break;
      case 'add_solution':
        newProblem.solutions.push('new solution');
        break;
      case 'solution_content':
        newProblem.solutions[index-1] = content;
        break;
      case 'solution_delete':
        if (newProblem.solutions.length === 1) {
          alert("Subjective problem must have at least one solution");
          break;
        }
        newProblem.solutions.splice(index-1, 1);
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

  onClickBackButton = () => {
    this.props.history.push(`/problem/${this.props.match.params.id}/detail/`);
  }

  render() {
    if (!this.props.selectedUser) {
      return <Redirect to="/" />;
    }

    const problemNumberButtons = this.props.selectedProblemSet.problems.map(
      (_, index) => (
        <Menu.Item
          key={index}
          className={`P${index}Button`}
          onClick={() => this.onClickProblemNumberButton(index)}
        >
          {index+1}
        </Menu.Item>
      )
    );

    let currentProblem;
    if (this.state.editingProblem == null) {
      currentProblem = null;
    } else {
      const editingProblem: any = this.state.editingProblem;
      currentProblem = (
        <div>
          {editingProblem.problemType === 'multiple-choice' ? (
            <MultipleChoiceProblemForm
              problem={this.state.editingProblem}
              editContent={this.editProblemHandler}
              deleteProb={() => this.onClickDeleteButton()}
              saveProb={() => this.onClickSaveButton()}
            />
          ) : (
            <SubjectiveProblemForm
              problem={this.state.editingProblem}
              editContent={this.editProblemHandler}
              deleteProb={() => this.onClickDeleteButton()}
              saveProb={() => this.onClickSaveButton()}
            />
          )}
        </div>
      );
    }

    return (
      <div className="ProblemSetEdit">
        <Container text>
          <Header as="h1">ProblemSetEdit Page</Header>
          {currentProblem ? (
            currentProblem 
          ) : (
            <div>
              <Menu>
                <Menu.Item
                  className="NewMCPButton"
                  onClick={() => this.onClickNewProblemButton('multiple-choice')}
                >
                  new multiple choice
                </Menu.Item>
                <Menu.Item
                  className="NewSPButton"
                  onClick={() => this.onClickNewProblemButton('subjective')}
                >
                  new subjective
                </Menu.Item>
                {problemNumberButtons}
              </Menu>
              <Button
                secondary
                size="small"
                className="BackButton"
                onClick={() => this.onClickBackButton()}
              >
                Back
              </Button>
            </div>
          )}
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
