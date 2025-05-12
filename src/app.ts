import express from 'express';
import appConfig from './config/app';
import v1Routes from './routes/v1';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api/v1', v1Routes);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
