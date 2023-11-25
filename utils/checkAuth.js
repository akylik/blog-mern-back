import jwt from 'jsonwebtoken';

import { SECRET_JWT_KEY } from '../constants.js';


export default (req, res, next) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '');

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET_JWT_KEY);

      req.userId = decoded._id;
      next();
    } catch (error) {
      return res.status(405).json({msg: 'No access'});
    }
  } else {
    return res.status(403).json({msg: 'Invalid token'});
  }
};