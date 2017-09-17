import Router from 'koa-router';
import account from './account';

const router = new Router({
  prefix: '/api'
});

router.use(account.routes());

router.all('*', async (ctx) => {
  ctx.body = 404;
});

module.exports = router;
