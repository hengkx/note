import ReduxReqs from 'redux-reqs';
import Api from '../config/api';

const reduxReqs = new ReduxReqs({
  prefix: 'USER',
  prefixUrl: '/api/account'
});

reduxReqs
  .get('GET_LIST')
  .get('CHECK_USERNAME_EXIST', Api.CheckUsernameExist)
  .post('SIGN_IN', '/signin')
  .post('SIGN_UP', '/signup')
  .post('ADD');

export const { checkUsernameExist, signIn, signUp, add, getList }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

