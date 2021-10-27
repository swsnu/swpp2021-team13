import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { getMockStore } from '../../mocks';
import { UserProfile, UserState } from '../../store/reducers/userReducer';
import ProfileSummary from './ProfileSummary';

describe('<ProfileSummary />', () => {
  it('renders user introduction', () => {
    const mockUserProfile: UserProfile = {
      userId: 42,
      introduction: 'TEST_USER_PROFILE_INTRODUCTION',
    };
    const mockUserState: UserState = {
      users: [],
      selectedUser: null,
      selectedUserProfile: mockUserProfile,
      selectedUserStatistics: null,
    };
    const mockStore = getMockStore({ mockUserState });
    const app = (
      <Provider store={mockStore}>
        <ProfileSummary userId={42} />
      </Provider>
    );
    render(app);
    expect(screen.getByText(mockUserProfile.introduction)).toBeInTheDocument();
  });
});
