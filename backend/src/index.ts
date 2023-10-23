import express, { Express, Request, Response, Application } from 'express';
import BodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();
import { initConnection } from './db/base/conn';
import ErrorHandler from './middleware/ErrorHandler';

const app: Application = express();
const port = process.env.PORT || 8000;

app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended: true}));

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Express & TypeScript Server');
});
async function boot() {
  await initConnection(["default"]);
  const router = await (await (import("./router"))).default;
  app.use(router);
}

boot().then(() => {
  app.use(ErrorHandler);
  app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
  });
});
