import ApiError from '../errors/ApiError';
import { Log, Project } from '../models';

export async function getList(ctx) {
  const { id: user } = ctx.session;
  const { action } = ctx.query;
  if (action === 'project') {
    const ids = [];
    (await Project.find({ $or: [{ user }, { members: user }] }, '_id'))
      .forEach(item => {
        ids.push(item._id);
        ids.push(item._id.toString());
      });
    const logs = await Log.find({
      'data.project': { $in: ids }
    }).limit(10).sort('-created_at');
    ctx.body = logs;
  }
}
