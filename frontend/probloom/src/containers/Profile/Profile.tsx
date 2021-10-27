import { RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import './Profile.css';
import { NotFound } from '../../components/NotFound/NotFound';
import ProfileSummary from './ProfileSummary';
import ProfileStatistics from './ProfileStatistics';

export interface ProfilePathParams {
  id: string;
  active: string;
}

const Profile = (props: RouteComponentProps<ProfilePathParams>) => {
  const userId = parseInt(props.match.params.id, 10);
  if (isNaN(userId)) {
    console.warn(`"${props.match.params.id}" is not a valid user id`);
    return <NotFound />;
  }

  const active = props.match.params.active;
  let tabContent: JSX.Element | null;
  switch (props.match.params.active) {
    case 'summary':
      tabContent = <ProfileSummary />;
      break;
    case 'statistics':
      tabContent = <ProfileStatistics userId={userId} />;
      break;
    default:
      console.warn(`"${active}" is not a valid tab name`);
      return <NotFound />;
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to="summary">Summary</NavLink>
          </li>
          <li>
            <NavLink to="statistics">Statistics</NavLink>
          </li>
        </ul>
      </nav>
      <h2>John Doe</h2>
      <h3>john.doe@example.com</h3>
      {tabContent}
    </div>
  );
};

export default withRouter(Profile);
