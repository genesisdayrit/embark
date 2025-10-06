import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { server_auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

const app = express();
app.use(express.json())

app.all("/api/auth/*path", toNodeHandler(server_auth)); //runs, state not found error from better auth, 404 when you go to login google. 

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello Vite + React!");
});

app.all("/api/auth/login/google", async (req: Request, res: Response) => {

  const response = await toNodeHandler(server_auth)

  return response

})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);