import { mount, shallow } from 'enzyme';
import { ConnectedRouter } from 'connected-react-router';
import AppHeader, { ProfileDropdownProps } from './AppHeader';
import { Provider } from 'react-redux';
import { history } from '../../store/store';
import { getMockStore } from '../../test-utils/mocks';
import * as userActions from '../../store/actions/userActions';
import { User, UserState } from '../../store/reducers/userReducer';
import axios from 'axios';

const testUser1: User = {
  id: 1,
  username: 'user1',
  email: 'email1@email.emaul',
  logged_in: true,
};

let spyGet = jest.spyOn(axios, 'get').mockImplementation(async () => ({
  status: 200,
  data: testUser1,
}));

const UserStateTest: UserState = {
  users: [testUser1],
  selectedUser: testUser1,
  selectedUserProfile: null,
  selectedUserStatistics: null,
};

const ProfileDropdown: ProfileDropdownProps = {
  user: testUser1,
  onSignOut: (user) => {},
};

const mockStore = getMockStore(UserStateTest);

describe('<AppHeader />', () => {
  let problemSetCreate;
  let spyCreateProblemSet;
  /*
  beforeEach(() => {
    problemSetCreate = (
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route path="/" exact component={ProblemSetCreate} />
          </Switch>
        </ConnectedRouter>
      </Provider>
    );
  });*/

  it('should render AppHeader', () => {
    const component = mount(
      <Provider store={mockStore}>
        <ConnectedRouter history={history}>
          <AppHeader />
        </ConnectedRouter>
      </Provider>
    );

    console.log(component.debug());

    const wrapper = component.find('ProfileDropdown');
    expect(wrapper.length).toBe(1);

    const wrapper_item = wrapper.find('DropdownItem');
    wrapper_item.at(1).simulate('click');
  });
});
