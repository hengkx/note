import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const Notes = new Schema({
  title: { type: String, required: true },
  content: String,
  sort: { type: Number, default: 99, required: true },
  group: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  read_password: String,
  share_password: String,
  is_shared: { type: Boolean, default: false, required: true },
});

Notes.plugin(CommonPlugin);

export default mongoose.model('Note', Notes);
