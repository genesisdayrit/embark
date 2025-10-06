import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { server_auth } from "./auth";
import { toNodeHandler } from "better-auth/node";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { account } from "@/db/auth-schema";

const app = express();
app.use(express.json())


app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello Vite + React!");
});

app.all("/api/auth/*path", toNodeHandler(server_auth));

app.all("/api/auth/login/google", async (_req: Request, _res: Response) => {

  const response = toNodeHandler(server_auth)

  return response

})

app.get("/orders", async (req: Request, res: Response) => {

  //get users access token from database and view their emails? 

  // Convert req.headers to a plain object with string values to use with server_auth.api.getsession 
  const headers: Record<string, string> = {};
  Object.entries(req.headers).forEach(([key, value]) => {
    if (typeof value === "string") {
      headers[key] = value;
    } else if (Array.isArray(value)) {
      headers[key] = value.join(", ");
    }
  });

  //get session, userid 
  const ba_session = await server_auth.api.getSession({
    headers: headers,
  })

  let USER_ID = ''
  if (!ba_session) {
    throw Error('Cannot Get User: No User Session Found :(')
  } else {
    USER_ID = ba_session.session.userId
  }

  //Retrieve token from db 
  const token = await db
    .select({ accessToken: account.accessToken })
    .from(account)
    .where(eq(account.userId, USER_ID))

  if (USER_ID)

    res.send("You have hit the orders endpoint")
  return res

})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);