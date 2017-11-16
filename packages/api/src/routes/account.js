import Router from 'koa-router';
import { signup, active, sendActiveEmail, getInfo, signin, forgot } from '../controllers/account';

const router = new Router({
  prefix: '/account'
});

router
  .get('/info', getInfo)
  .get('/active', active)
  .post('/active', sendActiveEmail)
  .post('/signup', signup)
  .post('/signin', signin)
  .post('/forgot', forgot)

export default router;
