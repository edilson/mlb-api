const express = require('express');

const routes = express.Router();

const UserController = require('../controllers/UserController');
const teamRoutes = require('./team-routes');

routes.use(teamRoutes);

routes.post('/v1/register', UserController.create);

module.exports = routes;
