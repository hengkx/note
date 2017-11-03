import mongoose from 'mongoose';
import find from 'lodash/find';
// import isEqual from 'lodash/isEqual';
import ApiError from '../errors/ApiError';
import { Table, TableColumn } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  const groups = await Table.find({ user: id });
  ctx.body = groups;
}

export async function getById(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const table = await Table.findOne({ user, id }).lean();
  const tableColumn = await TableColumn.find({ user, table: id });
  table.columns = tableColumn;
  ctx.body = table;
}

export async function add(ctx) {
  const { id: user } = ctx.session;
  const { body } = ctx.request;
  const { name, remark, columns, project } = body;
  const table = await Table.create({ user, name, remark, project });

  await Promise.all(columns.map(async (column) => {
    const res = await TableColumn.create({ ...column, project, table: table.id, user });
    return res;
  }));

  ctx.body = table;
}

export async function del(ctx) {
  const { id } = ctx.params;

  const res = await Table.remove({
    $or: [{ id }, { parents: id }],
    $and: [{ user: ctx.session.id }]
  });
  if (res.result.n === 0) throw new ApiError('GROUP_NOT_EXISTS');
}


function isEqual(value, other, keys) {
  for (let i = 0; i < keys.length; i += 1) {
    if (value[keys[i]] !== other[keys[i]]) {
      return false;
    }
  }
  return true;
}

export async function update(ctx) {
  const { id } = ctx.params;
  const user = ctx.session.id;
  const { body } = ctx.request;
  const { name, remark, columns } = body;

  const table = await Table.findOneAndUpdate({ id, user }, {
    $set: { name, remark }
  }, { new: true });
  const srcTableColumns = await TableColumn.find({ table: id, user }).lean();

  const ids = [];
  await Promise.all(columns.map(async (column) => {
    if (!column._id) {
      const res = await TableColumn.create({
        ...column,
        user,
        project: table.project,
        table: table._id,
      });
      ids.push(res._id);
      return res;
    }
    const srcColumn = find(srcTableColumns, { _id: mongoose.Types.ObjectId(column._id) });
    if (srcColumn) {
      ids.push(column._id);
      if (!isEqual(srcColumn, column, ['name', 'type', 'required', 'remark'])) {
        const res = await TableColumn.findByIdAndUpdate(column._id, { $set: column });
        return res;
      }
    }
  }));

  await TableColumn.remove({
    $or: [{ _id: { $nin: ids } }],
    $and: [{ user }]
  });

  await getById(ctx);
}
