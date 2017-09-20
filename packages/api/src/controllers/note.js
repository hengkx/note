import validator from 'validator';
import randomize from 'randomatic';
import nodemailer from 'nodemailer';
import ApiError from '../errors/ApiError';
import { User, UserActive, Group, Note } from '../models';

export async function getList(ctx) {
  const { id } = ctx.session;
  const { group } = ctx.query;
  const notes = await Note.find({ user: id, group });
  ctx.body = notes;
}


export async function add(ctx) {
  const { id } = ctx.session;
  const { body } = ctx.request;
  const { title, content, group } = body;
  const count = await Group.count({ id: group, user: id });
  if (count === 0) throw new ApiError('GROUP_NOT_EXISTS');
  const note = await Note.create({ user: id, title, content, group });

  ctx.body = note;
}

export async function del(ctx) {
  const { id } = ctx.params;
  const note = await Note.findOneAndRemove({ id, user: ctx.session.id });
  if (!note) throw new ApiError('NOTE_NOT_EXISTS');
}
