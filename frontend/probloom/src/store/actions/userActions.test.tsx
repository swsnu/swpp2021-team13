import axios from 'axios';
import { getUserProfile, updateUserIntroduction } from '.';
import { UserProfile } from '../reducers/userReducer';
import store, { AppDispatch } from '../store';

const dispatch = store.dispatch as AppDispatch;

describe('Out of all action creators', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    spy.mockClear();
  });

  test('getUserProfile fetches user profile correctly', async () => {
    const stubUserProfile: UserProfile = {
      userId: 42,
      introduction: 'TEST_USER_PROFILE_INTRODUCTION',
    };
    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: stubUserProfile,
    }));
    await dispatch(getUserProfile(42));
    expect(spy).toHaveBeenCalledWith('/api/user/42/profile');
    expect(store.getState().user.selectedUserProfile).toEqual(stubUserProfile);
  });

  test('updateUserIntroduction updates introduction correctly', async () => {
    const stubUserProfile: UserProfile = {
      userId: 42,
      introduction: 'TEST_USER_PROFILE_INTRODUCTION_OLD',
    };
    const newIntroduction = 'TEST_USER_PROFILE_INTRODUCTION_NEW';
    spy = jest.spyOn(axios, 'put').mockImplementation(async (url, data) => ({
      status: 200,
    }));
    await dispatch(updateUserIntroduction(42, newIntroduction));
    expect(spy).toHaveBeenCalledWith('/api/user/42/profile', {
      introduction: newIntroduction,
    });
    expect(store.getState().user.selectedUserProfile).toEqual({
      ...stubUserProfile,
      introduction: newIntroduction,
    });
  });
});
