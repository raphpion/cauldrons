import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import session from 'express-session';

import db from './db';

import accountRoute from './routes/account.route';
import userRoute from './routes/user.route';

dotenv.config();

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

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
app.use('/users', userRoute);

db.initialize()
  .then(() => {
    console.log('Succesfully connected to database!');
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error(err);
  });
