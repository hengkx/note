import Router from 'koa-router';
import { mock } from '../controllers/mock';

const router = new Router({
  prefix: '/mock'
});

router
  .all('/:id/*', mock);

export default router;
