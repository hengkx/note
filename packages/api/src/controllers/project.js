import ApiError from '../errors/ApiError';
import { Project } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  let groups = await Project.find({ user: id });
  if (groups.length === 0) {
    await Project.create({ name: '我的分组', user: id });
    groups = await Project.find({ user: id });
  }
  ctx.body = groups;
}


export async function add(ctx) {
  const { id } = ctx.session;
  const { body } = ctx.request;
  const { name } = body;
  const group = await Project.create({ user: id, name });

  ctx.body = group;
}

export async function del(ctx) {
  const { id } = ctx.params;

  const res = await Project.remove({
    $or: [{ id }, { parents: id }],
    $and: [{ user: ctx.session.id }]
  });
  if (res.result.n === 0) throw new ApiError('GROUP_NOT_EXISTS');
}
