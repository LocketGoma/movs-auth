var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

var serviceSchema = mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  community: {
    activated: Boolean,
    id: String,
    pass: String,
  },
}, {
  timestamps: true
});
serviceSchema.plugin(findOrCreate);

module.exports = mongoose.model('Service', serviceSchema);
