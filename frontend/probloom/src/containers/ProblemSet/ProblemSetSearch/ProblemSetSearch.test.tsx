import React, { Component } from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ProblemState } from '../../../store/reducers/problemReducer';
import ProblemSetSearch from './ProblemSetSearch';
import { history } from '../../../store/store';
import axios from 'axios';
import { User, UserState } from '../../../store/reducers/userReducer';

const testUser: User = {
    id: 1,
    username: 'user1',
    email: 'email1@email.emaul',
    logged_in: true,
};

const UserStateTest: UserState = {
  users: [testUser],
  selectedUser: testUser,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const ProblemStateTest: ProblemState = {
  problems: [
      {
          id: 1,
          title: 'title1',
          date: '2021-01-01',
          is_open: false,
          tag: 'math',
          difficulty: 1,
          content: 'content1',
          userID: 1,
          username: 'user1',
          solved_num: 1,
          recommended_num: 1,
      },
      {
          id: 2,
          title: 'title2',
          date: '2021-02-02',
          is_open: true,
          tag: 'math',
          difficulty: 2,
          content: 'content2',
          userID: 2,
          username: 'user2',
          solved_num: 0,
          recommended_num: 3,
      },
      {
          id: 3,
          title: 'title12',
          date: '1000-01-01',
          is_open: true,
          tag: 'history',
          difficulty: 3,
          content: 'content3',
          userID: 12,
          username: 'user12',
          solved_num: 3,
          recommended_num: 2,
      }
  ]
};

const mockStore = getMockStore(UserStateTest, ProblemStateTest);

describe('<ProblemSetSearch />', () => {
  let problemSetSearch;
  let spyGet;

  beforeEach(() => {
    problemSetSearch = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSearch} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyGet = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: ProblemStateTest.problems[0],
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProblemSetSearch', () => {
    const component = mount(problemSetSearch);
    const wrapper = component.find('.ProblemSetSearch');
    expect(wrapper.length).toBe(1);
    expect(spyGet).toBeCalledTimes(1);
    const wrapper2 = component.find('.Problem');
    expect(wrapper2.length).toBe(3);
  });

  it('should move to ProblemSetCreate', () => {
    const spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation(path => {});
    const component = mount(problemSetSearch);
    const wrapper = component.find('#create');
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledWith('/problem/create/');
  })

  it('should move to ProblemSetDetial', () => {
    const spyHistoryPush = jest.spyOn(history, 'push')
      .mockImplementation(path => {});
    const component = mount(problemSetSearch);
    const wrapper = component.find('#detail').first();
    wrapper.simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledWith('/problem/2/');
  })

  it('should search by title appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('#search_bar');
    wrapper1.simulate('change', { target: { value : '1' } });
    const wrapper2 = component.find('#term');
    wrapper2.simulate('change', { target: { value : 'title' } });
    const wrapper3 = component.find('#search');
    wrapper3.simulate('click');
    const wrapper4 = component.find('.Problem');
    expect(wrapper4.length).toBe(2);
  });

  it('should search by content appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('#search_bar');
    wrapper1.simulate('change', { target: { value : '1' } });
    const wrapper2 = component.find('#term');
    wrapper2.simulate('change', { target: { value : 'content' } });
    const wrapper3 = component.find('#search');
    wrapper3.simulate('click');
    const wrapper4 = component.find('.Problem');
    expect(wrapper4.length).toBe(1);
  })

  it('should search own problems appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('#search_bar');
    wrapper1.simulate('change', { target: { value : '1' } });
    const wrapper2 = component.find('#creator');
    wrapper2.simulate('change', { target: { value : 'own' } });
    const wrapper3 = component.find('#search');
    wrapper3.simulate('click');
    const wrapper4 = component.find('.Problem');
    expect(wrapper4.length).toBe(1);
  })

  it('should search by math appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper2 = component.find('#tag');
    wrapper2.simulate('change', { target: { value : 'math' } });
    const wrapper4 = component.find('.Problem');
    expect(wrapper4.length).toBe(2);
  })

  it('should sort by solved appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('#sort');
    wrapper1.simulate('change', { target: { value : 'solved' } });
    const wrapper2 = component.find('#detail');
    expect(wrapper2.at(0).text()).toBe('title12');
    expect(wrapper2.at(1).text()).toBe('title1');
    expect(wrapper2.at(2).text()).toBe('title2');
  })

  it('should sort by recommended appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('#sort');
    wrapper1.simulate('change', { target: { value : 'recommended' } });
    const wrapper2 = component.find('#detail');
    expect(wrapper2.at(0).text()).toBe('title2');
    expect(wrapper2.at(1).text()).toBe('title12');
    expect(wrapper2.at(2).text()).toBe('title1');
  })
})