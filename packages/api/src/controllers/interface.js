import ApiError from '../errors/ApiError';
import { Interface, Param, Project, ProjectLog } from '../models';

export async function getList(ctx) {
  const { id: user } = ctx.session;

  const project = await Project.findOne({
    $and: [{ _id: ctx.query.project }],
    $or: [{ user }, { members: user }]
  });
  if (!project) throw new ApiError('PROJECT_NOT_FOUNT');

  const res = await Interface.find({ project: project._id });
  ctx.body = res;
}

export async function getById(ctx) {
  const { id: user } = ctx.session;
  const { id } = ctx.params;

  const project = await Project.findOne({
    $and: [{ _id: ctx.query.project }],
    $or: [{ user }, { members: user }]
  });
  if (!project) throw new ApiError('PROJECT_NOT_FOUNT');

  const res = await Interface.findOne({ _id: id }).lean();

  const interfaces = await Param.find({ project: project._id, interface: undefined, type: 'Variable' });
  if (!res.req_param_type) {
    res.req_param_type = {};
  }
  if (!res.res_param_type) {
    res.res_param_type = {};
  }
  interfaces.forEach(item => {
    if (item.is_request) {
      if (!res.req_param_type[item.name]) {
        res.req_param_type[item.name] = 'Object';
      }
    } else if (!res.res_param_type[item.name]) {
      res.res_param_type[item.name] = 'Object';
    }
  });

  ctx.body = res;
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { body } = ctx.request;

  const { project } = body;
  const interfaces = await Param.find({ user, project, interface: undefined, type: 'Variable' });
  const req_param_type = {};
  const res_param_type = {};
  interfaces.forEach(item => {
    if (item.is_request) {
      req_param_type[item.name] = 'Object';
    } else {
      res_param_type[item.name] = 'Object';
    }
  });

  const res = await Interface.create({ user, req_param_type, res_param_type, ...body });

  await ProjectLog.create({
    user,
    project,
    ip: ctx.ip,
    action: 'create_interface',
    interface: res.interface,
    data: {
      current: res.name,
    }
  });

  ctx.body = res;
}

export async function edit(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const res = await Interface.findOneAndUpdate({ id, user }, body, { new: true });
  if (!res) throw new ApiError('INTERFACE_NOT_FOUND');

  await Promise.all(Object.keys(body).map(async (key) => {
    const log = await ProjectLog.create({
      user,
      action: `update_interface_${key}`,
      ip: ctx.ip,
      project: res.project,
      interface: res.interface,
      data: {
        current: body[key],
      }
    });
    return log;
  }));

  ctx.body = res;
}

export async function del(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;

  const api = await Interface.findById(id);
  if (!api) throw new ApiError('INTERFACE_NOT_FOUND');

  await Interface.remove({ id, user });

  await ProjectLog.create({
    user,
    action: 'remove_interface',
    ip: ctx.ip,
    project: api.project,
    interface: id,
  });
}
