import Router from 'koa-router';
import account from './account';
import group from './group';
import note from './note';
import tag from './tag';
import upload from './upload';
import project from './project';
import table from './table';
import interfaces from './interface';
import param from './param';
import mock from './mock';
import ApiError from '../errors/ApiError';

const router = new Router({
  prefix: '/api'
});

router.use(account.routes());
router.use(group.routes());
router.use(note.routes());
router.use(tag.routes());
router.use(upload.routes());
router.use(project.routes());
router.use(table.routes());
router.use(interfaces.routes());
router.use(param.routes());

const allRouter = new Router();

allRouter.use(router.routes());
allRouter.use(mock.routes());

allRouter.all('*', async () => {
  throw new ApiError('NOT_FOUND');
});

export default allRouter;
