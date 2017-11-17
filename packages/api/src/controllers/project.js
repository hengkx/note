import ApiError from '../errors/ApiError';
import { Project, User, ProjectLog } from '../models';

export async function getList(ctx) {
  const { id: user } = ctx.session;
  const projects = await Project.find({ $or: [{ user }, { members: user }] })
    .sort('-created_at').populate('user', ['name']);
  ctx.body = projects;
}

export async function getLog(ctx) {
  const { id: user } = ctx.session;
  const ids = (await Project.find({ $or: [{ user }, { members: user }] }, '_id'))
    .map(item => (item._id));
  const logs = await ProjectLog.find({
    project: { $in: ids }
  }).limit(10)
    .sort('-created_at')
    .populate('user', ['name'])
    // .populate('param', ['name'])
    .populate('interface', ['name'])
    .populate({ path: 'data.user', model: 'User', select: ['name', 'email'] })
    .populate('project', ['name']);
  ctx.body = logs;
}

export async function getById(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const table = await Project.findOne({
    $and: [{ id }],
    $or: [{ user }, { members: user }]
  }).populate('members', ['name', 'email', 'avatar']);
  ctx.body = table;
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const project = await Project.create({ user, ...body });

  await ProjectLog.create({
    user,
    project: project._id,
    ip: ctx.ip,
    action: 'create_project',
    data: {
      current: project.name,
    }
  });


  ctx.body = project;
}

export async function addMember(ctx) {
  const { id: user } = ctx.session;
  const { id } = ctx.params;

  const { body } = ctx.request;

  const u = await User.findOne({ email: body.email });
  if (!u) throw new ApiError('USER_NOT_FOUND');
  await Project.update({ user, id }, {
    $push: { members: u._id }
  });

  await ProjectLog.create({
    user,
    project: id,
    ip: ctx.ip,
    action: 'add_project_member',
    data: {
      user: u._id,
    }
  });
}

export async function removeMember(ctx) {
  const { id: user } = ctx.session;
  const { id, user: member } = ctx.params;

  await Project.update({ user, id }, {
    $pop: { members: member }
  });

  await ProjectLog.create({
    user,
    project: id,
    ip: ctx.ip,
    action: 'add_project_member',
    data: {
      user: member,
    }
  });
}

export async function del(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;

  const res = await Project.remove({ id, user });
  if (res.result.n === 0) throw new ApiError('PROJECT_NOT_FOUND');

  await ProjectLog.create({
    user,
    project: id,
    ip: ctx.ip,
    action: 'remove_project',
  });
}

