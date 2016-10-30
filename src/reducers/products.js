/**
 * Created by mjimenez on 10/30/16.
 */
import {ADD_PRODUCTS, EDIT_PRODUCT, EDIT_VARIANT, REMOVE_PRODUCT} from '../actions/products';

export default function(state = {}, action) {
  let newState;
  switch(action.type) {
    case ADD_PRODUCTS:
      newState = Object.assign({}, state);
      action.products.forEach(product => newState[product.id] = product);
      return newState;
    case EDIT_PRODUCT:
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          ...action.payload
        }
      }
    case EDIT_VARIANT:
      return {
        ...state,
        [action.product]: {
          ...state[action.product],
          variants: state[action.product].variants.map(variant => variant.id != action.id ? variant : {
            ...variant,
            ...action.payload
          })
        }
      }
    case REMOVE_PRODUCT:
      newState = Object.assign({}, state);
      delete newState[action.id];
      return newState;
    default:
      return state;
  }
}