import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const ProjectGroups = new Schema({
  name: { type: String, required: true },
  url: String,
  sort: { type: Number, default: 99, required: true },
  parent: { type: Schema.Types.ObjectId, ref: 'ProjectGroup' },
  parents: [{ type: Schema.Types.ObjectId, ref: 'ProjectGroup' }],
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

ProjectGroups.plugin(CommonPlugin);

export default mongoose.model('ProjectGroup', ProjectGroups);
