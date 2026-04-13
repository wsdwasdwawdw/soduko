const boardElement = document.querySelector(".board");
let solution = generateFullBoard(); // full correct answer
let puzzle = removeNumbers(solution.map(r => [...r]));
// Create grid
function createBoard() {
    boardElement.innerHTML = "";
 
    for (let i = 0; i < 81; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;
        input.classList.add("cell");
   
        let row = Math.floor(i / 9);
        let col = i % 9;
   
        // Determine 3x3 box
        let boxRow = Math.floor(row / 3);
        let boxCol = Math.floor(col / 3);
   
        // Alternate color
        if ((boxRow + boxCol) % 2 === 0) {
            input.classList.add("box-light");
        } else {
            input.classList.add("box-dark");
        }
   
        boardElement.appendChild(input);
 
        input.addEventListener("input", ()=>{
            // Remove non-numeric characters immediately
            input.value = input.value.replace(/[^1-9]/g, "");
           
            let value = parseInt(input.value);
 
            // If empty, clear formatting and exit
            if (isNaN(value)) {
                input.classList.remove("invalid");
                return;
            }
 
            // Validation Logic
            if (value === solution[row][col]) {
                input.classList.remove("invalid");
                // Optional: input.classList.add("correct");
            } else {
                input.classList.add("invalid");
            }
        });
    }
}
 
// Fill board with puzzle
function displayBoard(board) {
    const cells = document.querySelectorAll(".cell");
 
    cells.forEach((cell, i) => {
        let row = Math.floor(i / 9);
        let col = i % 9;
 
        if (board[row][col] !== 0) {
            cell.value = board[row][col];
            cell.classList.add("fixed");
            cell.disabled = true;
        } else {
            cell.value = "";
            cell.classList.remove("fixed");
            cell.disabled = false;
        }
    });
}
 
function isValid(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) return false;
        if (board[x][col] === num) return false;
    }
 
    let startRow = row - row % 3;
    let startCol = col - col % 3;
 
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (board[startRow + r][startCol + c] === num) return false;
        }
    }
 
    return true;
}
 
function generateFullBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
 
    function shuffle(nums) {
        return nums.sort(() => Math.random() - 0.5);
    }
 
    function fillBoard() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    let numbers = shuffle([1,2,3,4,5,6,7,8,9]);
 
                    for (let num of numbers) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
 
                            if (fillBoard()) return true;
 
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
 
    fillBoard();
    return board;
}
 
function hasUniqueSolution(board) {
    let count = 0;
 
    function solve() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            solve();
                            board[row][col] = 0;
                        }
                    }
                    return;
                }
            }
        }
        count++;
    }
 
    solve();
    return count === 1;
}
 
function removeNumbers(board, attempts = 40) {
    while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
 
        if (board[row][col] !== 0) {
            let backup = board[row][col];
            board[row][col] = 0;
 
            let copy = board.map(r => [...r]);
 
            if (!hasUniqueSolution(copy)) {
                board[row][col] = backup;
                attempts--;
            }
        }
    }
    return board;
}
 
function generateSudoku() {
    let full = generateFullBoard();
    return removeNumbers(full, 40);
}
 
const generateBtn = document.querySelector(".generate");
generateBtn.addEventListener("click", ()=>{
    displayBoard(puzzle);
});
function checkInput(row, col, value) {
    if (value == solution[row][col]) {
        return "correct";
    } else {
        return "wrong";
    }
}
createBoard();