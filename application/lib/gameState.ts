import { GameState, Square, Tile } from "@/types/logic";
import { create }  from "zustand";

export const useGameStore = create<GameState>((set) => ({
    tileBag: generateTileBag(),
    tileRack: [],
    board: generateBoard(),
    tilesToShake: new Set<number>(),

    // actions
    drawTiles: (num) => set((state) => {
        const newTileRack = [...state.tileRack]
        const remainingTileBag = [...state.tileBag]
        const drawnTiles: Tile[] = []

        for(let i = 0; i < num && remainingTileBag.length > 0; i++) {
            const randomIndex = Math.floor(Math.random() * remainingTileBag.length)
            
            // removes tile from the bag
            const [tile] = remainingTileBag.splice(randomIndex, 1)
            drawnTiles.push(tile)
        }

        return {
            tileRack: [...newTileRack, ...drawnTiles],
            tileBag: remainingTileBag
        }
    }),

    placeTile: (row, col, tile) => set((state) => {
        const newBoard = [...state.board];
        
        if (!newBoard[row][col]?.tile) {
            newBoard[row][col] = { ...newBoard[row][col], tile };
        }
        return { board: newBoard };
    }),

    removeTileFromRack: (index: number) => set((state) => {
        const newTileRack = [...state.tileRack];
        newTileRack.splice(index, 1);
        return { tileRack: newTileRack };
    }),

    triggerTileShake: (index: number) => set((state) => {
        const updatedTilesToShake = new Set(state.tilesToShake)
        updatedTilesToShake.add(index)

        setTimeout(() => {
            updatedTilesToShake.delete(index);
            set({ tilesToShake: updatedTilesToShake });
        }, 500)
        
        return { tilesToShake: updatedTilesToShake }
    }),
}))

function generateBoard(): Square[][] {
    const board: Square[][] = Array(15).fill(null).map(() =>
        Array(15).fill(null).map(() => ({
            type: 'normal',
            tile: null
        }))
    )

    const tripleWord = [[0, 0], [0, 7], [0, 14], [7, 0], [7, 14], [14, 0], [14, 7], [14, 14]]
    const doubleWord = [[1, 1], [1, 13], [2, 2], [2, 12], [3, 3], [3, 11], [4, 4], [4, 10], [10, 4], [10, 10], [11, 3], [11, 11], [12, 2], [12, 12],[13, 1], [13, 13]]
    const tripleLetter = [[1, 5], [1, 9], [5, 1], [5, 5], [5, 9], [9, 1], [9, 5], [9, 9], [9, 13], [13, 5], [5, 13], [13, 9]]
    const doubleLetter = [[0, 3], [0, 11], [2, 6], [2, 8], [3, 0], [3, 7], [3, 14], [6, 2], [6, 6], [6, 8], [6, 12], [7, 3], [7, 11], [8, 2], [8, 6], [8, 8], [8, 12], [11, 0], [11, 7], [11, 14], [12, 6], [12, 8], [14, 3], [14, 11]]

    // Setting special squares
    tripleWord.forEach(([row, col]) => board[row][col].type = 'triple-word')
    doubleWord.forEach(([row, col]) => board[row][col].type = 'double-word')
    tripleLetter.forEach(([row, col]) => board[row][col].type = 'triple-letter')
    doubleLetter.forEach(([row, col]) => board[row][col].type = 'double-letter')

    // Start square
    board[7][7].type = 'start'

    return board
}

function generateTileBag() {
    const tiles = [
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
    ]
    return shuffleLetters(tiles)
}

function shuffleLetters(array: any[]) {
    let currentIndex = array.length, randomIndex

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex--

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]]
    }

    return array
}
  