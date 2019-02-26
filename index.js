var express = require("express");
var expressWs = require("express-ws");
var expressWs = expressWs(express());
const PlayerCommands = require("./PlayerCommands.js");
const ConfigConstants = require("./ConfigConstants.js");
var app = expressWs.app;
var board = new (require("./Board.js"))();
var playerManager = new (require("./PlayerManager.js"))();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.ws("/", function(ws, req) {
  ws.on("message", function(message) {
    var parsedMessage = JSON.parse(message);
    switch (parsedMessage.command) {
      case PlayerCommands.INIT:
        ws.send(
          JSON.stringify({
            command: PlayerCommands.TOKEN,
            token: playerManager.playerJoin()
          })
        );
        playerManager.broadcastPlayerJoinedMessage(expressWs);
        if (playerManager.isReady()) {
          playerManager.broadcastWaitingMessage(expressWs, board.board);
        }
        break;
      case PlayerCommands.MOVE:
        if (parsedMessage.player === playerManager.waitingOnPlayer) {
          board.move(playerManager.waitingOnPlayer, parsedMessage.column);
          if (board.checkWinner(playerManager.waitingOnPlayer)) {
            board.winningToken = playerManager.waitingOnPlayer;
            playerManager.broadcastWinnerMessage(expressWs);
          } else {
            playerManager.swapWaitingOnPlayer();
            playerManager.broadcastWaitingMessage(expressWs, board.board);
          }
        }
        break;
      case PlayerCommands.BOARD:
        ws.send(JSON.stringify({ board: board.board }));
        break;
      default:
        ws.send("Invalid Command");
        break;
    }
  });
});

app.get("/svg", function(req, res) {
  res.send(board.createBoardSvg());
});

app.get("/stats", function(req, res) {
  res.send({
    winner: ConfigConstants.TOKEN_COLOR_MAP[board.winningToken],
    player_one: playerManager.activePlayers.length > 0,
    player_two: playerManager.activePlayers.length === 2,
    current_turn:
      playerManager.waitingOnPlayer === ConfigConstants.PLAYER_ONE_TOKEN
        ? "Player One"
        : "Player Two"
  });
});

app.get("/reset", function(req, res) {
  board.reset();
  playerManager.reset();
  res.send();
});

app.listen(ConfigConstants.PORT, ConfigConstants.HOST);
console.log(`Server running: http://127.0.0.1:${ConfigConstants.PORT}`);
