'use client'
import { useGameStore } from "@/lib/gameState"
import { BoardType } from "@/types/logic"

export default function Board() {
    const board = useGameStore((state) => state.board as BoardType)

    return (
        <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 40px)',
            gap:'5px'
        }}>
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: '1px solid black'
                        }} 
                    >
                        {cell ? cell.letter : ''}
                    </div>
                ))
            )}
        </div>
    )
}
