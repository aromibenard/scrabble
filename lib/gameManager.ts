import { db } from "@/database";
import type { WebSocket } from "ws";

type Client = {
    ws: WebSocket;
    gameId: string;
    userId: string;
}

class GameManager {
    private clients: Client[] = [];

    addClient(ws: WebSocket, gameId: string, userId: string) {
        this.clients.push({ ws, gameId, userId });
    }

    removeClient(ws: WebSocket) {
        this.clients = this.clients.filter(client => client.ws !== ws);
    }

    broadcast(gameId: string, data: unknown) {
        const message = JSON.stringify(data);
        this.clients
            .filter(client => client.gameId === gameId)
            .forEach(client => client.ws.readyState === 1 && client.ws.send(message));
    }

    async rotateTurn(gameId: string) {
        const game = await db.game.findUnique({
            where: { id: gameId },
            include: { players: true },
        });

        if (!game) return null

        const players = game.players.sort(
            (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
        )
        if (!players.length) return null

        const currentIndex = players.findIndex(p => p.id === game.currentTurnId);
        const nextPlayer = players[(currentIndex + 1) % players.length];

        await db.game.update({
            where: { id: gameId },
            data: { currentTurnId: nextPlayer.id },
        });

        this.broadcast(gameId, {
            type: "TURN_UPDATE",
            data: { nextPlayerId: nextPlayer.id },
        });
    }
}

export const gameManager = new GameManager();