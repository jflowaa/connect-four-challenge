from Player import Player


class Human(Player):
    def __init__(self):
        super().__init__()

    @staticmethod
    def make_move():
        return input("Enter Column: ")

    def print_board(self):
        print("[*] Current Board:")
        for row in self.board:
            print("|" + "|".join(row) + "|")
