import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { server_auth } from "./auth";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import 'dotenv/config'
import { parseEmail } from "./ai/extractor/parseEmail"
import { getUserOrders } from "./getUserOrders";
import { fetchUserEmails } from "./gmail";
import { gmailNormalize } from "./ingest/gmailNormalize"
import { processEmail } from "./processEmail"
import { registerGmailWatch } from "./gmail/watch"
import { setupPubSubInfrastructure, checkPubSubInfrastructure } from "./pubsub/setup"

const app = express();
console.log("[BOOT] server starting… PID", process.pid);

app.all("/api/auth/*path", toNodeHandler(server_auth)); //runs, state not found error from better auth, 404 when you go to login google. 

app.use(express.json())

app.use(async (req, _, next) => {
 const session = await server_auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });
    if (session?.user?.id) (req as any).auth = { userId: session.user.id };
next()
} 
)

app.get("/api/hello", (_req: Request, res: Response) => {
  res.send("Hello Vite + React!");
});

app.all("/api/auth/login/google", async (_req: Request, _res: Response) => {

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

    // fetch emails
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

app.post("/api/shipments/ingest", async (req, res) => {
  try {
  const userId = req.body?.userId.trim();
  if (!userId) return res.status(401).json({ error: "unauthorized" })
  const emailText = req.body?.emailText?.trim()
  if (!emailText) return res.status(400).json({ error: "emailText required" })

  const normalized = { emailId: `dev${Date.now()}`, userId, rawText:emailText }
  const dto = await processEmail(normalized)
  res.json(dto)
} catch (err) {
  console.error("ingest error:", err)
  res.status(500).json({ error: "ingest_failed" })
}
})

app.post("/api/shipments/ingest/gmail", async (req, res) => {
  try {
  const userId = req.auth?.userId ?? req.body.userId
  const lookBackPeriod = Number(req.body?.period ?? 5)
  const messages = await fetchUserEmails({ userId, lookBackPeriod })
  const results = await Promise.allSettled(
    messages.map(async message => {
      const normalized = gmailNormalize(message, userId)
      console.log("normalized sample:", normalized)
      return await processEmail(normalized)
    })
  )

  const successes = results.filter(res => res.status === "fulfilled").map(res => (res as any).value)
  const failures = results.filter(res => res.status === "rejected").map(res => (res as any).reason?.message ?? "unknown_error")

  console.log(`gmail ingest: ${successes.length} ok, ${failures.length} failed`)
  res.json({ successes, failures })
} catch (err) {
console.error("ingest/gmail error:", err);
    res.status(500).json({ error: "gmail_ingest_failed" })
}
})



app.post('/api/ai/extract', async (req, res) => {
  try {
  const { emailText } = req.body ?? {}
  if (!emailText?.trim()) return res.status(400).json({ error: "emailText required" })

  const result = await parseEmail(emailText)

  return res.json(result)}
  catch (err) {
    console.error("ingest/gmail error:", err)
    res.status(500).json({ error: "gmail_ingest_failed" })
  }
})

// Gmail Watch Registration endpoint
app.post("/api/gmail/setup-watch", async (req, res) => {
  try {
    const userId = req.auth?.userId || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "userId required" });
    }
    
    const result = await registerGmailWatch(userId);
    
    res.json({ 
      success: true, 
      message: "Gmail watch registered",
      ...result,
    });
  } catch (error: any) {
    console.error("Watch setup error:", error);
    res.status(500).json({ 
      error: "Failed to setup Gmail watch",
      message: error.message,
    });
  }
});

// Pub/Sub infrastructure setup endpoint
app.post("/api/pubsub/setup", async (_req, res) => {
  try {
    const result = await setupPubSubInfrastructure();
    
    res.json({
      success: true,
      message: "Pub/Sub infrastructure created successfully",
      ...result,
    });
  } catch (error: any) {
    console.error("Pub/Sub setup error:", error);
    res.status(500).json({
      error: "Failed to setup Pub/Sub infrastructure",
      message: error.message,
    });
  }
});

// Check Pub/Sub infrastructure status
app.get("/api/pubsub/status", async (_req, res) => {
  try {
    const status = await checkPubSubInfrastructure();
    res.json(status);
  } catch (error: any) {
    console.error("Pub/Sub status check error:", error);
    res.status(500).json({
      error: "Failed to check Pub/Sub status",
      message: error.message,
    });
  }
});

// Pub/Sub enable endpoint (for testing component)
app.post("/api/enable-pubsub", async (req, res) => {
  try {
    const userId = req.auth?.userId || req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: "userId required" });
    }
    
    // First, ensure Pub/Sub infrastructure exists
    console.log("[Enable] Checking Pub/Sub infrastructure...");
    const infraStatus = await checkPubSubInfrastructure();
    
    if (!infraStatus.exists) {
      console.log("[Enable] Creating Pub/Sub infrastructure...");
      await setupPubSubInfrastructure();
    }
    
    // Then register Gmail watch
    const result = await registerGmailWatch(userId);
    
    res.json({ 
      success: true, 
      message: `Pub/Sub enabled! Watch expires at ${result.expiration}`,
      historyId: result.historyId,
      expiration: result.expiration,
    });
  } catch (error: any) {
    console.error("Enable Pub/Sub error:", error);
    res.status(500).json({ 
      error: "Failed to enable Pub/Sub",
      message: error.message,
    });
  }
});

// Pub/Sub test publish endpoint
app.post("/api/publish-email", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.id) {
      return res.status(400).json({ error: "email object with id required" });
    }
    
    // Ensure infrastructure exists before publishing
    const infraStatus = await checkPubSubInfrastructure();
    
    if (!infraStatus.exists) {
      console.log("[Publish] Topic doesn't exist, creating infrastructure...");
      await setupPubSubInfrastructure();
    }
    
    // Import PubSub dynamically to avoid errors if not installed
    const { PubSub } = await import("@google-cloud/pubsub");
    
    const pubsub = new PubSub({
      projectId: process.env.GCP_PROJECT_ID,
    });
    
    const topicName = "gmail-events";
    const topic = pubsub.topic(topicName);
    
    // Publish the test message
    const dataBuffer = Buffer.from(JSON.stringify(email));
    const messageId = await topic.publishMessage({ data: dataBuffer });
    
    console.log(`[Test] Published test email event with messageId: ${messageId}`);
    
    res.json({
      success: true,
      messageId,
      message: "Test email event published successfully",
    });
  } catch (error: any) {
    console.error("Publish test email error:", error);
    res.status(500).json({
      error: "Failed to publish test email",
      message: error.message,
    });
  }
});

// Only listen in development (Vercel handles this in production)
if (process.env.NODE_ENV !== 'production') {
  ViteExpress.listen(app, 3000, () =>
    console.log("Server is listening on port 3000..."),
  );
}

export default app;