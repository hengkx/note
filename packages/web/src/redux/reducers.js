import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { nprogress } from 'redux-nprogress';
import account from './account';
import group from './group';
import note from './note';
import tag from './tag';
import upload from './upload';

export default combineReducers({
  account,
  group,
  note,
  tag,
  upload,
  nprogress,
  router: routerReducer,
});
