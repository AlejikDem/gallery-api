import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import mongoose from 'mongoose';

import config from './config';
import router from './routes';

const app = express();
const port = process.env.PORT || 8080;

mongoose.Promise = Promise;
mongoose.connection.openUri(config.db);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
  }),
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept',
  );
  next();
});

app.use(router);

app.listen(port, () => console.log(`listening on port ${port}`));

module.exports = app;
