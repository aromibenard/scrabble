'use client'

import { useGameStore } from "@/lib/gameState";
import { type Tile } from "@/types/logic";
import { useEffect, useState } from "react";

export default function ATile( { tile, index } : { tile: Tile; index: number }) {
    const [shake, setShake] = useState(false)
    const triggerTileShake = useGameStore((state) => state.triggerTileShake)
    
    useEffect(() => {
        if (shake) {
            const timer = setTimeout(() => setShake(false), 500)
            return () => clearTimeout(timer)
        }
    }, [shake])

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ tile, index }));
    }

    return (
        <div
            className={`tile ${shake ? 'shake' : ''}`}
            draggable
            onDragStart={handleDragStart}
        >
            {tile?.letter}<span className="mx-1 text-xs">{tile?.points}</span>
        </div>
    );
}


