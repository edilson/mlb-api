const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const WorldSeriesController = require('../controllers/WorldSeriesController');

const gameRoutes = require('./gameRoutes');

const routes = express.Router();

routes.post(
  '/world_series',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      start_date: Joi.date().iso().required(),
      end_date: Joi.date()
        .iso()
        .ruleset.greater(Joi.ref('start_date'))
        .rule({ message: 'end_date must be greater than start_date' })
        .required(),
      champion_id: Joi.string().required(),
      runners_up_id: Joi.string().required(),
    }),
  }),
  WorldSeriesController.create
);
routes.get(
  '/world_series',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number(),
    }),
  }),
  WorldSeriesController.list
);
routes.get(
  '/world_series/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  WorldSeriesController.findById
);
routes.put(
  '/world_series/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      start_date: Joi.date().iso(),
      end_date: Joi.date().iso(),
      champion_id: Joi.string(),
      runners_up_id: Joi.string(),
    }),
  }),
  WorldSeriesController.update
);
routes.delete(
  '/world_series/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  WorldSeriesController.delete
);
routes.use(gameRoutes);

module.exports = routes;