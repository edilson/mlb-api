const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const DivisionSeriesController = require('../controllers/DivisionSeriesController');

const routes = express.Router();

routes
  .route('/division_series')
  .post(DivisionSeriesController.create)
  .get(DivisionSeriesController.list);

routes
  .route('/division_series/:id')
  .get(DivisionSeriesController.findById)
  .put(DivisionSeriesController.update)
  .delete(DivisionSeriesController.delete);

module.exports = routes;
