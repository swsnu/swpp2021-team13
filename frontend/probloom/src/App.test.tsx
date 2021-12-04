import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { getMockStoreWithRouter } from './mocks';
import store, { history } from './store/store';
import { signInSuccess } from './store/actions/userActions';
import { User } from './store/reducers/userReducer';
import axios from 'axios';

jest.mock('./containers/Profile/Profile', () => ({
  __esModule: true,
  default: (props) => (
    <div>
      <h1>TEST_PROFILE</h1>
      <div>id: {props.match.params.id}</div>
      <div>tab name: {props.match.params.active}</div>
    </div>
  ),
}));

jest.mock('./components/NotFound/NotFound', () => ({
  __esModule: true,
  default: () => <h1>TEST_NOT_FOUND</h1>,
}));

const stubUser: User = {
  id: 1,
  username: 'turing',
  email: 'turing@example.com',
  logged_in: true,
};

describe('<App />', () => {
  describe('when routing', () => {
    let app: JSX.Element;
    let spyGet: jest.SpyInstance;

    beforeEach(() => {
      app = (
        <Provider store={store}>
          <App history={history} />
        </Provider>
      );
      store.dispatch(signInSuccess(stubUser));
      spyGet = jest.spyOn(axios, 'get').mockResolvedValue(stubUser);
    });

    afterEach(() => {
      spyGet.mockClear();
    });

    it('routes to not found page', () => {
      render(app);
      history.push('/invalid-path');
      expect(screen.getByRole('heading')).toHaveTextContent('TEST_NOT_FOUND');
    });

    it('routes to signup page', () => {
      render(app);
      history.push('/signup/');
    });

    it.each([
      ['/user/123/summary', '123', 'summary'],
      ['/user/123/statistics', '123', 'statistics'],
      ['/user/123', '123', 'summary'],
    ])('routes %s to Profile page', (path, id, active) => {
      render(app);
      history.push(path);
      expect(screen.getByRole('heading')).toHaveTextContent('TEST_PROFILE');
      expect(screen.getByText(`id: ${id}`)).toBeInTheDocument();
      expect(screen.getByText(`tab name: ${active}`)).toBeInTheDocument();
    });
  });
});
