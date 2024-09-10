export type Tile = {
    id: number
    letter: string
    points: number
} | null

export type SquareType = 'normal' | 'double-letter' | 'triple-letter' | 'double-word' | 'triple-word' | 'start'

export interface Square {
    type: SquareType
    tile: Tile | null
}

export type BoardType = Square[][]

export interface GameState {
    board: BoardType;
    tileBag: Tile[];
    tileRack: Tile[];
    // tileIndexes: Map<Tile, number>;
    drawTiles: (num: number) => void;
    placeTile: (row: number, col: number, tile: Tile) => void;
    removeTileFromRack: (index: number) => void
    tilesToShake: Set<number>
    triggerTileShake: (index: number) => void
    handleTilePlaced: (index: number) => void
    tiles: {[index: number]: Tile}
    moveTile: (fromRow: number, fromCol:number, 
        toRow: number, toCol: number) => void
    removeTileFromBoard: (row: number, col:number) => void
    // setTileIndexes: (tile: Tile, index: number) => void
}
