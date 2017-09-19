import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';
import account from './account';
import group from './group';

export default combineReducers({
  account,
  group,
  nprogress,
  router: routerReducer,
});
