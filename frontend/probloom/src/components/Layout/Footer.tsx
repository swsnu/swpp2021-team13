import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { List, Segment } from 'semantic-ui-react';

const Footer = (props: RouteComponentProps) => {
  return (
    <Segment vertical>
      <List horizontal divided link>
        <List.Item>Made by Team 13, SWPP 2021</List.Item>
        <List.Item>
          <a href="https://www.github.com/swsnu/swpp2021-team13">View Source</a>
        </List.Item>
      </List>
    </Segment>
  );
};

export default withRouter(Footer);
