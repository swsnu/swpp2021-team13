import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom';
import { Container, List, Segment } from 'semantic-ui-react';

const Footer = (props: RouteComponentProps) => {
  return (
    <Segment vertical>
      <Container textAlign="center">
        <List horizontal divided link>
          <List.Item>Made by Team 13, SWPP 2021</List.Item>
          <List.Item>
            <NavLink to="https://www.github.com/swsnu/swpp2021-team13">
              View Source
            </NavLink>
          </List.Item>
        </List>
      </Container>
    </Segment>
  );
};

export default withRouter(Footer);
