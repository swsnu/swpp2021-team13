import axios from 'axios';
import { push } from 'connected-react-router';

import * as actionTypes from './actionTypes';

export const getUserStatistics_ = (statistics) => {
  return {
    type: actionTypes.GET_USER_STATISTICS,
    selectedUserStatistics: statistics,
  };
};
export const getUserStatistics = (id) => {
  return (dispatch) => {
    return axios.get(`/api/user/${id}/statistics`).then((res) => {
      dispatch(getUserStatistics_(res.data));
    });
  };
};
