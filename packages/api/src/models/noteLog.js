import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

const NoteLogs = new Schema({
  old: {
    title: { type: String, required: true },
    content: String,
    group: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  new: {
    title: { type: String, required: true },
    content: String,
    group: { type: Schema.Types.ObjectId, required: true, ref: 'Group' },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  },
  note: { type: Schema.Types.ObjectId, required: true, ref: 'Note' },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

NoteLogs.plugin(CommonPlugin);

export default mongoose.model('NoteLog', NoteLogs);
