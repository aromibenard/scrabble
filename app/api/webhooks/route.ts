export async function POST(request: Request) {
    try {
        return new Response("Webhook processed", { status: 200 })
    } catch (error) {
        console.error('Error verifying webhook:', error)
        return new Response('Error verifying webhook:', { status: 400 })
    }
}