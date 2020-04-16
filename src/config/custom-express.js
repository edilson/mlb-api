const express = require('express');
const { errors } = require('celebrate');

const routers = require('../routes/routes');

const app = express();

app.use(express.json());
app.use(routers);
app.use(errors());

module.exports = app;
