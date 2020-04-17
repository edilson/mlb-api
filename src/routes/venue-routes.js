const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const VenueController = require('../controllers/VenueController');

const routes = express.Router();

routes.post('/v1/venues', VenueController.create);
routes.get('/v1/venues', VenueController.list);
routes.get('/v1/venues/:id', VenueController.findById);
routes.put('/v1/venues/:id', VenueController.update);
routes.delete('/v1/venues/:id', VenueController.delete);

module.exports = routes;
