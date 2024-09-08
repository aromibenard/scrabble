'use client'

import { useGameStore } from "@/lib/gameState"
import { Tile } from "@/types/logic"

const TileRack = () => {
    const tileRack = useGameStore((state) => state.tileRack as Tile[])
    const drawTiles = useGameStore((state) => state.drawTiles)

    return (
    <div style={{ display: 'flex', margin: '20px 0'}}>
        <button onClick={() => drawTiles(7)}>Draw Tiles</button>
        {tileRack.map((tile, index) => (
            <div key={index} style={{ width: '40px', height: '40px', border: '1px solid black', margin: '0 5px'}}>
               {/* Checking if the tile exists before accessing its properties */} 
               {tile ? `${tile.letter} (${tile.points})`: ''}
            </div>
        ))}
        
    </div>
    )
}

export default TileRack
