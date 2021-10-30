import React from 'react';
import { getMockStore } from '../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { UserState } from '../../store/reducers/userReducer';
import Welcome from './Welcome';
import { history } from '../../store/store';
import axios from 'axios';

const UserstateTest: UserState = {
  users: [
    {
      id: 1,
      username: 'John',
      email: 'swpp@snu.ac.kr',
      password: 'iluvswpp',
      logged_in: true,
    },
    {
      id: 2,
      username: 'Jake',
      email: 'abc@naver.com',
      password: 'abc',
      logged_in: false,
    },
  ],
  selectedUser: null,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const mockStore = getMockStore(UserstateTest);

describe('<Welcome />', () => {
  let welcome;
  let spyGet, spyPut;

  beforeEach(() => {
    welcome = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={Welcome} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyGet = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: UserstateTest.users,
    }));
    spyPut = jest.spyOn(axios, 'put').mockImplementation(async (_) => ({
      status: 200,
      data: UserstateTest.users[1],
    }));
  });

  it('should render Welcome', () => {
    const component = mount(welcome);
    const wrapper = component.find('.Welcome');
    expect(wrapper.length).toBe(1);
    expect(spyGet).toBeCalledTimes(1);
  });

  it('should set state properly on id input', () => {
    const component = mount(welcome);
    const wrapper = component.find('input');
    expect(wrapper.length).toBe(2);

    const id = 'swpp@snu.ac.kr';
    wrapper.at(0).simulate('change', { target: { value: id } });

    const WelcomeInstance = component.find(Welcome.WrappedComponent).instance();
    expect(WelcomeInstance.state.id).toEqual(id);
    expect(WelcomeInstance.state.pw).toEqual('');
  });

  it('should set state properly on pw input', () => {
    const component = mount(welcome);
    const wrapper = component.find('input');
    expect(wrapper.length).toBe(2);

    const pw = 'iluvswpp';
    wrapper.at(1).simulate('change', { target: { value: pw } });

    const WelcomeInstance = component.find(Welcome.WrappedComponent).instance();
    expect(WelcomeInstance.state.id).toEqual('');
    expect(WelcomeInstance.state.pw).toEqual(pw);
  });

  it('should click sign in button', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(welcome);
    const wrapper = component.find('.signInButton');
    wrapper.simulate('click');
    expect(spyAlert).toBeCalledTimes(1);
  });

  it('should sign in success', () => {
    const component = mount(welcome);
    const wrapper = component.find('input');

    const id = 'swpp@snu.ac.kr';
    wrapper.at(0).simulate('change', { target: { value: id } });
    const pw = 'iluvswpp';
    wrapper.at(1).simulate('change', { target: { value: pw } });
    const wrapper2 = component.find('.signInButton');
    wrapper2.simulate('click');

    expect(spyPut).toBeCalledTimes(1);
    history.push('/');
  });

  it('should sign in fail', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(welcome);
    const wrapper = component.find('input');

    const id = 'swpp@snu.ac.kr';
    wrapper.at(0).simulate('change', { target: { value: id } });
    const pw = 'iluvsw';
    wrapper.at(1).simulate('change', { target: { value: pw } });
    const wrapper2 = component.find('.signInButton');
    wrapper2.simulate('click');

    expect(spyAlert).toBeCalledTimes(2);

    const WelcomeInstance = component.find(Welcome.WrappedComponent).instance();
    expect(WelcomeInstance.state.id).toEqual('');
    expect(WelcomeInstance.state.pw).toEqual('');
  });

  it('should click sign up button', () => {
    const component = mount(welcome);
    const wrapper = component.find('.signUpButton');
    wrapper.simulate('click');
    expect(window.location.href).toEqual('http://localhost/signup');
    history.push('/');
  });
});
