import ApiError from '../errors/ApiError';
import { Interface, Param, Project } from '../models';

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

  ctx.body = res;
}

export async function edit(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const res = await Interface.findOneAndUpdate({ id, user }, body, { new: true });
  if (!res) throw new ApiError('INTERFACE_NOT_FOUND');

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
