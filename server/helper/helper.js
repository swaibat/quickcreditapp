import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const Helper = {
  /**
     * Hash Password Method
     * @param {string} Password
     * @returns {string} returns hashed password
     */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  /**
     * compare Password
     * @param {string} hashPassword
     * @param {string} password
     * @returns {Boolean} return True or False
     */
  comparePassword(hashPassword, password) {
    return bcrypt.compareSync(password, hashPassword);
  },

  /**
     * Generate Token
     * @params {string} id
     * @params {string} token
     */
  generateToken(id, isAdmin) {
    const token = jwt.sign({
      id,
      isAdmin,
    },
    process.env.SECRET_KEY, { expiresIn: '1d' });
    return token;
  },

  /**
   * trim input whitespaces
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  trimmer(req, res, next) {
    const { body } = req;
    if (body) {
      const trimmed = {};

      Object.keys(body).forEach((key) => {
        const value = body[key];
        Object.assign(trimmed, { [key]: value.trim() });
      });
      req.body = trimmed;
    }

    next();
  },
};

export default Helper;
