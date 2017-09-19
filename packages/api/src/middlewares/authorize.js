import ApiError from '../errors/ApiError';

const authorize = () => (async (ctx, next) => {
  const unAuthorizes = ['/api/account/signin', '/api/account/signup', '/api/account/active'];
  if (ctx.session.id || unAuthorizes.indexOf(ctx.request.path) !== -1) {
    await next();
  } else {
    throw new ApiError('UN_AUTHORIZE');
  }
})

export default authorize;
