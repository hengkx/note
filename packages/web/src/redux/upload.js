import ReduxReqs from 'redux-reqs';

const reduxReqs = new ReduxReqs({
  prefix: 'UPLOAD',
  prefixUrl: '/api/upload'
});

reduxReqs
  .post('BASE64_IMG', '/base64');

export const { base64Img }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

