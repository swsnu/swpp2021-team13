import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container, Dropdown, Menu } from 'semantic-ui-react';
import { signOut } from '../../store/actions';
import { User } from '../../store/reducers/userReducer';
import { AppDispatch, RootState } from '../../store/store';

export interface ProfileDropdownProps {
  user: User | null;
  onSignOut: (user: User) => any;
}

const ProfileDropdown = ({ user, onSignOut }: ProfileDropdownProps) => {
  if (user === null || user.logged_in === false) {
    return null;
  }
  return (
    <Menu.Menu position="right">
      <Dropdown pointing item text={user.username}>
        <Dropdown.Menu>
          <Dropdown.Item as={NavLink} to={`/user/${user.id}/summary`}>
            View Profile
          </Dropdown.Item>
          <Dropdown.Item onClick={async () => onSignOut(user)}>
            Sign Out
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  );
};

class AppHeader extends Component<PropsFromRedux> {
  render() {
    return (
      <Menu borderless fixed="top">
        <Container>
          <Menu.Item header>ProbLoom</Menu.Item>
          <ProfileDropdown
            user={this.props.selectedUser}
            onSignOut={this.props.onSignOut}
          />
        </Container>
      </Menu>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  selectedUser: state.user.selectedUser,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  onSignOut: (user: User) => dispatch(signOut(user)),
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(AppHeader);
