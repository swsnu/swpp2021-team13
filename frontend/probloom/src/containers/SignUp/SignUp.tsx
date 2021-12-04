import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Button, Form, Grid, Header, Input, Segment } from 'semantic-ui-react';

import './SignUp.css';
import * as actionCreators from '../../store/actions';
import { AppDispatch, RootState } from '../../store/store';
import { SignUpRequest } from '../../store/actions/userActions';

interface SignUpProps extends PropsFromRedux {
  history: any;
}

interface SignUpState {
  username: string;
  email: string;
  pw: string;
  pwConfirm: string;
}

class SignUp extends Component<SignUpProps, SignUpState> {
  state = {
    username: '',
    email: '',
    pw: '',
    pwConfirm: '',
  };

  onClickSignUpButton = async () => {
    const data = {
      username: this.state.username,
      email: this.state.email,
      pw: this.state.pw,
      pwConfirm: this.state.pwConfirm,
    };

    let emailCheck = new RegExp(
      "^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );
    let usernameCheck = new RegExp('^[A-Za-z0-9_\\+\\.\\-]{3,150}$');
    let pwCheck = new RegExp('^[a-zA-Z\\d~!@#$%^&*+-_]{8,150}$');

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
      await this.props.onSignUp(newUser);

      if (this.props.selectedUser) {
        alert('Account created!');
        this.props.history.push('/signin');
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
    this.props.history.push('/signin');
  };

  render() {
    return (
      <Grid
        textAlign="center"
        style={{ height: '80vh' }}
        verticalAlign="middle"
      >
        <Grid.Column className="SignUp" style={{ maxWidth: '28rem' }}>
          <Header as="h2">Sign Up</Header>
          <Form size="large">
            <Segment>
              <Form.Field>
                <label>Username</label>
                <Input
                  fluid
                  placeholder="Username"
                  value={this.state.username}
                  onChange={(event) =>
                    this.setState({ username: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <label>Email</label>
                <Input
                  type="email"
                  fluid
                  placeholder="Email"
                  value={this.state.email}
                  onChange={(event) =>
                    this.setState({ email: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <label>Password</label>
                <Input
                  type="password"
                  fluid
                  placeholder="Password"
                  value={this.state.pw}
                  onChange={(event) =>
                    this.setState({ pw: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <label>Confirm Password</label>
                <Input
                  type="password"
                  fluid
                  placeholder="Confirm Password"
                  value={this.state.pwConfirm}
                  onChange={(event) =>
                    this.setState({ pwConfirm: event.target.value })
                  }
                />
              </Form.Field>

              <Button
                primary
                type="submit"
                fluid
                className="signUpButton"
                onClick={this.onClickSignUpButton}
              >
                Sign Up
              </Button>

              <Button
                fluid
                className="signInButton"
                onClick={this.onClickSignInButton}
              >
                Back
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    selectedUser: state.user.selectedUser,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
  return {
    onSignUp: (request: SignUpRequest) =>
      dispatch(actionCreators.signUp(request)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(SignUp);
