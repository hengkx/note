import ApiError from '../errors/ApiError';
import { Project, Interface } from '../models';
import { getParamList } from './param';
import toTree from '../utils/toTree';
import getParamsMockObj from '../utils/getParamsMockObj';

export async function mock(ctx) {
  const { method, body } = ctx.request;
  // console.log(method, body);
  // console.log(ctx.query);
  const { id, 1: url } = ctx.params;
  const { id: user } = ctx.session;
  // const project = await Project.findOne({ user, id });
  const api = await Interface.findOne({
    $and: [{ user, method, project: id }],
    $or: [{ url }, { url: `/${url}` }],
  });
  if (!api) throw new ApiError('INTERFACE_NOT_FOUND');
  const res = await getParamList({ user, is_request: false, api: api._id, project: id });
  const params = toTree(res);
  ctx.body = getParamsMockObj(params);
}
