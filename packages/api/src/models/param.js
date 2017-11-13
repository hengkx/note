import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Params = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  defaultValue: String,
  remark: String,
  rule: String,
  parent: { type: Schema.Types.ObjectId, ref: 'Param' },
  parents: [{ type: Schema.Types.ObjectId, ref: 'Param' }],
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  interface: { type: Schema.Types.ObjectId, required: true, ref: 'Interface' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Params.plugin(CommonPlugin);

export default mongoose.model('Param', Params);
