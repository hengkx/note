import Router from 'koa-router';
import account from './account';
import group from './group';
import note from './note';

const router = new Router({
  prefix: '/api'
});

router.use(account.routes());
router.use(group.routes());
router.use(note.routes());

router.all('*', async (ctx) => {
  ctx.body = 404;
});

module.exports = router;
