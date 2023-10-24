import express, { Express, Request, Response, Application } from 'express';
import BodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import path from "path";
dotenv.config();
import { initConnection } from './db/base/conn';
import ErrorHandler from './middleware/ErrorHandler';

const app: Application = express();
const port = process.env.PORT || 8000;
app.use(cors({
  origin: "*"
}))
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

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
  app.use("public", express.static(path.resolve(process.env.ASSETS_PATH + "/public")));
  app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
  });
});
