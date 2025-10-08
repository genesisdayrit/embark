import { google } from "googleapis";
import { db } from "@/db";
import { account } from "@/db/auth-schema";
import { eq, and } from "drizzle-orm";

type FetchEmailsParams = {
  userId: string;
  lookBackPeriod: number;
};

type EmailResult = {
  id: string;
  threadId: string;
  snippet: string;
  subject: string;
  from: string;
  date: string;
  isRead: boolean;
  body?: string;
};

// create google oauth client with credentials
const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

// use refresh token to get a new access token from google
const refreshAccessToken = async (refreshToken: string): Promise<{
  access_token: string;
  expiry_date: number;
}> => {
  const oauth2Client = createOAuthClient();

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  const { credentials } = await oauth2Client.refreshAccessToken();
  
  if (!credentials.access_token || !credentials.expiry_date) {
    throw new Error("Failed to refresh access token");
  }

  return {
    access_token: credentials.access_token,
    expiry_date: credentials.expiry_date,
  };
};

// save new access token and expiry to database
const updateAccessToken = async (
  userId: string,
  accessToken: string,
  expiresAt: Date
): Promise<void> => {
  await db
    .update(account)
    .set({
      accessToken,
      accessTokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(account.userId, userId),
        eq(account.providerId, "google")
      )
    );
};

// get valid access token, refresh if expired or expiring soon
const getAccessToken = async (userId: string): Promise<string> => {
  try {
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
    
    // check if token expires in less than 5 minutes or is already expired
    const now = new Date();
    const expiresAt = userAccount.accessTokenExpiresAt;
    const shouldRefresh = !expiresAt || expiresAt.getTime() - now.getTime() < 5 * 60 * 1000;

    if (shouldRefresh) {
      const { access_token, expiry_date } = await refreshAccessToken(userAccount.refreshToken);
      await updateAccessToken(userId, access_token, new Date(expiry_date));
      return access_token;
    }

    return userAccount.accessToken;
  } catch (error) {
    console.error("error in getAccessToken:", error);
    throw error;
  }
};

// fetch user emails from gmail within lookback period
export const fetchUserEmails = async (
  params: FetchEmailsParams
): Promise<EmailResult[]> => {
  const { userId, lookBackPeriod } = params;

  const accessToken = await getAccessToken(userId);

  const oauth2Client = createOAuthClient();

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  // subtract current date from lookBackPeriod date in days, and convert to timestamp
  const lookBackDate = new Date();
  lookBackDate.setDate(lookBackDate.getDate() - lookBackPeriod);
  const afterTimestamp = Math.floor(lookBackDate.getTime() / 1000);

  const query = `after:${afterTimestamp}`;

  try {
    // get list of emails
    const listResponse = await gmail.users.messages.list({
      userId: "me",
      q: query,
      maxResults: 500,
    });

    const messages = listResponse.data.messages || [];

    if (messages.length === 0) {
      return [];
    }

    // fetch email details
    const emailPromises = messages.map(async (message) => {
      const messageData = await gmail.users.messages.get({
        userId: "me",
        id: message.id!,
        format: "full",
      });

      // extract subject, from, and date from headers
      const headers = messageData.data.payload?.headers || [];
      const subject = headers.find((h) => h.name?.toLowerCase() === "subject")?.value || "(no subject)";
      const from = headers.find((h) => h.name?.toLowerCase() === "from")?.value || "unknown";
      const date = headers.find((h) => h.name?.toLowerCase() === "date")?.value || "";

      const labels = messageData.data.labelIds || [];
      const isRead = !labels.includes("UNREAD");

      // parse the email body
      let body = "";
      if (messageData.data.payload?.body?.data) {
        body = Buffer.from(messageData.data.payload.body.data, "base64").toString("utf-8");
      } else if (messageData.data.payload?.parts) {
        const textPart = messageData.data.payload.parts.find(
          (part) => part.mimeType === "text/plain"
        );
        if (textPart?.body?.data) {
          body = Buffer.from(textPart.body.data, "base64").toString("utf-8");
        }
      }

      return {
        id: messageData.data.id!,
        threadId: messageData.data.threadId!,
        snippet: messageData.data.snippet || "",
        subject,
        from,
        date,
        isRead,
        body: body || messageData.data.snippet || "",
      };
    });

    const emails = await Promise.all(emailPromises);
    return emails;
  } catch (error) {
    console.error("error fetching emails:", error);
    throw error;
  }
};

