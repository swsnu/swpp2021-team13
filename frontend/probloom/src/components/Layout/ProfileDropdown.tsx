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
  container = React.createRef<HTMLInputElement>();
  constructor(props: any) {
    super(props);

    this.state = {
      displayMenu: false,
    };
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.closeDropdownMenu);
  }
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.closeDropdownMenu);
  }

  showDropdownMenu = () => {
    this.setState({ displayMenu: !this.state.displayMenu });
  };

  closeDropdownMenu = (event: any) => {
    if (
      this.container.current &&
      !this.container.current.contains(event.target)
    ) {
      this.setState({ displayMenu: false });
    }
  };

  render() {
    // console.log('render', this.state.displayMenu);
    return (
      <div className="ProfileDropdown" ref={this.container}>
        <button
          id="profile-button"
          onClick={() => this.showDropdownMenu()}
          onBlur={(e) => this.closeDropdownMenu(e)}
        >
          <span>☰ username: {this.props.username} </span>
          <img
            src="https://item.kakaocdn.net/do/1b9aa4b7165a7d3822d2c2c81d0c37259f5287469802eca457586a25a096fd31"
            alt="User avatar"
            height="100"
          />
        </button>

        <div className="blank"> </div>

        {this.state.displayMenu && (
          <ul>
            <li>
              <NavLink to="/user/1/summary">View profile</NavLink>
            </li>
            <li>
              <NavLink to="/user/1/summary">Sign out</NavLink>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default ProfileDropdown;
