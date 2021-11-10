import React from 'react';
import { getMockStore } from '../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { UserState } from '../../store/reducers/userReducer';
import SignUp from './SignUp';
import { history } from '../../store/store';
import axios from 'axios';

const UserstateTest: UserState = {
  users: [
    {
      id: 1,
      username: 'John',
      email: 'swpp@snu.ac.kr',
      logged_in: false,
    },
  ],
  selectedUser: null,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const UserstateTest2: UserState = {
  users: [
    {
      id: 1,
      username: 'John',
      email: 'swpp@snu.ac.kr',
      logged_in: false,
    },
  ],
  selectedUser: {
    id: 1,
    username: 'John',
    email: 'swpp@snu.ac.kr',
    logged_in: false,
  },
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const mockStore = getMockStore(UserstateTest);
const mockStore2 = getMockStore(UserstateTest2);

describe('<SignUp />', () => {
  let signup, signup2;
  let spyPost;

  beforeEach(() => {
    signup = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={SignUp} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    signup2 = (
      <Provider store={mockStore2}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={SignUp} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyPost = jest.spyOn(axios, 'post').mockImplementation(async (_) => ({
      status: 200,
      data: {
        id: 2,
        username: 'Jake',
        email: 'abc@naver.com',
        logged_in: false,
      },
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Sign up', () => {
    const component = mount(signup);
    const wrapper = component.find('.SignUp');
    expect(wrapper.length).toBe(1);
  });

  it('should set state properly on input', () => {
    const component = mount(signup);
    const wrapper = component.find('input');
    expect(wrapper.length).toBe(4);

    const username = 'Jake';
    wrapper.at(0).simulate('change', { target: { value: username } });

    const email = 'abc@naver.com';
    wrapper.at(1).simulate('change', { target: { value: email } });

    const password = 'abcabcabc';
    wrapper.at(2).simulate('change', { target: { value: password } });

    const passwordConfirm = 'abcabcabc';
    wrapper.at(3).simulate('change', { target: { value: passwordConfirm } });

    const SignUpInstance = component.find(SignUp.WrappedComponent).instance();
    expect(SignUpInstance.state.username).toEqual(username);
    expect(SignUpInstance.state.email).toEqual(email);
    expect(SignUpInstance.state.pw).toEqual(password);
    expect(SignUpInstance.state.pwConfirm).toEqual(passwordConfirm);
  });

  it('should click sign in button', () => {
    const component = mount(signup);
    const wrapper = component.find('.signInButton');
    wrapper.simulate('click');
    expect(window.location.href).toEqual('http://localhost/signin');
    history.push('/');
  });

  it('should sign up fail 1-1: invalid pw', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(signup);
    const wrapper = component.find('input');

    const username = 'Jake';
    wrapper.at(0).simulate('change', { target: { value: username } });

    const email = 'abc@naver.com';
    wrapper.at(1).simulate('change', { target: { value: email } });

    const password = 'abc';
    wrapper.at(2).simulate('change', { target: { value: password } });

    const passwordConfirm = 'abc';
    wrapper.at(3).simulate('change', { target: { value: passwordConfirm } });

    const wrapper2 = component.find('.signUpButton');
    wrapper2.simulate('click');

    expect(spyAlert).toBeCalledTimes(1);

    const SignUpInstance = component.find(SignUp.WrappedComponent).instance();
    expect(SignUpInstance.state.username).toEqual('');
    expect(SignUpInstance.state.email).toEqual('');
    expect(SignUpInstance.state.pw).toEqual('');
    expect(SignUpInstance.state.pwConfirm).toEqual('');
  });

  it('should sign up fail 1-2: invalid email and username', () => {
    //const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(signup);
    const wrapper = component.find('input');

    const username = 'Jake!';
    wrapper.at(0).simulate('change', { target: { value: username } });

    const email = 'abcnaver.com';
    wrapper.at(1).simulate('change', { target: { value: email } });

    const password = 'abcabcabc';
    wrapper.at(2).simulate('change', { target: { value: password } });

    const passwordConfirm = 'abcabcabc';
    wrapper.at(3).simulate('change', { target: { value: passwordConfirm } });

    const wrapper2 = component.find('.signUpButton');
    wrapper2.simulate('click');

    //expect(spyAlert).toBeCalledTimes(1);

    //const SignUpInstance = component.find(SignUp.WrappedComponent).instance();
  });

  it('should sign up fail 2: password do not match', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(signup);
    const wrapper = component.find('input');

    const username = 'Jake';
    wrapper.at(0).simulate('change', { target: { value: username } });

    const email = 'abc@naver.com';
    wrapper.at(1).simulate('change', { target: { value: email } });

    const password = 'abcabcabc';
    wrapper.at(2).simulate('change', { target: { value: password } });

    const passwordConfirm = 'abcabcab';
    wrapper.at(3).simulate('change', { target: { value: passwordConfirm } });

    const wrapper2 = component.find('.signUpButton');
    wrapper2.simulate('click');

    expect(spyAlert).toBeCalledTimes(1);

    const SignUpInstance = component.find(SignUp.WrappedComponent).instance();
    expect(SignUpInstance.state.username).toEqual('');
    expect(SignUpInstance.state.email).toEqual('');
    expect(SignUpInstance.state.pw).toEqual('');
    expect(SignUpInstance.state.pwConfirm).toEqual('');
  });

  it('should sign up fail 3: already exist id', () => {
    //const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(signup);
    const wrapper = component.find('input');

    const username = 'John';
    wrapper.at(0).simulate('change', { target: { value: username } });

    const email = 'abc@naver.com';
    wrapper.at(1).simulate('change', { target: { value: email } });

    const password = 'abcabcabc';
    wrapper.at(2).simulate('change', { target: { value: password } });

    const passwordConfirm = 'abcabcabc';
    wrapper.at(3).simulate('change', { target: { value: passwordConfirm } });

    const wrapper2 = component.find('.signUpButton');
    wrapper2.simulate('click');

    //expect(spyAlert).toBeCalledTimes(1);

    //const SignUpInstance = component.find(SignUp.WrappedComponent).instance();
  });

  it('should sign up success', async () => {
    //const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    //const spyHistoryPush = jest
    //  .spyOn(history, 'push')
    //  .mockImplementation((path) => {});
    const component = mount(signup2);
    const wrapper = component.find('input');

    const username = 'Jake';
    wrapper.at(0).simulate('change', { target: { value: username } });

    const email = 'abc@naver.com';
    wrapper.at(1).simulate('change', { target: { value: email } });

    const password = 'abcabcabc';
    wrapper.at(2).simulate('change', { target: { value: password } });

    const passwordConfirm = 'abcabcabc';
    wrapper.at(3).simulate('change', { target: { value: passwordConfirm } });

    const wrapper2 = component.find('.signUpButton');
    wrapper2.simulate('click');

    expect(spyPost).toBeCalledTimes(1);
    //expect(spyHistoryPush).toBeCalledTimes(0);
    //expect(spyAlert).toBeCalledTimes(1);
    //expect(window.location.href).toEqual('http://localhost/signin');
    history.push('/');
  });
});
