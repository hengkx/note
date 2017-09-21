import Router from 'koa-router';
import { getList, getById, add, del, update } from '../controllers/note';

const router = new Router({
  prefix: '/note'
});

router
  .get('/', getList)
  .get('/:id', getById)
  .post('/', add)
  .del('/:id', del)
  .put('/:id', update);

export default router;
