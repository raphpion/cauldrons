import express from 'express';
import session from 'express-session';
import { setupDatabaseConnection } from './db';
import bodyParser from 'body-parser';

import accountRoute from './routes/account.route';

require('dotenv').config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const sess = {
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
  },
};

if (app.get('env') === 'production') {
  app.set('trust proxy', 1);
  sess.cookie.secure = true;
}

app.use(session(sess));

app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/account', accountRoute);

setupDatabaseConnection()
  .then(() => {
    console.log('Connected to database successfully!');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.error('Could not connect to database!');
  });
