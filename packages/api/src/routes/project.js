import Router from 'koa-router';
import { getList, add, addMember, del, getById } from '../controllers/project';

const router = new Router({
  prefix: '/project'
});

router
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .post('/:id/member', addMember)
  .del('/:id', del);

export default router;
