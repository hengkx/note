import ApiError from '../errors/ApiError';
import { Interface, Param, Project, ProjectLog, ProjectGroup } from '../models';

export async function param(id, ctx, next) {
  const { id: user } = ctx.session;

  const api = await Interface.findById(id)
    .populate('group', ['name']).lean();
  if (!api) throw new ApiError('INTERFACE_NOT_FOUND');
  ctx.api = api;

  const project = await Project.findOne({
    $and: [{ id: api.project }],
    $or: [{ user }, { members: user }]
  }).populate('members', ['name', 'email', 'avatar']);
  if (!project) throw new ApiError('PROJECT_NOT_FOUND');
  ctx.project = project;

  return next();
}

export async function getList(ctx) {
  const { id: user } = ctx.session;
  const { group } = ctx.query;

  const project = await Project.findOne({
    $and: [{ _id: ctx.query.project }],
    $or: [{ user }, { members: user }]
  });
  if (!project) throw new ApiError('PROJECT_NOT_FOUNT');

  const addon = {};

  if (group === "-1") {
    addon.group = undefined;
  } else if (group) {
    addon.group = group;
  }

  const res = await Interface.find({ project: project._id, ...addon })
    .populate('group', ['name']);
  ctx.body = res;
}

export async function getById(ctx) {
  const res = ctx.api;

  // const interfaces = await Param.find({ project: res.project, interface: undefined, type: 'Variable' });
  // if (!res.req_param_type) {
  //   res.req_param_type = {};
  // }
  // if (!res.res_param_type) {
  //   res.res_param_type = {};
  // }
  // interfaces.forEach(item => {
  //   if (item.is_request) {
  //     if (!res.req_param_type[item.name]) {
  //       res.req_param_type[item.name] = 'Object';
  //     }
  //   } else if (!res.res_param_type[item.name]) {
  //     res.res_param_type[item.name] = 'Object';
  //   }
  // });

  ctx.body = res;
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { body } = ctx.request;

  const { project, url } = body;
  const params = await Param.find({ user, project, interface: undefined, type: 'Variable' });
  const req_param_type = {};
  const res_param_type = {};
  params.forEach(item => {
    if (item.is_request) {
      req_param_type[item.name] = 'Object';
    } else {
      res_param_type[item.name] = 'Object';
    }
  });

  let display_url = url;
  if (body.group) {
    const group = await ProjectGroup.findById(body.group);
    if (group) {
      display_url = `${group.url}${display_url}`;
    }
  } else if (body.group === '') {
    body.group = undefined;
  }

  const res = await Interface.create({
    ...body,
    user,
    display_url,
    req_param_type,
    res_param_type,
  });

  await ProjectLog.create({
    user,
    project,
    ip: ctx.ip,
    action: 'create_interface',
    interface: res._id,
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
  let display_url = ctx.api.url;
  if (body.group) {
    const group = await ProjectGroup.findById(body.group);
    if (group) {
      display_url = `${group.url}${display_url}`;
    }
  } else if (body.group === '') {
    body.group = undefined;
  }

  const res = await Interface.findOneAndUpdate({ id, user },
    { ...body, display_url }, { new: true });
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
export async function batchSetGroup(ctx) {
  const { body } = ctx.request;
  const { ids, groupId } = body;
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
