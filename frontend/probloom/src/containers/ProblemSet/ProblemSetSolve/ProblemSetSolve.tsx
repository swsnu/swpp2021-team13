import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  Button,
  Icon,
  Container,
  Form,
  Header,
  Input,
} from 'semantic-ui-react';
import { AppDispatch, RootState } from '../../../store/store';
import NotFound from '../../../components/NotFound/NotFound';
import { getProblemSet, getProblem } from '../../../store/actions';
import Latex from 'react-latex';

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetSolveProps extends PropsFromRedux {
  history: any;
}

interface ProblemSetSolveState {
  subjectSolution: Object;
  choiceSolution: Object;
  checkNum: number;
}

let problemIDList: number[] = [];
class ProblemSetSolve extends Component<
  ProblemSetSolveProps & MatchProps,
  ProblemSetSolveState
> {
  constructor(props: ProblemSetSolveProps & MatchProps) {
    super(props);

    this.state = {
      subjectSolution: {},
      choiceSolution: {},
      checkNum: 0,
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
    let problemTab = problemIDList[this.state.checkNum];
    this.props.onGetProblem(problemTab);
    this.setState({
      checkNum: this.state.checkNum + 1,
    });
  };

  onClickPrevButton = () => {
    let problemTab = problemIDList[this.state.checkNum - 2];
    this.props.onGetProblem(problemTab);
    this.setState({
      checkNum: this.state.checkNum - 1,
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

  render() {
    if (!this.props.selectedUser) {
      return <Redirect to="/" />;
    }

    return (
      <div className="ProblemSetSolve">
        <Button
          primary
          size="small"
          className="backDetailButton"
          onClick={() => this.onClickBackDetailButton()}
        >
          Back to detail page
        </Button>
        <Button
          primary
          size="small"
          className="backSearchButton"
          onClick={() => this.onClickBackSearchButton()}
        >
          Back to search page
        </Button>
        {this.state.checkNum > 1 && (
          <div className="Problem_prev">
            <Button
              primary
              size="small"
              className="prevButton"
              onClick={() => this.onClickPrevButton()}
              icon
              labelPosition="left"
            >
              Prev
              <Icon className="left arrow" />
            </Button>
          </div>
        )}
        <Latex displayMode={true}>{this.props.selectedProblem?.content}</Latex>
        {this.state.checkNum > 0 && this.state.checkNum < problemIDList.length && (
          <div className="Problem_next">
            <Button
              primary
              size="small"
              className="nextButton"
              onClick={() => this.onClickNextButton()}
              icon
              labelPosition="right"
            >
              Next
              <Icon className="right arrow" />
            </Button>
          </div>
        )}
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
