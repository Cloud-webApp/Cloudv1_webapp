import _ from 'lodash';
import db from '../dbSetup.js';
import bcrypt from 'bcryptjs';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (_.isEmpty(authHeader)) {
    // Authentication header is missing
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(403).json({ error: 'You are not an authorized user' });
  }

  const [username, password] = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');

  if (!_.isEmpty(username) && !_.isEmpty(password)) {
    let authUser = await db.users.findOne({ where: { email: username } });

    if (!authUser) {
      // User not found
      res.setHeader('WWW-Authenticate', 'Basic');
      return res.status(401).json({ error: 'Authentication failed. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, authUser.password);

    if (!isMatch) {
      // Password does not match
      res.setHeader('WWW-Authenticate', 'Basic');
      return res.status(401).json({ error: 'Authentication failed. Invalid password.' });
    }

    req.authUser = { ...authUser.dataValues };
    delete req.authUser.password;
    console.log(req.authUser, '<-- this is the authenticated user');
  } else {
    // Authentication header is missing or invalid
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(403).json({ error: 'You are not an authorized user' });
  }

  next();
};


