import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import indexRouter from './routes/index';
import { errorHandlerMiddleware } from './utils/error';
import sequelize from './config/sequelize';

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors({ credentials: true }));
app.use(morgan('combined'));
app.use('/', indexRouter);
app.use(errorHandlerMiddleware);

const port = process.env.PORT ?? 8080;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

sequelize
  .sync()
  .then(() => {
    console.log('Connection has been established successfully.');
    console.log('All models were synchronized successfully.');
  })
  .catch((err: any) => {
    console.error('Unable to connect to the database:', err);
  });
