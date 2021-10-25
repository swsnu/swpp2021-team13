import { Component } from 'react';
import { withRouter, RouteProps } from 'react-router';
import { connect } from 'react-redux';

import './ProfileStatistics.css';
import * as actionCreators from '../../store/actions/actions';

interface UserField {
  id: number;
  username: string;
  email: string;
  password: string;
  logged_in: boolean;
}

interface Props {
  selectedUser: UserField;
  onGetUserStatistics: (number) => void;
}

interface State {
  // TODO
}

class ProfileStatistics extends Component<Props & RouteProps, State> {
  componentDidMount() {
    this.props.onGetUserStatistics(this.props.match.params.id);
  }

  clickSummaryHandler = () => {
    this.props.history.push(`/user/${this.props.match.params.id}/summary`);
  };

  clickStatisticsHandler = () => {
    this.props.history.push(`/user/${this.props.match.params.id}/statistics`);
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

const mapStateToProps = (state) => {
  return {
    selectedUserStatistics: state.user.selectedUserStatistics,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetUserStatistics: (userId: number) =>
      dispatch(actionCreators.getUserStatistics(userId)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProfileStatistics));
