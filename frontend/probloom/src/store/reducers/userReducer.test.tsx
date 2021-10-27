import {
  GET_USER_PROFILE,
  UPDATE_USER_INTRODUCTION,
} from '../actions/actionTypes';
import userReducer, { UserProfile } from './userReducer';

describe('User Reducer', () => {
  it('gets user profile', () => {
    const oldUserProfile: UserProfile = {
      userId: 42,
      introduction: 'TEST_USER_PROFILE_INTRODUCTION_OLD',
    };
    const oldState = userReducer(undefined, {
      type: GET_USER_PROFILE,
      selectedUserProfile: oldUserProfile,
    });
    expect(oldState).toEqual({
      users: [],
      selectedUser: null,
      selectedUserProfile: oldUserProfile,
      selectedUserStatistics: null,
    });

    const newUserProfile = {
      ...oldUserProfile,
      introduction: 'TEST_USER_PROFILE_INTRODUCTION_NEW',
    };
    const newState = userReducer(oldState, {
      type: GET_USER_PROFILE,
      selectedUserProfile: newUserProfile,
    });
    expect(newState).toEqual({
      users: [],
      selectedUser: null,
      selectedUserProfile: newUserProfile,
      selectedUserStatistics: null,
    });
  });

  it('updates user introduction', () => {
    let introduction = 'TEST_USER_PROFILE_INTRODUCTION_0';
    const userProfile = {
      userId: 42,
      introduction,
    };
    const initialState = {
      users: [],
      selectedUser: null,
      selectedUserProfile: userProfile,
      selectedUserStatistics: null,
    };

    introduction = 'TEST_USER_PROFILE_INTRODUCTION_1';
    let state = userReducer(initialState, {
      type: UPDATE_USER_INTRODUCTION,
      newIntroduction: introduction,
    });
    expect(state).toEqual({
      users: [],
      selectedUser: null,
      selectedUserProfile: { ...userProfile, introduction },
      selectedUserStatistics: null,
    });

    introduction = 'TEST_USER_PROFILE_INTRODUCTION_2';
    state = userReducer(initialState, {
      type: UPDATE_USER_INTRODUCTION,
      newIntroduction: introduction,
    });
    expect(state).toEqual({
      users: [],
      selectedUser: null,
      selectedUserProfile: { ...userProfile, introduction },
      selectedUserStatistics: null,
    });
  });
});
