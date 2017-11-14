import Router from 'koa-router';
import { getList, add, edit, del, getById } from '../controllers/param';

const router = new Router({
  prefix: '/param'
});

router
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .patch('/:id', edit)
  .del('/:id', del);

export default router;
