from ws4py.client.threadedclient import WebSocketClient
import json
import sys

from Bot import Bot
from Human import Human

# This can be changed to the server's local IP
SERVER_URL = "ws://127.0.0.1:3000/"


class ConnectFourClient(WebSocketClient):

    def __init__(self, *args, **kwargs):
        super(ConnectFourClient, self).__init__(*args, **kwargs)
        if len(sys.argv) > 1 and sys.argv[1] == "human":
            self.player = Human()
        else:
            self.player = Bot()

    def opened(self):
        print("[*] Connected to server")
        payload = {"command": "init"}
        self.send(json.dumps(payload))

    def closed(self, code, reason=None):
        print("[!] Lost connection to server\n{}: {}".format(code, reason))

    def received_message(self, msg):
        try:
            payload = json.loads(str(msg))
            command = payload.get("command")
            if "token" == command:
                self.handle_joined(payload)
            if "waiting" == command:
                player = payload.get("player")
                if self.player.token == player:
                    self.handle_turn(payload)
            if "winner" == command:
                self.handle_winner(payload)
        except TypeError:
            print("[!] Unexpected message from server: {}".format(msg))
            sys.exit()

    def handle_joined(self, payload):
        if payload.get("token"):
            print("[+] Joined")
            print("[*] Player Token: {}".format(payload.get("token")))
            self.player.token = payload.get("token")
        else:
            print("[!] Max players joined. Closing...")
            sys.exit()

    def handle_turn(self, payload):
        print("[+] Player's turn")
        self.player.board = payload.get("board")
        self.player.print_board()
        column = self.player.make_move()
        self.send(json.dumps(
            {"command": "move", "player": self.player.token, "column": column}))

    def handle_winner(self, payload):
        player = payload.get("player")
        if self.player.token == player:
            print("[+] Player won")
        else:
            print("[+] Player lost")
        sys.exit()


if __name__ == '__main__':
    try:
        ws = ConnectFourClient(SERVER_URL, protocols=['http-only', 'chat'])
        ws.connect()
        ws.run_forever()
    except KeyboardInterrupt:
        print("[*] Closing...")
        ws.close()
