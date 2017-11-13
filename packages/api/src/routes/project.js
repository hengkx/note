import Router from 'koa-router';
import { getList, add, del, getById } from '../controllers/project';

const router = new Router({
  prefix: '/project'
});

router
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .del('/:id', del);

export default router;