from ws4py.client.threadedclient import WebSocketClient
import json
import sys

from bot import Bot

SERVER_URL = "ws://127.0.0.1:3000/"


class ConnectFourClient(WebSocketClient):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.player_token = None
        self.bot = Bot()

    def opened(self):
        payload = {"command": "init"}
        self.send(json.dumps(payload))

    def closed(self, code, reason=None):
        print("[!] Lost connection to server\n{}: {}".format(code, reason))

    def received_message(self, msg):
        try:
            payload = json.loads(str(msg))
            command = payload.get("command")
            if "token" == command:
                if payload.get("token"):
                    self.player_token = payload.get("token")
                else:
                    print("[!] Max players joined. Closing...")
                    sys.exit()
            if "waiting" == command:
                player = payload.get("player")
                if self.player_token == player:
                    self.bot.board = payload.get("board")
                    column = self.bot.make_move()
                    self.bot.print_board()
                    self.send(json.dumps(
                        {"command": "move", "player": self.player_token, "column": column}))
            if "winner" == command:
                player = payload.get("player")
                if self.player_token == player:
                    print("[+] Player won")
                else:
                    print("[+] Player lost")
                sys.exit()
        except TypeError:
            print("[!] Unexpected message from server: {}".format(msg))
            sys.exit()


if __name__ == '__main__':
    try:
        ws = ConnectFourClient(SERVER_URL, protocols=['http-only', 'chat'])
        ws.connect()
        ws.run_forever()
    except KeyboardInterrupt:
        print("[*] Closing...")
        ws.close()
