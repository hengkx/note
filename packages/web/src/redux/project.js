import ReduxReqs from 'redux-reqs';

const reduxReqs = new ReduxReqs({
  prefix: 'PROJECT',
  prefixUrl: '/api/project'
});

reduxReqs
  .get('GET_LIST')
  .get('GET_LOG_LIST', '/log')
  .get('GET_BY_ID', '/:id')
  .get('GET_GROUP', '/:id/group')
  .del('DEL', '/:id')
  .del('REMOVE_MEMBER', '/:_id/member/:user')
  .post('ADD')
  .post('ADD_MEMBER', '/:_id/member')
  .post('ADD_GROUP', '/:_id/group');

export const { del, add, addGroup, getGroup, getList, getById, addMember, removeMember, getLogList }
  = reduxReqs.getCreateActions();

export default reduxReqs.getReducers();

export const watchSagas = reduxReqs.getWatchSagas();

