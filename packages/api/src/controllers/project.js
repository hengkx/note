import ApiError from '../errors/ApiError';
import { Project } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  const groups = await Project.find({ user: id });
  ctx.body = groups;
}

export async function getById(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const table = await Project.findOne({ user, id });
  ctx.body = table;
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
