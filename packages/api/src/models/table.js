import mongoose from 'mongoose';
import CommonPlugin from './plugins/common';

const Schema = mongoose.Schema;

// const TableColumns = new Schema({
//   // table: { type: Schema.Types.ObjectId, required: true, ref: 'Table' },
//   name: { type: String, required: true },
//   type: { type: String, required: true },
//   required: { type: Boolean, required: true, default: false },
//   defaultValue: String,
//   remark: String,
//   // user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
// });

// TableColumns.plugin(CommonPlugin);

const Tables = new Schema({
  project: { type: Schema.Types.ObjectId, required: true, ref: 'Project' },
  name: { type: String, required: true },
  remark: String,
  // columns: [{
  //   name: { type: String, required: true },
  //   type: { type: String, required: true },
  //   required: { type: Boolean, required: true, default: false },
  //   defaultValue: String,
  //   remark: String,
  // }],
  // columns: [{ type: Schema.Types.ObjectId, ref: 'TableColumn' }],
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

Tables.plugin(CommonPlugin);

export default mongoose.model('Table', Tables);
