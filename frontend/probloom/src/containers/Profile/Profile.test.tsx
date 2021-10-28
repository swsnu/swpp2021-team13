import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router';

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

describe('<Profile />', () => {
  describe('given valid user id and active tab name', () => {
    it('renders summary tab', async () => {
      const app = (
        <MemoryRouter initialEntries={['/user/0/summary']}>
          <Route path="/user/:id/:active" exact component={Profile} />
        </MemoryRouter>
      );
      render(app);
      expect(screen.getByText('TEST_PROFILE_SUMMARY')).toBeInTheDocument();
      expect(
        screen.queryByText('TEST_PROFILE_STATISTICS')
      ).not.toBeInTheDocument();
    });

    it('renders statistics tab', () => {
      const app = (
        <MemoryRouter initialEntries={['/user/0/statistics']}>
          <Route path="/user/:id/:active" exact component={Profile} />
        </MemoryRouter>
      );
      render(app);
      expect(screen.getByText('TEST_PROFILE_STATISTICS')).toBeInTheDocument();
      expect(
        screen.queryByText('TEST_PROFILE_SUMMARY')
      ).not.toBeInTheDocument();
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
        <MemoryRouter initialEntries={[path]}>
          <Route path="/user/:id/:active" exact component={Profile} />
        </MemoryRouter>
      );
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
