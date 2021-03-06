import ApiError from '../errors/ApiError';
import { Interface, Param, Project, ProjectLog } from '../models';

export async function getParamList({ user, api, project, is_request }) {
  const pro = await Project.findOne({
    $and: [{ _id: project }],
    $or: [{ user }, { members: user }]
  });
  if (!pro) throw new ApiError('PROJECT_NOT_FOUNT');

  if (api) {
    const inter = await Interface.findOne({ _id: api });
    let paramTypes = {};
    if (is_request && is_request === 'true') {
      paramTypes = inter.req_param_type || {};
    } else {
      paramTypes = inter.res_param_type || {};
    }
    const params = await Param.find({
      $and: [{ is_request, project }],
      $or: [{ interface: api }, { interface: undefined }]
    });

    params.forEach(item => {
      if (item.type === 'Variable') {
        if (paramTypes[item.name]) {
          item.type = paramTypes[item.name];// eslint-disable-line no-param-reassign
        } else {
          item.type = 'Object';// eslint-disable-line no-param-reassign
        }
      }
    });

    return params;
  }
  const params = await Param.find({ is_request, project, interface: undefined });
  return params;
}

export async function getList(ctx) {
  const { id: user } = ctx.session;
  const { interface: api, project, is_request } = ctx.query;
  const res = await getParamList({ user, api, project, is_request });
  ctx.body = res;
}

export async function getById(ctx) {
  const { id: user } = ctx.session;
  const { id } = ctx.params;
  const table = await Param.findOne({ user, id });
  ctx.body = table;
}

async function addParam({ addon, params, parent, ip }) {
  await Promise.all(params.map(async (item) => {
    let param;
    if (item._id) {
      param = await Param.findOne({ _id: item._id });
    } else {
      const temp = {};
      if (parent) {
        temp.parent = parent._id;
        temp.parents = [...parent.parents, temp.parent];
      }
      param = await Param.create({ ...addon, ...item, ...temp });
      await ProjectLog.create({
        ip,
        user: addon.user,
        action: 'create_param',
        project: addon.project,
        interface: addon.interface,
        param: param._id,
        data: {
          current: param.name,
        }
      });
    }
    if (item.children) {
      await addParam({ addon, params: item.children, parent: param, ip });
    }
    return param;
  }));
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { interface: api, project, is_request, params } = ctx.request.body;
  const addon = { user, project, is_request, interface: api };

  await addParam({ addon, params, ip: ctx.ip });
}

export async function edit(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const res = await Param.findOneAndUpdate({ id, user }, body, { new: true });

  await Promise.all(Object.keys(body).map(async (key) => {
    const log = await ProjectLog.create({
      user,
      action: `update_param_${key}`,
      ip: ctx.ip,
      project: res.project,
      interface: res.interface,
      param: id,
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


  const param = await Param.findById(id);
  if (!param) throw new ApiError('PARAM_NOT_FOUND');

  await Param.remove({
    $or: [{ id }, { parents: id }],
    $and: [{ user }]
  });

  await ProjectLog.create({
    user,
    action: 'remove_param',
    ip: ctx.ip,
    project: param.project,
    interface: param.interface,
    param: id,
    data: {
      current: param.name
    }
  });
}
