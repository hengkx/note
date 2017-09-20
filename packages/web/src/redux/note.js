import ReduxReqs from 'redux-reqs';
import Api from '../config/api';

const reduxReqs = new ReduxReqs({
  prefix: 'NOTE',
  prefixUrl: '/api/note'
});

reduxReqs
  .get('GET_LIST')
  .get('CHECK_USERNAME_EXIST', Api.CheckUsernameExist)
  .post('SIGN_IN', '/signin')
  .del('DEL', '/:id')
  .post('ADD');

export const { checkUsernameExist, signIn, del, add, getList }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

