import axios from 'axios';
import { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Redirect } from 'react-router';
import {
  Button,
  Divider,
  Form,
  Grid,
  Header,
  Input,
  Segment,
} from 'semantic-ui-react';
import * as actionCreators from '../../store/actions';
import { SignInRequest } from '../../store/actions/userActions';
import { AppDispatch, RootState } from '../../store/store';

interface WelcomeProps extends PropsFromRedux {
  logo: string;
  history: any;
}

interface WelcomeState {
  id: string;
  pw: string;
}

class Welcome extends Component<WelcomeProps, WelcomeState> {
  state = { id: '', pw: '' };

  async componentDidMount() {
    await axios.get('/api/token/');
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
      const request = { id: data.id, password: data.pw };
      await this.props.onSignIn(request);

      if (this.props.selectedUser === null) {
        alert('Incorrect username/email or password');
        this.setState({ id: '', pw: '' });
      }
    } else {
      alert('Invalid username/email or password');
      this.setState({ id: '', pw: '' });
    }
  };

  onClickSignUpButton = () => {
    this.props.history.push('/signup/');
  };

  render() {
    if (this.props.selectedUser !== null && this.props.selectedUser.logged_in) {
      return <Redirect to="/problem/search/" />;
    }
    return (
      <Grid
        textAlign="center"
        style={{ height: '80vh' }}
        verticalAlign="middle"
      >
        <Grid.Column className="Welcome" style={{ maxWidth: '28rem' }}>
          <Header as="h1">{this.props.logo}</Header>
          <Header as="h2">Sign In</Header>
          <Form size="large">
            <Segment>
              <Form.Field>
                <label>Username / Email</label>
                <Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="Username / Email"
                  value={this.state.id}
                  onChange={(event) =>
                    this.setState({ id: event.target.value })
                  }
                />
              </Form.Field>

              <Form.Field>
                <label>Password</label>
                <Input
                  type="password"
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  value={this.state.pw}
                  onChange={(event) =>
                    this.setState({ pw: event.target.value })
                  }
                />
              </Form.Field>

              <Button
                primary
                type="submit"
                fluid
                className="signInButton"
                onClick={this.onClickSignInButton}
              >
                Sign In
              </Button>

              <Divider />

              <Button
                fluid
                className="signUpButton"
                onClick={this.onClickSignUpButton}
              >
                Sign Up
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
    onSignIn: (request: SignInRequest) =>
      dispatch(actionCreators.signIn(request)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;

export default connector(Welcome);
