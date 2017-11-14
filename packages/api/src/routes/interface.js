import Router from 'koa-router';
import { getList, add, edit, del, getById } from '../controllers/interface';

const router = new Router({
  prefix: '/interface'
});

router
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .patch('/:id', edit)
  .del('/:id', del);

export default router;
