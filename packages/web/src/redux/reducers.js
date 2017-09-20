import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';
import account from './account';
import group from './group';
import note from './note';

export default combineReducers({
  account,
  group,
  note,
  nprogress,
  router: routerReducer,
});
