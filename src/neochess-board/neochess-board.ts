import {BoardUtils, Figure, Match, Move, Piece, Square} from "@neochess/core";
import {NeochessBoardTheme} from "./neochess-board-theme";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            width: 500px;
            height: 500px;
            border: 1px solid lightgray;
            -webkit-box-shadow: 3px 3px 4px -2px rgba(0,0,0,0.75);
            -moz-box-shadow: 3px 3px 4px -2px rgba(0,0,0,0.75);
            box-shadow: 3px 3px 4px -2px rgba(0,0,0,0.75);
            overflow: auto;
        }

        :host, :host *, :host ::after, :host ::before {
            box-sizing: border-box;
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }

        .board-container {
            position: relative;
            width: 100%;
            padding-bottom: 100%;
        }

        .board {
            background: azure;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            padding: 12px;
        }

        .board-content {
            position: relative;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
        }

        .square {
            position: absolute;
            width: 12.5%;
            height: 12.5%;
        }

        .square-light {
            background-color: transparent;
        }

        .square-dark {
            background-color: lightblue;
        }

        .square-last-move-indicator::before {
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: palegoldenrod;
            opacity: 0.7;
        }

        .square-origin::after {
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: palegoldenrod;
            opacity: 0.7;
        }

        .square-destination::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-width: 4px;
            border-style: solid;
            border-color: lightgray;
            z-index: 120;
        }

        .square-destination-hint::after {
            content: '';
            top: 33%;
            left: 33%;
            bottom: 33%;
            right: 33%;
            border-radius: 50%;
            background-color: rgba(0,0,0,.1);
            position: absolute;
        }

        .square-destination-hint-capture::after {
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: transparent;
            border: 11px solid rgba(0,0,0,.1);
            border-radius: 50%;
        }

        .square-highlighted::after {
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: darkorange;
            opacity: 0.8;
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

        .board-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 150;
        }

        .coordinate {
            font-weight: 600;
        }

        .coordinate-light {
            fill: lightblue;
        }

        .coordinate-dark {
            fill: azure;
        }

        .arrow {
            fill: rgba(255, 123, 34, 0.6);
            stroke: orange;
            stroke-width: 0.5;
        }

        .piece {
            position: absolute;
            width: 12.5%;
            height: 12.5%;
            background-repeat: no-repeat;
            background-size: contain;
            background-position: center;
            pointer-events: none;
            z-index: 100;
            -webkit-transition: top 0.3s, left 0.3s;
            -moz-transition: top 0.3s, left 0.3s;
            -o-transition: top 0.3s, left 0.3s;
            transition: top 0.3s, left 0.3s;
        }

        .piece-white-pawn {
            background-image: url(` + require('./assets/images/pieces/white_pawn.png') + `);
        }

        .piece-white-knight {
            background-image: url(` + require('./assets/images/pieces/white_knight.png') + `);
        }

        .piece-white-bishop {
            background-image: url(` + require('./assets/images/pieces/white_bishop.png') + `);
        }

        .piece-white-rook {
            background-image: url(` + require('./assets/images/pieces/white_rook.png') + `);
        }

        .piece-white-queen {
            background-image: url(` + require('./assets/images/pieces/white_queen.png') + `);
        }

        .piece-white-king {
            background-image: url(` + require('./assets/images/pieces/white_king.png') + `);
        }

        .piece-black-pawn {
            background-image: url(` + require('./assets/images/pieces/black_pawn.png') + `);
        }

        .piece-black-knight {
            background-image: url(` + require('./assets/images/pieces/black_knight.png') + `);
        }

        .piece-black-bishop {
            background-image: url(` + require('./assets/images/pieces/black_bishop.png') + `);
        }

        .piece-black-rook {
            background-image: url(` + require('./assets/images/pieces/black_rook.png') + `);
        }

        .piece-black-queen {
            background-image: url(` + require('./assets/images/pieces/black_queen.png') + `);
        }

        .piece-black-king {
            background-image: url(` + require('./assets/images/pieces/black_king.png') + `);
        }

        .piece-dragging {
            z-index: 200;
            cursor: grabbing;
            -webkit-transition: none;
            -moz-transition: none;
            -o-transition: none;
            transition: none;
        }
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
                <svg viewBox="0 0 100 100" class="board-overlay" preserveAspectRatio="none"></svg>
            </div>
        </div>
    </div>
`;

export class NeochessBoardElement extends HTMLElement {

    private static SQUARE_CLASSES = [
        'square-a1', 'square-b1', 'square-c1', 'square-d1', 'square-e1', 'square-f1', 'square-g1', 'square-h1',
        'square-a2', 'square-b2', 'square-c2', 'square-d2', 'square-e2', 'square-f2', 'square-g2', 'square-h2',
        'square-a3', 'square-b3', 'square-c3', 'square-d3', 'square-e3', 'square-f3', 'square-g3', 'square-h3',
        'square-a4', 'square-b4', 'square-c4', 'square-d4', 'square-e4', 'square-f4', 'square-g4', 'square-h4',
        'square-a5', 'square-b5', 'square-c5', 'square-d5', 'square-e5', 'square-f5', 'square-g5', 'square-h5',
        'square-a6', 'square-b6', 'square-c6', 'square-d6', 'square-e6', 'square-f6', 'square-g6', 'square-h6',
        'square-a7', 'square-b7', 'square-c7', 'square-d7', 'square-e7', 'square-f7', 'square-g7', 'square-h7',
        'square-a8', 'square-b8', 'square-c8', 'square-d8', 'square-e8', 'square-f8', 'square-g8', 'square-h8'
    ];
    private static PIECE_CLASSES = [
        'piece-white-pawn', 'piece-white-knight', 'piece-white-bishop', 'piece-white-rook', 'piece-white-queen', 'piece-white-king',
        'piece-black-pawn', 'piece-black-knight', 'piece-black-bishop', 'piece-black-rook', 'piece-black-queen', 'piece-black-king'
    ];

    private match: Match;
    private flipped: boolean = false;
    private squareElements: Array<HTMLElement>;
    private moveData?: { fromSquare?: Square, toSquare?: Square, grabElement?: HTMLElement, grabXOffset?: number, grabYOffset?: number } = null;
    private highlightData?: { fromSquare?: Square, toSquare?: Square, element?: Element };

    constructor() {
        super();
        this.flipped = this.getAttribute('flipped') === 'true';
        this.match = new Match(this.getAttribute('fen'));
        this.onContextMenu = this.onContextMenu.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onPositionChange = this.onPositionChange.bind(this);
    }

    public connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.squareElements = [];
        this.shadowRoot.querySelectorAll('.square').forEach((squareElement: HTMLElement) => this.squareElements.push(squareElement));
        this.shadowRoot.addEventListener('contextmenu', this.onContextMenu);
        if (this.isTouchDevice()) {
            this.shadowRoot.addEventListener('touchstart', this.onDragStart);
        } else {
            this.shadowRoot.addEventListener('mousedown', this.onDragStart);
        }
        this.match.addEventListener('positionChange', this.onPositionChange);
        this.updateState();
        this.drawCoordinates();
    }

    public removeTheme() {
        const skinElement = this.shadowRoot.getElementById('skin');
        if (skinElement) {
            skinElement.remove();
        }
    }

    public setTheme(theme: NeochessBoardTheme) {
        this.removeTheme();
        let styleText = '';
        if (theme.boardColor || theme.boardPadding) {
            styleText += '.board {';
            if (theme.boardColor) {
                styleText += 'background: ' + theme.boardColor + ';';
            }
            if (theme.boardPadding >= 0) {
                styleText += 'padding: ' + theme.boardPadding + 'px;';
            }
            styleText += '}';
            if (theme.boardColor && !theme.lightSquareColor) {
                styleText += '.coordinate-dark { fill: ' + theme.boardColor + '; }';
            }
        }
        if (theme.boardImageUrl) {
            styleText += '.board-content { background: url(' + theme.boardImageUrl + ') 0/contain; } ';
            styleText += '.square-light { background-color: transparent }';
            styleText += '.square-dark { background-color: transparent }';
            if (!theme.coordinatesColor) {
                styleText += '.coordinate-dark, .coordinate-light { fill: white; }';
            }
        } else {
            if (theme.lightSquareColor) {
                styleText += '.square-light { background-color: ' + theme.lightSquareColor + '}';
                if (!theme.coordinatesColor) {
                    styleText += '.coordinate-dark { fill: ' + theme.lightSquareColor + '; }';
                }
            }
            if (theme.darkSquareColor) {
                styleText += '.square-dark { background-color: ' + theme.darkSquareColor + '}';
                if (!theme.coordinatesColor) {
                    styleText += '.coordinate-light { fill: ' + theme.darkSquareColor + '; }';
                }
            }
        }
        if (theme.coordinatesColor) {
            styleText += '.coordinate-dark, .coordinate-light { fill: ' + theme.coordinatesColor + '; }';
        }
        if (theme.coordinatesVisible === false) {
            styleText += '.coordinate { display: none; }';
        }
        if (theme.selectedSquareColor || theme.selectedSquareOpacity) {
            styleText += '.square-origin::after {';
            if (theme.selectedSquareColor) {
                styleText += 'background-color: ' + theme.selectedSquareColor + ';';
            }
            if (theme.selectedSquareOpacity) {
                styleText += 'opacity: ' + theme.selectedSquareOpacity + ';';
            }
            styleText += '}';
        }
        if (theme.lastMoveSquareColor || theme.lastMoveSquareOpacity) {
            styleText += '.square-last-move-indicator::before {';
            if (theme.lastMoveSquareColor) {
                styleText += 'background-color: ' + theme.lastMoveSquareColor + ';';
            }
            if (theme.lastMoveSquareOpacity) {
                styleText += 'opacity: ' + theme.lastMoveSquareOpacity + ';';
            }
            styleText += '}';
        }
        if (theme.destinationSquareColor || theme.destinationSquareOpacity) {
            styleText += '.square-destination::before {';
            if (theme.destinationSquareColor) {
                styleText += 'border-color: ' + theme.destinationSquareColor + ';';
            }
            if (theme.destinationSquareOpacity) {
                styleText += 'opacity: ' + theme.destinationSquareOpacity + ';';
            }
            styleText += '}';
        }
        if (theme.pieceSet) {
            styleText += '.piece-white-pawn { background-image: url(' + theme.pieceSet.whitePawnImageUrl + '); }';
            styleText += '.piece-white-knight { background-image: url(' + theme.pieceSet.whiteKnightImageUrl + '); }';
            styleText += '.piece-white-bishop { background-image: url(' + theme.pieceSet.whiteBishopImageUrl + '); }';
            styleText += '.piece-white-rook { background-image: url(' + theme.pieceSet.whiteRookImageUrl + '); }';
            styleText += '.piece-white-queen { background-image: url(' + theme.pieceSet.whiteQueenImageUrl + '); }';
            styleText += '.piece-white-king { background-image: url(' + theme.pieceSet.whiteKingImageUrl + '); }';
            styleText += '.piece-black-pawn { background-image: url(' + theme.pieceSet.blackPawnImageUrl + '); }';
            styleText += '.piece-black-knight { background-image: url(' + theme.pieceSet.blackKnightImageUrl + '); }';
            styleText += '.piece-black-bishop { background-image: url(' + theme.pieceSet.blackBishopImageUrl + '); }';
            styleText += '.piece-black-rook { background-image: url(' + theme.pieceSet.blackRookImageUrl + '); }';
            styleText += '.piece-black-queen { background-image: url(' + theme.pieceSet.blackQueenImageUrl + '); }';
            styleText += '.piece-black-king { background-image: url(' + theme.pieceSet.blackKingImageUrl + '); }';
        }
        const styleElement = document.createElement('style');
        styleElement.setAttribute('id', 'skin');
        styleElement.appendChild(document.createTextNode(styleText));
        this.shadowRoot.appendChild(styleElement);
    }

    public setFlipped(flipped: boolean): void {
        this.flipped = flipped;
        this.updateFlipState();
    }

    public isFlipped(): boolean {
        return this.flipped;
    }

    public setMatch(match: Match): void {
        if (this.match) {
            this.match.removeEventListener('positionChange', this.onPositionChange)
        }
        this.match = match;
        this.match.addEventListener('positionChange', this.onPositionChange);
        this.updatePosition();
    }

    public getMatch(): Match {
        return this.match;
    }

    private isTouchDevice() {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }

    private onPositionChange() {
        this.updatePosition();
        this.clearHighlightedSquares();
        this.clearArrows();
        this.clearLegalMoves();
        this.shadowRoot.querySelectorAll('.square-last-move-indicator').forEach((element: HTMLElement) => element.classList.remove('square-last-move-indicator'));
        const lastMove = this.match.getMove();
        if (lastMove) {
            this.squareElements[lastMove.getFromSquare()].classList.add('square-last-move-indicator');
            this.squareElements[lastMove.getToSquare()].classList.add('square-last-move-indicator');
        }
    }

    private onContextMenu(event: MouseEvent) {
        event.preventDefault();
    }

    private onDragStart(event: MouseEvent|TouchEvent) {
        const isRightButtonPressed = (('which' in event && event.which === 3) || ('button' in event && event.button === 2));
        if (isRightButtonPressed) {
            this.clearLegalMoves();
            if (event.target instanceof HTMLDivElement && event.target.classList.contains('square')) {
                const squareElement = event.target as HTMLElement;
                const square = this.squareElements.indexOf(squareElement);
                this.highlightData = {
                    fromSquare: square,
                    toSquare: square
                };
                if (this.isTouchDevice()) {
                    this.shadowRoot.addEventListener('touchmove', this.onDrag);
                    this.shadowRoot.addEventListener('touchend', this.onDragEnd);
                } else {
                    this.shadowRoot.addEventListener('mousemove', this.onDrag);
                    this.shadowRoot.addEventListener('mouseup', this.onDragEnd);
                }
            }
        } else {
            this.clearHighlightedSquares();
            this.clearArrows();
            if (event.target instanceof HTMLDivElement && event.target.classList.contains('square')) {
                const squareElement = event.target as HTMLElement;
                if (squareElement.classList.contains('square-destination-hint')) {
                    const fromSquare = this.squareElements.indexOf(this.shadowRoot.querySelector('.square-origin'));
                    const toSquare = this.squareElements.indexOf(squareElement);
                    this.clearLegalMoves();
                    this.match.makeMove(new Move(fromSquare, toSquare));
                } else {
                    this.clearLegalMoves();
                    const square = this.squareElements.indexOf(squareElement);
                    const piece = this.match.getPiece(square);
                    if (piece >= 0 && BoardUtils.getSide(piece) == this.match.getSideToMove()) {
                        const movingPieceSquareClass = NeochessBoardElement.SQUARE_CLASSES[square];
                        const movingPieceElement: HTMLElement = this.shadowRoot.querySelector('.piece.' + movingPieceSquareClass);
                        movingPieceElement.classList.add('piece-dragging');
                        const clientX = (event instanceof MouseEvent)? event.clientX : event.changedTouches[0].clientX;
                        const clientY = (event instanceof MouseEvent)? event.clientY : event.changedTouches[0].clientY;
                        this.moveData = {
                            fromSquare: square,
                            grabElement: movingPieceElement,
                            grabXOffset: (clientX - movingPieceElement.offsetLeft),
                            grabYOffset: (clientY - movingPieceElement.offsetTop)
                        };
                        if (this.isTouchDevice()) {
                            this.shadowRoot.addEventListener('touchmove', this.onDrag);
                            this.shadowRoot.addEventListener('touchend', this.onDragEnd);
                        } else {
                            this.shadowRoot.addEventListener('mousemove', this.onDrag);
                            this.shadowRoot.addEventListener('mouseup', this.onDragEnd);
                        }
                        this.showLegalMoves(square);
                    }
                }
            } else {
                this.clearLegalMoves();
            }
        }
    }

    private onDrag(event: MouseEvent|TouchEvent) {
        const clientX = (event instanceof MouseEvent)? event.clientX : event.changedTouches[0].clientX;
        const clientY = (event instanceof MouseEvent)? event.clientY : event.changedTouches[0].clientY;
        if (this.moveData) {
            this.moveData.grabElement.style.left = (clientX - this.moveData.grabXOffset) + 'px';
            this.moveData.grabElement.style.top = (clientY - this.moveData.grabYOffset) + 'px';
            const elementAtPoint = this.shadowRoot.elementFromPoint(clientX, clientY);
            if (elementAtPoint && elementAtPoint.classList.contains('square')) {
                this.moveData.toSquare = this.squareElements.indexOf(elementAtPoint as HTMLElement);
                this.setMoveHighlightSquare(this.moveData.toSquare);
            } else {
                this.clearMoveHighlightSquare();
            }
        } else if (this.highlightData) {
            const elementAtPoint = this.shadowRoot.elementFromPoint(clientX, clientY);
            if (elementAtPoint && elementAtPoint.classList.contains('square')) {
                const toSquare = this.squareElements.indexOf(elementAtPoint as HTMLElement);
                if (this.highlightData.toSquare != toSquare) {
                    this.highlightData.toSquare = toSquare;
                    if (this.highlightData.element) {
                        this.highlightData.element.remove();
                        this.highlightData.element = null;
                    }
                    if (this.highlightData.toSquare != this.highlightData.fromSquare) {
                        this.highlightData.element = this.drawLine(this.highlightData.fromSquare, this.highlightData.toSquare);
                    }
                }
            }
        }
    }

    private onDragEnd() {
        this.clearMoveHighlightSquare();
        if (this.isTouchDevice()) {
            this.removeEventListener('touchmove', this.onDrag);
            this.removeEventListener('touchend', this.onDragEnd);
        } else {
            this.removeEventListener('mousemove', this.onDrag);
            this.removeEventListener('mouseup', this.onDragEnd);
        }
        if (this.moveData) {
            if (this.moveData.grabElement) {
                this.moveData.grabElement.classList.remove('piece-dragging');
                this.moveData.grabElement.style.left = '';
                this.moveData.grabElement.style.top = '';
            }
            if (this.moveData.fromSquare >= 0 && this.moveData.toSquare >= 0) {
                this.match.makeMove(new Move(this.moveData.fromSquare, this.moveData.toSquare));
            }
            this.moveData = null;
        } else if (this.highlightData) {
            if (this.highlightData.fromSquare == this.highlightData.toSquare) {
                this.toggleHighlightSquare(this.highlightData.fromSquare);
            }
            this.highlightData = null;
        }
    }

    private updateState() {
        this.updateFlipState();
        this.updatePosition();
    }

    private updatePosition() {
        const currentPieces = [];
        const currentPieceElements = [];
        this.shadowRoot.querySelectorAll('.piece').forEach((element: HTMLElement) => {
            const square = Number(element.dataset.square);
            const piece = Number(element.dataset.piece);
            currentPieces[square] = piece;
            currentPieceElements[square] = element;
        });
        const piecesToMove = [];
        const piecesToCreate = [];
        for (let square = Square.A1; square <= Square.H8; square++) {
            const piece = this.match.getPiece(square);
            const currentPiece = currentPieces[square];
            if (piece != currentPiece) {
                if (piece >= 0) {
                    if (currentPiece >= 0) {
                        piecesToMove[square] = currentPiece;
                    }
                    piecesToCreate[square] = piece;
                } else {
                    piecesToMove[square] = currentPiece;
                }
            }
        }

        const boardContentElement = this.shadowRoot.querySelector('.board-content');
        piecesToCreate.forEach((pieceToCreate: Piece, destinationSquare: Square) => {
            const destinationSquareFile = BoardUtils.getFile(destinationSquare);
            const destinationSquareRank = BoardUtils.getRank(destinationSquare);
            let possibleOriginSquares = [];
            piecesToMove.forEach((piece: Piece, square: Square) => {
                if (piece == pieceToCreate) {
                    possibleOriginSquares.push(square);
                }
            });
            if (BoardUtils.getFigure(pieceToCreate) == Figure.BISHOP) {
                possibleOriginSquares = possibleOriginSquares.filter((square: Square) => {
                    const squareDistance = Math.abs(destinationSquareFile - BoardUtils.getFile(square)) + Math.abs(destinationSquareRank - BoardUtils.getRank(square));
                    return squareDistance % 2 == 0;
                });
            }
            possibleOriginSquares.sort((square1: Square, square2: Square) => {
                const square1Distance = Math.abs(destinationSquareFile - BoardUtils.getFile(square1)) + Math.abs(destinationSquareRank - BoardUtils.getRank(square1));
                const square2Distance = Math.abs(destinationSquareFile - BoardUtils.getFile(square2)) + Math.abs(destinationSquareRank - BoardUtils.getRank(square2));
                return square1Distance - square2Distance;
            });

            if (!possibleOriginSquares.length) {
                const pieceElement = document.createElement('div');
                pieceElement.classList.add('piece', NeochessBoardElement.PIECE_CLASSES[pieceToCreate], NeochessBoardElement.SQUARE_CLASSES[destinationSquare]);
                pieceElement.dataset.square = String(destinationSquare);
                pieceElement.dataset.piece = String(pieceToCreate);
                boardContentElement.appendChild(pieceElement);
            } else {
                const originSquare = possibleOriginSquares[0];
                delete piecesToMove[originSquare];
                const originSquareElement = currentPieceElements[originSquare];
                originSquareElement.classList.replace(NeochessBoardElement.SQUARE_CLASSES[originSquare], NeochessBoardElement.SQUARE_CLASSES[destinationSquare]);
                originSquareElement.dataset.square = String(destinationSquare);
            }
        });
        piecesToMove.forEach((_piece: Piece, square: Square) => {
            currentPieceElements[square].remove();
        });
    }

    private updateFlipState() {
        if (this.flipped) {
            this.shadowRoot.querySelector('.board-content').classList.add('board-flipped');
        } else {
            this.shadowRoot.querySelector('.board-content').classList.remove('board-flipped');
        }
        this.drawCoordinates();
    }

    private showLegalMoves(square: Square) {
        this.clearLegalMoves();
        const originSquareElement = this.squareElements[square] as HTMLElement;
        const destinationSquares = this.match.getLegalMoves().filter((move) => move.getFromSquare() === square).map((move) => move.getToSquare());
        originSquareElement.classList.add('square-origin');
        for (const destinationSquare of destinationSquares) {
            const destinationSquareElement = this.squareElements[destinationSquare];
            destinationSquareElement.classList.add('square-destination-hint');
            if (this.match.getPiece(destinationSquare) >= 0) {
                destinationSquareElement.classList.add('square-destination-hint-capture');
            }
        }
    }

    private clearLegalMoves() {
        this.shadowRoot.querySelectorAll('.square-origin').forEach((element: HTMLElement) => {
            element.classList.remove('square-origin');
        });
        this.shadowRoot.querySelectorAll('.square-destination-hint').forEach((element: HTMLElement) => {
            element.classList.remove('square-destination-hint', 'square-destination-hint-capture');
        });
    }

    private setMoveHighlightSquare(square: Square) {
        const squareElement = this.squareElements[square] as HTMLElement;
        if (!squareElement.classList.contains('square-destination')) {
            this.clearMoveHighlightSquare();
            squareElement.classList.add('square-destination');
        }
    }

    private clearMoveHighlightSquare() {
        const destinationSquareHighlighted = this.shadowRoot.querySelector('.square-destination');
        if (destinationSquareHighlighted) {
            destinationSquareHighlighted.classList.remove('square-destination');
        }
    }

    private toggleHighlightSquare(square: Square) {
        this.squareElements[square].classList.toggle('square-highlighted');
    }

    private clearHighlightedSquares() {
        this.shadowRoot.querySelectorAll('.square-highlighted').forEach((element: HTMLElement) => element.classList.remove('square-highlighted'));
    }

    private clearArrows() {
        this.shadowRoot.querySelectorAll('.arrow').forEach((element: HTMLElement) => element.remove());
    }

    private drawCoordinates() {
        const overlayElement = this.shadowRoot.querySelector('.board-overlay');
        overlayElement.querySelectorAll('.coordinate').forEach((element: Element) => element.remove());
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '1' : '8', 0.75, 3.5, true));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '2' : '7', 0.75, 15.75, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '3' : '6', 0.75, 28.25, true));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '4' : '5', 0.75, 40.75, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '5' : '4', 0.75, 53.25, true));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '6' : '3', 0.75, 65.75, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '7' : '2', 0.75, 78.25, true));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? '8' : '1', 0.75, 90.75, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'h' : 'a',10.5, 99, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'g' : 'b',23, 99, true));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'f' : 'c',35.5, 99, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'e' : 'd',48, 99, true));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'd' : 'e',60.5, 99, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'c' : 'f',73, 99, true));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'b' : 'g',85.5, 99, false));
        overlayElement.appendChild(this.createCoordinateElement(this.flipped ? 'a' : 'h',98, 99, true));
    }

    private createCoordinateElement(text: string, x: number, y: number, isLight: boolean): Element {
        const coordinate = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        coordinate.setAttribute('x', String(x));
        coordinate.setAttribute('y', String(y));
        coordinate.setAttribute('font-size', '2.8');
        coordinate.classList.add('coordinate', isLight ? 'coordinate-light' : 'coordinate-dark');
        coordinate.append(document.createTextNode(text));
        return coordinate;
    }

    private drawLine(fromSquare: Square, toSquare: Square): Element {
        const arrowOriginOffset = 4;
        const arrowDestinationOffset = 0;
        const fromSquareRect = this.getSquareRect(fromSquare);
        const toSquareRect = this.getSquareRect(toSquare);
        const arrowAngle = 180 - (Math.atan2(toSquareRect.x - fromSquareRect.x, toSquareRect.y - fromSquareRect.y) * 180 / Math.PI);
        const fromSquareCenterPoint = new DOMPoint(fromSquareRect.x + (fromSquareRect.width / 2), fromSquareRect.y + (fromSquareRect.height / 2));
        const toSquareCenterPoint = new DOMPoint(toSquareRect.x + (toSquareRect.width / 2), toSquareRect.y + (toSquareRect.height / 2));
        const arrowHeadHeight = 4;
        const arrowHeadWidth = 6;
        const arrowHeight = Math.sqrt(Math.pow(toSquareCenterPoint.x - fromSquareCenterPoint.x, 2) + Math.pow(toSquareCenterPoint.y - fromSquareCenterPoint.y, 2)) - arrowOriginOffset + arrowDestinationOffset - arrowHeadHeight;
        const arrowWidth = 3;
        let x = fromSquareCenterPoint.x - (arrowWidth / 2);
        let y = fromSquareCenterPoint.y - arrowOriginOffset;
        const polygonPoints = [];
        polygonPoints.push(x + ' ' + y);
        y -= arrowHeight;
        polygonPoints.push(x + ' ' + y);
        x = fromSquareCenterPoint.x - (arrowHeadWidth / 2);
        polygonPoints.push(x + ' ' + y);
        x = fromSquareCenterPoint.x;
        y -= arrowHeadHeight;
        polygonPoints.push(x + ' ' + y);
        x = fromSquareCenterPoint.x + (arrowHeadWidth / 2);
        y += arrowHeadHeight;
        polygonPoints.push(x + ' ' + y);
        x = fromSquareCenterPoint.x + (arrowWidth / 2);
        polygonPoints.push(x + ' ' + y);
        y += arrowHeight;
        polygonPoints.push(x + ' ' + y);
        const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        polygon.classList.add('arrow');
        polygon.setAttribute('points', polygonPoints.join(','));
        polygon.setAttribute('transform', 'rotate(' + arrowAngle + ' ' + fromSquareCenterPoint.x + ' ' + fromSquareCenterPoint.y + ')');
        const overlayElement = this.shadowRoot.querySelector('.board-overlay');
        overlayElement.appendChild(polygon);
        return polygon;
    }

    private getSquareRect(square: Square): DOMRect {
        const file = BoardUtils.getFile(square);
        const rank = BoardUtils.getRank(square);
        const width = 12.5;
        const height = 12.5;
        const x = (this.flipped ? (7 - file) : file) * width;
        const y = (this.flipped ? rank : (7 - rank)) * height;
        return new DOMRect(x, y, width, height);
    }
}

if (!customElements.get('neochess-board')) {
    customElements.define('neochess-board', NeochessBoardElement);
}
