var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
 
var userSchema = mongoose.Schema({
  // EVE Default User Tracking Information
  characterID: Number,
  name: String,
  corporationID: Number,
  corporationName: String,
  startDateTime: Date,
  baseID: String,
  base: String,
  title: String,
  logonDateTime: Date,
  logoffDateTime: Date,
  locationID: String,
  location: String,
  shipTypeID: Number,
  shipType: String,
  roles: String,
  grantableRoles: String,

  // Additional MOVS-Flavored User Information
  isAdmin: { type: Boolean, default: false },
  isDirector: { type: Boolean, default: false },
  hasRoles: [ String ],
}, {
  timestamps: true
});
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
