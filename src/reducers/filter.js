/**
 * Created by mjimenez on 10/30/16.
 */
import {SET_FILTER_STATE} from '../actions/filter';
export default function(state = {
  title: '',
  startDate: null,
  endDate: null
}, action) {
  switch(action.type) {
    case SET_FILTER_STATE:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}