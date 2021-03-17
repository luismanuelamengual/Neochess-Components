import {Match} from "@neochess/engine/dist/match";
import {BoardUtils, Piece, Square} from "@neochess/engine";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        neochess-board {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            padding: 20px;
            background: white;
            overflow: auto;
        }

        neochess-board, neochess-board * {
            box-sizing: border-box;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-tap-highlight-color:transparent;
        }

        .board-container {
            width: 100%;
            padding-bottom: 100%;
            position: relative;
        }

        .board {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: darkseagreen;
            padding: 16px;
            border-radius: 16px;
        }

        .board-content {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 8px;
        }

        .square {
            position: absolute;
            width: 12.5%;
            height: 12.5%;
        }

        .square-white-pawn {
            background: url(` + require('./assets/images/pieces/white_pawn.svg') + `) 0/contain no-repeat;
        }

        .square-white-knight {
            background: url(` + require('./assets/images/pieces/white_knight.svg') + `) 0/contain no-repeat;
        }

        .square-white-bishop {
            background: url(` + require('./assets/images/pieces/white_bishop.svg') + `) 0/contain no-repeat;
        }

        .square-white-rook {
            background: url(` + require('./assets/images/pieces/white_rook.svg') + `) 0/contain no-repeat;
        }

        .square-white-queen {
            background: url(` + require('./assets/images/pieces/white_queen.svg') + `) 0/contain no-repeat;
        }

        .square-white-king {
            background: url(` + require('./assets/images/pieces/white_king.svg') + `) 0/contain no-repeat;
        }

        .square-black-pawn {
            background: url(` + require('./assets/images/pieces/black_pawn.svg') + `) 0/contain no-repeat;
        }

        .square-black-knight {
            background: url(` + require('./assets/images/pieces/black_knight.svg') + `) 0/contain no-repeat;
        }

        .square-black-bishop {
            background: url(` + require('./assets/images/pieces/black_bishop.svg') + `) 0/contain no-repeat;
        }

        .square-black-rook {
            background: url(` + require('./assets/images/pieces/black_rook.svg') + `) 0/contain no-repeat;
        }

        .square-black-queen {
            background: url(` + require('./assets/images/pieces/black_queen.svg') + `) 0/contain no-repeat;
        }

        .square-black-king {
            background: url(` + require('./assets/images/pieces/black_king.svg') + `) 0/contain no-repeat;
        }

        .square-light {
            background-color: white;
        }

        .square-dark {
            background-color: darkseagreen;
        }

        .square-move-origin {
            background-color: gold;
        }

        .square-move-destination::after {
            content: '';
            top: 33%;
            left: 33%;
            bottom: 33%;
            right: 33%;
            border-radius: 50%;
            background-color: rgba(0,0,0,.1);
            position: absolute;
        }

        .square-a1 { left: 0; top: 87.5%; }
        .square-b1 { left: 12.5%; top: 87.5%; }
        .square-c1 { left: 25%; top: 87.5%; }
        .square-d1 { left: 37.5%; top: 87.5%; }
        .square-e1 { left: 50%; top: 87.5%; }
        .square-f1 { left: 62.5%; top: 87.5%; }
        .square-g1 { left: 75%; top: 87.5%; }
        .square-h1 { left: 87.5%; top: 87.5%; }
        .square-a2 { left: 0; top: 75%; }
        .square-b2 { left: 12.5%; top: 75%; }
        .square-c2 { left: 25%; top: 75%; }
        .square-d2 { left: 37.5%; top: 75%; }
        .square-e2 { left: 50%; top: 75%; }
        .square-f2 { left: 62.5%; top: 75%; }
        .square-g2 { left: 75%; top: 75%; }
        .square-h2 { left: 87.5%; top: 75%; }
        .square-a3 { left: 0; top: 62.5%; }
        .square-b3 { left: 12.5%; top: 62.5%; }
        .square-c3 { left: 25%; top: 62.5%; }
        .square-d3 { left: 37.5%; top: 62.5%; }
        .square-e3 { left: 50%; top: 62.5%; }
        .square-f3 { left: 62.5%; top: 62.5%; }
        .square-g3 { left: 75%; top: 62.5%; }
        .square-h3 { left: 87.5%; top: 62.5%; }
        .square-a4 { left: 0; top: 50%; }
        .square-b4 { left: 12.5%; top: 50%; }
        .square-c4 { left: 25%; top: 50%; }
        .square-d4 { left: 37.5%; top: 50%; }
        .square-e4 { left: 50%; top: 50%; }
        .square-f4 { left: 62.5%; top: 50%; }
        .square-g4 { left: 75%; top: 50%; }
        .square-h4 { left: 87.5%; top: 50%; }
        .square-a5 { left: 0; top: 37.5%; }
        .square-b5 { left: 12.5%; top: 37.5%; }
        .square-c5 { left: 25%; top: 37.5%; }
        .square-d5 { left: 37.5%; top: 37.5%; }
        .square-e5 { left: 50%; top: 37.5%; }
        .square-f5 { left: 62.5%; top: 37.5%; }
        .square-g5 { left: 75%; top: 37.5%; }
        .square-h5 { left: 87.5%; top: 37.5%; }
        .square-a6 { left: 0; top: 25%; }
        .square-b6 { left: 12.5%; top: 25%; }
        .square-c6 { left: 25%; top: 25%; }
        .square-d6 { left: 37.5%; top: 25%; }
        .square-e6 { left: 50%; top: 25%; }
        .square-f6 { left: 62.5%; top: 25%; }
        .square-g6 { left: 75%; top: 25%; }
        .square-h6 { left: 87.5%; top: 25%; }
        .square-a7 { left: 0; top: 12.5%; }
        .square-b7 { left: 12.5%; top: 12.5%; }
        .square-c7 { left: 25%; top: 12.5%; }
        .square-d7 { left: 37.5%; top: 12.5%; }
        .square-e7 { left: 50%; top: 12.5%; }
        .square-f7 { left: 62.5%; top: 12.5%; }
        .square-g7 { left: 75%; top: 12.5%; }
        .square-h7 { left: 87.5%; top: 12.5%; }
        .square-a8 { left: 0; top: 0; }
        .square-b8 { left: 12.5%; top: 0; }
        .square-c8 { left: 25%; top: 0; }
        .square-d8 { left: 37.5%; top: 0; }
        .square-e8 { left: 50%; top: 0; }
        .square-f8 { left: 62.5%; top: 0; }
        .square-g8 { left: 75%; top: 0; }
        .square-h8 { left: 87.5%; top: 0; }

        .board-flipped .square-a1 { left: 87.5%; top: 0; }
        .board-flipped .square-b1 { left: 75%; top: 0; }
        .board-flipped .square-c1 { left: 62.5%; top: 0; }
        .board-flipped .square-d1 { left: 50%; top: 0; }
        .board-flipped .square-e1 { left: 37.5%; top: 0; }
        .board-flipped .square-f1 { left: 25%; top: 0; }
        .board-flipped .square-g1 { left: 12.5%; top: 0; }
        .board-flipped .square-h1 { left: 0; top: 0; }
        .board-flipped .square-a2 { left: 87.5%; top: 12.5%; }
        .board-flipped .square-b2 { left: 75%; top: 12.5%; }
        .board-flipped .square-c2 { left: 62.5%; top: 12.5%; }
        .board-flipped .square-d2 { left: 50%; top: 12.5%; }
        .board-flipped .square-e2 { left: 37.5%; top: 12.5%; }
        .board-flipped .square-f2 { left: 25%; top: 12.5%; }
        .board-flipped .square-g2 { left: 12.5%; top: 12.5%; }
        .board-flipped .square-h2 { left: 0; top: 12.5%; }
        .board-flipped .square-a3 { left: 87.5%; top: 25%; }
        .board-flipped .square-b3 { left: 75%; top: 25%; }
        .board-flipped .square-c3 { left: 62.5%; top: 25%; }
        .board-flipped .square-d3 { left: 50%; top: 25%; }
        .board-flipped .square-e3 { left: 37.5%; top: 25%; }
        .board-flipped .square-f3 { left: 25%; top: 25%; }
        .board-flipped .square-g3 { left: 12.5%; top: 25%; }
        .board-flipped .square-h3 { left: 0; top: 25%; }
        .board-flipped .square-a4 { left: 87.5%; top: 37.5%; }
        .board-flipped .square-b4 { left: 75%; top: 37.5%; }
        .board-flipped .square-c4 { left: 62.5%; top: 37.5%; }
        .board-flipped .square-d4 { left: 50%; top: 37.5%; }
        .board-flipped .square-e4 { left: 37.5%; top: 37.5%; }
        .board-flipped .square-f4 { left: 25%; top: 37.5%; }
        .board-flipped .square-g4 { left: 12.5%; top: 37.5%; }
        .board-flipped .square-h4 { left: 0; top: 37.5%; }
        .board-flipped .square-a5 { left: 87.5%; top: 50%; }
        .board-flipped .square-b5 { left: 75%; top: 50%; }
        .board-flipped .square-c5 { left: 62.5%; top: 50%; }
        .board-flipped .square-d5 { left: 50%; top: 50%; }
        .board-flipped .square-e5 { left: 37.5%; top: 50%; }
        .board-flipped .square-f5 { left: 25%; top: 50%; }
        .board-flipped .square-g5 { left: 12.5%; top: 50%; }
        .board-flipped .square-h5 { left: 0; top: 50%; }
        .board-flipped .square-a6 { left: 87.5%; top: 62.5%; }
        .board-flipped .square-b6 { left: 75%; top: 62.5%; }
        .board-flipped .square-c6 { left: 62.5%; top: 62.5%; }
        .board-flipped .square-d6 { left: 50%; top: 62.5%; }
        .board-flipped .square-e6 { left: 37.5%; top: 62.5%; }
        .board-flipped .square-f6 { left: 25%; top: 62.5%; }
        .board-flipped .square-g6 { left: 12.5%; top: 62.5%; }
        .board-flipped .square-h6 { left: 0; top: 62.5%; }
        .board-flipped .square-a7 { left: 87.5%; top: 75%; }
        .board-flipped .square-b7 { left: 75%; top: 75%; }
        .board-flipped .square-c7 { left: 62.5%; top: 75%; }
        .board-flipped .square-d7 { left: 50%; top: 75%; }
        .board-flipped .square-e7 { left: 37.5%; top: 75%; }
        .board-flipped .square-f7 { left: 25%; top: 75%; }
        .board-flipped .square-g7 { left: 12.5%; top: 75%; }
        .board-flipped .square-h7 { left: 0; top: 75%; }
        .board-flipped .square-a8 { left: 87.5%; top: 87.5%; }
        .board-flipped .square-b8 { left: 75%; top: 87.5%; }
        .board-flipped .square-c8 { left: 62.5%; top: 87.5%; }
        .board-flipped .square-d8 { left: 50%; top: 87.5%; }
        .board-flipped .square-e8 { left: 37.5%; top: 87.5%; }
        .board-flipped .square-f8 { left: 25%; top: 87.5%; }
        .board-flipped .square-g8 { left: 12.5%; top: 87.5%; }
        .board-flipped .square-h8 { left: 0; top: 87.5%; }
    </style>

    <div class="board-container">
        <div class="board">
            <div class="board-content">
                <div class="square square-dark square-a1"></div><div class="square square-light square-b1"></div><div class="square square-dark square-c1"></div><div class="square square-light square-d1"></div><div class="square square-dark square-e1"></div><div class="square square-light square-f1"></div><div class="square square-dark square-g1"></div><div class="square square-light square-h1"></div>
                <div class="square square-light square-a2"></div><div class="square square-dark square-b2"></div><div class="square square-light square-c2"></div><div class="square square-dark square-d2"></div><div class="square square-light square-e2"></div><div class="square square-dark square-f2"></div><div class="square square-light square-g2"></div><div class="square square-dark square-h2"></div>
                <div class="square square-dark square-a3"></div><div class="square square-light square-b3"></div><div class="square square-dark square-c3"></div><div class="square square-light square-d3"></div><div class="square square-dark square-e3"></div><div class="square square-light square-f3"></div><div class="square square-dark square-g3"></div><div class="square square-light square-h3"></div>
                <div class="square square-light square-a4"></div><div class="square square-dark square-b4"></div><div class="square square-light square-c4"></div><div class="square square-dark square-d4"></div><div class="square square-light square-e4"></div><div class="square square-dark square-f4"></div><div class="square square-light square-g4"></div><div class="square square-dark square-h4"></div>
                <div class="square square-dark square-a5"></div><div class="square square-light square-b5"></div><div class="square square-dark square-c5"></div><div class="square square-light square-d5"></div><div class="square square-dark square-e5"></div><div class="square square-light square-f5"></div><div class="square square-dark square-g5"></div><div class="square square-light square-h5"></div>
                <div class="square square-light square-a6"></div><div class="square square-dark square-b6"></div><div class="square square-light square-c6"></div><div class="square square-dark square-d6"></div><div class="square square-light square-e6"></div><div class="square square-dark square-f6"></div><div class="square square-light square-g6"></div><div class="square square-dark square-h6"></div>
                <div class="square square-dark square-a7"></div><div class="square square-light square-b7"></div><div class="square square-dark square-c7"></div><div class="square square-light square-d7"></div><div class="square square-dark square-e7"></div><div class="square square-light square-f7"></div><div class="square square-dark square-g7"></div><div class="square square-light square-h7"></div>
                <div class="square square-light square-a8"></div><div class="square square-dark square-b8"></div><div class="square square-light square-c8"></div><div class="square square-dark square-d8"></div><div class="square square-light square-e8"></div><div class="square square-dark square-f8"></div><div class="square square-light square-g8"></div><div class="square square-dark square-h8"></div>
            </div>
        </div>
    </div>
`;

export class NeochessBoardElement extends HTMLElement {

    private match: Match;
    private flipped: boolean = false;

    constructor() {
        super();
        this.match = new Match();
        this.flipped = this.getAttribute('flipped') === 'true';
        this.appendChild(template.content.cloneNode(true));
        this.updateState();
        this.configureEvents();
    }

    public setFlipped(flipped: boolean): void {
        this.flipped = flipped;
        this.updateFlipState();
    }

    public isFlipped(): boolean {
        return this.flipped;
    }

    private configureEvents() {
        this.addEventListener('contextmenu', (event) => {
            event.preventDefault();
        });
        this.addEventListener('click', () => {
            this.clearLegalMoves();
        });
        this.querySelectorAll('.square').forEach((squareElement: HTMLElement, square: Square) => {
            squareElement.addEventListener('click', (event) => {
                const piece = this.match.getPiece(square);
                if (BoardUtils.getSide(piece) == this.match.getSideToMove()) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.showLegalMoves(square);
                }
            });
        });
    }

    private updateState() {
        this.updateFlipState();
        this.updateMatchState();
    }

    private updateMatchState() {
        const squareElements = this.querySelectorAll('.square');
        for (let square = Square.A1; square <= Square.H8; square++) {
            const squareElement = squareElements[square] as HTMLElement;
            let pieceClassName = null;
            const piece = this.match.getPiece(square);
            switch (piece) {
                case Piece.WHITE_PAWN: pieceClassName = 'square-white-pawn'; break;
                case Piece.WHITE_KNIGHT: pieceClassName = 'square-white-knight'; break;
                case Piece.WHITE_BISHOP: pieceClassName = 'square-white-bishop'; break;
                case Piece.WHITE_ROOK: pieceClassName = 'square-white-rook'; break;
                case Piece.WHITE_QUEEN: pieceClassName = 'square-white-queen'; break;
                case Piece.WHITE_KING: pieceClassName = 'square-white-king'; break;
                case Piece.BLACK_PAWN: pieceClassName = 'square-black-pawn'; break;
                case Piece.BLACK_KNIGHT: pieceClassName = 'square-black-knight'; break;
                case Piece.BLACK_BISHOP: pieceClassName = 'square-black-bishop'; break;
                case Piece.BLACK_ROOK: pieceClassName = 'square-black-rook'; break;
                case Piece.BLACK_QUEEN: pieceClassName = 'square-black-queen'; break;
                case Piece.BLACK_KING: pieceClassName = 'square-black-king'; break;
            }
            squareElement.classList.remove('square-white-pawn', 'square-white-knight', 'square-white-bishop', 'square-white-rook', 'square-white-queen', 'square-white-king', 'square-black-pawn', 'square-black-knight', 'square-black-bishop', 'square-black-rook', 'square-black-queen', 'square-black-king');
            if (pieceClassName) {
                squareElement.classList.add(pieceClassName);
            }
        }
    }

    private updateFlipState() {
        const boardElement = this.querySelector('.board');
        if (this.flipped) {
            boardElement.classList.add('board-flipped');
        } else {
            boardElement.classList.remove('board-flipped');
        }
    }

    private showLegalMoves(square: Square) {
        const squareElements = this.querySelectorAll('.square');
        this.clearLegalMoves();
        const originSquareElement = squareElements[square] as HTMLElement;
        const destinationSquares = this.match.getLegalMoves().filter((move) => move.getFromSquare() === square).map((move) => move.getToSquare());
        originSquareElement.classList.add('square-move-origin');
        for (const destinationSquare of destinationSquares) {
            const destinationSquareElement = squareElements[destinationSquare];
            destinationSquareElement.classList.add('square-move-destination');
            if (this.match.getPiece(destinationSquare) >= 0) {
                destinationSquareElement.classList.add('square-move-destination-capture');
            }
        }
    }

    private clearLegalMoves() {
        this.querySelectorAll('.square-move-origin').forEach((element: HTMLElement) => {
            element.classList.remove('square-move-origin');
        });
        this.querySelectorAll('.square-move-destination').forEach((element: HTMLElement) => {
            element.classList.remove('square-move-destination', 'square-move-destination-capture');
        });
    }
}

if (!customElements.get('neochess-board')) {
    customElements.define('neochess-board', NeochessBoardElement);
}
