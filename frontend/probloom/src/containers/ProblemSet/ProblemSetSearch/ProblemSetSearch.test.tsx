import React, { Component } from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ProblemSetState } from '../../../store/reducers/problemReducer';
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

const ProblemSetStateTest: ProblemSetState = {
  problemSets: [
    {
      id: 1,
      title: 'title1',
      created_time: '2021-01-01',
      is_open: false,
      tag: 'tag-mathematics',
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
      created_time: '2021-02-02',
      is_open: true,
      tag: 'tag-mathematics',
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
      created_time: '1000-01-01',
      is_open: true,
      tag: 'tag-physics',
      difficulty: 3,
      content: 'content3',
      userID: 12,
      username: 'user12',
      solved_num: 3,
      recommended_num: 2,
    },
  ],
  solvers: [],
  selectedProblemSet: null,
  selectedProblems: [],
};

const mockStore = getMockStore(UserStateTest, ProblemSetStateTest);

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
      data: ProblemSetStateTest.problemSets[0],
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
    const wrapper2 = component.find('.ProblemSetSearchResult');
    expect(wrapper2.length).toBe(6);
  });

  it('should move to ProblemSetCreate', () => {
    const spyHistoryPush = jest
      .spyOn(history, 'push')
      .mockImplementation((path) => {});
    const component = mount(problemSetSearch);
    const wrapper = component.find('#create');
    wrapper.at(0).simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledWith('/problem/create/');
  });

  it('should move to ProblemSetDetial', () => {
    const spyHistoryPush = jest
      .spyOn(history, 'push')
      .mockImplementation((path) => {});
    const component = mount(problemSetSearch);
    const wrapper = component.find('#detail');
    wrapper.at(0).simulate('click');
    expect(spyHistoryPush).toHaveBeenCalledWith('/problem/2/detail/');
  });

  it('should search by title appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('input');
    wrapper1.at(0).simulate('change', { target: { value: '1' } });
    const wrapper2 = component.find({"label": "Range"});
    const wrapper2_ = wrapper2.find("DropdownItem")
    wrapper2_.at(1).simulate('click');
    const wrapper3 = component.find('#search');
    wrapper3.at(0).simulate('click');
    const wrapper4 = component.find('.ProblemSetSearchResult');
    expect(wrapper4.length).toBe(4);
  });

  it('should search by content appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('input');
    wrapper1.at(0).simulate('change', { target: { value: '1' } });
    const wrapper2 = component.find({"label": "Range"});
    const wrapper2_ = wrapper2.find("DropdownItem")
    wrapper2_.at(2).simulate('click');
    const wrapper3 = component.find('#search');
    wrapper3.at(1).simulate('click');
    const wrapper4 = component.find('.ProblemSetSearchResult');
    expect(wrapper4.length).toBe(2);
  });

  it('should search own problems appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find('input');
    wrapper1.at(0).simulate('change', { target: { value: '1' } });
    const wrapper2 = component.find({"label": "Creator"});
    const wrapper2_ = wrapper2.find("DropdownItem")
    wrapper2_.at(1).simulate('click');
    const wrapper3 = component.find('#search');
    wrapper3.at(0).simulate('click');
    const wrapper4 = component.find('.ProblemSetSearchResult');
    expect(wrapper4.length).toBe(2);
  });

  it('should search by math appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper2 = component.find({"label": "Tag"});
    const wrapper2_ = wrapper2.find("DropdownItem")
    wrapper2_.at(5).simulate('click');
    const wrapper4 = component.find('.ProblemSetSearchResult');
    expect(wrapper4.length).toBe(4);
  });

  it('should sort by solved appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find({"label": "Sort By"});
    const wrapper1_ = wrapper1.find("DropdownItem")
    wrapper1_.at(1).simulate('click');
    const wrapper2 = component.find('#detail');
    expect(wrapper2.at(0).text()).toBe('title12');
    expect(wrapper2.at(2).text()).toBe('title1');
    expect(wrapper2.at(4).text()).toBe('title2');
  });

  it('should sort by recommended appropriately', () => {
    const component = mount(problemSetSearch);
    const wrapper1 = component.find({"label": "Sort By"});
    const wrapper1_ = wrapper1.find("DropdownItem")
    wrapper1_.at(2).simulate('click');
    const wrapper2 = component.find('#detail');
    expect(wrapper2.at(0).text()).toBe('title2');
    expect(wrapper2.at(2).text()).toBe('title12');
    expect(wrapper2.at(4).text()).toBe('title1');
  });


  it('should redirect to signin if not logged in', () => {
    const component = mount(      
      <Provider store={getMockStore()}>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={ProblemSetSearch} />
        </ConnectedRouter>
      </Provider>
    );
    const wrapper = component.find("Redirect");
    expect(wrapper.length).toBe(1);
  });

  it('should render with no problem sets', () => {
    const NoProblemSetStateTest: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedProblemSet: null,
      selectedProblems: [],
    };
    const component = mount(      
      <Provider store={getMockStore(UserStateTest, NoProblemSetStateTest)}>
        <ConnectedRouter history={history}>
          <Route path="/" exact component={ProblemSetSearch} />
        </ConnectedRouter>
      </Provider>
    );
    const wrapper = component.find("Segment");
    const wrapper2 = wrapper.find("Header")
    expect(wrapper2.at(0).text()).toBe("No Results");
  });
});
