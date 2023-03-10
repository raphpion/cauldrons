import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import express, { Response } from 'express';
import session from 'express-session';

import db from '~/db';

import { CauldronRequest } from '~/models/request.model';
import accountRoute from '~/routes/account.route';
import profileRoute from '~/routes/profile.route';
import userRoute from '~/routes/user.route';

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

app.get('/', (req: CauldronRequest, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/account', accountRoute);
app.use('/profiles', profileRoute);
app.use('/users', userRoute);

db.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log('\nWelcome to Cauldrons API!');

      if (app.get('env') === 'development') {
        console.log('\nActive services:');
        console.table([
          { name: 'API', url: `http://localhost:${port}` },
          { name: 'Postgres', url: `http://${process.env.POSTGRES_URL}:${process.env.POSTGRES_PORT}` },
        ]);
      }
    });
  })
  .catch(err => {
    console.error('Could not connect to Postgres database.');
    console.error(err);
  });
