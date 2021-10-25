import * as actionTypes from './actionTypes';
import axios from 'axios';

export const getAllUsers_ = (users) => {
  return {
    type: actionTypes.GET_ALL_USERS,
    users: users,
  };
};

export const getAllUsers = () => {
  return (dispatch) => {
    return axios
      .get('/api/user/')
      .then((res) => dispatch(getAllUsers_(res.data)));
  };
};

export const getUser_ = (user) => {
  return {
    type: actionTypes.GET_USER,
    target: user,
  };
};

export const getUser = (id) => {
  return (dispatch) => {
    return axios
      .get(`/api/user/${id}/`)
      .then((res) => dispatch(getUser_(res.data)));
  };
};

export const logIn_ = (user: any) => {
  return {
    type: actionTypes.LOG_IN,
    targetID: user.id,
  };
};

export const logIn = (user: any) => {
  return (dispatch) => {
    return axios
      .put(`/api/user/${user.id}/`, { ...user, logged_in: true })
      .then((res) => dispatch(logIn_(res.data)));
  };
};

export const signUp_ = (user: any) => {
  return {
    type: actionTypes.SIGN_UP,
    id: user.id,
    username: user.username,
    email: user.email,
    password: user.password,
    logged_in: user.logged_in,
  };
};

export const signUp = (user: any) => {
  return (dispatch) => {
    return axios
      .post(`/api/user/`, user)
      .then((res) => dispatch(signUp_(res.data)));
  };
};
