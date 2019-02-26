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
        ws.send(playerManager.playerJoin());
        if (playerManager.isReady()) {
          playerManager.broadcastWaitingMessage(expressWs);
        }
        break;
      case PlayerCommands.MOVE:
        if (parsedMessage.player === playerManager.waitingOnPlayer) {
          board.move(playerManager.waitingOnPlayer, parsedMessage.column);
          playerManager.swapWaitingOnPlayer();
          playerManager.broadcastWaitingMessage(expressWs);
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

app.get("/clear", function(req, res) {
  res.send(board.createBoard());
});

// setInterval(function() {
//   expressWs.getWss("/").clients.forEach(function(client) {
//     client.send("hello");
//   });
// }, 5000);

app.listen(ConfigConstants.PORT, ConfigConstants.HOST);
console.log(`Server running: http://127.0.0.1:${ConfigConstants.PORT}`);
