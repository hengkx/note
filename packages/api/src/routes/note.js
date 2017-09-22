import Router from 'koa-router';
import { getList, getById, share, getShareContent, add, del, update } from '../controllers/note';

const router = new Router({
  prefix: '/note'
});

router
  .get('/', getList)
  .get('/share', getShareContent)
  .get('/:id', getById)
  .post('/', add)
  .post('/share', share)
  .del('/:id', del)
  .put('/:id', update);

export default router;
