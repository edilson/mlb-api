const bcrypt = require('bcrypt');

const connection = require('../database/connection');

module.exports = {
  async create(request, response) {
    try {
      let { name, email, password } = request.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      password = hash;

      await connection('user').insert({
        name,
        email,
        password,
      });

      return response.status(201).json({ name, email });
    } catch (error) {
      return response
        .status(400)
        .json({ error: 'Unable to create user, invalid data provided.' });
    }
  },
};
