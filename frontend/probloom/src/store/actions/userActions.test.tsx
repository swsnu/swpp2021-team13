import axios from 'axios';
import { getUserProfile, updateUserIntroduction } from '.';
import { UserStatistics, UserProfile } from '../reducers/userReducer';
import store, { AppDispatch } from '../store';
import * as actionCreators from './userActions';

const dispatch = store.dispatch as AppDispatch;

describe('Out of all action creators', () => {
  let spy: jest.SpyInstance;

  afterEach(() => {
    spy.mockClear();
  });

  it(`'getUserStatistics' should fetch user statistics correctly`, async () => {
    const stubUserStatistics: UserStatistics = {
      userId: 1,
      lastActiveDays: 1,
      // createdProblems: [1, 2],
      // solvedProblems: [1, 2, 3],
      // recommendedProblems: [1],
      // createdExplanations: [7, 8],
      // recommendedExplanations: [7],
    };

    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: stubUserStatistics,
    }));

    await dispatch(actionCreators.getUserStatistics(stubUserStatistics.userId));
    const newState = store.getState();

    // TODO
    expect(newState.user.selectedUserStatistics.data).toEqual(
      stubUserStatistics
    );
    expect(spy).toHaveBeenCalledTimes(1);
  });

  test('getUserProfile fetches user profile correctly', async () => {
    const introduction = 'TEST_USER_PROFILE_INTRODUCTION';
    const stubUserProfile: UserProfile = {
      userId: 42,
      introduction,
    };
    spy = jest.spyOn(axios, 'get').mockImplementation(async (_) => ({
      status: 200,
      data: { introduction },
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
