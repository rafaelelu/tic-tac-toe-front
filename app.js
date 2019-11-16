$(document).ready(function () {

    var board = ["#", "#", "#", "#", "#", "#", "#", "#", "#"];
    var playerWins = 0;
    var computerWins = 0;
    var draws = 0;
    var clickable = true;
    startGame();

    function startGame() {
        clear();
        let whoStarts = prompt("Who will start the game?", "Type 'computer' or 'human'");
        if (whoStarts == null) {
            whoStarts = "HUMAN";
        } else {
            whoStarts = whoStarts.toUpperCase();
        }
        while (true) {
            if (whoStarts == "COMPUTER") {
                computersTurn();
                break;
            } else if (whoStarts == "HUMAN") {
                break;
            } else {
                whoStarts = prompt("Who will start the game?", "Type 'computer' or 'human'");
                if (whoStarts == null) {
                    whoStarts = "HUMAN";
                } else {
                    whoStarts = whoStarts.toUpperCase();
                }
            }
        }
        return whoStarts
    }

    function isBoardFull() {
        let emptySpaces = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i] == "#") {
                emptySpaces += 1;
            }
        }
        return emptySpaces == 0
    }

    function playerTurn(pos) {
        board[pos] = "X";
        updateBoard();
        if (isWinner("X")) {
            playerWon()
        } else {
            if (!isBoardFull()) {
                computersTurn();
            } else {
                draw();
            }
        }

    }

    function computersTurn() {
        clickable = false;
        let obj = {
            "board": formatBoard(),
            "player": 1
        }
        let newBoard = JSON.stringify(obj);
        $.ajax({
            url: 'https://tec-tac-test.herokuapp.com/',
            type: 'POST',
            data: newBoard,
            contentType: false,
            processData: false,
            success: function (response) {
                let pos = parseInt(response);
                board[pos] = "O";
                updateBoard();
                if (isWinner("O")) {
                    computerWon();
                } else if (isBoardFull()) {
                    draw();
                }
                clickable = true;
            },
        });
    }

    function updateBoard() {
        for (let i = 0; i < board.length; i++) {
            $("#" + i).text(board[i]);
        }
    }

    function playerWon() {
        playerWins += 1;
        updateStats();
        reset();
    }

    function computerWon() {
        computerWins += 1;
        updateStats();
        reset();
    }

    function draw() {
        draws += 1;
        updateStats();
        reset();
    }

    function spaceIsFree(pos) {
        return board[pos] === "#";
    }

    function updateStats() {
        console.log("Player Wins: " + playerWins + "\nMachine wins: " + computerWins + "\nDraws: " + draws);
        $("#playerWins").text("Player wins: " + playerWins);
        $("#computerWins").text("Computer wins: " + computerWins);
        $("#draws").text("Draws: " + draws);
    }



    function isWinner(symbol) {
        return (board[6] == symbol && board[7] == symbol && board[8] == symbol) ||
            (board[3] == symbol && board[4] == symbol && board[5] == symbol) ||
            (board[0] == symbol && board[1] == symbol && board[2] == symbol) ||
            (board[0] == symbol && board[3] == symbol && board[6] == symbol) ||
            (board[1] == symbol && board[4] == symbol && board[7] == symbol) ||
            (board[2] == symbol && board[5] == symbol && board[8] == symbol) ||
            (board[0] == symbol && board[4] == symbol && board[8] == symbol) ||
            (board[2] == symbol && board[4] == symbol && board[6] == symbol)
    }

    function reset() {
        startGame();
    }

    function clear() {
        board = ["#", "#", "#", "#", "#", "#", "#", "#", "#"];
        $(".tic").text("#");
    }

    function spaceIsFree(pos) {
        return board[pos] === "#"

    }

    function formatBoard() {
        newBoard = []
        for (let i = 0; i < board.length; i++) {
            switch (board[i]) {
                case "#":
                    newBoard.push(0);
                    break;
                case "X":
                    newBoard.push(-1);
                    break;
                case "O":
                    newBoard.push(1);
                    break;
            }
        }
        return newBoard;
    }

    $(".tic").click(function () {
        let pos = $(this).attr('id');
        if (spaceIsFree(pos) && clickable) {
            playerTurn(pos);
        }
    });


    $("#reset").click(function () {
        reset();
    });

});