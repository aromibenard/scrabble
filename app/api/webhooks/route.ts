import { db } from "@/database";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix"


export async function POST(request: Request) {
    try {
        const secret = process.env.CLERK_WEBHOOK_SECRET_KEY;
        if (!secret) return new Response("Missing secret", { status: 500 })

        const wh = new Webhook(secret)
        const body = await request.text()
        const headerPayload = await headers()

        const event = wh.verify(body, {
            "svix-id": headerPayload.get("svix-id")!,
            "svix-timestamp": headerPayload.get("svix-timestamp")!,
            "svix-signature": headerPayload.get("svix-signature")!,
        }) as WebhookEvent

        if (event.type === "user.created") {
            const { id, email_addresses } = event.data

            try {
                await db.user.upsert({
                    where: { clerkId: id },
                    update: {},
                    create: {
                        clerkId: id,
                        email: email_addresses[0]?.email_address || "",
                    }
                })
            } catch (error) {
                console.error('Database error:', error)
                return new Response('Create User failed', { status: 500 })
            }
        }

        return new Response("Webhook processed", { status: 200 })
    } catch (error) {
        console.error('Error verifying webhook:', error)
        return new Response('Error verifying webhook:', { status: 400 })
    }
}