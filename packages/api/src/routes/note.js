import Router from 'koa-router';
import { getList, add, del } from '../controllers/note';

const router = new Router({
  prefix: '/note'
});

router
  .get('/', getList)
  .post('/', add)
  .del('/:id', del);

export default router;
