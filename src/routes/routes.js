const express = require('express');
const { Segments, Joi, celebrate } = require('celebrate');

const routes = express.Router();

const UserController = require('../controllers/UserController');
const LoginController = require('../controllers/LoginController');

const teamRoutes = require('./team-routes');
const venueRoutes = require('./venue-routes');
const worldSeriesRoutes = require('./worldSeriesRoutes');

routes.use(teamRoutes);
routes.use(venueRoutes);
routes.use(worldSeriesRoutes);

routes.post(
  '/register',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(5),
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  UserController.create
);
routes.post('/login', LoginController.login);

module.exports = routes;
