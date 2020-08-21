const r = require('rethinkdb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const BaseDao = require("./BaseDao");
const { User } = require("../models");
const saltRounds = 10;

class UserDao extends BaseDao {
/**
 * Insert the give user object into the database if username is not taken
 * @param {string} username The proposed username of the user 
 * @param {string} password The plain text password to salt and hash
 * @param {string} fullName The full name of the new user
 * @returns {object} returns object containing access token and refresh token
  */
  async registerUser(username, password, fullName) {
    let salt = await bcrypt.genSalt(saltRounds);
    let hashedPass = await bcrypt.hash(password, salt);
    let user = new User(username, fullName);    

    let result = await this.insert('users', {...user, password: hashedPass, salt: salt});
    console.log(result);
    
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {accessToken, refreshToken};
  }

/**
 * Authenticates the user given a valid username and password
 * @param {string} username The proposed username of the user 
 * @param {string} password The plain text password to salt and hash
 * @returns {object} returns object containing access token and refresh token
  */
  async login(username, password) {
    console.log(username, password);
    
    let user = await this.findUserByUsername(username);
    console.log(user);
    
    let hashedPass = await bcrypt.hash(password, user.salt);
    if (hashedPass === user.password) {
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
      return {accessToken, refreshToken};
    }
    else return null;
  }

  async findUserByUsername(username) {
    let result = await this.get('users', { username: username });
    return result[0];
  }

  async listUsers() {
    let result = await this.getAll('users');
    return result;
  }

  generateRefreshToken(user) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  }

  generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '2h' });
  }
}

module.exports = UserDao; 