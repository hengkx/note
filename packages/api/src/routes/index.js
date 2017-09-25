import Router from 'koa-router';
import account from './account';
import group from './group';
import note from './note';
import tag from './tag';
import upload from './upload';

const router = new Router({
  prefix: '/api'
});

router.use(account.routes());
router.use(group.routes());
router.use(note.routes());
router.use(tag.routes());
router.use(upload.routes());

router.all('*', async (ctx) => {
  ctx.body = 404;
});

export default router;
