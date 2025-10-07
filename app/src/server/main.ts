import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { server_auth } from "./auth";
import { toNodeHandler } from "better-auth/node";
import 'dotenv/config';
import { parseEmail } from "./ai/extractor/parseEmail";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserOrders } from "./getUserOrders";

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

app.get("/orders", async (req: Request, res: Response) => {

  const userOrders = await getUserOrders(req)

  res.send(userOrders)

})

app.post('/ai/extract', async (req, res) => {
  const { emailText } = req.body ?? {}
  if (!emailText?.trim()) return res.status(400).json({ error: "emailText required" })

  const result = await parseEmail(emailText)

  return res.json(result)
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);