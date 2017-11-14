import ReduxReqs from 'redux-reqs';

const reduxReqs = new ReduxReqs({
  prefix: 'PARAM',
  prefixUrl: '/api/param'
});

reduxReqs
  .get('GET_LIST')
  .get('GET_BY_ID', '/:id')
  .patch('EDIT', '/:id')
  .del('DEL', '/:id')
  .post('ADD');

export const { del, add, getList, getById, edit }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

