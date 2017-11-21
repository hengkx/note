import Router from 'koa-router';
import { getList, add, edit, param, del, getById } from '../controllers/interface';

const router = new Router({
  prefix: '/interface'
});

router
  .param('id', param)
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .patch('/:id', edit)
  .del('/:id', del);

export default router;
