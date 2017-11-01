import ApiError from '../errors/ApiError';
import { Group } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  let groups = await Group.find({ user: id });
  if (groups.length === 0) {
    await Group.create({ name: '我的分组', user: id });
    groups = await Group.find({ user: id });
  }
  ctx.body = groups;
}


export async function add(ctx) {
  const { id } = ctx.session;
  const { body } = ctx.request;
  const { name, parent } = body;
  const parentGroup = await Group.findById(parent);
  const parents = [...parentGroup.parents, parent]
  const group = await Group.create({ user: id, name, parent, parents });

  ctx.body = group;
}

export async function del(ctx) {
  const { id } = ctx.params;

  const res = await Group.remove({
    $or: [{ id }, { parents: id }],
    $and: [{ user: ctx.session.id }]
  });
  if (res.result.n === 0) throw new ApiError('GROUP_NOT_EXISTS');
}
