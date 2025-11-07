import { NextRequest } from "next/server";
import { WebSocketServer } from "ws";
import { gameManager } from "@/lib/gameManager";
import { db } from "@/database";


const wss = new WebSocketServer({ noServer: true });

wss.on("connection", (ws, req) => {
    const url = new URL(req.url || "", "http://localhost");
    const gameId = url.searchParams.get("gameId")!;
    const userId = url.searchParams.get("userId")!;

    gameManager.addClient(ws, gameId, userId);

    ws.on("message", async (message) => {
        try {
            const data = JSON.parse(message.toString());

            if (data.type === "MOVE") {
                const { playerId, word, placedTiles, score } = data;

                const game = await db.game.findUnique({
                    where: { id: gameId },
                    include: { players: true },
                });

                if (!game) {
                    ws.send(JSON.stringify({ type: "ERROR", message: "Game not found" }));
                    return;
                }

                if (game.currentTurnId !== playerId) {
                    ws.send(JSON.stringify({ type: "ERROR", message: "Not your turn!" }));
                    return;
                }

                // Save the move
                await db.move.create({
                    data: { gameId, playerId, word, placedTiles, score },
                });

                // Update player score
                await db.player.update({
                    where: { id: playerId },
                    data: { score: { increment: score } },
                });

                // Broadcast move to all players
                gameManager.broadcast(gameId, {
                    type: "MOVE_BROADCAST",
                    data: { playerId, word, placedTiles, score },
                });

                // Rotate turn
                await gameManager.rotateTurn(gameId);
            }

            if (data.type === "CHAT") {
                await db.message.create({
                data: { gameId, userId, content: data.content },
                });
                gameManager.broadcast(gameId, {
                type: "CHAT_BROADCAST",
                data: { userId, content: data.content },
                });
            }
        } catch (err) {
            console.error("WS error:", err);
        }
    });

    ws.on("close", () => gameManager.removeClient(ws));
});

export const GET = async (req: NextRequest) => {
    const upgradeHeader = req.headers.get("upgrade");
    if (upgradeHeader !== "websocket") {
        return new Response("Expected websocket", { status: 400 });
    }

    const { socket } = (req as any);
    if (!socket) return new Response("No socket", { status: 400 });

    wss.handleUpgrade(req, socket, Buffer.alloc(0), (ws) => {
        wss.emit("connection", ws, req);
    });

    return new Response(null, { status: 101 });
};
