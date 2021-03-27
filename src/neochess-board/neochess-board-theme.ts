import {NeochessBoardPieceset} from "./neochess-board-pieceset";

export interface NeochessBoardTheme {
    boardImageUrl?: string;
    boardColor?: string;
    boardPadding?: number;
    lightSquareColor?: string;
    darkSquareColor?: string;
    pieceSet?: NeochessBoardPieceset;
    coordinatesColor?: string;
    selectedSquareColor?: string;
    selectedSquareOpacity?: number;
    lastMoveArrowColor?: string;
    lastMoveArrowOpacity?: number;
    destinationSquareColor?: string;
    destinationSquareOpacity?: number;
    highlightedSquareColor?: string;
    highlightedSquareOpacity?: number;
    arrowsColor?: string;
    arrowsOpacity?: number;
}
