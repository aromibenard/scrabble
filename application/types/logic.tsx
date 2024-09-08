//a cell can either have a tile or not
export type Tile = {
    letter: string
    points: number
} | null

// Each element of the board can either be a tile 
// (which contains a letter and its points) or null 
// if the space is empty.
export type BoardType = Tile[][]

export interface GameState {
    board: BoardType;
    tileBag: Tile[];
    tileRack: Tile[];
    drawTiles: (num: number) => void;
    placeTile: (row: number, col: number, tile: Tile) => void;
}