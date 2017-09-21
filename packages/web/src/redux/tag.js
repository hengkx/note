import ReduxReqs from 'redux-reqs';

const reduxReqs = new ReduxReqs({
  prefix: 'TAG',
  prefixUrl: '/api/tag'
});

reduxReqs
  .get('GET_LIST')
  .post('ADD')
  .del('DEL', '/:id')
  .put('UPDATE', '/:id');

export const { update, del, add, getList }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

