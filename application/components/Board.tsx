'use client'

import { useToast } from "@/hooks/use-toast";
import { useGameStore } from "@/lib/gameState"
import { Square, Tile } from "@/types/logic";
import React from "react";
import { ToastAction } from "./ui/toast";
import ATile from "./Tile";

export default function Board() {
    const board = useGameStore((state) => state.board)
    const placeTile = useGameStore((state) => state.placeTile)
    const removeTileFromRack = useGameStore((state) => state.removeTileFromRack)
    const triggerTileShake = useGameStore((state) => state.triggerTileShake)
    const handleTilePlaced = useGameStore((state) => state.handleTilePlaced)
    const removeTileFromBoard = useGameStore((state) => state.removeTileFromBoard)
    const moveTile = useGameStore((state) => state.moveTile)
    const { toast } = useToast()

    function checkPlacementRules(board: Square[][], row:number, col:number) : boolean {
        const boardSize = board.length

        // 1. Check if tile is within the board bounds
        if (row < 0 || row >= boardSize || col < 0 || col >= boardSize) {
            return false;
        }

        // 2. Check if the square is already occupied
        if (board[row][col].tile) {
            return false;
        }

        // 3. Check if it is the first move and the tile is placed at the center
        const centerRow = Math.floor(boardSize / 2);
        const centerCol = Math.floor(boardSize / 2);
        const isBoardEmpty = board.every(row => row.every(square => !square.tile));

        if (isBoardEmpty && !(row === centerRow && col === centerCol)) {
            return false;
        }

        // 4. For subsequent moves, 
        // checks if the tile is adjacent to existing tile
        const adjacentSquares = [
            { r: row - 1, c: col },   // above
            { r: row + 1, c: col },   // below
            { r: row, c: col - 1 },   // left
            { r: row, c: col + 1 }    // right
        ];

        // at least one adjacent square must contain a tile
        const isAdjacentToTile = adjacentSquares.some(({ r, c }) => {
            return r >= 0 && r < boardSize && c >= 0 && c < boardSize && board[r][c].tile !== null;
        });

        // If it's not the first move and the tile isn't 
        // adjacent to any other, it's invalid
        if (!isBoardEmpty && !isAdjacentToTile) {
            return false;
        }

        return true // All rules passed
    } 
   
    // Handles the drop event when a tile is dropped
    //  on a valid square
    const handleTheDrop = (e: React.DragEvent<HTMLDivElement>, row: number, col: number) => {
        e.preventDefault();
    
        const data = e.dataTransfer.getData('text/plain');
        const { tile, index } = JSON.parse(data) as { tile: Tile, index: number };
    
        const currentTilePosition = findTilePosition(tile);
        const fromRow = currentTilePosition.row;
        const fromCol = currentTilePosition.col;
    
        // Check if the tile placement is valid
        if (checkPlacementRules(board, row, col)) {
            if (fromRow !== -1 && fromCol !== -1) {
                moveTile(fromRow, fromCol, row, col)
                removeTileFromBoard(fromRow, fromCol)
            } else {
                removeTileFromRack(index)
                placeTile(row, col, tile);
            }
    
            // Place the tile at the new position
            handleTilePlaced(index);
        } else {
            triggerTileShake(index);
            toast({
                variant: "destructive",
                title: "Uh oh! Invalid move",
                description: "Check tile placement.",
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            });
        }
    }
    

    const findTilePosition = (tile: Tile) => {
        for (let row = 0; row < board.length; row++) {
            for (let col = 0; col < board[row].length; col++) {
                if (board[row][col].tile === tile) {
                    return { row, col };
                }
            }
        }
        return { row: -1, col: -1 }; // Tile not found
    }

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


    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, row: number, col: number, tile: Tile) => {
        const data = JSON.stringify({tile, fromRow: row, fromCol: col})
        e.dataTransfer.setData('text/plain', data)
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(15, 40px)',
            gap: '5px',
            width: 'fit-content',
            margin: 'auto'
        }}>
            {board.map((row, rowIndex) =>
                row.map((square, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        onDrop={(e) => handleTheDrop(e, rowIndex, colIndex)}
                        onDragOver={handleDragOver}
                        style={{
                            width: '40px',
                            height: '40px',
                            border: '1px solid black',
                            ...getSquareStyle(square),
                        }}
                    >
                        {square?.tile ? (
                            <ATile
                                tile={square.tile}
                                index={square.tile.id} // Ensure index is accessible
                                triggerTileShake={triggerTileShake}
                            />
                        ) : null}
                    </div>
                ))
            )}
        </div>
    )
}
