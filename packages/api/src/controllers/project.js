import ApiError from '../errors/ApiError';
import { Project } from '../models';

export async function getList(ctx) {
  const { id: user } = ctx.session;
  const projects = await Project.find({ user }).sort('-created_at').populate('user', ['name']);
  ctx.body = projects;
}

export async function getById(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const table = await Project.findOne({ user, id });
  ctx.body = table;
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const project = await Project.create({ user, ...body });

  ctx.body = project;
}

export async function del(ctx) {
  const { id } = ctx.params;

  const res = await Project.remove({
    $or: [{ id }, { parents: id }],
    $and: [{ user: ctx.session.id }]
  });
  if (res.result.n === 0) throw new ApiError('GROUP_NOT_EXISTS');
}

export async function mock(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const table = await Project.findOne({ user, id });
  ctx.body = table;
}
