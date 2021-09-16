const { Schema, model } = require('mongoose');

const PositionSchema = Schema({
  name: {
    type: String,
    required: [true, 'The name of the position is required'],
    unique: true
  },
  img: {type: String},
  description: {
    type: String,
    required: [true, 'The description is required']
  },
  video: {type: String},
  approved: {
    type: String,
    default: false
  }
}
)


module.exports = model('Position', PositionSchema);
