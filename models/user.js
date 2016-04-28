var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')
 
var userSchema = mongoose.Schema({
    CharacterID: String,
    CharacterName: String,
    CorporationID: String,
    CorporationName: String,
});
userSchema.plugin(findOrCreate);

module.exports = mongoose.model('User', userSchema);
