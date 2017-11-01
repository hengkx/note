import Router from 'koa-router';
import { getList, add, del } from '../controllers/project';

const router = new Router({
  prefix: '/project'
});

router
  .get('/', getList)
  .post('/', add)
  .del('/:id', del);

export default router;
