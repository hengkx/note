import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Projects = new Schema({
  name: { type: String, required: true },
  description: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Projects.plugin(CommonPlugin);

export default mongoose.model('Project', Projects);
