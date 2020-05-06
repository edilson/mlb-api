const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const PennantController = require('../controllers/PennantController');

const jwtAuth = require('../config/auth-middleware');

const gameRoutes = require('./gameRoutes');

const routes = express.Router();

routes
  .route('/pennants')
  .post(
    jwtAuth(),
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
    PennantController.create
  )
  .get(
    celebrate({
      [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
      }),
    }),
    PennantController.list
  );

routes
  .route('/pennants/:id')
  .get(
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required(),
      }),
    }),
    PennantController.findById
  )
  .put(
    jwtAuth(),
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
    PennantController.update
  )
  .delete(
    jwtAuth(),
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().integer().required(),
      }),
    }),
    PennantController.delete
  );

routes.use(gameRoutes);

module.exports = routes;
