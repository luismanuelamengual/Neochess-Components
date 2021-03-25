import {NeochessBoardPieceset} from "./neochess-board-pieceset";

export interface NeochessBoardTheme {
    boardImageUrl?: string;
    boardBackgroundColor?: string;
    boardPadding?: number;
    squareLightColor?: string;
    squareDarkColor?: string;
    pieceSet?: NeochessBoardPieceset;
    coordinatesVisible?: boolean;
    coordinatesColor?: string;
}
