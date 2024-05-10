'use strict';

const { users } = require('../models/index.js');

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { console.log('NEXT'); return res.status(401).send('No authorization header provided'); }

    console.log(req.headers.authorization);
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateWithToken(token);

    req.user = validUser;
    next();

  } catch (e) {
    console.error(e);
    res.status(403).send('Invalid Login');
  }
}
