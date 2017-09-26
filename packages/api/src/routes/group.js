import Router from 'koa-router';
import { getList, add, del } from '../controllers/group';

const router = new Router({
  prefix: '/group'
});

router
  .get('/', getList)
  .post('/', add)
  .del('/:id', del);

export default router;
