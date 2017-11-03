import Router from 'koa-router';
import { getList, add, update, del, getById } from '../controllers/table';

const router = new Router({
  prefix: '/table'
});

router
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .put('/:id', update)
  .del('/:id', del);

export default router;
