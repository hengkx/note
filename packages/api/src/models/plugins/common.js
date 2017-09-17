import jsonSelect from 'mongoose-json-select';

function CommonPlugin(Schema) {
  Schema.add({
    id: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    created_at: {
      type: Number,
      required: true
    },
    updated_at: {
      type: Number,
      required: true
    }
  });

  Schema.pre('validate', function (next) { // eslint-disable-line func-names
    this.created_at = Math.round(Date.parse(this._id.getTimestamp()) / 1000);
    this.updated_at = Math.round(Date.now() / 1000);
    this.id = this._id.toString();
    next();
  });

  Schema.plugin(
    jsonSelect,
    ['_id', '__v'].map(field => `-${field}`).join(' ')
  );
  return Schema;
}

export default CommonPlugin;
