import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const ProjectLogs = new Schema({
  action: { type: String, required: true },
  ip: { type: String, required: true },
  data: {},
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  interface: { type: Schema.Types.ObjectId, ref: 'Interface' },
  param: { type: Schema.Types.ObjectId, ref: 'Param' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

ProjectLogs.plugin(CommonPlugin);

export default mongoose.model('ProjectLog', ProjectLogs);
