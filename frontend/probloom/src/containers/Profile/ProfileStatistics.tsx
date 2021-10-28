import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import './ProfileStatistics.css';
import * as actionCreators from '../../store/actions/index';
import { AppDispatch, RootState } from '../../store/store';

export interface ProfileStatisticsProps extends PropsFromRedux {
  userId: number;
}

class ProfileStatistics extends Component<ProfileStatisticsProps> {
  componentDidMount() {
    this.props.onGetUserStatistics(this.props.userId);
  }

  render() {
    const lastActiveDays =
      this.props.selectedUserStatistics?.lastActiveDays ?? 0;
    const problemsCreated =
      this.props.selectedUserStatistics?.problemsCreated ?? 0;
    const problemsSolved =
      this.props.selectedUserStatistics?.problemsSolved ?? 0;
    return (
      <div className="ProfileStatistics">
        <div className="title">
          <h1>ProfileStatistics Page</h1>
        </div>
        <div>
          <h1>Last Active</h1>
          {lastActiveDays} days ago
        </div>
        <div>
          <h1>Problems Created</h1>
          {problemsCreated}
        </div>
        <div>
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

export default connector(ProfileStatistics);
