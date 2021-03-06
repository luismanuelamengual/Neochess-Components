import {BoardUtils, Match, Move, Side} from "@neochess/core";

window.startNew = function(options) {
    if (!options) {
        options = {};
    }
    if (!options.whitePlayer) {
        options.whitePlayer = matchOptions.whitePlayer === 'human' ? 'computer' : 'human';
    }
    if (!options.blackPlayer) {
        options.blackPlayer = matchOptions.blackPlayer === 'human' ? 'computer' : 'human';
    }
    matchOptions = options;
    match.startNew();
    board.whiteInteractionEnabled = options.whitePlayer === 'human';
    board.blackInteractionEnabled = options.blackPlayer === 'human';
    board.flipped = (options.whitePlayer === 'computer' && options.blackPlayer === 'human');
    engine.ready = false;
    if (options && options.engine) {
        if (options.engine.level) {
            postEngineCommand('setoption name Skill Level value ' + options.engine.level);
            postEngineCommand('setoption name Skill Level Maximum Error value ' + Math.round((options.engine.level * -0.5) + 10));
            postEngineCommand('setoption name Skill Level Probability value ' + Math.round((options.engine.level * 6.35) + 1));
        }
    }
    postEngineCommand('ucinewgame');
    postEngineCommand('isready');
}

window.goToPrevious = function() {
    match.goToPreviousPosition();
}

window.goToNext = function() {
    match.goToNextPosition();
}

window.goToFirst = function() {
    match.goToStartPosition();
}

window.goToLast = function() {
    match.goToCurrentPosition();
}

window.toggleFlip = function() {
    board.flipped = !board.flipped;
}

function postEngineCommand(command) {
    engine.postMessage(command);
}

function checkForEngineMove() {
    if (engine.ready && (board.match.getSideToMove() === Side.WHITE && matchOptions.whitePlayer === 'computer') || (board.match.getSideToMove() === Side.BLACK && matchOptions.blackPlayer === 'computer')) {
        postEngineCommand('position fen ' + board.match.getFEN());
        let engineCommand = 'go';
        if (matchOptions.engine && matchOptions.engine.maxDepth) {
            engineCommand += ' depth ' + engine.options.maxDepth;
        }
        if (matchOptions.engine && matchOptions.engine.maxTime) {
            engineCommand += ' movetime ' + engine.options.maxTime;
        }
        postEngineCommand(engineCommand);
    }
}

let matchOptions = {};
const match = new Match();
match.addEventListener('moveMade', (move) => {
    checkForEngineMove();
});
const board = document.querySelector('neochess-board');
board.match = match;
const engine = typeof STOCKFISH === "function" ? STOCKFISH() : new Worker('stockfish.js');
engine.loaded = false;
engine.ready = false;
engine.onmessage = (event) => {
    let message;
    if (event && typeof event === "object") {
        message = event.data;
    } else {
        message = event;
    }
    if(message === 'uciok') {
        engine.loaded = true;
    } else if(message === 'readyok') {
        engine.ready = true;
        checkForEngineMove();
    } else {
        var matchData = message.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
        if(matchData) {
            const fromSquare = BoardUtils.getSquareFromString(matchData[1]);
            const toSquare = BoardUtils.getSquareFromString(matchData[2]);
            match.makeMove(new Move(fromSquare, toSquare), true);
        }
    }
    console.log(message);
};
postEngineCommand('uci');
startNew({whitePlayer: 'human', blackPlayer: 'computer'});

