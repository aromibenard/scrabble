import { GameState } from "@/types/logic";
import { create }  from "zustand";

export const useGameStore = create<GameState>((set) => ({
    board: Array(15).fill(null).map(() => Array(15).fill(null)),
    tileBag: generateTileBag(),
    tileRack: [],

    // actions
    drawTiles: (num) => set((state) => {
        const newTiles = state.tileBag.splice(0, num)
        return { tileRack: [...state.tileRack, ...newTiles]}
    }),

    placeTile: (row, col, tile) => set((state) => {
        const newBoard = [...state.board];
        newBoard[row][col] = tile;
        return { board: newBoard };
    }),
}))

function generateTileBag() {
    return [
      // 1 Point Tiles
      ...Array(12).fill({ letter: 'E', points: 1 }),
      ...Array(9).fill({ letter: 'A', points: 1 }),
      ...Array(9).fill({ letter: 'I', points: 1 }),
      ...Array(8).fill({ letter: 'O', points: 1 }),
      ...Array(6).fill({ letter: 'N', points: 1 }),
      ...Array(6).fill({ letter: 'R', points: 1 }),
      ...Array(6).fill({ letter: 'T', points: 1 }),
      ...Array(4).fill({ letter: 'L', points: 1 }),
      ...Array(4).fill({ letter: 'S', points: 1 }),
      ...Array(4).fill({ letter: 'U', points: 1 }),
  
      // 2 Point Tiles
      ...Array(4).fill({ letter: 'D', points: 2 }),
      ...Array(3).fill({ letter: 'G', points: 2 }),
  
      // 3 Point Tiles
      ...Array(2).fill({ letter: 'B', points: 3 }),
      ...Array(2).fill({ letter: 'C', points: 3 }),
      ...Array(2).fill({ letter: 'M', points: 3 }),
      ...Array(2).fill({ letter: 'P', points: 3 }),
  
      // 4 Point Tiles
      ...Array(2).fill({ letter: 'F', points: 4 }),
      ...Array(2).fill({ letter: 'H', points: 4 }),
      ...Array(2).fill({ letter: 'V', points: 4 }),
      ...Array(2).fill({ letter: 'W', points: 4 }),
      ...Array(2).fill({ letter: 'Y', points: 4 }),
  
      // 5 Point Tile
      { letter: 'K', points: 5 },
  
      // 8 Point Tiles
      { letter: 'J', points: 8 },
      { letter: 'X', points: 8 },
  
      // 10 Point Tiles
      { letter: 'Q', points: 10 },
      { letter: 'Z', points: 10 },
  
      // Blank Tiles (0 points)
      ...Array(2).fill({ letter: '', points: 0 }),
    ];
}
  