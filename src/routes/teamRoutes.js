const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const TeamController = require('../controllers/TeamController');
const TeamPropertiesController = require('../controllers/TeamPropertiesController');

const routes = express.Router();

routes
  .route('/teams')
  .post(
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
  )
  .get(
    celebrate({
      [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
      }),
    }),
    TeamController.list
  );

routes
  .route('/teams/:id')
  .get(
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
      }),
    }),
    TeamController.findById
  )
  .put(
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
  )
  .delete(
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.string().required(),
      }),
    }),
    TeamController.delete
  );
routes.get('/teams/:id/venue', TeamPropertiesController.getVenue);
routes.get('/teams/:id/world_series', TeamPropertiesController.listWorldSeries);

module.exports = routes;
