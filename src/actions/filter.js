/**
 * Created by mjimenez on 10/30/16.
 */
import {filterProducts} from './products';
export const SET_FILTER_STATE = 'SET_FILTER_STATE';
export function setFilterState(payload) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_FILTER_STATE,
      payload
    });
    let {title, startDate, endDate} = getState().filter;
    dispatch(filterProducts(title, startDate, endDate));
  }
}