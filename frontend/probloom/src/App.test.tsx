import { render, screen } from '@testing-library/react';
import App from './App';
import { Provider } from 'react-redux';
import { getMockStoreWithRouter } from './mocks';
import { history } from './store/store';

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

describe('<App />', () => {
  describe('when routing', () => {
    let app: JSX.Element;
    beforeEach(() => {
      app = (
        <Provider store={getMockStoreWithRouter()}>
          <App history={history} />
        </Provider>
      );
    });

    it('routes to not found page', () => {
      render(app);
      history.push('/invalid-path');
      expect(screen.getByRole('heading')).toHaveTextContent('TEST_NOT_FOUND');
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
