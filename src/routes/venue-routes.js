const express = require('express');
const { celebrate, Segments, Joi } = require('celebrate');

const VenueController = require('../controllers/VenueController');

const routes = express.Router();

routes.post(
  '/venues',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().required().min(7),
      opened: Joi.date().iso().required(),
      capacity: Joi.number().integer().required(),
      location: Joi.string().required(),
      team_id: Joi.string().required(),
    }),
  }),
  VenueController.create
);
routes.get(
  '/venues',
  celebrate({
    [Segments.QUERY]: Joi.object().keys({
      page: Joi.number(),
    }),
  }),
  VenueController.list
);
routes.get(
  '/venues/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  VenueController.findById
);
routes.put(
  '/venues/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(7),
      opened: Joi.date().iso(),
      capacity: Joi.number().integer(),
      location: Joi.string(),
      team_id: Joi.string(),
    }),
  }),
  VenueController.update
);
routes.delete(
  '/venues/:id',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.number().integer().required(),
    }),
  }),
  VenueController.delete
);

module.exports = routes;
