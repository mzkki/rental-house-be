import express from 'express';
import appConfig from './config/app';
import v1Routes from './routes/v1';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const swaggerDocument = YAML.load(path.join(__dirname, '../api-spec.yml'));

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1', v1Routes);

app.use(errorHandler);
app.use(notFoundHandler);

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
