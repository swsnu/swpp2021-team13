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
  NotFound: () => <div>TEST_NOT_FOUND</div>,
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

  describe('given invalid user id', () => {
    let spy: jest.SpyInstance;
    beforeEach(() => {
      spy = jest.spyOn(console, 'warn');
    });

    afterEach(() => {
      spy.mockClear();
    });

    it('renders not found page', () => {
      const app = (
        <MemoryRouter initialEntries={['/user/invalid/statistics']}>
          <Route path="/user/:id/:active" exact component={Profile} />
        </MemoryRouter>
      );
      render(app);
      expect(screen.getByText('TEST_NOT_FOUND')).toBeInTheDocument();
    });

    it('emits warning', () => {
      const app = (
        <MemoryRouter initialEntries={['/user/invalid/statistics']}>
          <Route path="/user/:id/:active" exact component={Profile} />
        </MemoryRouter>
      );
      render(app);
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('not a valid user id')
      );
    });
  });
});
