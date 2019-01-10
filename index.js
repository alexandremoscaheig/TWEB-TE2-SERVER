require('dotenv/config');
const express = require('express');
const passport = require('passport');
const { port } = require('./config');
const api = require('./routes/api');
const auth = require('./routes/auth');
const mongoDBUtils = require('./src/mongoDBUtils');

const app = express();

app.use(express.json());
app.use(passport.initialize());

app.use('/api', api);
app.use('/auth', auth);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/comments', (req, res) => mongoDBUtils.findAllComments(req, res));
app.post('/api/comments', (req, res) => mongoDBUtils.addNewComment(req, res));


app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500);
  res.send(err.message);
  next();
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
