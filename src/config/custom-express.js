const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');

const routers = require('../routes/routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1', routers);
app.use(errors());

module.exports = app;
