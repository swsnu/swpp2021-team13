import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router';
import { Button, Icon, Grid, Container, Card } from 'semantic-ui-react';
import { AppDispatch, RootState } from '../../../store/store';
import NotFound from '../../../components/NotFound/NotFound';
import { getSolver } from '../../../store/actions';

interface MatchParams {
  id: string;
}

interface MatchProps extends RouteComponentProps<MatchParams> {}

interface ProblemSetSolveResultProps extends PropsFromRedux {
  history: any;
}

interface ProblemSetSolveResultState {
  checkNum: number;
}

class ProblemSetSolveResult extends Component<
  ProblemSetSolveResultProps & MatchProps,
  ProblemSetSolveResultState
> {
  constructor(props: ProblemSetSolveResultProps & MatchProps) {
    super(props);
    this.state = {
      checkNum: 0,
    };
  }

  componentDidMount() {
    let idSet = {
      userID: this.props.selectedUser?.id,
      problemSetID: parseInt(this.props.match.params.id),
    };
    this.props.onGetSolver(idSet);
  }

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

    if (!this.props.selectedSolver) {
      return <NotFound />;
    }

    return (
      <div className="ProblemSetSolveResult">
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
          {this.props.selectedSolver.problems.map((result, index) => (
            <Grid>
              <Grid.Column width={10}>
                <Card>
                  <Card.Content>
                    <Card.Header>Problem {index + 1}</Card.Header>
                  </Card.Content>
                  <Card.Content extra>
                    {this.props.selectedSolver?.problems[index] === true && (
                      <Icon color="blue" name="circle outline" />
                    )}
                    {this.props.selectedSolver?.problems[index] !== true && (
                      <Icon color="red" name="x" />
                    )}
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>
          ))}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    selectedUser: state.user.selectedUser,
    selectedSolver: state.problemset.selectedSolver,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    onGetSolver: (idSet: any) => {
      dispatch(getSolver(idSet));
    },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProblemSetSolveResult);
