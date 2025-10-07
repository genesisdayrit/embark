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
import { google } from "googleapis";
import { fetchUserEmails } from "./gmail";

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

app.get("/api/orders", async (req: Request, res: Response) => {

  const userOrders = await getUserOrders(req)

  res.send(userOrders)

})


app.get("/api/gmail/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { period } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    
    // check for lookBackPeriod in the query, if not available, default to lookback 5 days
    const lookBackPeriod = period ? parseInt(period as string) : 5;
    if (isNaN(lookBackPeriod) || lookBackPeriod < 1) {
      return res.status(400).json({ error: "Period must be a positive number" });
    }

    // fetch user emails
    const emails = await fetchUserEmails({
      userId,
      lookBackPeriod,
    });

    return res.json({
      success: true,
      email_count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("Error in /api/gmail endpoint:", error);
    return res.status(500).json({
      error: "Failed to fetch emails",
      message: error,
    });
  }
});

app.post('/ai/extract', async (req, res) => {
  const { emailText } = req.body ?? {}
  if (!emailText?.trim()) return res.status(400).json({ error: "emailText required" })

  const result = await parseEmail(emailText)

  return res.json(result)
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);