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
      logged_in: true,
    },
    {
      id: 2,
      username: 'Jake',
      email: 'abc@naver.com',
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
      logged_in: true,
    },
  ],
  selectedUser: {
    id: 1,
    username: 'John',
    email: 'swpp@snu.ac.kr',
    logged_in: true,
  },
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const mockStore = getMockStore(UserstateTest);
const mockStore2 = getMockStore(UserstateTest2);

describe('<Welcome />', () => {
  let welcome, welcome2;
  let spyPost;

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
    welcome2 = (
      <Provider store={mockStore2}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={Welcome} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyPost = jest.spyOn(axios, 'post').mockImplementation(async (_) => ({
      status: 200,
      data: UserstateTest.users[0],
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render Welcome', () => {
    const component = mount(welcome);
    const wrapper = component.find('div.Welcome');
    expect(wrapper.length).toBe(1);
  });

  it('should click sign in button', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(welcome);
    const wrapper = component.find('button.signInButton');
    wrapper.simulate('click');
    expect(spyAlert).toBeCalledTimes(1);
  });

  it('should sign in fail1', () => {
    const component = mount(welcome);
    const wrapper = component.find('input');

    const id = 'swpp@snu.ac.kr';
    wrapper.at(0).simulate('change', { target: { value: id } });
    const pw = 'iluvswpp';
    wrapper.at(1).simulate('change', { target: { value: pw } });
    const wrapper2 = component.find('button.signInButton');
    wrapper2.simulate('click');

    expect(spyPost).toBeCalledTimes(1);
    history.push('/');
  });

  it('should sign in fail2', () => {
    const spyAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    const component = mount(welcome);
    const wrapper = component.find('input');

    const id = 'swpp@snu.ac.kr';
    wrapper.at(0).simulate('change', { target: { value: id } });
    const pw = 'iluvsw';
    wrapper.at(1).simulate('change', { target: { value: pw } });
    const wrapper2 = component.find('button.signInButton');
    wrapper2.simulate('click');

    expect(spyAlert).toBeCalledTimes(1);

    const WelcomeInstance = component.find(Welcome.WrappedComponent).instance();
    expect(WelcomeInstance.state.id).toEqual('');
  });

  it('should click sign up button', () => {
    const component = mount(welcome);
    const wrapper = component.find('button.signUpButton');
    wrapper.simulate('click');
    expect(window.location.href).toEqual('http://localhost/signup');
    history.push('/');
  });

  it('should sign in success', () => {
    //const spyHistoryPush = jest
    //  .spyOn(history, 'push')
    //  .mockImplementation((path) => {});
    const component = mount(welcome2);
    const wrapper = component.find('input');

    const id = 'swpp@snu.ac.kr';
    wrapper.at(0).simulate('change', { target: { value: id } });
    const pw = 'iluvswpp';
    wrapper.at(1).simulate('change', { target: { value: pw } });

    const wrapper2 = component.find('button.signInButton');
    wrapper2.simulate('click');

    expect(spyPost).toBeCalledTimes(1);
    //expect(spyHistoryPush).toBeCalledTimes(0);
    history.push('/');
  });
});
