import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Logs = new Schema({
  action: { type: String, required: true },
  ip: { type: String, required: true },
  data: {},
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Logs.plugin(CommonPlugin);

export default mongoose.model('Log', Logs);
