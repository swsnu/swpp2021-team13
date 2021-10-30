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
      password: 'iluvswpp',
      logged_in: false,
    },
  ],
  selectedUser: null,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const mockStore = getMockStore(UserstateTest);

describe('<SignUp />', () => {
  let signup;
  let spyGet, spyPost;

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
    spyGet = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: UserstateTest.users,
    }));
    spyPost = jest.spyOn(axios, 'post').mockImplementation(async (_) => ({
      status: 200,
      data: {
        id: 2,
        username: 'Jake',
        email: 'abc@naver.com',
        password: 'abcabcabc',
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
    expect(spyGet).toBeCalledTimes(1);
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
    expect(window.location.href).toEqual('http://localhost/login');
    history.push('/');
  });

  it('should sign up fail 1: invalid', () => {
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

  it('should sign up fail 3: already exist username', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
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

    expect(spyAlert).toBeCalledTimes(1);

    const SignUpInstance = component.find(SignUp.WrappedComponent).instance();
    expect(SignUpInstance.state.username).toEqual('');
    expect(SignUpInstance.state.email).toEqual('');
    expect(SignUpInstance.state.pw).toEqual('');
    expect(SignUpInstance.state.pwConfirm).toEqual('');
  });

  it('should sign up fail 4: already exist email', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(signup);
    const wrapper = component.find('input');

    const username = 'Jake';
    wrapper.at(0).simulate('change', { target: { value: username } });

    const email = 'swpp@snu.ac.kr';
    wrapper.at(1).simulate('change', { target: { value: email } });

    const password = 'abcabcabc';
    wrapper.at(2).simulate('change', { target: { value: password } });

    const passwordConfirm = 'abcabcabc';
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

  it('should sign up success', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(signup);
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
    expect(window.location.href).toEqual('http://localhost/login');
    expect(spyAlert).toBeCalledTimes(1);
    history.push('/');
  });
});
