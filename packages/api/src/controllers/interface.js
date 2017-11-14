import ApiError from '../errors/ApiError';
import { Interface } from '../models';

export async function getList(ctx) {
  const { id: user } = ctx.session;
  const { project } = ctx.query;
  const groups = await Interface.find({ user, project });
  ctx.body = groups;
}

export async function getById(ctx) {
  const { id: user } = ctx.session;
  const { id } = ctx.params;
  const table = await Interface.findOne({ user, id });
  ctx.body = table;
}

export async function add(ctx) {
  const { id } = ctx.session;
  const { body } = ctx.request;
  const group = await Interface.create({ user: id, ...body });

  ctx.body = group;
}

export async function edit(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const res = await Interface.findOneAndUpdate({ id, user }, body, { new: true });

  ctx.body = res;
}

export async function del(ctx) {
  const { id } = ctx.params;

  const res = await Interface.remove({
    $or: [{ id }, { parents: id }],
    $and: [{ user: ctx.session.id }]
  });
  if (res.result.n === 0) throw new ApiError('GROUP_NOT_EXISTS');
}
