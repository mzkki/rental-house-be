import express from 'express';
import appConfig from './config/app';
import v1Routes from './routes/v1';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the second server!');
});

app.use('/api/v1', v1Routes);

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
