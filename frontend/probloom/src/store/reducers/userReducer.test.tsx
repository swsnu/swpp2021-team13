import {
  SIGN_UP,
  SIGN_IN,
  SIGN_OUT,
  GET_USER_PROFILE,
  UPDATE_USER_INTRODUCTION,
} from '../actions/actionTypes';
import userReducer, { UserProfile } from './userReducer';

describe('User Reducer', () => {
  it('sign in/up/out updates selected user', () => {
    const initialState = {
      users: [],
      selectedUser: null,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    };

    const user = {
      id: 1,
      username: 'TEST',
      email: 'TEST',
      logged_in: false,
    };

    let state = userReducer(initialState, {
      type: SIGN_IN,
      target: user,
    });

    expect(state).toEqual({
      users: [],
      selectedUser: user,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    });

    state = userReducer(initialState, {
      type: SIGN_UP,
      target: user,
    });

    expect(state).toEqual({
      users: [],
      selectedUser: user,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    });

    state = userReducer(initialState, {
      type: SIGN_OUT,
      target: user,
    });

    expect(state).toEqual({
      users: [],
      selectedUser: user,
      selectedUserProfile: null,
      selectedUserStatistics: null,
    });
  });

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

  it('update fails user introduction', () => {
    let introduction = 'TEST_USER_PROFILE_INTRODUCTION_0';
    const userProfile = {
      userId: 42,
      introduction,
    };
    const initialState = {
      users: [],
      selectedUser: null,
      selectedUserProfile: null,
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
      selectedUserProfile: null,
      selectedUserStatistics: null,
    });
  });
});
