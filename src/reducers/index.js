/**
 * Created by mjimenez on 10/30/16.
 */
import { combineReducers } from 'redux';
import app from './app';
import products from './products';
import filter from './filter';

const rootReducer = combineReducers({
  app,
  products,
  filter
});

export default rootReducer;