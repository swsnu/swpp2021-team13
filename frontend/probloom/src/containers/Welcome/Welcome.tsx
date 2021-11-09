import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { returntypeof } from 'react-redux-typescript';
import './Welcome.css';
import { User } from '../../store/reducers/userReducer';

interface WelcomeProps {
  logo: string;
  history: any;
}

interface WelcomeState {
  id: string;
  pw: string;
}

interface StateFromProps {
  selectedUser: User;
}

interface DispatchFromProps {
  onLogIn: (user: any) => void;
}

type Props = WelcomeProps & typeof statePropTypes & typeof actionPropTypes;
type State = WelcomeState;

class Welcome extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      id: '',
      pw: '',
    };
  }

  onClickSignInButton = async () => {
    const data = {
      id: this.state.id,
      pw: this.state.pw,
    };

    let emailCheck = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );
    let usernameCheck = new RegExp('^[A-Za-z0-9_\\+\\.\\-]{3,150}$');
    let pwCheck = new RegExp('^[a-zA-Z\\d~!@#$%^&*+-_]{8,150}$');

    let isProperEmail = emailCheck.test(data.id);
    let isProperUsername = usernameCheck.test(data.id);
    let isProperPW = pwCheck.test(data.pw);

    const isValid = (isProperEmail || isProperUsername) && isProperPW;

    if (isValid) {
      const user = { id: data.id, password: data.pw };
      await this.props.onLogIn(user);

      if (this.props.selectedUser) {
        this.props.history.push('/problem/search');
      } else {
        alert('Incorrect username/email or password');
        this.setState({ id: '', pw: '' });
      }
    } else {
      alert('Invalid username/email or password');
      this.setState({ id: '', pw: '' });
    }
  };

  onClickSignUpButton = () => {
    this.props.history.push('/signup');
  };

  render() {
    return (
      <div className="Welcome">
        <h1 className="logo">{this.props.logo}</h1>

        <div className="SignInBox">
          <label className="idLabel">Username / Email</label>
          <input
            type="text"
            value={this.state.id}
            className="idlInput"
            onChange={(event) => this.setState({ id: event.target.value })}
          />

          <label className="pwLabel">Password</label>
          <input
            type="password"
            value={this.state.pw}
            className="pwInput"
            onChange={(event) => this.setState({ pw: event.target.value })}
          />

          <button
            className="signInButton"
            onClick={() => this.onClickSignInButton()}
          >
            Sign In
          </button>
        </div>

        <button
          className="signUpButton"
          onClick={() => this.onClickSignUpButton()}
        >
          Sign Up
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    selectedUser: state.user.selectedUser,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onLogIn: (user: any) => dispatch(actionCreators.logIn(user)),
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
