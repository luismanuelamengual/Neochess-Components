import {Match} from "@neochess/engine/dist/match";
import {Piece, Square} from "@neochess/engine";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host{
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background: white;
        }

        .board, .board * {
            box-sizing: border-box;
        }

        .board {
            position: absolute;
            background: darkseagreen;
            padding: 20px;
            border-radius: 20px;
        }

        .board-content {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            border-radius: 10px;
        }

        .square {
            position: absolute;
            width: 12.5%;
            height: 12.5%;
        }

        .square-light {
            background: white;
        }

        .square-dark {
            background: darkseagreen;
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

        .flipped .square-a1 { left: 87.5%; top: 0; }
        .flipped .square-b1 { left: 75%; top: 0; }
        .flipped .square-c1 { left: 62.5%; top: 0; }
        .flipped .square-d1 { left: 50%; top: 0; }
        .flipped .square-e1 { left: 37.5%; top: 0; }
        .flipped .square-f1 { left: 25%; top: 0; }
        .flipped .square-g1 { left: 12.5%; top: 0; }
        .flipped .square-h1 { left: 0; top: 0; }

        .flipped .square-a2 { left: 87.5%; top: 12.5%; }
        .flipped .square-b2 { left: 75%; top: 12.5%; }
        .flipped .square-c2 { left: 62.5%; top: 12.5%; }
        .flipped .square-d2 { left: 50%; top: 12.5%; }
        .flipped .square-e2 { left: 37.5%; top: 12.5%; }
        .flipped .square-f2 { left: 25%; top: 12.5%; }
        .flipped .square-g2 { left: 12.5%; top: 12.5%; }
        .flipped .square-h2 { left: 0; top: 12.5%; }

        .flipped .square-a3 { left: 87.5%; top: 25%; }
        .flipped .square-b3 { left: 75%; top: 25%; }
        .flipped .square-c3 { left: 62.5%; top: 25%; }
        .flipped .square-d3 { left: 50%; top: 25%; }
        .flipped .square-e3 { left: 37.5%; top: 25%; }
        .flipped .square-f3 { left: 25%; top: 25%; }
        .flipped .square-g3 { left: 12.5%; top: 25%; }
        .flipped .square-h3 { left: 0; top: 25%; }

        .flipped .square-a4 { left: 87.5%; top: 37.5%; }
        .flipped .square-b4 { left: 75%; top: 37.5%; }
        .flipped .square-c4 { left: 62.5%; top: 37.5%; }
        .flipped .square-d4 { left: 50%; top: 37.5%; }
        .flipped .square-e4 { left: 37.5%; top: 37.5%; }
        .flipped .square-f4 { left: 25%; top: 37.5%; }
        .flipped .square-g4 { left: 12.5%; top: 37.5%; }
        .flipped .square-h4 { left: 0; top: 37.5%; }

        .flipped .square-a5 { left: 87.5%; top: 50%; }
        .flipped .square-b5 { left: 75%; top: 50%; }
        .flipped .square-c5 { left: 62.5%; top: 50%; }
        .flipped .square-d5 { left: 50%; top: 50%; }
        .flipped .square-e5 { left: 37.5%; top: 50%; }
        .flipped .square-f5 { left: 25%; top: 50%; }
        .flipped .square-g5 { left: 12.5%; top: 50%; }
        .flipped .square-h5 { left: 0; top: 50%; }

        .flipped .square-a6 { left: 87.5%; top: 62.5%; }
        .flipped .square-b6 { left: 75%; top: 62.5%; }
        .flipped .square-c6 { left: 62.5%; top: 62.5%; }
        .flipped .square-d6 { left: 50%; top: 62.5%; }
        .flipped .square-e6 { left: 37.5%; top: 62.5%; }
        .flipped .square-f6 { left: 25%; top: 62.5%; }
        .flipped .square-g6 { left: 12.5%; top: 62.5%; }
        .flipped .square-h6 { left: 0; top: 62.5%; }

        .flipped .square-a7 { left: 87.5%; top: 75%; }
        .flipped .square-b7 { left: 75%; top: 75%; }
        .flipped .square-c7 { left: 62.5%; top: 75%; }
        .flipped .square-d7 { left: 50%; top: 75%; }
        .flipped .square-e7 { left: 37.5%; top: 75%; }
        .flipped .square-f7 { left: 25%; top: 75%; }
        .flipped .square-g7 { left: 12.5%; top: 75%; }
        .flipped .square-h7 { left: 0; top: 75%; }

        .flipped .square-a8 { left: 87.5%; top: 87.5%; }
        .flipped .square-b8 { left: 75%; top: 87.5%; }
        .flipped .square-c8 { left: 62.5%; top: 87.5%; }
        .flipped .square-d8 { left: 50%; top: 87.5%; }
        .flipped .square-e8 { left: 37.5%; top: 87.5%; }
        .flipped .square-f8 { left: 25%; top: 87.5%; }
        .flipped .square-g8 { left: 12.5%; top: 87.5%; }
        .flipped .square-h8 { left: 0; top: 87.5%; }

        .piece {
            background-size: contain;
            background-repeat: no-repeat;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .piece-white-pawn {
            background-image: url(` + require('./assets/images/pieces/white_pawn.svg') + `);
        }

        .piece-white-knight {
            background-image: url(` + require('./assets/images/pieces/white_knight.svg') + `);
        }

        .piece-white-bishop {
            background-image: url(` + require('./assets/images/pieces/white_bishop.svg') + `);
        }

        .piece-white-rook {
            background-image: url(` + require('./assets/images/pieces/white_rook.svg') + `);
        }

        .piece-white-queen {
            background-image: url(` + require('./assets/images/pieces/white_queen.svg') + `);
        }

        .piece-white-king {
            background-image: url(` + require('./assets/images/pieces/white_king.svg') + `);
        }

        .piece-black-pawn {
            background-image: url(` + require('./assets/images/pieces/black_pawn.svg') + `);
        }

        .piece-black-knight {
            background-image: url(` + require('./assets/images/pieces/black_knight.svg') + `);
        }

        .piece-black-bishop {
            background-image: url(` + require('./assets/images/pieces/black_bishop.svg') + `);
        }

        .piece-black-rook {
            background-image: url(` + require('./assets/images/pieces/black_rook.svg') + `);
        }

        .piece-black-queen {
            background-image: url(` + require('./assets/images/pieces/black_queen.svg') + `);
        }

        .piece-black-king {
            background-image: url(` + require('./assets/images/pieces/black_king.svg') + `);
        }
    </style>

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
`;

export class NeochessBoardElement extends HTMLElement {

    private match: Match;
    private flipped: boolean = false;

    constructor() {
        super();
        this.match = new Match();
        this.appendChild(template.content.cloneNode(true));
        if (this.getAttribute('flipped') === 'true') {
            this.setFlipped(true);
        }
        this.updatePosition();
        this.updateState();
        window.onresize = () => this.updatePosition();
    }

    public setFlipped(flipped: boolean): void {
        this.flipped = flipped;
        const boardElement = this.querySelector('.board');
        if (flipped) {
            boardElement.classList.add('flipped');
        } else {
            boardElement.classList.remove('flipped');
        }
    }

    public isFlipped(): boolean {
        return this.flipped;
    }

    private updatePosition() {
        const boardElement = this.querySelector('.board') as HTMLElement;
        if (this.offsetWidth >= this.offsetHeight) {
            boardElement.style.top = '0';
            boardElement.style.left = ((this.offsetWidth / 2) - (this.offsetHeight / 2)) + 'px';
            boardElement.style.height = '100%';
            boardElement.style.width = this.offsetHeight + 'px';
        } else {
            boardElement.style.top = ((this.offsetHeight / 2) - (this.offsetWidth / 2)) + 'px';
            boardElement.style.left = '0';
            boardElement.style.width = '100%';
            boardElement.style.height = this.offsetWidth + 'px';
        }
    }

    private updateState() {
        const squareElements = this.querySelectorAll('.square');
        for (let square = Square.A1; square <= Square.H8; square++) {
            const squareElement = squareElements[square] as HTMLElement;
            const piece = this.match.getPiece(square);
            let pieceElement = squareElement.querySelector('.piece');
            if (piece >= 0) {
                let pieceClassName = '';
                switch (piece) {
                    case Piece.WHITE_PAWN: pieceClassName = 'piece-white-pawn'; break;
                    case Piece.WHITE_KNIGHT: pieceClassName = 'piece-white-knight'; break;
                    case Piece.WHITE_BISHOP: pieceClassName = 'piece-white-bishop'; break;
                    case Piece.WHITE_ROOK: pieceClassName = 'piece-white-rook'; break;
                    case Piece.WHITE_QUEEN: pieceClassName = 'piece-white-queen'; break;
                    case Piece.WHITE_KING: pieceClassName = 'piece-white-king'; break;
                    case Piece.BLACK_PAWN: pieceClassName = 'piece-black-pawn'; break;
                    case Piece.BLACK_KNIGHT: pieceClassName = 'piece-black-knight'; break;
                    case Piece.BLACK_BISHOP: pieceClassName = 'piece-black-bishop'; break;
                    case Piece.BLACK_ROOK: pieceClassName = 'piece-black-rook'; break;
                    case Piece.BLACK_QUEEN: pieceClassName = 'piece-black-queen'; break;
                    case Piece.BLACK_KING: pieceClassName = 'piece-black-king'; break;
                }
                if (pieceElement) {
                    if (!pieceElement.classList.contains(pieceClassName)) {
                        pieceElement.className = 'piece ' + pieceClassName;
                    }
                } else {
                    pieceElement = document.createElement('div');
                    pieceElement.classList.add('piece', pieceClassName);
                    squareElement.appendChild(pieceElement);
                }
            } else {
                if (pieceElement) {
                    pieceElement.remove();
                }
            }
        }
    }
}

if (!customElements.get('neochess-board')) {
    customElements.define('neochess-board', NeochessBoardElement);
}
