import axios from 'axios';
import { ThunkAction } from 'redux-thunk';

import { UserStatistics } from '../reducers/userReducer';
import { AppDispatch, RootState } from '../store';
import * as actionTypes from './actionTypes';

export interface GetUserStatisticsAction {
  type: typeof actionTypes.GET_USER_STATISTICS;
  selectedUserStatistics: UserStatistics;
}

export const getUserStatistics_: (
  statistics: UserStatistics
) => GetUserStatisticsAction = (statistics) => ({
  type: actionTypes.GET_USER_STATISTICS,
  selectedUserStatistics: statistics,
});

export const getUserStatistics: (
  id: number
) => ThunkAction<void, RootState, null, GetUserStatisticsAction> = (id) => {
  return async (dispatch: AppDispatch) => {
    const res = await axios.get(`/api/user/${id}/statistics`);
    dispatch(getUserStatistics_(res.data));
  };
};

export type UserAction = GetUserStatisticsAction;
