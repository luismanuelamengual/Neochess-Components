import {BoardUtils, Figure, Match, Move, Piece, Square} from "@neochess/core";
import {NeochessBoardTheme} from "./neochess-board-theme";

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
            z-index: 150;
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
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA8UExURUxpcUFBQUNDQ0REREREREVFRUVFRUVFRf////j4+O/v7+Li4tPT08TExK+vr5SUlICAgGtra1VVVUZGRh1ZfCsAAAAIdFJOUwAgPF19qsrhYMPqTAAAA+1JREFUeNrtm9vSqyAMhSv1FAmKrPd/132BWs+2u0g6/7Bu25l+k4QQFvTxSEpKSkpKSkpKSkpKSkpKSkpKSvpVZUoplf0UkspLDCpz9SNhyissVOU/QJVjq+opnT4fKWdbo7XWprVDLkWr7AkA6A3VNQ1q2h4AoIQT6Ez9giIiotYBwFOUqqM1FVHTC3IpAGjrLRVR04nlMasOqYh0B6CSqPvihIqILYBCZhHaQyrS3IuksQTQHFIRcSsRLjWk8IiKNFsAWfzKcs05lgEQe3sE0J1RUcPcA1X8HPIpFjF30bOYA6BTKmI20Vt9AfTnwSLN7GIXVwnYcypi5j52iyiB7i2sMipW9RaWFcE6pWokolUC9hxLS9RWAfTXWNFXYg7gMofx+5YCYK6CFb/LPwB0F8ES2BP9BHHaHUQmCAWgPU0hW4nxtAScPqMyIsP8E4A9ziALzfKP8iCNjacSOvk8MuxyaU8ldk70vki7C8WdoDsyeBCv9I1QLOlB+OP+VPeNntRDLIWjD2h3mqqPFiTMSlUO5tZu4+qcjCfoQ9U19cGWaCQCNoXq2Bnh+AEbQkXHR7KGOXbA/AJ0XNdnhg0zcxszYM8pVCdYvoUZG6+tKgCmrqmuqT4fbYZ2Hw+L6UJjv2+jDc7Z1Rz/GiN8tOKdXe0F1nx3jHWCLQDo96jaiB1C4SJcExX3Mc9kxeKazvBK7eLjeCOqWvzumorN4uOIu888XG6DxXOqmJt1lg8qgX6L5YBy/IbIMFgBVm+weplDz8qK2HDZ+ObDnnGz5hKwajaDl6YNVyt5J+xP1v2qgY41L1hc2eucqNfFBdkcMu1wyWaxGnO44XKxre/V9NzSLpcVfKBRAW5/cGADsXDlANr6gMtKVVeGVbDmszIbJ2SOlAA2DkSz6PSFTAp3rhSbxWCaS6xC1+w9r1kMg5FXo8LhHXqzmJ2jcqnq5HVGM1+NMbkUhmcQNf0Q13Oiqi/O1DGt3fyKatZYbaxTRla+qGp6j+t+h8sbgeaK6pXIDvcn0ofK6WuqF5i3BIvs5lqfjMArrBHMe6iVujWBbkjgG1TTfUt350PU3F9afEI1kpn7OsVzemb6CdR4HXRXZ1WzFfghlX9RfI97U81iRf+j7o45On/10P+jIrLhG34GoKdvoIgaFzyNxTBefUHlyysPHSz7LRVRH9gDyMdgfUVFoZ8oVf7h5JdURGE9gMsHzJ80iSxoDpsAVKSDZrEE+hBUREH9OFw/53y/pVYh24MJQkUhrxefAHQYLBNwjrh8NilT8zng6kBcAfefYm6Rfr8U/z6W6wIpLFZI/XWsKqh+4a+xSUlJSUlJSX9R/wAgFdSXQxyROwAAAABJRU5ErkJggg==');
        }

        .piece-white-knight {
            background-image: url('data:image/png;base64,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');
        }

        .piece-white-bishop {
            background-image: url('data:image/png;base64,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');
        }

        .piece-white-rook {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAA/UExURUxpcUFBQUNDQ0REREREREVFRUVFRUVFRf////j4+O/v7+Li4tPT08XFxbS0tKCgoI+Pj3p6emNjY1NTU0ZGRi8lq24AAAAIdFJOUwAiRmyXweDwOT8tswAABR1JREFUeNrtm2FzozYQht+VsO/aGZxk2v//C3vTnP3h7my0bz9gbIEhloTkuK02M5nYKPDw7mq1SAKoVq1atWrVqlWrVq1atWrVriZ5ziLnExHkU2BZEdmNvtmTdJ+Ntd3NfLk/PhZLREQAoBt89edwiP7Z/hraNwBAMtK3TURbY8xFmr/d9bY6VVIhAESMWAvImcK8XARU1QJYYm07o7IAOLnLN6RCPayrM3bAwTnmxRL7OvyphBgYD4tjAPU+mb597/gWeA8EC8OyTQsAdOoUwGaL3bfL+anjGCUvH2QHdEcA1lojAF4PncuHJS0A13XsL+9wcZNMYh0AOGQxyNBYtTPWGqB9zxtb/NVd3USBUQ9r3J+vXxiArv8kcM5sg3tXGBMgnRdBCk8PTrMM/aPqQesQiJmwphlOgZcrlmAJ6wXQpIwdrBaMh+Yu/9nO3D+B9nJy592VlFer/zx7IfpHnaQMKeFq+eeknv9Tzowju0Cb68Hlm8iIBR9rWa0pFnI78QDIJJO31hgjmCmwSECMMbadSCnAIevgM720A/C2ePsUvHoNfbWYM7ZuUqYSH3iFoyAcqZUX66YbaRiWJlabTZpa+PVR6+Nx/p7C1WqQZkw5mDtv3aqVVJsXiS1ZS5V9TLzNp4li5Vcrpuky1jOpJSikFg9r1LpiHTI7UTNgmZlqYyUWAZvqxfM1xAT7MEYtbJKnc/qnOuRXS/fARlaJZYF9biw4QLYpWtlhmJNrmXP/eTl4EDx9hZHoeSsZ7rtpgO9d/hmbDsBGjlwKn3NWGherZvD7xp5PkX20sm8A9NRdhehnu2QyWpLsZ7T0EiLWGm/yKfMgat8AQDsVIyIhUakESbEGcVRxI4ppdskpdd8pCmEBzWjuDSAx/AznO/+MT3xwXVxPie7vr713SFJJf/Z7Zpr1HHfvLnJaPLZoJgH80JvHwtsiceiS8gXxk/XRtbxMn7IGBlkoX0kpVp0uPIyNLq/K+KeRjGotO3hWMeIBan1YNFH5SVjtx16ZWRMgsCuNdbcep+bIQ9mxbrn4IKw7o8iU6xFYCMiNE66Uhc8EtRgLzoc4MeDm9TmxbtqUxtqFYenKxGVy54cZroSuaLLnh1svlscKrwi4qoQopdYUq7gTA++dXJMh4rE0ye3FYys0UnRNcJno5oznZ8p1MhaBy4BtSSxBqlqRwWUK5YcbfnkWta4ttTxW0m42lsWK6+xMzxDxaiViydNgjdqWxNqlzSjEF4KmWH7w1YpOXKZcflhTCEb3xGS18H9TK7ra8vN8Uaz0HcvPiMWnwuJDsNo1arWlsGKz6YquaIrmBz4K60FqNekR3y/oyGhLCM+/2W+S97ikGBYAPa9tSthOIKJf8oQyrrCJVMv8HplCk3adRrTtN0YuSLLM4tvBBb9gEIhl7Is/6zEsRy+9QCP9Sme/kO27+7vTfFiXdwuoTqmxKVWMGDus8YeteIZgyWYHAJ3r1rxaJI1tAGB/YhYs2bYATifFWjObDYDD8T5XwK6R7Q7Qn6cML2HROSv4EvA6xn21mlfA/Zx0ttA0RJl2068WeO9WY8kfgP5gwrPe/AApvxng2z3pTYiXj5x29KSYFxEBjyGhE4LlnOR5XxCAiHMZsEwbsesqzBzQmpVYErW/Kci6gCgNwFLmxaJmwcpMFfS88S/FQhksZAj5ArZWrbaMWu16J36GVaz/AFbAA5mVx0sRgmWrEwPz2rbQdY+oVq1atWrVqlXLbP8ALD7swRCgEUgAAAAASUVORK5CYII=');
        }

        .piece-white-queen {
            background-image: url('data:image/png;base64,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');
        }

        .piece-white-king {
            background-image: url('data:image/png;base64,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');
        }

        .piece-black-pawn {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURUxpcSQkJCUlJSUlJSUlJSUlJSUlJSUlJSwsK3d0dGZjYlZTUk1KSUVCQjo5OSYmJrRYvAoAAAAJdFJOUwAfN1Z6o8Tg+2/nYHEAAAPpSURBVHja7ZlNTxNRFIZb2gpL4kKX4EbdlcSYuMMYEt3Vf4D+growcVklboDEWU/5BdA/AJxWtioUtiXktluRxApoGejHa+5MP+ZOKb09lxij8+7K4sk5Z87HO0MkEipUqFChQoUKFeqf1s0Hd66J9DADoPbkGkjRp/D02pz1DB29N0XdA5yDtVzhK4CXZqiYhdaGnSOiggVnxoiVgrPqoogKwKkJKg7s2yvkaR0wCWwWdTtLHVVxYtAPFjbaGUrt4mySzbqhhCXL/9wgxcNutYgoXzJIMg3bJp/KqLGbCw1/ikRFC9NMVgLnvspLVgWPmawJ7CspUqGEV0xWEqtZlVXGMXuA/E9RsgR7jOZbarkk6ye3JZp9LOsXk5VpqKWXrBqblf0rWemm+hipyK/XfCvAEvznmEKuj3XK7nsVlRf8vp/AUaBc/HlMoB5IscJerDG01I4Q/P0VyWBbSdFgr0Zm/QUrCGGy72+g6XuIMkX+HYpaOOhlKMom9zEy2w2sKIQwutvST7gVy0tUycxPjFlwJGpHyjJKMZICvnWr/8nIGt4FlnurIl81sIZxQNn4woLDvLVjGWkK/Y1fBmqT3GLtK36iIB8lq2S3gSVbObYF2WKsks2iYdvKgfTG6ITF+rK5uUYBVpnFSioLp50jc0tP9eZaYf1gsMYD296bb97GT6ARPEPuruB065i67b2whAVWs6a9Vz3RVtn7yTMBSZUlvJ/vmOfxMhZvuKNzc3NzGafHqsk/GKzDTKvYYbH9Ukdo5busMzPUGJrUCayKSSNWHHXKd1lm79vjWKZOYBWDq+312BF1AivhreF3gO3O9Iiy2XeAiOV0p1o2mGnpu2Mtqnwn55Z+qbduRAUvjMq16ds3JZOCRS0n69uDwvD7RNa/CKsGHZbC/op/QZfYrzCRGJze3S56K4w7Rvdx4bvbXpILbFO4YQevozPNDKvh/wST987QAq9afZaJ7X9TMqwV9d1KBsZ4lLeAz6plcrMsMQxY3ELdtu1+c1Id+XNmNC29qp3tdyeje9ZHsvCBFNuwEkZ7lnHXqwZTlNpxPevMSM+waV8WlvdqZI2ye2LAhh1oCB9td5TAku4zzNIgVUdwOxk3rNxA1kf9KxJ3qzUYJQPTtU5TWLwqQyLa0k5yHquXtYN/AHSnMipTzF3JIsvRLdfF1RkS0Z5mwcZxOCwsWtc8u0llNQ/qimPNARrU8b7e1xyjtDM0RSJNI2w1skNRVD3Ta4n6ynBWRcsIx3AxPEXa0/JicZyTDmtGi7WowdrSatZE2wteD2tZg7Wuyfrwfbj0bF0CevrjrDd64v6nKFSoUP+zfgN+r0dDyFRp3AAAAABJRU5ErkJggg==');
        }

        .piece-black-knight {
            background-image: url('data:image/png;base64,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');
        }

        .piece-black-bishop {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAqUExURUxpcSUlJSUlJSUlJSUlJSUlJSUlJSwsLHd0dGdkZFZTUkVCQjw6OiYmJk6AIV8AAAAIdFJOUwAWNFWCq977e1jxYQAABNNJREFUeNrtmb9v20YUx/XDUlZrSScBGVJkMpCtk4AiuwAXBdqJQIMk3Qg07eAkCHfSyB9ACegc+9hdgk+aGyTSEDsSK4nf/6W4H6QpmSLveETRAHqbnfiD977v3feeTrXaIQ5xiK8qOpWRHtpY/lgN6luweFYF6ggifqiAZQEfyQRYHleR1tgj5C/gqTHrBCuXEEJGWBizbPjnjEUdPDBENbHhaZFgjlNDVguveFqEjvDZkHUP46HIa4IbY+l9IvKi+GLMGiQs00b2MCSxXgvjvKRcdI4/DFldkFh6PDZktfFRsEbGbawdYS3kMh/VWgMhZ02q8AmLF1lFiWwoompOIzvbeO0xlwjNS+wjcj0m15eaeRsxdrlcLytQfu2ec7m+Z009NXIvXHgkkau9MEpr5Q5JIlffoJktwPfEdDFPrTsGVtGXadEpT6gFlE6sCfiuPIwPuGeUT6yHFWsiCaizFOpR8H6WONYOLlzhg1z6OkIyLTmz97FmI08IneCaz+2GBCUd0cKYK8+s/hdui28ImeL3UscncmWJU65SD1eEBKV8rIfXosRAttHi1l/GfOo2fFmibKPDjIy8L6F+C2tRYnzLNrDhPzr66vfwIS6Rcn+Ob5Gp9lJXd+DzQSUBnfDTyNtI2Ia4MChRjESXtbFUkSdxiZx1yosWKP0i7bhEQuV49WOWbifZaikmIqByvOxQsgLNzbWNV1IuzjpOxqvEXdnDhZQrkKMajxd32WstuUJXysVYC171WrKI3obYZBMxlNIL9zpKsbQEazG5blk3/FdvEtZUR7AuxlJ6QqUTxkud8LOXOheQL6XnrM980U9Yequ+HcXSc9Zv6SPE/V9d/Mat9MlxPEmzxMQp2vM/W6yt4yhYj9Wn/kMsfTZLo5HdZOozjjZjjbiEiifIv8sKU6yJ+inqI2kjL4iJY6VZVH0orCiRfh9L2cLsTZolb8cozXKUByzx+hTL3mYtVe+gXdbxHdY8VB77VdJGvshlsFCW1el0OrusY3XWeZrFoxyrucUKjFgNuT7LkKxNFSwq4ir9Cy0WyQmq0ce6AivUmPsClvLc15y1l4MKqM55tDfVsazIyy9Rw3P6KGTdqHv0MJ+l4dFdFMilcXe0b+/VfSzlOy2102TLNVX/GNlMHeSstKRtKx6iKJ+lPvZbF1hWiVpPmr294vO0JjrL7ze3i1tWWmKLUv80lJMWneu8BjT2iS8sVu8xzEJOWpqPYSfZglEpl9ZjWCtzWkVaenKxj7Xh3rQoljWt6GcUGcQlaj6Ptu8WKVH6L8ANZ3f0Y1SJF+Deru/QJK1rTVSthTATNSnzBGaxxFhhMxZns7ez2ewTS0v/DabxHeAgK55pfuf08CfkxIsnGjn9nP7L8IzHVpLPVXNr2vz/v/17djXw3VR4AzqbnfF/XKjB6haAT5dblC3icMRgSkP2CNjsBYk4n6t9Hdlw2EeFgvCmStN/H5HvFsMcFc9nT6FC6MFgd0W5vBwMBgL2TmFmG+wp1BvkLTrkkrVXwfRbWHm5IInz/yw+l/uvxp14XyxYL29f2vKz4u9c+yCKUWzVOWvJLquwkXakyirey9VZ80KWs1FmFV6TqI5V12CF/0/W9OtlRTPFcIpZ6vGfsn7ViNohDnGIQ2jGv7ULQsgUpwsIAAAAAElFTkSuQmCC');
        }

        .piece-black-rook {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAwUExURUxpcSUlJSUlJSYmJiUlJSYmJiUlJYiGhXh1dW1ramBeXVZTUk1LSkVCQjk3NyYmJt1oLkIAAAAHdFJOUwApUXmew+Gm1HRSAAAEcklEQVR42u2ZvW8cRRjGf7N2QBcRMnM+UlDAnnEoaEj8DxBb9EhBQqJBUESpIKHmP0AIXUOBUuAaKYEORQqJKwoULIsCiRDsoySxbkdHsKXEvpdid897vv2YWR+EYt/uZnefeZ73az4OGmusscYaa6yxo6YcXukaiAb2+JMtvSOxXVo9NtYVSW23rsb2otH73wACEJn03RcuSLS1nf/NfO5o8OZN4NEpUBxc37JLoTKLWlt47Wvg0q1+7ld5gwsf3kx5KPY3bCdEBvHnGuDaL+ddsTo7PSBKngnBOQCLBkLZttDaWHHTOPcQDq63WQq1RQGLyQMNqvfkS169qLl9ftOFl4IHn/ycEFFYFWawGBG8tGUTsZVYwuPPCcESgsIupMMaAoRlGFiso+9HECYfK2xKK/7Zn9OAdfS9JCEU1qDFcKymByfZ7Mb6XHmpBCsAGGamIGQYFuZ9Aa8AEBTosZOTn8NErjsvAGyQxQIFoYTFdZfLSyUAJ7MEBAVrkkJb13qMsaxetlnvBIvl3S4P6+pnCRY/JS6PmejfD4O851iPVhXKGEMLzr7XRe/b2AHaVWPK6+DWxPDdPH6VGit6sfbTWMtq8FJevs937b/ES82Kl/bjFVbqceW1W46lQfG+I9aoFCtOmL4z1lwFlnbGkqsnSkIZAnrPusZxkwulSaTYd95P/MBCocIQMLznXHpqxE5miVcaJBHV1qC6GOtcxq9vcr8PqK7SJh2MxA6CGOqv591bQnCAbCljpp9EYKDb9yjTM1JmH/jtMd9YTwtK0j3mmOWjU5578re+RaIosihzWMwGA38/57GmJQV+N46VDKLuobciFsWnTxzdMci2rd0Lp7qKTBw6VA1eWRtMr3i1sdh24FX4QEa3JydNe1pbK09eKmcPW9Xwi7GOhr4/ThZ9nDgeJXZcjZllUx8fK6qPZQtEyyx4jdF9sVo5uwp7eP7wwtIlkVXeOWGd9hB1ecXw4s0r98Bj62nUNe4hAp8NlszQX1LeDP002loaeyV6Wn5YqjTntCeWlCTxTLCkDq+ZnTuK/SX1/GVLFgI9C17U4dUq4GXLmmHgX9qFrAP3Vlh5HAw82lf2AuUpaZwplpQl6wx5WT+sXmk7bj2t2i5sX6XFHdQoR+uJJTWKe748kbRBnU4ucCyRWN87PlDYttFqcvp2sjuUoRcvRadTMLmBts/dUefKxNEzGg0iibIjuyuuETt7L1Yz2I4mPKS0Me1ufCR9+4YTVuchcH9ju4h1+5VVYPWOA5b6qMdvN8qdcPYiey9OxXT65ubM9/z4XYVDB78un7i3WZ2r7/LgziRzpYw5Erqdr/iiWuP8E/k0drTSmbP/+OghNg7HZb2yXoX1cv/PNUzeNUcGMop45uPh6apcPcd6u1vhLmMY/DHt6imsUBYWHNK5beyzVb5XPXGrDWVbugIrcDhzpufcsIqXR0/WlViu/6WKA9bseM1yHWp5aOz993vfBst5fXQqbUcs87/UuHfZ/dvHNNZYY4352T/ZP4i5JEtsbQAAAABJRU5ErkJggg==');
        }

        .piece-black-queen {
            background-image: url('data:image/png;base64,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');
        }

        .piece-black-king {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWCAMAAAAL34HQAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAzUExURUxpcSIiIiUlJSUlJSUlJSUlJSUlJSUlJSUlJYWDgnd0dGNgYFZTUk5MS0NAQDIxMSYmJtBHgnAAAAAJdFJOUwARMVJ8nr7f8e5A/hcAAAUDSURBVHja7ZrrmqMgDIYrB3WLHO7/avcBPCJgwNh29+GbX9Pq+E4SYxLzejU1NTU1Nf17oieRX8AaTSjWsP5BrOnPqvdPYb0XTT+FJaZFDathoeX2Mxb/Xr4/ZKsA64sZrGHV5/YNS2yffQ3rvSX3RdtH769hba6LqWE1rIbVsH4O6z39IpZaJXcwcv30649qtcPSP1RB7KR+Bkv/Dla3aAiwXKQvX36tpu+C0HLBxT92dUIZd2KMkp0VqDFGhlhDcOZy6uHM20iUD8HwY+gZ9VfgQcT74OrmE1kfDk56htMNEX4eyeyu0IehNUljDH29COsT5w3sts3o9re11kpprY9XOIWW7xTZ0b7aaf115LfAOj7/VTUJV54LIYRN5Ac4GWDtv9NKye17KdX85XgjdVDvPjUjBb5armDCZ6FakWTsUTmf19cazJtKxpj2ZPr0cYbJH+DARlrlQBdVKg01k51CywZXhmlnUFpLNeWhPNn5otOlvMHKA8xSaXHoTHGlauxl40oDTHWXqyy30uepPNdQcj92NjOIh6l8fPHCwJqeppozGC1yoXqeymaXY7WRl32ePXgPVpqLzrl9eh6rxFy9N5Z4HksWmKv7mLFsTwm+GZlPDh8wlvWiNmbsgD7UnzGWxVJQL3ofiozh1VWBMO0Lv0MhWO1FkvOh1CZf4xUeLZ0XB2BoJXwo9bFAl9dJKT6nCLBMB6oddNxYAVUe7HywSkQErI7o3YMnhuUuxG1/2K3dlsyWnyN378jmo1USi4KePDLqQ3t+T3b9Y8Y3OuwHafx/kOAx2JjCOlVHpE/Zy1fE3enxfw9rimHJiLFZwlz27iKRdHgDyySw7OnX45r00IZFOsoFi9/CGu5g0ZjDLRZs8DR+GgvmxNSdGMsvJVg85kT4QNrnrXjI83os27XoFBaFZvnEXU+qsXjsUKnAWZ66R/UUN1fQ1sGxqEkZyxZcwOI0/trk3NaBscgYTbyzsXpg36PidY0OoxOKZafkiRwPfgXjiub4PCucsgCx3PQnnuKhdY2vA2W8ZpbBlAWGlaBajQXy4dyQgaY/MKw+XpmtxgL2r8TNSyFcICyermmK2lc/GcnUdyMpwMpSFc1GSDwWzlwALJajKoisZErep4mZ6xrrkqpkHpjIMzsun+4vsahJJyzvwqKpLsm1D47LTfuvsMglVf8qErvmopTlimbG3NpgnmosfZXBc2EvL9o/nftaqqrA2idBAFceS2epal5jDFdpwr+Qk9E+X0Ooqt6SkSyXBAxtpMxSVb7RdkWSxh7/3aV6gGtP1b9eP8KFRIXMhUaFyoVIhch1oLq/pUHG3GP7W1Tz+32FRKWxqJLVyZepkhPGOqoBb/uH3eN6iOqizIFSHboTHPU3wkvdK2UuyxwZFgjbMqfS88+68ymX+kGpysq9pElzKMG6VEZuQaqm+SoJezBNhA8/sJwX2YVJVqWPGyi2C7k574oJId5p+QW0YANtQA0uNq4dQxYlibgtyQ5ojvQ7U0ZP71sS87s8ipizlk28e/KdGkXL8AYDyqqyaU3sTIkgmIVfqcxqOez4H01FazX5hRux3Vu1Wvlwtvv9wo1AWtawaBrDXDwzsKwsKDCia8RurB0WQ3hCK1wsmyV6jNDCX1UcEOqGJzYo70e8xsZCiPmGVfiYfgSLNiyoGtbnsRSyNArWI/o/sfjwjLAb2aampqampqam1195W8+wSJhrTQAAAABJRU5ErkJggg==');
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
    }

    public connectedCallback() {
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            this._squareElements = [];
            this.shadowRoot.querySelectorAll('.square').forEach((squareElement: HTMLElement) => this._squareElements.push(squareElement));
            this.shadowRoot.addEventListener('contextmenu', (event) => event.preventDefault());
            if (this.isTouchDevice()) {
                this.shadowRoot.addEventListener('touchstart', this.onDragStart);
            } else {
                this.shadowRoot.addEventListener('mousedown', this.onDragStart);
            }
        }
        this._match.addEventListener('positionChange', this.onPositionChange);
        this.updatePosition();
        this.showLastMoveArrow();
    }

    public disconnectedCallback() {
        this._match.removeEventListener('positionChange', this.onPositionChange);
    }

    public get match(): Match {
        return this._match;
    }

    public set match(match: Match|null) {
        if (match != this._match) {
            if (this._match) {
                this._match.removeEventListener('positionChange', this.onPositionChange);
            }
            this._match = match;
            if (this._match) {
                this._match.addEventListener('positionChange', this.onPositionChange);
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

    private isTouchDevice() {
        return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
    }

    private onPositionChange() {
        this.updatePosition();
        this.clearHighlightedSquares();
        this.clearHighlightedArrows();
        this.clearLegalMoves();
        this.showLastMoveArrow();
    }

    private onDragStart(event: MouseEvent|TouchEvent) {
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
                this.clearHighlightedArrows();
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
                            const clientX = (event instanceof MouseEvent)? event.clientX : event.changedTouches[0].clientX;
                            const clientY = (event instanceof MouseEvent)? event.clientY : event.changedTouches[0].clientY;
                            this._moveData = {
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
    }

    private onDrag(event: MouseEvent|TouchEvent) {
        const clientX = (event instanceof MouseEvent)? event.clientX : event.changedTouches[0].clientX;
        const clientY = (event instanceof MouseEvent)? event.clientY : event.changedTouches[0].clientY;
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
        if (this.isTouchDevice()) {
            this.removeEventListener('touchmove', this.onDrag);
            this.removeEventListener('touchend', this.onDragEnd);
        } else {
            this.removeEventListener('mousemove', this.onDrag);
            this.removeEventListener('mouseup', this.onDragEnd);
        }
        if (this._moveData) {
            if (this._moveData.grabElement) {
                this._moveData.grabElement.classList.remove('piece-dragging');
                this._moveData.grabElement.style.left = '';
                this._moveData.grabElement.style.top = '';
            }
            if (this._moveData.fromSquare >= 0 && this._moveData.toSquare >= 0) {
                this._match.makeMove(new Move(this._moveData.fromSquare, this._moveData.toSquare));
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
                    arrowOriginOffset: 1,
                    arrowDestinationOffset: 2,
                    arrowWidth: 2,
                    arrowHeadHeight: 4,
                    arrowHeadWidth: 6,
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
            arrowOriginOffset: 4,
            arrowDestinationOffset: 0,
            arrowWidth: 2.8,
            arrowHeadHeight: 4,
            arrowHeadWidth: 6,
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
        const arrowOriginOffset = options.arrowOriginOffset ?? 4;
        const arrowDestinationOffset = options.arrowDestinationOffset ?? 0;
        const arrowWidth = options.arrowWidth ?? 2.5;
        const arrowHeadHeight = options.arrowHeadHeight ?? arrowWidth * 1.3;
        const arrowHeadWidth = options.arrowHeadWidth ?? arrowWidth * 2;
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
