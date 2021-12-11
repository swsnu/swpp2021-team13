import React from 'react';
import { getMockStore } from '../../../test-utils/mocks';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import * as problemActions from '../../../store/actions/problemSetActions';
import { Solver } from '../../../store/reducers/problemReducerInterface';
import { ProblemSetState } from '../../../store/reducers/problemReducer';
import ProblemSetSolveResult from './ProblemSetSolveResult';
import { history } from '../../../store/store';
import { User, UserState } from '../../../store/reducers/userReducer';

const testUser1: User = {
  id: 1,
  username: 'user1',
  email: 'email1@email.emaul',
  logged_in: true,
};

const UserStateTest: UserState = {
  users: [testUser1],
  selectedUser: testUser1,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const solver1: Solver = {
  userID: 1,
  username: 'user1',
  result: true,
  problems: [true, false],
};

const ProblemSetStateTest: ProblemSetState = {
  problemSets: [],
  solvers: [solver1],
  selectedSolver: solver1,
  isRecommender: false,
  selectedProblemSet: null,
  selectedProblem: null,
};

const mockStore = getMockStore(UserStateTest, ProblemSetStateTest);

describe('<ProblemSetSolveResult />', () => {
  let problemSetSolveResult;
  let spyGetSolver;

  beforeEach(() => {
    problemSetSolveResult = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSolveResult} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    spyGetSolver = jest
      .spyOn(problemActions, 'getSolver')
      .mockImplementation((idSet: any) => {
        return (dispatch) => {};
      });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProblemSetSolveResult', () => {
    const component = mount(problemSetSolveResult);
    const wrapper = component.find('div.ProblemSetSolveResult');
    expect(wrapper.length).toBe(1);
    expect(spyGetSolver).toBeCalledTimes(1);
    history.push('/');
  });

  it('click back to detail page button', () => {
    const component = mount(problemSetSolveResult);
    const wrapper_button = component.find('button.backDetailButton');
    wrapper_button.simulate('click');
    history.push('/');
  });

  it('click back to search page button', () => {
    const component = mount(problemSetSolveResult);
    const wrapper_button = component.find('button.backSearchButton');
    wrapper_button.simulate('click');
    history.push('/');
  });

  it('selectedUser is null', () => {
    const UserStateTest: UserState = {
      users: [],
      selectedUser: null,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    };
    const mockStore = getMockStore(UserStateTest);

    problemSetSolveResult = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSolveResult} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );

    const component = mount(problemSetSolveResult);
    history.push('/');
  });

  it('selectedSolver is null', () => {
    const UserStateTest: UserState = {
      users: [],
      selectedUser: testUser1,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    };

    const ProblemSetStateTest: ProblemSetState = {
      problemSets: [],
      solvers: [],
      selectedSolver: null,
      isRecommender: false,
      selectedProblemSet: null,
      selectedProblem: null,
    };
    const mockStore = getMockStore(UserStateTest, ProblemSetStateTest);

    problemSetSolveResult = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetSolveResult} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );

    const component = mount(problemSetSolveResult);
    history.push('/');
  });
});
