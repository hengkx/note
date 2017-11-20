import Router from 'koa-router';
import { getList, param, getLog, getGroup, add, addGroup, addMember, removeMember, del, getById } from '../controllers/project';

const router = new Router({
  prefix: '/project'
});
router
  .param('id', param)
  .get('/', getList)
  .get('/log', getLog)
  .get('/:id', getById)
  .get('/:id/group', getGroup)
  .post('/', add)
  .post('/:id/group', addGroup)
  .post('/:id/member', addMember)
  .del('/:id/member/:user', removeMember)
  .del('/:id', del);

export default router;
