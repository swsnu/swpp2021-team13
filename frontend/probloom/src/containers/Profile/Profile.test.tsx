import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { Profile } from './Profile';

jest.mock('./ProfileSummary', () => ({
  ProfileSummary: jest.fn(() => <div>TEST_PROFILE_SUMMARY</div>),
}));

jest.mock('./ProfileStatistics', () => ({
  ProfileStatistics: jest.fn(() => <div>TEST_PROFILE_STATISTICS</div>),
}));

jest.mock('../../components/NotFound/NotFound', () => ({
  ProfileStatistics: jest.fn(() => <div>TEST_NOT_FOUND</div>),
}));

describe('<Profile />', () => {
  describe('given valid user id and active tab name', () => {
    beforeEach(() => {});

    it('renders summary tab', () => {
      const app = (
        <MemoryRouter initialEntries={['/user/0/summary']}>
          <Profile />
        </MemoryRouter>
      );
      render(app);
      expect(screen.getByText('TEST_PROFILE_SUMMARY')).toBeDefined();
      expect(screen.getByText('TEST_PROFILE_STATISTICS')).toThrow();
    });

    it('renders statistics tab', () => {
      const app = (
        <MemoryRouter initialEntries={['/user/0/statistics']}>
          <Profile />
        </MemoryRouter>
      );
      render(app);
      expect(screen.getByText('TEST_PROFILE_SUMMARY')).toThrow();
      expect(screen.getByText('TEST_PROFILE_STATISTICS')).toBeDefined();
    });
  });

  describe('given invalid user id', () => {
    beforeEach(() => {
      console.warn = jest.fn();
    });

    afterEach(() => {
      (console.warn as jest.Mock).mockClear();
    });

    it('renders not found page', () => {
      const app = (
        <MemoryRouter initialEntries={['/user/invalid/statistics']}>
          <Profile />
        </MemoryRouter>
      );
      render(app);
      expect(screen.getByText('TEST_NOT_FOUND')).toBeDefined();
    });

    it('emits warning', () => {
      const app = (
        <MemoryRouter initialEntries={['/user/invalid/statistics']}>
          <Profile />
        </MemoryRouter>
      );
      render(app);
      expect(console.warn).toHaveBeenCalledWith(
        expect.stringContaining('not a valid user id')
      );
    });
  });
});
