'use strict';

const base64 = require('base-64');
const { users } = require('../models/index.js');

function _authError(res, message, statusCode = 403) {
  console.log('Authentication error:', message);
  return res.status(statusCode).send('Invalid Login');
}

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { 
    return _authError(res, 'Invalid or missing authorization header', 401); 
  }

  let basicHeader = req.headers.authorization.split(' ');
  if (basicHeader.length !== 2 || basicHeader[0] !== 'Basic') {
    return _authError(res, 'Invalid authorization header format', 401); 
  }

  let encoded = basicHeader[1];
  let decoded;
  try {
    decoded = base64.decode(encoded);
  } catch (error) {
    return res.status(400).send('Bad Request: Error decoding credentials');
  }

  let [username, pass] = decoded.split(':');
  if (!username || !pass) {
    return _authError(res, 'Missing username or password', 401);
  } else {
    console.log('user:', username, 'pass:', pass)
  }

  console.log(users);

  try {
    req.user = await users.authenticateBasic(username, pass)
    next();
  } catch (e) {
    console.error(e);
    return res.status(403).send('Invalid Login');
  }
}
