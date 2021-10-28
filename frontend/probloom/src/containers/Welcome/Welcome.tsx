import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../../store/actions/index';
import { returntypeof } from 'react-redux-typescript';
import './Welcome.css';

interface WelcomeProps {
  logo: string;
  history: any;
}

interface WelcomeState {
  id: string;
  pw: string;
}

interface StateFromProps {
  storedUsers: any;
}

interface DispatchFromProps {
  onGetAllUsers: () => void;
  onLogIn: (any) => void;
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

  componentDidMount() {
    this.props.onGetAllUsers();
  }

  onClickSignInButton = () => {
    const data = {
      id: this.state.id,
      pw: this.state.pw,
    };

    let emailCheck = new RegExp(
      '^[^@\\s]+@[^@\\.\\s]+\\.[a-zA-Z]{2,3}(\\.[a-zA-Z]{2,3})*$'
    );
    let usernameCheck = new RegExp('[a-zA-Z\\-_\\d]{1,30}');
    let pwCheck = new RegExp('[a-zA-Z\\d~!@#$%^&*]{8,20}');

    let isProperEmail = emailCheck.test(data.id);
    let isProperUsername = usernameCheck.test(data.id);
    let isProperPW = pwCheck.test(data.pw);

    const isValid = (isProperEmail || isProperUsername) && isProperPW;

    if (isValid) {
      const user = this.props.storedUsers.find(
        (user_) =>
          (user_.email === this.state.id || user_.username === this.state.id) &&
          user_.password === this.state.pw
      );

      if (user) {
        this.props.onLogIn(user);
        this.props.history.push('/search');
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
    storedUsers: state.user.users,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    onGetAllUsers: () => dispatch(actionCreators.getAllUsers()),
    onLogIn: (user: any) => dispatch(actionCreators.logIn(user)),
  };
};

const statePropTypes = returntypeof(mapStateToProps);
const actionPropTypes = returntypeof(mapDispatchToProps);

export default connect<StateFromProps, DispatchFromProps>(
  mapStateToProps,
  mapDispatchToProps
)(Welcome);
