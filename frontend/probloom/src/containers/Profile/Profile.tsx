import { RouteComponentProps, withRouter } from 'react-router';

import './Profile.css';
import NotFound from '../../components/NotFound/NotFound';
import ProfileSummary from './ProfileSummary';
import ProfileStatistics from './ProfileStatistics';
import { Button, Container, Header, Tab, TabProps } from 'semantic-ui-react';
import { Component } from 'react';
import { RootState } from '../../store/store';
import { connect, ConnectedProps } from 'react-redux';

export interface ProfilePathParams {
  id: string;
  active: string;
}

const validActiveValues = ['summary', 'statistics'];
const getPanes = (userId: number) => [
  {
    menuItem: 'Summary',
    render: () => <ProfileSummary userId={userId} />,
  },
  {
    menuItem: 'Statistics',
    render: () => <ProfileStatistics userId={userId} />,
  },
];

class Profile extends Component<
  PropsFromRedux & RouteComponentProps<ProfilePathParams>
> {
  handleTabChange = (_: any, { activeIndex }: TabProps) => {
    const active = validActiveValues[activeIndex as number];
    this.props.history.push(active);
  };

  onClickBackButton = () => {
    this.props.history.push('/problem/search/');
  };

  render() {
    const userId = parseInt(this.props.match.params.id, 10);
    if (isNaN(userId)) {
      console.warn(`"${this.props.match.params.id}" is not a valid user id`);
      return <NotFound />;
    }

    const active = this.props.match.params.active;
    const activeIndex = validActiveValues.findIndex(
      (value) => value === active
    );
    if (activeIndex === -1) {
      console.warn(
        `"${this.props.match.params.active}" is not a valid tab name`
      );
      return <NotFound />;
    }

    const panes = getPanes(userId);

    return (
      <Container text>
        <Header as="h2">
          {this.props.selectedUser?.username}
          <Header.Subheader>
            {this.props.selectedUser?.email}
          </Header.Subheader>
        </Header>
        <Tab
          panes={panes}
          activeIndex={activeIndex}
          onTabChange={this.handleTabChange}
        />
        <Button onClick={() => this.onClickBackButton()}>
          Back to problem search
        </Button>
      </Container>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    selectedUser: state.user.selectedUser,
  };
};

const connector = connect(mapStateToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(withRouter(Profile));
