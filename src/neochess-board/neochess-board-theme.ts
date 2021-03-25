import {NeochessBoardPieceset} from "./neochess-board-pieceset";

export interface NeochessBoardTheme {
    boardImageUrl?: string;
    boardColor?: string;
    boardPadding?: number;
    lightSquareColor?: string;
    darkSquareColor?: string;
    pieceSet?: NeochessBoardPieceset;
    coordinatesVisible?: boolean;
    coordinatesColor?: string;
    selectedSquareColor?: string;
    selectedSquareOpacity?: number;
    lastMoveSquareColor?: string;
    lastMoveSquareOpacity?: number;
}
