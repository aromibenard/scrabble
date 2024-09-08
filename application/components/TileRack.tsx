'use client'

import { useGameStore } from "@/lib/gameState"
import { Tile } from "@/types/logic"
import React, { useState } from "react"

const TileRack = () => {
    const tileRack = useGameStore((state) => state.tileRack as Tile[])
    const drawTiles = useGameStore((state) => state.drawTiles)
    const [draggedTile, setDraggedTile] = useState<{tile: Tile, index: number} | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, tile: Tile, index: number) => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ tile, index}))  
    }

    return (
    <div className="flex my-4 mx-auto bg-sky-500 rounded shadow-md p-4">
        <button  className="bg-rose-600 text-white p-2 rounded shadow-md" onClick={() => drawTiles(7)}>Draw Tiles</button>
        {tileRack.map((tile, index) => (
            <div key={index} 
                className="h-[42px] w-[42px] mx-1 border-2 rounded bg-green-700 text-white px-1 font-medium shadow grid items-cente hover:border-rose-500 transition"
                draggable
                onDragStart={(e) => handleDragStart(e, tile, index)}
            >
               {/* Checking if the tile exists before accessing its properties */} 
              <p className="flex items-cente text-lg">{tile ? `${tile.letter}`: ''}<span className="text-xs mx-2">{tile ? `${tile.points}`: ''}</span></p>
            </div>
        ))}
        
    </div>
    )
}

export default TileRack
