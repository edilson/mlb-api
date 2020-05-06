const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const GameController = require('../controllers/GameController');

const jwtAuth = require('../config/auth-middleware');

const routes = express.Router();

routes
  .route('/world_series/:world_series_id/games')
  .post(
    jwtAuth(),
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        event_date: Joi.date().iso().required(),
        venue_id: Joi.number().integer().required(),
        winner_id: Joi.string().required(),
        loser_id: Joi.string().required(),
        winner_score: Joi.number().integer().required(),
        loser_score: Joi.number().integer().required(),
      }),
      [Segments.PARAMS]: Joi.object().keys({
        world_series_id: Joi.number().integer().required(),
      }),
    }),
    GameController.create
  )
  .get(
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        world_series_id: Joi.number().integer().required(),
      }),
    }),
    GameController.list
  );

routes
  .route('/world_series/:world_series_id/games/:game_id')
  .get(
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        world_series_id: Joi.number().integer().required(),
        game_id: Joi.number().integer().required(),
      }),
    }),
    GameController.findById
  )
  .put(
    jwtAuth(),
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        world_series_id: Joi.number().integer().required(),
        game_id: Joi.number().integer().required(),
      }),
      [Segments.BODY]: Joi.object().keys({
        event_date: Joi.date().iso(),
        venue_id: Joi.number().integer(),
        winner_id: Joi.string(),
        loser_id: Joi.string(),
        winner_score: Joi.number().integer(),
        loser_score: Joi.number().integer(),
      }),
    }),
    GameController.update
  )
  .delete(
    jwtAuth(),
    celebrate({
      [Segments.PARAMS]: Joi.object().keys({
        world_series_id: Joi.number().integer().required(),
        game_id: Joi.number().integer().required(),
      }),
    }),
    GameController.delete
  );

module.exports = routes;
