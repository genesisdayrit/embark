import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { server_auth } from "./auth";
import { toNodeHandler } from "better-auth/node";
import 'dotenv/config'
import { parseEmail } from "./ai/extractor/parseEmail"
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getUserOrders } from "./getUserOrders";
import { google } from "googleapis";
import { fetchUserEmails } from "./gmail";

// Setup temp directory (ES module compatible)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const TEMP_DIR = path.join(__dirname, "temp");
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

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

    // fetch emails
    const emails = await fetchUserEmails({
      userId,
      lookBackPeriod,
    });

    // Write to temp file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `gmail_${userId}_${timestamp}.json`;
    const filepath = path.join(TEMP_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify({
      success: true,
      email_count: emails.length,
      lookBackPeriod,
      timestamp: new Date().toISOString(),
      emails,
    }, null, 2));
    
    console.log(`📧 Gmail results written to: ${filepath}`);

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

  // Write to temp file
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `extract_${timestamp}.json`;
  const filepath = path.join(TEMP_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify({
    timestamp: new Date().toISOString(),
    emailText: emailText.substring(0, 500) + '...',
    result,
  }, null, 2));
  
  console.log(`🤖 AI extraction result written to: ${filepath}`);

  return res.json(result)
})

app.get("/api/test/extract/:userId", async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { period, limit, emailIndex } = req.query;

    const lookBackPeriod = period ? parseInt(period as string) : 5;
    const processLimit = limit ? parseInt(limit as string) : 1; // Default: process 1 email
    const startIndex = emailIndex ? parseInt(emailIndex as string) : 0;

    console.log('\n' + '='.repeat(80));
    console.log(`🧪 TEST EMAIL EXTRACTION - User: ${userId}`);
    console.log('='.repeat(80));

    // Fetch emails
    const emails = await fetchUserEmails({ userId, lookBackPeriod });
    console.log(`✓ Fetched ${emails.length} total emails`);
    
    // Select emails to process
    const emailsToProcess = emails.slice(startIndex, startIndex + processLimit);
    console.log(`✓ Processing ${emailsToProcess.length} email(s) starting at index ${startIndex}\n`);

    // Process each email
    const results = [];
    for (let i = 0; i < emailsToProcess.length; i++) {
      const email = emailsToProcess[i];
      const emailNum = startIndex + i + 1;
      
      console.log(`\n[${emailNum}/${emails.length}] Processing Email`);
      console.log('-'.repeat(80));
      console.log(`Subject: ${email.subject}`);
      console.log(`From: ${email.from}`);
      console.log(`Date: ${email.date}`);
      console.log(`Body Preview: ${email.body?.substring(0, 150)}...`);
      console.log('-'.repeat(80));

      const extraction = await parseEmail(email.body || email.snippet);
      
      console.log(`\n📋 EXTRACTION RESULT:`);
      console.log(`   Path Used: ${extraction.path_used}`);
      console.log(`   Is Shipping: ${extraction.is_shipping_email}`);
      console.log(`   Carrier: ${extraction.carrier}`);
      console.log(`   Tracking #s: ${extraction.tracking_numbers?.join(', ') || 'none'}`);
      console.log(`   Merchant: ${extraction.merchant || 'unknown'}`);
      console.log(`   Order ID: ${extraction.order_id || 'none'}`);
      
      results.push({
        email: {
          id: email.id,
          subject: email.subject,
          from: email.from,
          date: email.date,
        },
        extraction,
      });
    }

    console.log('\n' + '='.repeat(80));
    console.log(`✅ COMPLETED - Processed ${results.length}/${emails.length} emails`);
    console.log('='.repeat(80) + '\n');

    // Write to temp file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `test_extract_${userId}_${timestamp}.json`;
    const filepath = path.join(TEMP_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify({
      success: true,
      total_emails: emails.length,
      processed_count: results.length,
      timestamp: new Date().toISOString(),
      results,
    }, null, 2));
    
    console.log(`💾 Test results written to: ${filepath}\n`);

    return res.json({
      success: true,
      total_emails: emails.length,
      processed_count: results.length,
      results,
    });
  } catch (error) {
    console.error("❌ Error in test endpoint:", error);
    return res.status(500).json({
      error: "Test failed",
      message: error instanceof Error ? error.message : String(error),
    });
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);