import ReduxReqs from 'redux-reqs';

const reduxReqs = new ReduxReqs({
  prefix: 'TABLE',
  prefixUrl: '/api/table'
});

reduxReqs
  .get('GET_LIST')
  .get('GET_BY_ID', '/:id')
  .put('UPDATE', '/:id')
  .del('DEL', '/:id')
  .post('ADD');

export const { del, add, getList, getById, update }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

