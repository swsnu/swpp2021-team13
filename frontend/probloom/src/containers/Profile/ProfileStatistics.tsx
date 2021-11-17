import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import './ProfileStatistics.css';
import * as actionCreators from '../../store/actions/index';
import { AppDispatch, RootState } from '../../store/store';
import { UserStatisticsProblemSet } from '../../store/reducers/userReducer';

export interface ProfileStatisticsProps extends PropsFromRedux {
  userId: number;
}

class ProfileStatistics extends Component<ProfileStatisticsProps> {
  componentDidMount() {
    this.props.onGetUserStatistics(this.props.userId);
  }

  render() {
    const lastActiveDays: number =
      this.props.selectedUserStatistics?.lastActiveDays ?? 0;
    const _createdProblems: UserStatisticsProblemSet[] =
      this.props.selectedUserStatistics?.createdProblems ?? [];
    // const solvedProblems: number[] = this.props.selectedUserStatistics
    //   ?.solvedProblems ?? [0];
    // const recommendedProblems: number[] = this.props.selectedUserStatistics
    //   ?.recommendedProblems ?? [0];
    // const createdExplanations: number[] = this.props.selectedUserStatistics
    //   ?.createdExplanations ?? [0];
    // const recommendedExplanations: number[] = this.props.selectedUserStatistics
    //   ?.recommendedExplanations ?? [0];
    const createdProblems = _createdProblems.map((createdProblem) => {
      return (
        <div>
          <h3>{createdProblem.title}</h3>
          <h3>{createdProblem.content}</h3>
          <h3>{createdProblem.created_time}</h3>
          <h3>{createdProblem.scope}</h3>
          <h3>{createdProblem.tag}</h3>
          <h3>{createdProblem.difficulty}</h3>
        </div>
      );
    });
    // console.log(
    //   '@@@ this.props.selectedUserStatistics',
    //   this.props.selectedUserStatistics?.createdProblems
    // );
    // console.log('createdProblems', createdProblems);

    return (
      <div className="ProfileStatistics">
        <div className="last-active">
          <h1>Last Active</h1>
          {lastActiveDays} days ago
        </div>
        <div className="created-problems">
          <h1>Created Problems</h1>
          {createdProblems}
        </div>
        {/* <div className="solved-problems">
          <h1>Solved Problems</h1>
          {solvedProblems}
        </div>
        <div className="recommended-problems">
          <h1>Recommended Problems</h1>
          {recommendedProblems}
        </div>
        <div className="created-explanations">
          <h1>Created Explanations</h1>
          {createdExplanations}
        </div>
        <div className="recommended-explanations">
          <h1>Recommended Explanations</h1>
          {recommendedExplanations}
        </div> */}
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
