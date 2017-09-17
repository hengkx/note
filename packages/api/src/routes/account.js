import Router from 'koa-router';
import { signup, active, signin } from '../controllers/account';

const router = new Router({
  prefix: '/account'
});

router
  .get('/active', active)
  .post('/signup', signup)
  .post('/signin', signin)

// .get('/download', async (ctx) => {
//   const res = await download(ctx.query);
//   ctx.body = res;
// });

export default router;
