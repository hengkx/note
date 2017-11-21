import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Interfaces = new Schema({
  name: { type: String, required: true },
  method: { type: String, required: true },
  url: { type: String, required: true },
  display_url: { type: String, required: true },
  remark: String,
  req_param_type: {},
  res_param_type: {},
  group: { type: Schema.Types.ObjectId, ref: 'ProjectGroup' },
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Interfaces.plugin(CommonPlugin);

export default mongoose.model('Interface', Interfaces);
