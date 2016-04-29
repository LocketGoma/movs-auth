var User = require('../models/user.js');
var corpAPI = require('../config/api.js');

module.exports = {
  syncTimer : undefined,

  startSync : function() {
    syncTimer = setInterval(this.syncMembers, 6 * 60 * 60 * 1000) // 6 Hour
  },

  stopSync : function() {
    clearInterval(this.syncTimer);
  },

  syncMembers : function() {
    console.log('Sync Member DB : ' + new Date());

    for (corpID in corpAPI.EVECorpAPI) {
      (function(corpID) {
        var eveonlinejs = require('eveonlinejs');

        eveonlinejs.setParams({
          keyID: corpAPI.EVECorpAPI[corpID].keyid,
          vCode: corpAPI.EVECorpAPI[corpID].vcode,
        })
        eveonlinejs.fetch('corp:CorporationSheet', {corporationID: corpID}, function (err, corpInfo) {
          eveonlinejs.setParams({
            keyID: corpAPI.EVECorpAPI[corpID].keyid,
            vCode: corpAPI.EVECorpAPI[corpID].vcode,
          })

          eveonlinejs.fetch('corp:MemberTracking', {extended: 1}, function (err, result) {
            if (err) throw err;

            for(id in result.members) {
              (function(member, id) {
                User.findOrCreate({ characterID: id }, function (err, user) {
                  user.characterID = member.characterID,
                  user.name = member.name,
                  user.corporationID = corpInfo.corporationID,
                  user.corporationName = corpInfo.corporationName,
                  user.startDateTime = member.startDateTime,
                  user.baseID = member.baseID,
                  user.base = member.base,
                  user.title = member.title,
                  user.logonDateTime = member.logonDateTime,
                  user.logoffDateTime = member.logoffDateTime,
                  user.locationID = member.locationID,
                  user.location = member.location,
                  user.shipTypeID = member.shipTypeID,
                  user.shipType = member.shipType,
                  user.roles = member.roles,
                  user.grantableRoles = member.grantableRoles,
                  user.save();
                  //console.log('User (' + user.name + '/' + user.corporationName + ') Updated.')
                });
              })(result.members[id], id);
            }

            console.log('Synced : Num of (' + corpInfo.corporationName + ') = ' + Object.keys(result.members).length);
          });
        });
      })(corpID);
    }
  },
};