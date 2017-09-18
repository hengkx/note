import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';
import account from './account';

export default combineReducers({
  nprogress,
  account,
  router: routerReducer,
});
