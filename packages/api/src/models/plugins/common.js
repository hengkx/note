/* eslint-disable func-names */

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
  Schema.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
  });
  Schema.pre('validate', function (next) {
    if (this.created_at) {
      this.updated_at = Math.round(Date.now() / 1000);
    } else {
      this.created_at = Math.round(Date.parse(this._id.getTimestamp()) / 1000);
      this.updated_at = this.created_at;
    }
    this.id = this._id.toString();
    next();
  });
  Schema.pre('update', function (next) {
    const update = this.getUpdate();
    console.log(update);
    update.$set = update.$set || {};
    update.$set.updated_at = Math.round(Date.now() / 1000);

    // update.$setOnInsert = update.$setOnInsert || {};
    // update.$setOnInsert.created_at = Math.round(Date.now() / 1000);

    next();
  });

  Schema.pre('findByIdAndUpdate', function (next) {
    const update = this.getUpdate();
    update.updated_at = Math.round(Date.now() / 1000);
    next();
  });
  Schema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();
    // console.log(this);
    update.updated_at = Math.round(Date.now() / 1000);
    next();
  });

  return Schema;
}

export default CommonPlugin;
