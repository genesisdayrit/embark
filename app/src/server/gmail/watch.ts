import { google } from "googleapis";
import { db } from "@/db";
import { gmailWatchState } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { account } from "@/db/auth-schema";
import { and } from "drizzle-orm";

// Helper to get a valid access token (refreshes if needed)
async function getAccessToken(userId: string): Promise<string> {
  const [userAccount] = await db
    .select()
    .from(account)
    .where(
      and(
        eq(account.userId, userId),
        eq(account.providerId, "google")
      )
    )
    .limit(1);

  if (!userAccount) {
    throw new Error("Google account not found for user");
  }

  if (!userAccount.accessToken || !userAccount.refreshToken) {
    throw new Error("Access token or refresh token not found");
  }
  
  // Check if token expires in less than 5 minutes or is already expired
  const now = new Date();
  const expiresAt = userAccount.accessTokenExpiresAt;
  const shouldRefresh = !expiresAt || expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;

  if (shouldRefresh) {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      refresh_token: userAccount.refreshToken,
    });

    const { credentials } = await oauth2Client.refreshAccessToken();
    
    if (!credentials.access_token || !credentials.expiry_date) {
      throw new Error("Failed to refresh access token");
    }

    // Update the token in the database
    await db
      .update(account)
      .set({
        accessToken: credentials.access_token,
        accessTokenExpiresAt: new Date(credentials.expiry_date),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(account.userId, userId),
          eq(account.providerId, "google")
        )
      );
    
    return credentials.access_token;
  }

  return userAccount.accessToken;
}

export async function registerGmailWatch(userId: string): Promise<{
  historyId: string;
  expiration: string;
}> {
  console.log(`[Watch] Registering Gmail watch for user: ${userId}`);
  
  // Get fresh access token (already handles refresh)
  const accessToken = await getAccessToken(userId);
  
  // Create OAuth client
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ access_token: accessToken });
  
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });
  
  // Register watch with Gmail
  const response = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: `projects/${process.env.GCP_PROJECT_ID}/topics/gmail-events`,
      labelIds: ["INBOX"],
      labelFilterAction: "include",
    },
  });
  
  if (!response.data.historyId || !response.data.expiration) {
    throw new Error("Invalid watch response from Gmail API");
  }
  
  const historyId = response.data.historyId;
  const expiration = new Date(Number(response.data.expiration));
  
  console.log(`[Watch] Registered successfully:`, {
    historyId,
    expiration,
  });
  
  // Check if watch state already exists
  const [existing] = await db
    .select()
    .from(gmailWatchState)
    .where(eq(gmailWatchState.userId, userId))
    .limit(1);
  
  if (existing) {
    // Update existing
    await db
      .update(gmailWatchState)
      .set({
        historyId,
        watchExpiration: expiration,
        updatedAt: new Date(),
      })
      .where(eq(gmailWatchState.userId, userId));
    
    console.log(`[Watch] Updated existing watch state for user ${userId}`);
  } else {
    // Insert new - get email from user's Google account
    const [userAccount] = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, userId),
          eq(account.providerId, "google")
        )
      )
      .limit(1);
    
    const emailAddress = userAccount?.accountId || "unknown";
    
    await db.insert(gmailWatchState).values({
      userId,
      emailAddress,
      historyId,
      watchExpiration: expiration,
    });
    
    console.log(`[Watch] Created new watch state for user ${userId}`);
  }
  
  return {
    historyId,
    expiration: expiration.toISOString(),
  };
}

export async function renewExpiredWatches(): Promise<{ renewed: number; failed: number }> {
  const now = new Date();
  const expiringSoon = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours
  
  const watches = await db
    .select()
    .from(gmailWatchState)
    .where(sql`${gmailWatchState.watchExpiration} < ${expiringSoon}`);
  
  console.log(`[Cron] Found ${watches.length} watches to renew`);
  
  let renewed = 0;
  let failed = 0;
  
  for (const watch of watches) {
    try {
      await registerGmailWatch(watch.userId);
      renewed++;
    } catch (error: any) {
      console.error(`[Cron] Failed to renew watch for user ${watch.userId}:`, error.message);
      failed++;
    }
  }
  
  console.log(`[Cron] Renewal complete: ${renewed} renewed, ${failed} failed`);
  return { renewed, failed };
}

