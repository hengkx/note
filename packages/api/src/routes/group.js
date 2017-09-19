import Router from 'koa-router';
import { signup, getList, add, del } from '../controllers/group';

const router = new Router({
  prefix: '/group'
});

router
  .get('/', getList)
  .post('/signup', signup)
  .post('/', add)
  .del('/:id', del);

export default router;
