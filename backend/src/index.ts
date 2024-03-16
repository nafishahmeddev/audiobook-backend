import express, { Express, Request, Response, Application } from 'express';
import BodyParser from "body-parser";
import cors from "cors";
import dotenv from 'dotenv';
import path from "path";
import { initDatabase } from 'db';
dotenv.config({ path: __dirname + "/../.env" });
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
  await initDatabase();
  const router = await (await (import("./router"))).default;
  app.use(router);
}

boot().then(() => {
  app.use("/public", express.static(path.join(process.env.ASSETS_PATH || "", "public")));
  app.use(express.static(path.join(process.env.FRONTEND_PATH || "dist")));
  app.use("*", express.static(path.join(process.env.FRONTEND_PATH || "", "dist", "index.html")));
  app.listen(port, () => {
    console.log(`Server is Fire at http://localhost:${port}`);
  });
});
