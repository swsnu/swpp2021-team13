import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch } from 'react-router-dom';
import { getMockStore } from '../../test-utils/mocks';

import { history } from '../../store/store';

import { UserState } from '../../store/reducers/userReducer';
import ProfileStatistics from './ProfileStatistics';

const stubInitialState: UserState = {
  users: [
    {
      id: 1,
      username: 'test-user-1',
      email: 'test-email-1',
    },
    {
      id: 2,
      username: 'test-user-2',
      email: 'test-email-2',
    },
  ],
  selectedUser: {
    id: 1,
    username: 'test-user-1',
    email: 'test-email-1',
  },
  selectedUserProfile: null,
  selectedUserStatistics: {
    userId: 1,
    lastActiveDays: 1,
    createdProblems: [1, 2],
    solvedProblems: [1, 2, 3],
    recommendedProblems: [1],
    createdExplanations: [7, 8],
    recommendedExplanations: [7],
  },
};

const stubInitialStateNoSelected: UserState = {
  users: [
    {
      id: 1,
      username: 'test-user-1',
      email: 'test-email-1',
    },
    {
      id: 2,
      username: 'test-user-2',
      email: 'test-email-2',
    },
  ],
  selectedUser: {
    id: 1,
    username: 'test-user-1',
    email: 'test-email-1',
  },
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const mockStore = getMockStore(stubInitialState);
const mockStoreNoSelected = getMockStore(stubInitialStateNoSelected);

describe('<ProfileStatistics />', () => {
  let newProfileStatistics, newProfileStatisticsNoSelected;

  beforeEach(() => {
    newProfileStatistics = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path="/"
              exact
              component={() => <ProfileStatistics userId={1} />}
            />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
    newProfileStatisticsNoSelected = (
      <Provider store={mockStoreNoSelected}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route
              path="/"
              exact
              component={() => <ProfileStatistics userId={1} />}
            />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render ProfileStatistics', () => {
    const component = mount(newProfileStatistics);
    const wrapper = component.find('.ProfileStatistics');
    expect(wrapper.length).toBe(1);
  });

  it('should render ProfileStatisticsNoSelected', () => {
    const component = mount(newProfileStatisticsNoSelected);
    const wrapper = component.find('.ProfileStatistics');
    expect(wrapper.length).toBe(1);
  });
});
