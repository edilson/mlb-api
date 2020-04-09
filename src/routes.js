const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const TeamController = require('./controllers/TeamController');

const routes = express.Router();

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

module.exports = routes;
