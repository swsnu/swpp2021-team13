import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { getUserProfile, updateUserIntroduction } from '../../store/actions';
import { AppDispatch, RootState } from '../../store/store';

export interface ProfileSummaryProps extends PropsFromRedux {
  userId: number;
}

export interface ProfileSummaryState {
  editing: boolean;
  pendingIntroduction: string;
}

class ProfileSummary extends Component<
  ProfileSummaryProps,
  ProfileSummaryState
> {
  state = { editing: false, pendingIntroduction: '' };

  componentDidMount() {
    this.props.onGetUserProfile(this.props.userId);
  }

  onClickModifyIntroductionButton() {
    this.setState({
      editing: true,
      pendingIntroduction: this.props.selectedUserProfile?.introduction ?? '',
    });
  }

  onClickConfirmIntroductionButton() {
    const pendingIntroduction = this.state.pendingIntroduction;
    const oldIntroduction = this.props.selectedUserProfile?.introduction;
    if (pendingIntroduction !== oldIntroduction) {
      this.props.onUpdateUserIntroduction(
        this.props.userId,
        pendingIntroduction
      );
    }
    this.setState({ editing: false });
  }

  onClickCancelIntroductionButton() {
    if (
      this.state.pendingIntroduction !==
      this.props.selectedUserProfile?.introduction
    ) {
      const isOk = window.confirm('Are you sure? The changes will be lost.');
      if (!isOk) {
        return;
      }
    }
    this.setState({ editing: false });
  }

  renderIntroduction(introduction: string) {
    return (
      <div>
        <p>{introduction}</p>
        <button onClick={() => this.onClickModifyIntroductionButton()}>
          Edit Introduction
        </button>
      </div>
    );
  }

  renderIntroductionPlaceholder() {
    return (
      <div>
        <p>This user does not have an introduction.</p>
        <button onClick={() => this.onClickModifyIntroductionButton()}>
          Write an Introduction
        </button>
      </div>
    );
  }

  renderIntroductionEditor() {
    return (
      <form onSubmit={(event) => event.preventDefault()}>
        <textarea
          cols={30}
          rows={10}
          placeholder="Tell us about yourself..."
          value={this.state.pendingIntroduction}
          onChange={(event) =>
            this.setState({ pendingIntroduction: event.target.value })
          }
        />
        <button
          type="submit"
          disabled={this.state.pendingIntroduction === ''}
          onClick={() => this.onClickConfirmIntroductionButton()}
        >
          Confirm
        </button>
        <button onClick={() => this.onClickCancelIntroductionButton()}>
          Cancel
        </button>
      </form>
    );
  }

  render() {
    const introduction =
      this.props.selectedUserProfile?.introduction ?? 'test-introduction';
    const hasIntroduction = introduction !== '';
    if (this.state.editing) {
      return <div>{this.renderIntroductionEditor()}</div>;
    }
    return (
      <div>
        {hasIntroduction
          ? this.renderIntroduction(introduction)
          : this.renderIntroductionPlaceholder()}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedUserProfile: state.user.selectedUserProfile,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onGetUserProfile: (userId: number) => dispatch(getUserProfile(userId)),
  onUpdateUserIntroduction: (userId: number, pendingIntroduction: string) =>
    dispatch(updateUserIntroduction(userId, pendingIntroduction)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(ProfileSummary);
