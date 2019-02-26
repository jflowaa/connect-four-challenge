const PlayerCommands = require("./PlayerCommands.js");
const ConfigConstants = require("./ConfigConstants.js");

module.exports = class PlayerManager {
  constructor() {
    this.activePlayers = [];
    this.waitingOnPlayer = ConfigConstants.PLAYER_ONE_TOKEN;
  }

  reset() {
    this.activePlayers = [];
    this.waitingOnPlayer = ConfigConstants.PLAYER_ONE_TOKEN;
  }

  broadcastWaitingMessage(expressWs, board) {
    expressWs.getWss("/").clients.forEach(client => {
      client.send(
        JSON.stringify({
          command: PlayerCommands.WAITING,
          player: this.waitingOnPlayer,
          board: board
        })
      );
    });
  }

  broadcastPlayerJoinedMessage(expressWs) {
    expressWs.getWss("/").clients.forEach(client => {
      client.send(
        JSON.stringify({
          command: PlayerCommands.JOINED,
          player: this.activePlayers[this.activePlayers.length - 1]
        })
      );
    });
  }

  broadcastWinnerMessage(expressWs) {
    expressWs.getWss("/").clients.forEach(client => {
      client.send(
        JSON.stringify({
          command: PlayerCommands.WINNER,
          player: this.waitingOnPlayer
        })
      );
    });
  }

  playerJoin() {
    if (this.activePlayers.length === 0) {
      this.activePlayers.push(ConfigConstants.PLAYER_ONE_TOKEN);
      return ConfigConstants.PLAYER_ONE_TOKEN;
    } else if (this.activePlayers.length === 1) {
      this.activePlayers.push(ConfigConstants.PLAYER_TWO_TOKEN);
      return ConfigConstants.PLAYER_TWO_TOKEN;
    }
  }

  swapWaitingOnPlayer() {
    if (this.waitingOnPlayer === ConfigConstants.PLAYER_ONE_TOKEN) {
      this.waitingOnPlayer = ConfigConstants.PLAYER_TWO_TOKEN;
    } else {
      this.waitingOnPlayer = ConfigConstants.PLAYER_ONE_TOKEN;
    }
  }

  isReady() {
    return this.activePlayers.length === 2;
  }

  clearPlayers() {
    this.activePlayers = [];
  }
};
