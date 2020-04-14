const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const TeamController = require('./controllers/TeamController');

const routes = express.Router();

routes.use('/', swaggerUi.serve);
routes.get('/', swaggerUi.setup(swaggerDocument));

routes.post(
  '/v1/teams',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required(),
      established_in: Joi.number().integer().required().min(1871),
      league: Joi.string().required().length(15),
      division: Joi.string().required().min(13).max(17),
      logo: Joi.string().required(),
      number_of_titles: Joi.number().integer().required(),
    }),
  }),
  TeamController.create
);
routes.get(
  '/v1/teams',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number(),
    }),
  }),
  TeamController.list
);
routes.get(
  '/v1/teams/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  TeamController.findById
);
routes.put(
  '/v1/teams/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string(),
      established_in: Joi.number().integer().min(1871),
      league: Joi.string().length(15),
      division: Joi.string().min(13).max(17),
      logo: Joi.string(),
      number_of_titles: Joi.number().integer(),
    }),
  }),
  TeamController.update
);
routes.delete(
  '/v1/teams/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  }),
  TeamController.delete
);

module.exports = routes;
