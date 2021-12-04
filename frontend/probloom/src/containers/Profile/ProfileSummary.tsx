import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Container, Form, Header, Icon, Segment } from 'semantic-ui-react';

import { getUserProfile, updateUserIntroduction } from '../../store/actions';
import { AppDispatch, RootState } from '../../store/store';

import './ProfileSummary.css';

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
    const modifyIntroductionButton = (
      <Button primary onClick={() => this.onClickModifyIntroductionButton()}>
        Edit Introduction
      </Button>
    )
    return (
      <Segment>
        <p>{introduction}</p>
        {modifyIntroductionButton}
      </Segment>
    );
  }

  renderIntroductionPlaceholder() {
    const modifyIntroductionButton = (
      <Button primary onClick={() => this.onClickModifyIntroductionButton()}>
        Write an Introduction
      </Button>
    )
    return (
      <Segment placeholder>
        <Header icon>
          <Icon name='user' />
          This user does not have an introduction.
        </Header>
        {modifyIntroductionButton}
      </Segment>
    );
  }

  renderIntroductionEditor() {
    return (
      <Form>
        <Form.TextArea
          placeholder="Tell us about yourself..."
          value={this.state.pendingIntroduction}
          onChange={(event) =>
            this.setState({ pendingIntroduction: event.target.value })
          }
        />
        <Button
          primary
          type="submit"
          disabled={this.state.pendingIntroduction === ''}
          onClick={() => this.onClickConfirmIntroductionButton()}
        >
          Confirm
        </Button>
        <Button onClick={() => this.onClickCancelIntroductionButton()}>
          Cancel
        </Button>
      </Form>
    );
  }

  render() {
    const introduction =
      this.props.selectedUserProfile?.introduction ?? '';
    const hasIntroduction = introduction !== '';
    if (this.state.editing) {
      return (
        <Container className="profile-summary__introduction">
          {this.renderIntroductionEditor()}
        </Container>
      )
    }
    return (
      <Container className="profile-summary__introduction">
        {hasIntroduction
          ? this.renderIntroduction(introduction)
          : this.renderIntroductionPlaceholder()}
      </Container>
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
