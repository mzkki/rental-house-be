import express from 'express';
import appConfig from './config/app';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the second server!');
});

app.listen(appConfig.port, () => {
  console.log(`Server is running on port ${appConfig.port}`);
});
