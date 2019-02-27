class Human:
    def __init__(self):
        self.board = []
        self.token = ""

    @staticmethod
    def make_move():
        return input("Enter Column: ")

    def print_board(self):
        print("[*] Current Board:")
        for row in self.board:
            print("|" + "|".join(row) + "|")
