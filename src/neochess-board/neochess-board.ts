import {BoardUtils, Figure, Match, MatchState, Move, Piece, Side, Square} from "@neochess/core";
import {NeochessBoardTheme} from "./neochess-board-theme";
import {NeochessBoardPieceset} from "./neochess-board-pieceset";

const template = document.createElement('template');
template.innerHTML = `
    <style>
        :host {
            display: block;
            width: 500px;
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
            padding: 2%;
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
            border-color: orange;
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

        :host([show-legal-moves-hint="false"]) .square-destination-hint::after {
            display: none;
        }

        .square-highlighted::after {
            position: absolute;
            content: '';
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: gold;
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

        :host([flipped="true"]) .square-a1 { left: 87.5%; top: 0; }
        :host([flipped="true"]) .square-b1 { left: 75%; top: 0; }
        :host([flipped="true"]) .square-c1 { left: 62.5%; top: 0; }
        :host([flipped="true"]) .square-d1 { left: 50%; top: 0; }
        :host([flipped="true"]) .square-e1 { left: 37.5%; top: 0; }
        :host([flipped="true"]) .square-f1 { left: 25%; top: 0; }
        :host([flipped="true"]) .square-g1 { left: 12.5%; top: 0; }
        :host([flipped="true"]) .square-h1 { left: 0; top: 0; }
        :host([flipped="true"]) .square-a2 { left: 87.5%; top: 12.5%; }
        :host([flipped="true"]) .square-b2 { left: 75%; top: 12.5%; }
        :host([flipped="true"]) .square-c2 { left: 62.5%; top: 12.5%; }
        :host([flipped="true"]) .square-d2 { left: 50%; top: 12.5%; }
        :host([flipped="true"]) .square-e2 { left: 37.5%; top: 12.5%; }
        :host([flipped="true"]) .square-f2 { left: 25%; top: 12.5%; }
        :host([flipped="true"]) .square-g2 { left: 12.5%; top: 12.5%; }
        :host([flipped="true"]) .square-h2 { left: 0; top: 12.5%; }
        :host([flipped="true"]) .square-a3 { left: 87.5%; top: 25%; }
        :host([flipped="true"]) .square-b3 { left: 75%; top: 25%; }
        :host([flipped="true"]) .square-c3 { left: 62.5%; top: 25%; }
        :host([flipped="true"]) .square-d3 { left: 50%; top: 25%; }
        :host([flipped="true"]) .square-e3 { left: 37.5%; top: 25%; }
        :host([flipped="true"]) .square-f3 { left: 25%; top: 25%; }
        :host([flipped="true"]) .square-g3 { left: 12.5%; top: 25%; }
        :host([flipped="true"]) .square-h3 { left: 0; top: 25%; }
        :host([flipped="true"]) .square-a4 { left: 87.5%; top: 37.5%; }
        :host([flipped="true"]) .square-b4 { left: 75%; top: 37.5%; }
        :host([flipped="true"]) .square-c4 { left: 62.5%; top: 37.5%; }
        :host([flipped="true"]) .square-d4 { left: 50%; top: 37.5%; }
        :host([flipped="true"]) .square-e4 { left: 37.5%; top: 37.5%; }
        :host([flipped="true"]) .square-f4 { left: 25%; top: 37.5%; }
        :host([flipped="true"]) .square-g4 { left: 12.5%; top: 37.5%; }
        :host([flipped="true"]) .square-h4 { left: 0; top: 37.5%; }
        :host([flipped="true"]) .square-a5 { left: 87.5%; top: 50%; }
        :host([flipped="true"]) .square-b5 { left: 75%; top: 50%; }
        :host([flipped="true"]) .square-c5 { left: 62.5%; top: 50%; }
        :host([flipped="true"]) .square-d5 { left: 50%; top: 50%; }
        :host([flipped="true"]) .square-e5 { left: 37.5%; top: 50%; }
        :host([flipped="true"]) .square-f5 { left: 25%; top: 50%; }
        :host([flipped="true"]) .square-g5 { left: 12.5%; top: 50%; }
        :host([flipped="true"]) .square-h5 { left: 0; top: 50%; }
        :host([flipped="true"]) .square-a6 { left: 87.5%; top: 62.5%; }
        :host([flipped="true"]) .square-b6 { left: 75%; top: 62.5%; }
        :host([flipped="true"]) .square-c6 { left: 62.5%; top: 62.5%; }
        :host([flipped="true"]) .square-d6 { left: 50%; top: 62.5%; }
        :host([flipped="true"]) .square-e6 { left: 37.5%; top: 62.5%; }
        :host([flipped="true"]) .square-f6 { left: 25%; top: 62.5%; }
        :host([flipped="true"]) .square-g6 { left: 12.5%; top: 62.5%; }
        :host([flipped="true"]) .square-h6 { left: 0; top: 62.5%; }
        :host([flipped="true"]) .square-a7 { left: 87.5%; top: 75%; }
        :host([flipped="true"]) .square-b7 { left: 75%; top: 75%; }
        :host([flipped="true"]) .square-c7 { left: 62.5%; top: 75%; }
        :host([flipped="true"]) .square-d7 { left: 50%; top: 75%; }
        :host([flipped="true"]) .square-e7 { left: 37.5%; top: 75%; }
        :host([flipped="true"]) .square-f7 { left: 25%; top: 75%; }
        :host([flipped="true"]) .square-g7 { left: 12.5%; top: 75%; }
        :host([flipped="true"]) .square-h7 { left: 0; top: 75%; }
        :host([flipped="true"]) .square-a8 { left: 87.5%; top: 87.5%; }
        :host([flipped="true"]) .square-b8 { left: 75%; top: 87.5%; }
        :host([flipped="true"]) .square-c8 { left: 62.5%; top: 87.5%; }
        :host([flipped="true"]) .square-d8 { left: 50%; top: 87.5%; }
        :host([flipped="true"]) .square-e8 { left: 37.5%; top: 87.5%; }
        :host([flipped="true"]) .square-f8 { left: 25%; top: 87.5%; }
        :host([flipped="true"]) .square-g8 { left: 12.5%; top: 87.5%; }
        :host([flipped="true"]) .square-h8 { left: 0; top: 87.5%; }

        .board-coordinates {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 40;
        }

        :host([show-coordinates="false"]) .board-coordinates {
            display: none;
        }

        .coordinate {
            font-weight: 600;
        }

        .coordinate:nth-of-type(even), :host([flipped="true"]) .coordinate:nth-of-type(odd) {
            fill: lightblue;
        }

        .coordinate:nth-of-type(odd), :host([flipped="true"]) .coordinate:nth-of-type(even) {
            fill: azure;
        }

        .coordinate-rank-1 { transform: translate(0.75%, 90.75%); }
        .coordinate-rank-2 { transform: translate(0.75%, 78.25%); }
        .coordinate-rank-3 { transform: translate(0.75%, 65.75%); }
        .coordinate-rank-4 { transform: translate(0.75%, 53.25%); }
        .coordinate-rank-5 { transform: translate(0.75%, 40.75%); }
        .coordinate-rank-6 { transform: translate(0.75%, 28.25%); }
        .coordinate-rank-7 { transform: translate(0.75%, 15.75%); }
        .coordinate-rank-8 { transform: translate(0.75%, 3.5%); }
        .coordinate-file-a { transform: translate(10.5%, 99%); }
        .coordinate-file-b { transform: translate(23%, 99%); }
        .coordinate-file-c { transform: translate(35.5%, 99%); }
        .coordinate-file-d { transform: translate(48%, 99%); }
        .coordinate-file-e { transform: translate(60.5%, 99%); }
        .coordinate-file-f { transform: translate(73%, 99%); }
        .coordinate-file-g { transform: translate(85.5%, 99%); }
        .coordinate-file-h { transform: translate(98%, 99%); }

        :host([flipped="true"]) .coordinate-rank-1 { transform: translate(0.75%, 3.5%); }
        :host([flipped="true"]) .coordinate-rank-2 { transform: translate(0.75%, 15.75%); }
        :host([flipped="true"]) .coordinate-rank-3 { transform: translate(0.75%, 28.25%); }
        :host([flipped="true"]) .coordinate-rank-4 { transform: translate(0.75%, 40.75%); }
        :host([flipped="true"]) .coordinate-rank-5 { transform: translate(0.75%, 53.25%); }
        :host([flipped="true"]) .coordinate-rank-6 { transform: translate(0.75%, 65.75%); }
        :host([flipped="true"]) .coordinate-rank-7 { transform: translate(0.75%, 78.25%); }
        :host([flipped="true"]) .coordinate-rank-8 { transform: translate(0.75%, 90.75%); }
        :host([flipped="true"]) .coordinate-file-h { transform: translate(10.5%, 99%); }
        :host([flipped="true"]) .coordinate-file-g { transform: translate(23%, 99%); }
        :host([flipped="true"]) .coordinate-file-f { transform: translate(35.5%, 99%); }
        :host([flipped="true"]) .coordinate-file-e { transform: translate(48%, 99%); }
        :host([flipped="true"]) .coordinate-file-d { transform: translate(60.5%, 99%); }
        :host([flipped="true"]) .coordinate-file-c { transform: translate(73%, 99%); }
        :host([flipped="true"]) .coordinate-file-b { transform: translate(85.5%, 99%); }
        :host([flipped="true"]) .coordinate-file-a { transform: translate(98%, 99%); }

        .board-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 50;
        }

        :host([flipped="true"]) .board-overlay {
            transform: rotate(180deg);
        }

        .arrow-last-move {
            fill: darkorange;
            fill-opacity: 0.7;
        }

        :host([show-last-move-hint="false"]) .arrow-last-move {
            display: none;
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

        :host([animated="false"]) .piece {
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            transition: none !important;
        }

        .piece-white-pawn {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/white_pawn.png');
        }

        .piece-white-knight {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/white_knight.png');
        }

        .piece-white-bishop {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/white_bishop.png');
        }

        .piece-white-rook {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/white_rook.png');
        }

        .piece-white-queen {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/white_queen.png');
        }

        .piece-white-king {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/white_king.png');
        }

        .piece-black-pawn {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/black_pawn.png');
        }

        .piece-black-knight {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/black_knight.png');
        }

        .piece-black-bishop {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/black_bishop.png');
        }

        .piece-black-rook {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/black_rook.png');
        }

        .piece-black-queen {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/black_queen.png');
        }

        .piece-black-king {
            background-image: url('https://luismanuelamengual.github.io/neochess/assets/chesssets/set3/black_king.png');
        }

        .board-highlight-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 180;
        }

        :host([flipped="true"]) .board-highlight-overlay {
            transform: rotate(180deg);
        }

        .arrow-highlighted {
            fill: khaki;
            fill-opacity: 0.7;
            stroke-width: 0.3;
            stroke: darkkhaki;
        }

        .piece-dragging {
            z-index: 200;
            cursor: grabbing;
            -webkit-transition: none !important;
            -moz-transition: none !important;
            -o-transition: none !important;
            transition: none !important;
        }
    </style>
    <audio id="moveSelf"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/move-self.webm"></audio>
    <audio id="moveOpponent"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/move-opponent.webm"></audio>
    <audio id="moveCheck"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/move-check.webm"></audio>
    <audio id="capture"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/capture.webm"></audio>
    <audio id="castle"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/castle.webm"></audio>
    <audio id="promote"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/promote.webm"></audio>
    <audio id="gameStart"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/game-start.webm"></audio>
    <audio id="gameEnd"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/game-end.webm"></audio>
    <audio id="illegal"><source src="https://luismanuelamengual.github.io/neochess/assets/sounds/illegal.webm"></audio>
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
                <svg viewBox="0 0 100 100" class="board-coordinates" preserveAspectRatio="none" font-size="2.8"><text class="coordinate coordinate-rank-1">1</text><text class="coordinate coordinate-rank-2">2</text><text class="coordinate coordinate-rank-3">3</text><text class="coordinate coordinate-rank-4">4</text><text class="coordinate coordinate-rank-5">5</text><text class="coordinate coordinate-rank-6">6</text><text class="coordinate coordinate-rank-7">7</text><text class="coordinate coordinate-rank-8">8</text><text class="coordinate coordinate-file-a">a</text><text class="coordinate coordinate-file-b">b</text><text class="coordinate coordinate-file-c">c</text><text class="coordinate coordinate-file-d">d</text><text class="coordinate coordinate-file-e">e</text><text class="coordinate coordinate-file-f">f</text><text class="coordinate coordinate-file-g">g</text><text class="coordinate coordinate-file-h">h</text></svg>
                <svg viewBox="0 0 100 100" class="board-overlay" preserveAspectRatio="none"></svg>
                <svg viewBox="0 0 100 100" class="board-highlight-overlay" preserveAspectRatio="none"></svg>
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

    private _match: Match;
    private _theme: NeochessBoardTheme = null;
    private _pieceSet: NeochessBoardPieceset = null;
    private _squareElements: Array<HTMLElement>;
    private _moveData?: { fromSquare?: Square, toSquare?: Square, grabElement?: HTMLElement, grabXOffset?: number, grabYOffset?: number } = null;
    private _highlightData?: { fromSquare?: Square, toSquare?: Square, element?: Element };

    constructor() {
        super();
        this._match = new Match(this.getAttribute('fen'));
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrag = this.onDrag.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onPositionChange = this.onPositionChange.bind(this);
        this.onMoveMade = this.onMoveMade.bind(this);
        this.onStartMatch = this.onStartMatch.bind(this);
        this.onStateChange = this.onStateChange.bind(this);
    }

    public connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this._squareElements = [];
            this.shadowRoot.querySelectorAll('.square').forEach((squareElement: HTMLElement) => this._squareElements.push(squareElement));
            this.shadowRoot.addEventListener('contextmenu', (event) => event.preventDefault());
            this.shadowRoot.querySelector('.board').addEventListener('touchstart', this.onDragStart);
            this.shadowRoot.querySelector('.board').addEventListener('mousedown', this.onDragStart);
        }
        this._match.addEventListener('positionChange', this.onPositionChange);
        this._match.addEventListener('moveMade', this.onMoveMade);
        this._match.addEventListener('matchStart', this.onStartMatch);
        this._match.addEventListener('stateChange', this.onStateChange);
        this.updatePosition();
        this.showLastMoveArrow();
    }

    public disconnectedCallback() {
        this._match.removeEventListener('positionChange', this.onPositionChange);
        this._match.removeEventListener('moveMade', this.onMoveMade);
        this._match.removeEventListener('matchStart', this.onStartMatch);
        this._match.removeEventListener('stateChange', this.onStateChange);
    }

    public get match(): Match {
        return this._match;
    }

    public set match(match: Match|null) {
        if (match != this._match) {
            if (this._match) {
                this._match.removeEventListener('positionChange', this.onPositionChange);
                this._match.removeEventListener('moveMade', this.onMoveMade);
                this._match.removeEventListener('matchStart', this.onStartMatch);
                this._match.removeEventListener('stateChange', this.onStateChange);
            }
            this._match = match;
            if (this._match) {
                this._match.addEventListener('positionChange', this.onPositionChange);
                this._match.addEventListener('moveMade', this.onMoveMade);
                this._match.addEventListener('matchStart', this.onStartMatch);
                this._match.addEventListener('stateChange', this.onStateChange);
            }
            this.updatePosition();
            this.showLastMoveArrow();
        }
    }

    public get flipped(): boolean {
        return this.getAttribute('flipped') == 'true';
    }

    public set flipped(flipped: boolean) {
        this.setAttribute('flipped', String(flipped));
    }

    public get animated(): boolean {
        return this.getAttribute('animated') != 'false';
    }

    public set animated(animated: boolean) {
        this.setAttribute('animated', String(animated));
    }

    public get readonly(): boolean {
        return this.getAttribute('readonly') == 'true';
    }

    public set readonly(readonly: boolean) {
        this.setAttribute('readonly', String(readonly));
    }

    public get showLastMoveHint(): boolean {
        return this.getAttribute('show-last-move-hint') != 'false';
    }

    public set showLastMoveHint(showLastMoveHint: boolean) {
        this.setAttribute('show-last-move-hint', String(showLastMoveHint));
    }

    public get showLegalMovesHint(): boolean {
        return this.getAttribute('show-legal-moves-hint') != 'false';
    }

    public set showLegalMovesHint(showLegalMovesHint: boolean) {
        this.setAttribute('show-legal-moves-hint', String(showLegalMovesHint));
    }

    public get showCoordinates(): boolean {
        return this.getAttribute('show-coordinates') != 'false';
    }

    public set showCoordinates(showCoordinates: boolean) {
        this.setAttribute('show-coordinates', String(showCoordinates));
    }

    public get soundsEnabled(): boolean {
        return this.getAttribute('sounds-enabled') != 'false';
    }

    public set soundsEnabled(soundsEnabled: boolean) {
        this.setAttribute('sounds-enabled', String(soundsEnabled));
    }

    public get whiteInteractionEnabled(): boolean {
        return this.getAttribute('white-interaction-enabled') != 'false';
    }

    public set whiteInteractionEnabled(whiteInteractionEnabled: boolean) {
        this.setAttribute('white-interaction-enabled', String(whiteInteractionEnabled));
    }

    public get blackInteractionEnabled(): boolean {
        return this.getAttribute('black-interaction-enabled') != 'false';
    }

    public set blackInteractionEnabled(blackInteractionEnabled: boolean) {
        this.setAttribute('black-interaction-enabled', String(blackInteractionEnabled));
    }

    public get theme(): NeochessBoardTheme {
        return this._theme;
    }

    public set theme(theme: NeochessBoardTheme|null) {
        const skinElement = this.shadowRoot.getElementById('theme');
        if (skinElement) {
            skinElement.remove();
        }
        if (theme) {
            let styleText = '';
            if (theme.boardColor || theme.boardPadding >= 0) {
                styleText += '.board {';
                if (theme.boardColor) {
                    styleText += 'background: ' + theme.boardColor + ';';
                }
                if (theme.boardPadding >= 0) {
                    styleText += 'padding: ' + theme.boardPadding + 'px;';
                }
                styleText += '}';
                if (theme.boardColor && !theme.lightSquareColor) {
                    styleText += '.coordinate:nth-of-type(odd), :host([flipped="true"]) .coordinate:nth-of-type(even) { fill: ' + theme.boardColor + '; }';
                }
            }
            if (theme.boardImageUrl) {
                styleText += '.board-content { background: url(' + theme.boardImageUrl + ') 0/contain; } ';
                styleText += '.square-light { background-color: transparent }';
                styleText += '.square-dark { background-color: transparent }';
                if (!theme.coordinatesColor) {
                    styleText += '.coordinate { fill: white; }';
                }
            } else {
                if (theme.lightSquareColor) {
                    styleText += '.square-light { background-color: ' + theme.lightSquareColor + '}';
                    if (!theme.coordinatesColor) {
                        styleText += '.coordinate:nth-of-type(odd), :host([flipped="true"]) .coordinate:nth-of-type(even) { fill: ' + theme.lightSquareColor + '; }';
                    }
                }
                if (theme.darkSquareColor) {
                    styleText += '.square-dark { background-color: ' + theme.darkSquareColor + '}';
                    if (!theme.coordinatesColor) {
                        styleText += '.coordinate:nth-of-type(even), :host([flipped="true"]) .coordinate:nth-of-type(odd) { fill: ' + theme.darkSquareColor + '; }';
                    }
                }
            }
            if (theme.coordinatesColor) {
                styleText += '.coordinate { fill: ' + theme.coordinatesColor + '; }';
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
            if (theme.lastMoveArrowColor || theme.lastMoveArrowOpacity) {
                styleText += '.arrow-last-move {';
                if (theme.lastMoveArrowColor) {
                    styleText += 'fill: ' + theme.lastMoveArrowColor + ';';
                }
                if (theme.lastMoveArrowOpacity) {
                    styleText += 'fill-opacity: ' + theme.lastMoveArrowOpacity + ';';
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
            if (theme.highlightedSquareColor || theme.highlightedSquareOpacity) {
                styleText += '.square-highlighted::after {';
                if (theme.highlightedSquareColor) {
                    styleText += 'background-color: ' + theme.highlightedSquareColor + ';';
                }
                if (theme.highlightedSquareOpacity) {
                    styleText += 'opacity: ' + theme.highlightedSquareOpacity + ';';
                }
                styleText += '}';
            }
            if (theme.highlightArrowsColor || theme.highlightArrowsOpacity || theme.highlightArrowsBorderColor || theme.highlightArrowsBorderWidth) {
                styleText += '.arrow-highlighted {';
                if (theme.highlightArrowsColor) {
                    styleText += 'fill: ' + theme.highlightArrowsColor + ';';
                    if (!theme.highlightArrowsBorderColor) {
                        styleText += 'stroke: ' + theme.highlightArrowsColor + ';';
                    }
                }
                if (theme.highlightArrowsOpacity) {
                    styleText += 'fill-opacity: ' + theme.highlightArrowsOpacity + ';';
                }
                if (theme.highlightArrowsBorderColor) {
                    styleText += 'stroke: ' + theme.highlightArrowsBorderColor + ';';
                }
                if (theme.highlightArrowsBorderWidth) {
                    styleText += 'stroke-width: ' + theme.highlightArrowsBorderWidth + ';';
                }
                styleText += '}';
            }

            const styleElement = document.createElement('style');
            styleElement.setAttribute('id', 'theme');
            styleElement.appendChild(document.createTextNode(styleText));
            this.shadowRoot.appendChild(styleElement);
        }
        this._theme = theme;
    }

    public get pieceSet(): NeochessBoardPieceset {
        return this._pieceSet;
    }

    public set pieceSet(pieceSet: NeochessBoardPieceset|null) {
        const pieceSetElement = this.shadowRoot.getElementById('pieceSet');
        if (pieceSetElement) {
            pieceSetElement.remove();
        }
        if (pieceSet) {
            let styleText = '';
            styleText += '.piece-white-pawn { background-image: url(' + pieceSet.whitePawnImageUrl + '); }';
            styleText += '.piece-white-knight { background-image: url(' + pieceSet.whiteKnightImageUrl + '); }';
            styleText += '.piece-white-bishop { background-image: url(' + pieceSet.whiteBishopImageUrl + '); }';
            styleText += '.piece-white-rook { background-image: url(' + pieceSet.whiteRookImageUrl + '); }';
            styleText += '.piece-white-queen { background-image: url(' + pieceSet.whiteQueenImageUrl + '); }';
            styleText += '.piece-white-king { background-image: url(' + pieceSet.whiteKingImageUrl + '); }';
            styleText += '.piece-black-pawn { background-image: url(' + pieceSet.blackPawnImageUrl + '); }';
            styleText += '.piece-black-knight { background-image: url(' + pieceSet.blackKnightImageUrl + '); }';
            styleText += '.piece-black-bishop { background-image: url(' + pieceSet.blackBishopImageUrl + '); }';
            styleText += '.piece-black-rook { background-image: url(' + pieceSet.blackRookImageUrl + '); }';
            styleText += '.piece-black-queen { background-image: url(' + pieceSet.blackQueenImageUrl + '); }';
            styleText += '.piece-black-king { background-image: url(' + pieceSet.blackKingImageUrl + '); }';
            const styleElement = document.createElement('style');
            styleElement.setAttribute('id', 'pieceSet');
            styleElement.appendChild(document.createTextNode(styleText));
            this.shadowRoot.appendChild(styleElement);
        }
        this._pieceSet = pieceSet;
    }

    private onPositionChange() {
        this.updatePosition();
        this.clearHighlightedSquares();
        this.clearHighlightedArrows();
        this.clearLegalMoves();
        this.showLastMoveArrow();
    }

    private onMoveMade(move: Move, onCurrentPosition: boolean) {
        if (onCurrentPosition) {
            const san = move.getSAN();
            const promotion = san.indexOf('=') >= 0;
            const capture = san.indexOf('x') >= 0;
            const check = san.indexOf('+') >= 0 || san.indexOf('#') >= 0;
            const castle = san.indexOf('-') >= 0;
            if (promotion) {
                this.playSound('promote');
            } else if (castle) {
                this.playSound('castle');
            } else if (capture) {
                this.playSound('capture');
            } else if (check) {
                this.playSound('moveCheck');
            } else {
                if (this._match.getSideToMove() == Side.BLACK) {
                    this.playSound('moveSelf');
                } else {
                    this.playSound('moveOpponent');
                }
            }
        }
    }

    private onStartMatch() {
        this.playSound('gameStart');
    }

    private onStateChange(state: MatchState) {
        if (state != MatchState.ONGOING) {
            this.playSound('gameEnd');
        }
    }

    private playSound(soundId: string) {
        if (this.soundsEnabled) {
            const soundElement = this.shadowRoot.getElementById(soundId) as HTMLAudioElement;
            soundElement.play();
        }
    }

    private onDragStart(event: MouseEvent|TouchEvent) {
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
        if (!this.readonly && this._match) {
            const isRightButtonPressed = (('which' in event && event.which === 3) || ('button' in event && event.button === 2));
            if (isRightButtonPressed) {
                this.clearLegalMoves();
                if (event.target instanceof HTMLDivElement && event.target.classList.contains('square')) {
                    const squareElement = event.target as HTMLElement;
                    const square = this._squareElements.indexOf(squareElement);
                    this._highlightData = {
                        fromSquare: square,
                        toSquare: square
                    };
                    if ('changedTouches' in event) {
                        this.shadowRoot.addEventListener('touchmove', this.onDrag);
                        this.shadowRoot.addEventListener('touchend', this.onDragEnd);
                    } else {
                        this.shadowRoot.addEventListener('mousemove', this.onDrag);
                        this.shadowRoot.addEventListener('mouseup', this.onDragEnd);
                    }
                }
            } else {
                this.clearHighlightedSquares();
                this.clearHighlightedArrows();
                if (this._match.getState() == MatchState.ONGOING && ((this._match.getSideToMove() == Side.WHITE && this.whiteInteractionEnabled) || (this._match.getSideToMove() == Side.BLACK && this.blackInteractionEnabled))) {
                    if (event.target instanceof HTMLDivElement && event.target.classList.contains('square')) {
                        const squareElement = event.target as HTMLElement;
                        if (squareElement.classList.contains('square-destination-hint')) {
                            const fromSquare = this._squareElements.indexOf(this.shadowRoot.querySelector('.square-origin'));
                            const toSquare = this._squareElements.indexOf(squareElement);
                            this.clearLegalMoves();
                            const move = new Move(fromSquare, toSquare);
                            this._match.makeMove(move);
                        } else {
                            this.clearLegalMoves();
                            const square = this._squareElements.indexOf(squareElement);
                            const piece = this._match.getPiece(square);
                            if (piece >= 0 && BoardUtils.getSide(piece) == this._match.getSideToMove()) {
                                const movingPieceSquareClass = NeochessBoardElement.SQUARE_CLASSES[square];
                                const movingPieceElement: HTMLElement = this.shadowRoot.querySelector('.piece.' + movingPieceSquareClass);
                                movingPieceElement.classList.add('piece-dragging');
                                const clientX = ('changedTouches' in event)? event.changedTouches[0].clientX : event.clientX;
                                const clientY = ('changedTouches' in event)? event.changedTouches[0].clientY : event.clientY;
                                this._moveData = {
                                    fromSquare: square,
                                    grabElement: movingPieceElement,
                                    grabXOffset: (clientX - movingPieceElement.offsetLeft),
                                    grabYOffset: (clientY - movingPieceElement.offsetTop)
                                };
                                if ('changedTouches' in event) {
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
        }
    }

    private onDrag(event: MouseEvent|TouchEvent) {
        const clientX = ('changedTouches' in event)? event.changedTouches[0].clientX : event.clientX;
        const clientY = ('changedTouches' in event)? event.changedTouches[0].clientY : event.clientY;
        if (this._moveData) {
            this._moveData.grabElement.style.left = (clientX - this._moveData.grabXOffset) + 'px';
            this._moveData.grabElement.style.top = (clientY - this._moveData.grabYOffset) + 'px';
            const elementAtPoint = this.shadowRoot.elementFromPoint(clientX, clientY);
            if (elementAtPoint && elementAtPoint.classList.contains('square')) {
                this._moveData.toSquare = this._squareElements.indexOf(elementAtPoint as HTMLElement);
                this.setMoveHighlightSquare(this._moveData.toSquare);
            } else {
                this.clearMoveHighlightSquare();
            }
        } else if (this._highlightData) {
            const elementAtPoint = this.shadowRoot.elementFromPoint(clientX, clientY);
            if (elementAtPoint && elementAtPoint.classList.contains('square')) {
                const toSquare = this._squareElements.indexOf(elementAtPoint as HTMLElement);
                if (this._highlightData.toSquare != toSquare) {
                    this._highlightData.toSquare = toSquare;
                    if (this._highlightData.element) {
                        this._highlightData.element.remove();
                        this._highlightData.element = null;
                    }
                    if (this._highlightData.toSquare != this._highlightData.fromSquare) {
                        this._highlightData.element = this.addHighlightArrow(this._highlightData.fromSquare, this._highlightData.toSquare);
                    }
                }
            }
        }
    }

    private onDragEnd() {
        this.clearMoveHighlightSquare();
        this.shadowRoot.removeEventListener('touchmove', this.onDrag);
        this.shadowRoot.removeEventListener('touchend', this.onDragEnd);
        this.shadowRoot.removeEventListener('mousemove', this.onDrag);
        this.shadowRoot.removeEventListener('mouseup', this.onDragEnd);
        if (this._moveData) {
            if (this._moveData.grabElement) {
                this._moveData.grabElement.classList.remove('piece-dragging');
                this._moveData.grabElement.style.left = '';
                this._moveData.grabElement.style.top = '';
            }
            if (this._moveData.fromSquare >= 0 && this._moveData.toSquare >= 0 && this._moveData.fromSquare != this._moveData.toSquare) {
                if (!this._match.makeMove(new Move(this._moveData.fromSquare, this._moveData.toSquare))) {
                    this.playSound('illegal');
                }
            }
            this._moveData = null;
        } else if (this._highlightData) {
            if (this._highlightData.fromSquare == this._highlightData.toSquare) {
                this.toggleHighlightSquare(this._highlightData.fromSquare);
            }
            this._highlightData = null;
        }
    }

    private updatePosition() {
        if (this._match) {
            const currentPieces = [];
            const currentPieceElements = [];
            this.shadowRoot.querySelectorAll('.piece').forEach((element: HTMLElement) => {
                const square = Number(element.dataset.square);
                currentPieces[square] = Number(element.dataset.piece);
                currentPieceElements[square] = element;
            });
            const piecesToMove = [];
            const piecesToCreate = [];
            for (let square = Square.A1; square <= Square.H8; square++) {
                const piece = this._match.getPiece(square);
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
        } else {
            this.shadowRoot.querySelectorAll('.piece').forEach((element: HTMLElement) => element.remove());
        }
    }

    private clearLastMoveArrow() {
        this.shadowRoot.querySelectorAll('.arrow-last-move').forEach((element: HTMLElement) => element.remove());
    }

    private showLastMoveArrow() {
        this.clearLastMoveArrow();
        if (this._match) {
            const lastMove = this._match.getMove();
            if (lastMove) {
                const boardOverlay = this.shadowRoot.querySelector('.board-overlay');
                boardOverlay.appendChild(this.createLine({
                    fromSquare: lastMove.getFromSquare(),
                    toSquare: lastMove.getToSquare(),
                    classes: ['arrow-last-move']
                }));
            }
        }
    }

    private showLegalMoves(square: Square) {
        this.clearLegalMoves();
        if (this._match) {
            const originSquareElement = this._squareElements[square] as HTMLElement;
            const destinationSquares = this._match.getLegalMoves().filter((move) => move.getFromSquare() === square).map((move) => move.getToSquare());
            originSquareElement.classList.add('square-origin');
            for (const destinationSquare of destinationSquares) {
                const destinationSquareElement = this._squareElements[destinationSquare];
                destinationSquareElement.classList.add('square-destination-hint');
                if (this._match.getPiece(destinationSquare) >= 0) {
                    destinationSquareElement.classList.add('square-destination-hint-capture');
                }
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
        const squareElement = this._squareElements[square] as HTMLElement;
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

    public toggleHighlightSquare(square: Square) {
        this._squareElements[square].classList.toggle('square-highlighted');
    }

    public clearHighlightedSquares() {
        this.shadowRoot.querySelectorAll('.square-highlighted').forEach((element: HTMLElement) => element.classList.remove('square-highlighted'));
    }

    public addHighlightArrow(fromSquare: Square, toSquare: Square): Element {
        const line = this.createLine({
            fromSquare,
            toSquare,
            classes: ['arrow-highlighted']
        })
        this.shadowRoot.querySelector('.board-highlight-overlay').appendChild(line);
        return line;
    }

    public clearHighlightedArrows() {
        this.shadowRoot.querySelectorAll('.arrow-highlighted').forEach((element: HTMLElement) => element.remove());
    }

    private createLine(options: {fromSquare: Square, toSquare: Square, arrowWidth?: number, arrowHeadWidth?: number, arrowHeadHeight?: number, arrowOriginOffset?: number, arrowDestinationOffset?: number, classes?: Array<string>}): Element {
        const fromSquare = options.fromSquare;
        const toSquare = options.toSquare;
        const arrowOriginOffset = options.arrowOriginOffset ?? 1;
        const arrowDestinationOffset = options.arrowDestinationOffset ?? 0;
        const arrowWidth = options.arrowWidth ?? 2.2;
        const arrowHeadHeight = options.arrowHeadHeight ?? arrowWidth * 1.8;
        const arrowHeadWidth = options.arrowHeadWidth ?? arrowWidth * 2.6;
        const fromSquareRect = this.getSquareRect(fromSquare);
        const toSquareRect = this.getSquareRect(toSquare);
        const arrowAngle = 180 - (Math.atan2(toSquareRect.x - fromSquareRect.x, toSquareRect.y - fromSquareRect.y) * 180 / Math.PI);
        const fromSquareCenterPoint = new DOMPoint(fromSquareRect.x + (fromSquareRect.width / 2), fromSquareRect.y + (fromSquareRect.height / 2));
        const toSquareCenterPoint = new DOMPoint(toSquareRect.x + (toSquareRect.width / 2), toSquareRect.y + (toSquareRect.height / 2));
        const arrowHeight = Math.sqrt(Math.pow(toSquareCenterPoint.x - fromSquareCenterPoint.x, 2) + Math.pow(toSquareCenterPoint.y - fromSquareCenterPoint.y, 2)) - arrowOriginOffset - arrowDestinationOffset - arrowHeadHeight;
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
        if (options.classes) {
            polygon.classList.add(...options.classes);
        }
        polygon.setAttribute('points', polygonPoints.join(','));
        polygon.setAttribute('transform', 'rotate(' + arrowAngle + ' ' + fromSquareCenterPoint.x + ' ' + fromSquareCenterPoint.y + ')');
        return polygon;
    }

    private getSquareRect(square: Square): DOMRect {
        const file = BoardUtils.getFile(square);
        const rank = BoardUtils.getRank(square);
        const width = 12.5;
        const height = 12.5;
        const x = file * width;
        const y = (7 - rank) * height;
        return new DOMRect(x, y, width, height);
    }
}

if (!customElements.get('neochess-board')) {
    customElements.define('neochess-board', NeochessBoardElement);
}

declare global {
    interface HTMLElementTagNameMap {
        'neochess-board': NeochessBoardElement,
    }
}
