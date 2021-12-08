import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  Button,
  Icon,
  Grid,
  Container,
  Form,
  Checkbox,
} from 'semantic-ui-react';
import { AppDispatch, RootState } from '../../../store/store';
import NotFound from '../../../components/NotFound/NotFound';
import { getProblemSet, getProblem } from '../../../store/actions';
import Latex from 'react-latex';
import axios from 'axios';

export type SolveProblemRequest =
  | SolveMultipleChoiceProblemRequest
  | SolveSubjectiveProblemRequest;

export interface SolveMultipleChoiceProblemRequest {
  solution: number[];
}

export interface SolveSubjectiveProblemRequest {
  solution: string;
}

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetSolveProps extends PropsFromRedux {
  history: any;
}

interface ProblemSetSolveState {
  subjectiveSolution: string;
  multipleChoiceSolution: number[];
  // for solving the problem that the choice is not automatically initialized.
  // *Caution*: Since the number of choices is fixed to 4, it can cause a bug.
  choiceChecker: boolean[];
  checkNum: number;
  isFinalSubmit: boolean;
}

let problemIDList: number[] = [];
class ProblemSetSolve extends Component<
  ProblemSetSolveProps & MatchProps,
  ProblemSetSolveState
> {
  constructor(props: ProblemSetSolveProps & MatchProps) {
    super(props);

    this.state = {
      subjectiveSolution: '',
      multipleChoiceSolution: [],
      choiceChecker: [false, false, false, false],
      checkNum: 0,
      isFinalSubmit: false,
    };
  }

  componentDidMount() {
    this.props.onGetProblemSet(parseInt(this.props.match.params.id));

    if (this.props.selectedProblemSet) {
      problemIDList = this.props.selectedProblemSet.problems;
      this.onClickNextButton();
    } else {
      return <NotFound />;
    }
  }

  onClickNextButton = () => {
    let problemID = problemIDList[this.state.checkNum];
    this.props.onGetProblem(problemID);
    this.setState({
      checkNum: this.state.checkNum + 1,
      subjectiveSolution: '',
      multipleChoiceSolution: [],
      choiceChecker: [false, false, false, false],
    });
  };

  onClickPrevButton = () => {
    let problemID = problemIDList[this.state.checkNum - 2];
    this.props.onGetProblem(problemID);
    this.setState({
      checkNum: this.state.checkNum - 1,
      subjectiveSolution: '',
      multipleChoiceSolution: [],
      choiceChecker: [false, false, false, false],
    });
  };

  onClickBackDetailButton = () => {
    this.props.history.push(
      '/problem/' + this.props.match.params.id + '/detail/'
    );
  };

  onClickBackSearchButton = () => {
    this.props.history.push('/problem/search/');
  };

  onClickSubmitButton = async (isSubjective: boolean) => {
    let pSol: SolveProblemRequest | null = null;
    if (isSubjective) {
      pSol = { solution: this.state.subjectiveSolution };
    } else {
      pSol = { solution: this.state.multipleChoiceSolution };
    }

    try {
      await axios.post(
        `/api/problem/${problemIDList[this.state.checkNum - 1]}/solve/`,
        pSol
      );
    } catch (error) {
      console.error(error);
    }

    this.setState({
      subjectiveSolution: '',
      multipleChoiceSolution: [],
      choiceChecker: [false, false, false, false],
    });

    if (this.state.checkNum === problemIDList.length) {
      this.setState({ isFinalSubmit: true });
    }

    this.onClickNextButton();
  };

  onClickResultButton = () => {
    this.props.history.push(
      '/problem/' + this.props.match.params.id + '/solve/result/'
    );
  };

  insert_or_delete = (arr: number[], num: number) => {
    let index = arr.indexOf(num);

    if (index > -1) {
      arr.splice(index, 1);
    } else {
      arr.push(num);
    }

    return arr.sort((a, b) => a - b);
  };

  onSelectChoice = (index: number) => {
    let new_multipleChoiceSolution = this.insert_or_delete(
      this.state.multipleChoiceSolution,
      index + 1
    );

    let new_choiceChecker = this.state.choiceChecker;
    new_choiceChecker[index] = !this.state.choiceChecker[index];

    this.setState({
      multipleChoiceSolution: new_multipleChoiceSolution,
      choiceChecker: new_choiceChecker,
    });
  };

  render() {
    if (!this.props.selectedUser) {
      return <Redirect to="/" />;
    }

    if (!this.props.selectedProblem) {
      return <NotFound />;
    }

    // For avoiding type error
    let problem: any = this.props.selectedProblem;

    return (
      <div className="ProblemSetSolve">
        <Container text>
          <Grid columns="equal">
            <Grid.Column>
              <Button
                primary
                size="small"
                className="backDetailButton"
                onClick={() => this.onClickBackDetailButton()}
              >
                Back to detail page
              </Button>
              <Button
                secondary
                size="small"
                className="backSearchButton"
                onClick={() => this.onClickBackSearchButton()}
              >
                Back to search page
              </Button>
            </Grid.Column>
          </Grid>
          {!this.state.isFinalSubmit && (
            <Grid>
              <Grid.Column width={10}>
                <Form>
                  <Form.Field>
                    <h2>Promblem {this.state.checkNum}</h2>
                    <Latex className="latex">{problem.content}</Latex>
                    {problem.problemType === 'subjective' && (
                      <Form.TextArea
                        className="subjectiveSolution"
                        label="Sol"
                        placeholder="Enter your answer"
                        value={this.state.subjectiveSolution}
                        onChange={(event) => {
                          this.setState({
                            subjectiveSolution: event.target.value,
                          });
                        }}
                      />
                    )}
                    {problem.problemType === 'multiple-choice' &&
                      problem.choices.map((content, index) => (
                        <div className="Choice">
                          <Form.Field>
                            <Checkbox
                              name="checkbox"
                              checked={this.state.choiceChecker[index]}
                              onChange={() => this.onSelectChoice(index)}
                            ></Checkbox>
                            <Latex>{content}</Latex>
                          </Form.Field>
                        </div>
                      ))}
                  </Form.Field>
                  {this.state.checkNum > 1 && (
                    <Button
                      className="prevButton"
                      onClick={() => this.onClickPrevButton()}
                      icon
                      labelPosition="left"
                    >
                      Prev
                      <Icon className="left arrow" />
                    </Button>
                  )}
                  <Button
                    className="submitButton"
                    onClick={() =>
                      this.onClickSubmitButton(
                        this.props.selectedProblem!.problemType === 'subjective'
                      )
                    }
                    type="submit"
                    content="Submit"
                  />
                  {this.state.checkNum > 0 &&
                    this.state.checkNum < problemIDList.length && (
                      <Button
                        className="nextButton"
                        onClick={() => this.onClickNextButton()}
                        icon
                        labelPosition="right"
                      >
                        Skip
                        <Icon className="right arrow" />
                      </Button>
                    )}
                </Form>
              </Grid.Column>
            </Grid>
          )}
          {this.state.isFinalSubmit && (
            <Grid columns="equal" textAlign="center">
              <Grid.Column>
                <Button
                  size="small"
                  className="resultButton"
                  onClick={() => this.onClickResultButton()}
                >
                  Go Result!
                </Button>
              </Grid.Column>
            </Grid>
          )}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    selectedUser: state.user.selectedUser,
    selectedProblemSet: state.problemset.selectedProblemSet,
    selectedProblem: state.problemset.selectedProblem,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    onGetProblemSet: (problemSetID: number) =>
      dispatch(getProblemSet(problemSetID)),
    onGetProblem: (problemID: number) => {
      dispatch(getProblem(problemID));
    },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProblemSetSolve);
