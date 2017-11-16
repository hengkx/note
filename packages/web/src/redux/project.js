import ReduxReqs from 'redux-reqs';

const reduxReqs = new ReduxReqs({
  prefix: 'PROJECT',
  prefixUrl: '/api/project'
});

reduxReqs
  .get('GET_LIST')
  .get('GET_BY_ID', '/:id')
  .del('DEL', '/:id')
  .post('ADD')
  .post('ADD_MEMBER', '/:_id/member');

export const { del, add, getList, getById, addMember }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

