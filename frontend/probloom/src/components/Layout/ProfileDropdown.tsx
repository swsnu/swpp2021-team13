import React from 'react';
import { NavLink } from 'react-router-dom';

interface GoToProfileProps {
  username: string;
}

interface GoToProfileState {
  displayMenu: boolean;
}

class ProfileDropdown extends React.Component<
  GoToProfileProps,
  GoToProfileState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      displayMenu: false,
    };
  }

  showDropdownMenu = () => {
    this.setState({ displayMenu: !this.state.displayMenu });
  };

  render() {
    return (
      <div className="ProfileDropdown">
        <button id="profile-button" onClick={() => this.showDropdownMenu()}>
          <span>username: {this.props.username} </span>
          <img
            src="https://item.kakaocdn.net/do/1b9aa4b7165a7d3822d2c2c81d0c37259f5287469802eca457586a25a096fd31"
            alt="User avatar"
            height="100"
          />
        </button>

        {this.state.displayMenu ? (
          <ul>
            <li>
              <NavLink to="/user/1/summary">View profile</NavLink>
            </li>
            <li>
              <NavLink to="/user/1/summary">Sign out</NavLink>
            </li>
          </ul>
        ) : null}
      </div>
    );
  }
}

export default ProfileDropdown;
