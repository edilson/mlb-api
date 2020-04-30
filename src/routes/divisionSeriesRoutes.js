const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const DivisionSeriesController = require('../controllers/DivisionSeriesController');

const routes = express.Router();

routes
  .route('/division_series')
  .post(
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        start_date: Joi.date().iso().required(),
        end_date: Joi.date()
          .iso()
          .ruleset.greater(Joi.ref('start_date'))
          .rule({ message: 'end_date must be greater than start_date' })
          .required(),
        champion_id: Joi.string().required(),
        record: Joi.string().required().min(5),
      }),
    }),
    DivisionSeriesController.create
  )
  .get(
    celebrate({
      [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
      }),
    }),
    DivisionSeriesController.list
  );

routes
  .route('/division_series/:id')
  .get(
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required(),
      }),
    }),
    DivisionSeriesController.findById
  )
  .put(
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        start_date: Joi.date().iso(),
        end_date: Joi.date()
          .iso()
          .ruleset.greater(Joi.ref('start_date'))
          .rule({ message: 'end_date must be greater than start_date' }),
        champion_id: Joi.string(),
        record: Joi.string().min(5),
      }),
    }),
    DivisionSeriesController.update
  )
  .delete(
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required(),
      }),
    }),
    DivisionSeriesController.delete
  );

module.exports = routes;
