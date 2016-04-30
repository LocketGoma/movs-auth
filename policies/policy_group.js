module.exports = function() {
  return {
    groups : [
      'Admin',
      'Director',
      'Crop Member with Roles',
      'Corp Member',
    ],
    getAuthGroup : function (user) {
      if(user.isAdmin) {
        return this.groups[0];
      } else if (user.isDirector) {
        return this.groups[1];
      } else if (user.hasRoles.length > 0) {
        return this.groups[2];
      } else {
        return this.groups[3];
      }
    }
  }
};