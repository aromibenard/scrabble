'use client'
import { useGameStore } from "@/lib/gameState"
import { BoardType } from "@/types/logic"

export default function Board() {
    const board = useGameStore((state) => state.board as BoardType)

    return (
        <div className="w-full h-full grid-cols-15 gap-3 grid">
            {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        className="h-[38px] w-[38px] border-2 border-gray-500"
                    >
                        {cell ? cell.letter : ''}
                    </div>
                ))
            )}
        </div>
    )
}
