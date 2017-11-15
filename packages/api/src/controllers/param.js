import ApiError from '../errors/ApiError';
import { Interface, Param } from '../models';


export async function getParamList({ user, api, project, is_request }) {
  if (api) {
    const inter = await Interface.findOne({ user, _id: api });
    let paramTypes = {};
    if (is_request) {
      paramTypes = inter.req_param_type || {};
    } else {
      paramTypes = inter.res_param_type || {};
    }
    const params = await Param.find({
      $and: [{ user, is_request, project }],
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
  const params = await Param.find({ user, is_request, project, interface: undefined });
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

async function addParam(addon, params, parent) {
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
    }
    if (item.children) {
      await addParam(addon, item.children, param);
    }
    return param;
  }));
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { interface: api, project, is_request, params } = ctx.request.body;
  const addon = { user, project, is_request, interface: api };

  await addParam(addon, params);
}

export async function edit(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const res = await Param.findOneAndUpdate({ id, user }, body, { new: true });

  ctx.body = res;
}

export async function del(ctx) {
  const { id } = ctx.params;
  const { id: user } = ctx.session;

  const res = await Param.remove({
    $or: [{ id }, { parents: id }],
    $and: [{ user }]
  });
  if (res.result.n === 0) throw new ApiError('GROUP_NOT_EXISTS');
}
