const {model, Schema} = require('mongoose');

const TechniqueSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true
    },
    position: {
      type: Schema.Types.ObjectId,
      ref: 'Position',
      required: [true, 'Position is required']
    },
    description: {
      type: String
    },
    img: {type: String},
    video: {type: String},
    approved: {
      type: String,
      default: false
    }
  }
)

module.exports = model("Technique", TechniqueSchema);