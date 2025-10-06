import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { server_auth } from "./auth";
import { toNodeHandler } from "better-auth/node";
import {
  listMessages,
  getMessage,
  sendEmail,
  getProfile,
} from "./gmail/gmail";

const app = express();
app.use(express.json());

// Better Auth routes
app.all("/api/auth/*", toNodeHandler(server_auth));

// Test route
app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello Vite + React!");
});

// Middleware to extract access token from Better Auth session
async function getAccessToken(req: Request): Promise<string | null> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return null;
  }

  // Better Auth typically uses Bearer token
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // You'll need to verify this token with Better Auth
    // and extract the Google access token from the session
    const session = await server_auth.api.getSession({
      headers: req.headers as any,
    });

    if (!session?.user) {
      return null;
    }

    // Get the account with Google provider
    // This assumes Better Auth stores the access token in accounts
    // You may need to adjust based on your Better Auth configuration
    const accounts = await server_auth.api.listAccounts({
      headers: req.headers as any,
    });

    const googleAccount = accounts?.find(
      (acc: any) => acc.providerId === 'google'
    );

    return googleAccount?.accessToken || null;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

// Gmail API Routes
app.get("/api/gmail/messages", async (req: Request, res: Response) => {
  try {
    const accessToken = await getAccessToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const maxResults = parseInt(req.query.maxResults as string) || 10;
    const messages = await listMessages(accessToken, maxResults);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.get("/api/gmail/messages/:id", async (req: Request, res: Response) => {
  try {
    const accessToken = await getAccessToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const message = await getMessage(accessToken, req.params.id);
    res.json(message);
  } catch (error) {
    console.error("Error fetching message:", error);
    res.status(500).json({ error: "Failed to fetch message" });
  }
});

app.post("/api/gmail/send", async (req: Request, res: Response) => {
  try {
    const accessToken = await getAccessToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await sendEmail(accessToken, to, subject, body);
    res.json(result);
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.get("/api/gmail/profile", async (req: Request, res: Response) => {
  try {
    const accessToken = await getAccessToken(req);
    
    if (!accessToken) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const profile = await getProfile(accessToken);
    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);