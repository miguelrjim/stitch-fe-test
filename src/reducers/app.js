/**
 * Created by mjimenez on 10/30/16.
 */
import {SET_APP_STATE} from '../actions/app';
import {REMOVE_PRODUCT} from '../actions/products';
export default function(state = {
  size: 50,
  fetched: 0,
  currentProducts: [],
  currentFetched: 0,
  shownProducts: []
}, action) {
  let newState;
  switch(action.type) {
    case SET_APP_STATE:
      return {
        ...state,
        ...action.payload
      }
    case REMOVE_PRODUCT:
      newState = Object.assign({}, state);
      newState.shownProducts = newState.shownProducts.filter(id => id != action.id);
      newState.currentProducts = newState.currentProducts.filter(id => id != action.id);
      return newState;
    default:
      return state;
  }
}