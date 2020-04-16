const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const connection = require('../database/connection');

module.exports = {
  async login(request, response) {
    const { email, password } = request.body;

    const user = await connection('user')
      .where('email', email)
      .select('*')
      .first();

    if (
      email === user.email &&
      (await bcrypt.compare(password, user.password))
    ) {
      let token = await jwt.sign({ user }, process.env.SECRET, {
        expiresIn: '24h',
      });

      return response.json({
        success: true,
        email: user.email,
        token: token,
      });
    } else {
      return response.status(400).json({
        success: false,
        message: 'Authentication failed. Please provide a valid user.',
      });
    }
  },
};
