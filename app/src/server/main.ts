import express, { Request, Response } from "express";
import ViteExpress from "vite-express";

const app = express();

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello Vite + React!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
