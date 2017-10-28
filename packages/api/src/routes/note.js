import Router from 'koa-router';
import { getList, getById, getLogList, share, getShareContent, add, del, update } from '../controllers/note';

const router = new Router({
  prefix: '/note'
});

router
  .get('/', getList)
  .get('/share', getShareContent)
  .get('/log/:id', getLogList)
  .get('/:id', getById)
  .post('/', add)
  .post('/share', share)
  .del('/:id', del)
  .put('/:id', update);

export default router;
