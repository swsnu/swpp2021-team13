import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { returntypeof } from 'react-redux-typescript';
import './SignUp.css';
import { User } from '../../store/reducers/userReducer';

interface SignUpProps {
  history: any;
}

interface SignUpState {
  username: string;
  email: string;
  pw: string;
  pwConfirm: string;
}

interface StateFromProps {
  selectedUser: User;
}

interface DispatchFromProps {
  onSignUp: (any) => void;
}

type Props = SignUpProps & typeof statePropTypes & typeof actionPropTypes;
type State = SignUpState;

class SignUp extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      email: '',
      pw: '',
      pwConfirm: '',
    };
  }

  onClickSignUpButton = () => {
    const data = {
      username: this.state.username,
      email: this.state.email,
      pw: this.state.pw,
      pwConfirm: this.state.pwConfirm,
    };

    let emailCheck = new RegExp(
      '^[^@\\s]+@[^@\\.\\s]+\\.[a-zA-Z]{2,3}(\\.[a-zA-Z]{2,3})*$'
    );
    let usernameCheck = new RegExp('[a-zA-Z\\-_\\d]{1,30}');
    let pwCheck = new RegExp('[a-zA-Z\\d~!@#$%^&*]{8,20}');

    let isProperEmail = emailCheck.test(data.email);
    let isProperUsername = usernameCheck.test(data.username);
    let isProperPW = pwCheck.test(data.pw);
    let isSamePW = data.pw === data.pwConfirm;

    const isValid = (isProperEmail || isProperUsername) && isProperPW;

    if (isValid) {
      if (!isSamePW) {
        alert(`You can't sign up. Passwords do not match`);
        this.setState({ username: '', email: '', pw: '', pwConfirm: '' });
        return;
      }

      const newUser = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.pw,
      };
      this.props.onSignUp(newUser);

      if (this.props.selectedUser) {
        alert('Account created!');
        this.props.history.push('/login');
      } else {
        alert('Email or Username already exists!');
        this.setState({ username: '', email: '', pw: '', pwConfirm: '' });
      }
    } else {
      alert(`You can't sign up. There are invalid username/email or password`);
      this.setState({ username: '', email: '', pw: '', pwConfirm: '' });
    }
  };

  onClickSignInButton = () => {
    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="SignUp">
        <div className="SignUpBox">
          <label className="usernameLabel">Username</label>
          <input
            type="text"
            value={this.state.username}
            className="usernameInput"
            onChange={(event) =>
              this.setState({ username: event.target.value })
            }
          />

          <label className="emailLabel">Email</label>
          <input
            type="text"
            value={this.state.email}
            className="emailInput"
            onChange={(event) => this.setState({ email: event.target.value })}
          />

          <label className="pwLabel">Password</label>
          <input
            type="password"
            value={this.state.pw}
            className="pwInput"
            onChange={(event) => this.setState({ pw: event.target.value })}
          />

          <label className="pwComfirmLabel">Confirm Password</label>
          <input
            type="password"
            value={this.state.pwConfirm}
            className="pwConfirmInput"
            onChange={(event) =>
              this.setState({ pwConfirm: event.target.value })
            }
          />

          <button
            className="signUpButton"
            onClick={() => this.onClickSignUpButton()}
          >
            Sign Up
          </button>
        </div>

        <button
          className="signInButton"
          onClick={() => this.onClickSignInButton()}
        >
          Sign In
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
    onSignUp: (user: any) => dispatch(actionCreators.signUp(user)),
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
