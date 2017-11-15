import ApiError from '../errors/ApiError';
import { Interface, Param } from '../models';

export async function getList(ctx) {
  const { id: user } = ctx.session;
  const { project } = ctx.query;
  const groups = await Interface.find({ user, project });
  ctx.body = groups;
}

export async function getById(ctx) {
  const { id: user } = ctx.session;
  const { id } = ctx.params;
  const res = await Interface.findOne({ user, id });
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
