const app = require('./src/config/custom-express');

module.exports = app.listen(process.env.PORT || 3333, () => {
  console.log('Server listening on port 3333');
});
