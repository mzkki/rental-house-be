import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello from the second server!');
});

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
