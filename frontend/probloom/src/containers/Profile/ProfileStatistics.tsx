import { Component } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';

import './ProfileStatistics.css';
import * as actionCreators from '../../store/actions/index';
import { AppDispatch, RootState } from '../../store/store';

export interface ProfileStatisticsProps extends PropsFromRedux {
  userId: number;
}

export interface ProfileStatisticsState {
  // TODO
}

class ProfileStatistics extends Component<
  ProfileStatisticsProps & RouteComponentProps,
  ProfileStatisticsState
> {
  componentDidMount() {
    this.props.onGetUserStatistics(this.props.userId);
  }

  clickSummaryHandler = () => {
    this.props.history.push(`/user/${this.props.userId}/summary`);
  };

  clickStatisticsHandler = () => {
    this.props.history.push(`/user/${this.props.userId}/statistics`);
  };

  render() {
    let username = 'test-username';
    let email = 'test-email';
    let lastActiveDays = 0;
    let problemsCreated = 0;
    let problemsSolved = 0;
    if (this.props.selectedUserStatistics) {
      username = this.props.selectedUserStatistics.username;
      email = this.props.selectedUserStatistics.email;
      lastActiveDays = this.props.selectedUserStatistics.lastActiveDays;
      problemsCreated = this.props.selectedUserStatistics.problemsCreated;
      problemsSolved = this.props.selectedUserStatistics.problemsSolved;
    }
    return (
      <div className="ProfileStatistics">
        <p>
          <button
            id="summary-tab-button"
            onClick={() => this.clickSummaryHandler()}
          >
            Summary
          </button>
          <button
            id="statistics-tab-button"
            onClick={() => this.clickStatisticsHandler()}
          >
            Statistics
          </button>
        </p>

        <div className="title">
          <h1>ProfileStatistics Page</h1>
        </div>
        <div className="username">
          <h1>username</h1>
          {username}
        </div>
        <div className="email">
          <h1>email</h1>
          {email}
        </div>
        <div className="email">
          <h1>Last Active</h1>
          {lastActiveDays} days ago
        </div>
        <div className="email">
          <h1>Problems Created</h1>
          {problemsCreated}
        </div>
        <div className="email">
          <h1>Problems Solved</h1>
          {problemsSolved}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    selectedUserStatistics: state.user.selectedUserStatistics,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    onGetUserStatistics: (userId: number) =>
      dispatch(actionCreators.getUserStatistics(userId)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(ProfileStatistics));
