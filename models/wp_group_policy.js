var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var wpGroupPolicySchema = mongoose.Schema({
  authGroup: String,
  wpGroup: { type: String, default: 'Guest' },
}, {
  timestamps: true
});
wpGroupPolicySchema.plugin(findOrCreate);

module.exports = mongoose.model('WpGroupPolicy', wpGroupPolicySchema);