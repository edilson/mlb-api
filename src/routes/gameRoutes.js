const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const GameController = require('../controllers/GameController');

const routes = express.Router();

routes
  .route('/world_series/:world_series_id/games')
  .post(GameController.create)
  .get(GameController.list);

routes
  .route('/world_series/:world_series_id/games/:game_id')
  .get(GameController.findById)
  .put(GameController.update)
  .delete(GameController.delete);

module.exports = routes;
