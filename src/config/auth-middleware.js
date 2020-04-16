const jwt = require('jsonwebtoken');

require('dotenv').config();

const handleAuthentication = () => {
  return (request, response, next) => {
    let token = request.headers['authorization'];

    if (token) {
      if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
      }
      jwt.verify(token, process.env.SECRET, (error, decoded) => {
        if (error) {
          return response.status(401).json({
            success: false,
            message: 'Invalid token',
          });
        } else {
          request.decoded = decoded;
          next();
        }
      });
    } else {
      return response.status(401).send({
        success: false,
        message: 'No token found.',
      });
    }
  };
};

module.exports = handleAuthentication;
