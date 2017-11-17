import Router from 'koa-router';
import { getList } from '../controllers/log';

const router = new Router({
  prefix: '/log'
});

router
  .get('/', getList);

export default router;
