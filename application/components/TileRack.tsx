'use client'

import { useGameStore } from "@/lib/gameState"
import { type Tile } from "@/types/logic"
import React, { useState } from "react"
import ATile from "./Tile"

const TileRack = () => {
    const tileRack = useGameStore((state) => state.tileRack as Tile[])
    const drawTiles = useGameStore((state) => state.drawTiles)
    const triggerTileShake = useGameStore((state) => state.triggerTileShake)
    // const [placedTiles, setPlacedTiles] = useState<{ [key: number]: boolean }>({})

    return (
    <div className="flex my-4 mx-auto bg-sky-500 rounded shadow-md p-4">
        <button  className="bg-rose-600 text-white p-2 rounded shadow-md" onClick={() => drawTiles(7)}>Draw Tiles</button>
        {tileRack.map((tile, index) => (
            <ATile 
                key={index} 
                tile={tile}
                index={index}
                triggerTileShake={triggerTileShake}
                // isPlaced={placedTiles[index] ?? false}
            />
        ))}
        
    </div>
    )
}

export default TileRack
