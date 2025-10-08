import express, { Request, Response } from "express";
import ViteExpress from "vite-express";
import { server_auth } from "./auth";
import { toNodeHandler } from "better-auth/node";
import { db } from "@/db";
import { orders } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getUserOrders = async (req: Request) => {

    //Get session information 
    const ba_session = await server_auth.api.getSession({
        headers: new Headers(
            Object.entries(req.headers)
                .filter(([_, value]) => typeof value === "string")
                .map(([key, value]) => [key, value as string] as [string, string])
        )
    })

    //Get User ID from session 
    let USER_ID = ''
    if (!ba_session) {
        throw new Error("Failed to get session :(")
    }
    else {
        USER_ID = ba_session.session.userId
    }

    //Get all the orders for a given user - userorders is an array of order objects
    const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, USER_ID));

    return userOrders

}