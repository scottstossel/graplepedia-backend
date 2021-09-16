const { model, Schema } = require('mongoose');
const crypto = require('crypto');
const {uuid} = require('uuidv4');

const UserSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true
    },
    hashed_password: {
      type: String,
      required: true
    },
    salt: String,
    role: {
      type: String,
      enum: ['ADMIN', 'USER'],
      default: 'USER'
    }
  }
)

UserSchema.virtual('password')
  .set(function(password) {
    this._password = password;
    this.salt = uuid();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function() {
    return this._password
  });

// USER Methods
UserSchema.methods = {
  authenticate: function(text) {
    return this.encryptPassword(text) === this.hashed_password;
  },

  encryptPassword: function(password) {
    if (!password) return '';
    try {
      return crypto.createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (error) {
      return '';
    }
  }
}

module.exports = model('User', UserSchema);