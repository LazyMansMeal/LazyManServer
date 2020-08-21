const UserPreferences = require('./UserPreferences');

class User {
  constructor(username = "", fullName = "") {
    this.username = username;
    this.fullName = fullName;
    this.preferences = new UserPreferences();
    this.dateCreated = new Date();
    this.lastLogin = new Date();
  }
}

module.exports = User;