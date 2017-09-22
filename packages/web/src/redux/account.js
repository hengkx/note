import ReduxReqs from 'redux-reqs';
import Api from '../config/api';

const reduxReqs = new ReduxReqs({
  prefix: 'USER',
  prefixUrl: '/api/account'
});

reduxReqs
  .get('GET_LIST')
  .post('SEND_ACTIVE_EMAIL', '/active')
  .post('SIGN_IN', '/signin')
  .post('FORGOT', '/forgot')
  .post('SIGN_UP', '/signup')
  .post('ADD');

export const { sendActiveEmail, signIn, signUp, forgot, add, getList }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

