import { fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router';

import { signInSuccess } from '../../store/actions/userActions';
import { User } from '../../store/reducers/userReducer';
import store from '../../store/store';

import Profile from './Profile';

jest.mock('./ProfileSummary', () => ({
  __esModule: true,
  default: () => <div>TEST_PROFILE_SUMMARY</div>,
}));

jest.mock('./ProfileStatistics', () => ({
  __esModule: true,
  default: () => <div>TEST_PROFILE_STATISTICS</div>,
}));

jest.mock('../../components/NotFound/NotFound', () => ({
  __esModule: true,
  default: () => <div>TEST_NOT_FOUND</div>,
}));

const stubUser: User = {
  id: 1,
  username: 'turing',
  email: 'turing@example.com',
  logged_in: true,
};

describe('<Profile />', () => {
  describe('given valid user id and active tab name', () => {
    it('renders summary tab', async () => {
      const app = (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/user/0/summary']}>
            <Route path="/user/:id/:active" exact component={Profile} />
          </MemoryRouter>
        </Provider>
      );
      store.dispatch(signInSuccess(stubUser));
      render(app);
      expect(screen.getByText('TEST_PROFILE_SUMMARY')).toBeInTheDocument();
      expect(
        screen.queryByText('TEST_PROFILE_STATISTICS')
      ).not.toBeInTheDocument();
    });

    it('renders statistics tab', () => {
      const app = (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/user/0/statistics']}>
            <Route path="/user/:id/:active" exact component={Profile} />
          </MemoryRouter>
        </Provider>
      );
      store.dispatch(signInSuccess(stubUser));
      render(app);
      expect(screen.getByText('TEST_PROFILE_STATISTICS')).toBeInTheDocument();
      expect(
        screen.queryByText('TEST_PROFILE_SUMMARY')
      ).not.toBeInTheDocument();
    });

    it('handles tab change', async () => {
      const app = (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/user/0/summary']}>
            <Route path="/user/:id/:active" exact component={Profile} />
          </MemoryRouter>
        </Provider>
      );
      store.dispatch(signInSuccess(stubUser));
      render(app);
      fireEvent.click(screen.getByText(/statistics/i));
      expect(screen.getByText('TEST_PROFILE_STATISTICS')).toBeInTheDocument();
      fireEvent.click(screen.getByText(/summary/i));
      expect(screen.getByText('TEST_PROFILE_SUMMARY')).toBeInTheDocument();
    });

    it('contains back button', () => {
      const app = (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/user/0/statistics']}>
            <Route path="/user/:id/:active" exact component={Profile} />
            <Route
              path="/problem/search/"
              render={() => <div>TEST_PROBLEM_SEARCH</div>}
            />
          </MemoryRouter>
        </Provider>
      );
      store.dispatch(signInSuccess(stubUser));
      render(app);
      const backButton = screen.getByRole('button', { name: /back/i });
      expect(backButton).toBeInTheDocument();
      fireEvent.click(backButton);
      expect(screen.getByText('TEST_PROBLEM_SEARCH')).toBeInTheDocument();
    });

    it('renders username and email', async () => {
      const app = (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/user/0/statistics']}>
            <Route path="/user/:id/:active" exact component={Profile} />
          </MemoryRouter>
        </Provider>
      );
      store.dispatch(signInSuccess(stubUser));
      render(app);
      expect(screen.getByText('turing')).toBeInTheDocument();
      expect(screen.getByText('turing@example.com')).toBeInTheDocument();
    });

    it('redirects anonymous users', async () => {
      const app = (
        <Provider store={store}>
          <MemoryRouter initialEntries={['/user/0/statistics']}>
            <Route path="/user/:id/:active" exact component={Profile} />
            <Route render={() => <div>MAIN_PAGE</div>} />
          </MemoryRouter>
        </Provider>
      );
      render(app);
      expect(screen.getByText('MAIN_PAGE')).toBeInTheDocument();
    });
  });

  describe.each([
    ['user id', '/user/INVALID/statistics'],
    ['tab name', '/user/0/INVALID'],
  ])('given invalid %s', (invalidParameterName, path) => {
    let spy: jest.SpyInstance;
    beforeEach(() => {
      spy = jest.spyOn(console, 'warn').mockImplementation();
      const app = (
        <Provider store={store}>
          <MemoryRouter initialEntries={[path]}>
            <Route path="/user/:id/:active" exact component={Profile} />
          </MemoryRouter>
        </Provider>
      );
      store.dispatch(signInSuccess(stubUser));
      render(app);
    });

    afterEach(() => {
      spy.mockClear();
    });

    it('renders not found page', () => {
      expect(screen.getByText('TEST_NOT_FOUND')).toBeInTheDocument();
    });

    it('emits warning', () => {
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining(`not a valid ${invalidParameterName}`)
      );
    });
  });
});
