import { RouteComponentProps, withRouter } from 'react-router';

import './Profile.css';
import NotFound from '../../components/NotFound/NotFound';
import ProfileSummary from './ProfileSummary';
import ProfileStatistics from './ProfileStatistics';
import { Container, Tab, TabProps } from 'semantic-ui-react';
import { Component } from 'react';

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

class Profile extends Component<RouteComponentProps<ProfilePathParams>> {
  handleTabChange = (_: any, { activeIndex = 0 }: TabProps) => {
    const active = validActiveValues[activeIndex];
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
        {/* TODO : props as a username */}
        <h2>John Doe</h2>
        <h3>john.doe@example.com</h3>
        <Tab
          panes={panes}
          activeIndex={activeIndex}
          onTabChange={this.handleTabChange}
        />
        <button onClick={() => this.onClickBackButton()}>
          Back to problem search
        </button>
      </Container>
    );
  }
}

export default withRouter(Profile);
