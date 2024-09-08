'use client'
import { useGameStore } from "@/lib/gameState"
import { Square, Tile } from "@/types/logic";
import React from "react";


export default function Board() {
    const board = useGameStore((state) => state.board)
    const placeTile = useGameStore((state) => state.placeTile)
    const removeTileFromRack = useGameStore((state) => state.removeTileFromRack)

    const getSquareStyle = (square: Square) => {
        switch (square.type) {
            case 'triple-word':
                return { backgroundColor: 'red' };
            case 'double-word':
                return { backgroundColor: 'pink' };
            case 'triple-letter':
                return { backgroundColor: 'blue' };
            case 'double-letter':
                return { backgroundColor: 'lightblue' };
            case 'start':
                return { backgroundColor: 'yellow' };
            default:
                return { backgroundColor: 'white' };
        }
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
       e.preventDefault()
       const data = e.dataTransfer.getData('text/plain')
       const { tile, index } = JSON.parse(data) as { tile: Tile, index: number } 

       placeTile(row, col, tile)
       removeTileFromRack(index)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    return (
        <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(15, 40px)', 
            gap: '5px', 
            width: 'fit-content',
            margin: 'auto' // Center the board
        }}>
            {board.map((row, rowIndex) =>
                row.map((square, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                        onDragOver={handleDragOver}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: '1px solid black',
                            ...getSquareStyle(square),
                        }}
                    >
                        {square?.tile ? `${square?.tile.letter}` : ''}
                    </div>
                ))
            )}
        </div>
    )
}
