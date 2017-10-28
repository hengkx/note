import ReduxReqs from 'redux-reqs';

const reduxReqs = new ReduxReqs({
  prefix: 'NOTE',
  prefixUrl: '/api/note'
});

reduxReqs
  .get('GET_LIST')
  .get('GET_LOG_LIST', '/log/:id')
  .get('GET_SHARE_CONTENT', '/share')
  .post('ADD')
  .post('SHARE', '/share')
  .del('DEL', '/:id')
  .put('UPDATE', '/:id');

export const { update, del, add, getList, getLogList, share, getShareContent }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

