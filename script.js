const boardElement = document.querySelector(".board");
const mainMenu = document.querySelector(".mainMenu");
const gameGround = document.querySelector(".gameGround");
let seconds = 0;
let life = 3;
let pinakatimer = null;
let solution = generateFullBoard(); // full correct answer
let difficulty = 40;
let puzzle = removeNumbers(solution.map(r => [...r]));
let number = 0;
// Create grid
function createBoard() {
    boardElement.innerHTML = "";
 
    for (let i = 0; i < 81; i++) {
        const input = document.createElement("div");
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
 
        input.addEventListener("click", ()=>{
            
            // Remove non-numeric characters immediately
            if(input.innerHTML === number.toString() && !input.classList.contains("fixed")){
                input.innerHTML = "";
                input.classList.remove("highlight");
            }
            else if (number >= '1' && number <= '9' && !input.classList.contains("fixed")){ 
                input.innerHTML = number;
            }

            let value = parseInt(input.innerHTML);
 
            // If empty, clear formatting and exit
            if (isNaN(value)) {
                input.classList.remove("invalid");
                return;
            }
 
            // Validation Logic
            if (value === solution[row][col]) {
                input.classList.remove("invalid");
            } else {
                input.classList.add("invalid");   
                console.log(life);
                life--;
                livesCounter();
            }

            highlighter();
            
            // Check if sudoku is complete
            if (checkSudokuComplete()) {
                stopTimer();
                setTimeout(()=>{
                    alert("🎉 Congratulations! You solved the Sudoku!");
                }, 1000);
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
            cell.innerHTML = board[row][col];
            cell.classList.add("fixed");
            cell.disabled = true;
        } else {
            cell.innerHTML = "";
            cell.classList.remove("fixed");
            cell.disabled = false;
        }
    });
    timer();

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
    // Creating empty array
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
 
function checkInput(row, col, value) {
    if (value == solution[row][col]) {
        return "correct";
    } else {
        return "wrong";
    }
}

function checkSudokuComplete() {
    const cells = document.querySelectorAll(".cell");
    
    for (let i = 0; i < 81; i++) {
        let row = Math.floor(i / 9);
        let col = i % 9;
        let cellValue = parseInt(cells[i].innerHTML);
        
        // Check if cell is empty
        if (isNaN(cellValue) || cellValue === 0) {
            return false;
        }
        
        // Check if cell matches solution
        if (cellValue !== solution[row][col]) {
            return false;
        }
    }
    
    return true;  // All cells filled and correct!
}

function removeNumbers(board) {
    let removed = 0;
    let attempts = 0;
    let maxAttempts = difficulty * 3;  // Try 3x the target
    
    while (removed < difficulty && attempts < maxAttempts) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        attempts++;
 
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            removed++;
        }
    }
    return board;
}

 
function generateSudoku() {
    solution = generateFullBoard();
    return removeNumbers(solution.map(r => [...r]));
}
 
const difficultyButtons = document.querySelectorAll(".mainMenu div button");
difficultyButtons.forEach(button => {
    button.addEventListener("click", () => {
        difficultyButtons.forEach(btn => btn.classList.remove("highlight"));

        button.classList.add("highlight");
        
        if (button.classList.contains("easy")) {
            difficulty = 40;
        } 
        else if (button.classList.contains("medium")) {
            difficulty = 50;
        } 
        else if (button.classList.contains("hard")) {
            difficulty = 55;
        }

        console.log(difficulty);
    });
});

const generateBtn = mainMenu.querySelector(".generate");
generateBtn.addEventListener("click", ()=>{
    mainMenu.classList.add("hide");
    gameGround.classList.remove("hide");
    createBoard();
    puzzle = generateSudoku();
    displayBoard(puzzle);
});

const numberButtons = document.querySelectorAll(".numbers div");
numberButtons.forEach(button => {
    button.addEventListener("click", () => { 
        numberButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");
        number = button.innerHTML;
        highlighter();
    });

});

document.addEventListener("keydown", (event)=>{
    numberButtons.forEach(btn => btn.classList.remove("active"));
    let key = event.key;
    const disabled = gameGround.querySelector(`.numbers .num-${key}`);
    if(event.key >= '1' && event.key <= '9' && !(disabled.classList.contains("disabled"))) {
        gameGround.querySelector(`.numbers .num-${event.key}`).classList.add("active");
        number = event.key;
    }
    else{
        number = 0;
    }
    highlighter();
});

function highlighter(){
    const boxes = gameGround.querySelectorAll(".cell");
    let counter = 0
    let numberDone = 0;
    boxes.forEach(box => {
        box.classList.remove("highlight");

        if(box.innerHTML === number.toString() && !(box.classList.contains("invalid"))){
            box.classList.add("highlight");
            counter++;
            numberDone = box.innerHTML;
        }
    });

    if(counter === 9 ){
        console.log(numberDone);
        numberfixed(numberDone);
    }
}

function numberfixed(numberDone){
    const boxes = gameGround.querySelectorAll(".cell");
    const disabler = gameGround.querySelector(`.numbers .num-${numberDone}`);
    boxes.forEach(box => {
        if(box.classList.contains("invalid")){
            box.innerHTML = "";
            box.classList.remove("invalid")
        }

        if(box.classList.contains("highlight") && !box.classList.contains("invalid")){
            disabler.classList.add("disabled");
            box.classList.add("numberFixed");
        }
    });
    disabler.classList.remove("active");

    number = 0;
}

//TIMER

const Timer = gameGround.querySelector(".nav .timer");
function timer(){
    pinakatimer = setInterval(() => {
        seconds++;

        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;

        // add leading zero (e.g. 01:05)
        let formatted = 
            String(mins).padStart(2, '0') + ":" + 
            String(secs).padStart(2, '0');

        Timer.innerHTML = formatted;
    }, 1000);
}

function stopTimer(yas){

    if(yas === "reset"){
        seconds = 0;
        Timer.innerHTML = "00:00";
    }
    clearInterval(pinakatimer);
    pinakatimer = null;
    
}

const back = gameGround.querySelector(".nav .back");
back.addEventListener("click", () => {
    stopTimer("reset");
    mainMenu.classList.remove("hide");
    gameGround.classList.add("hide");
});

const lives = gameGround.querySelector(".lives");
function livesCounter(){
    if(life === 3){
        lives.innerHTML = "♥ ♥ ♥";
    }
    else if(life === 2){
        lives.innerHTML = "♥ ♥";
    }
    else if(life === 1){
        lives.innerHTML = "♥";
    }
    else{
        alert("Game Over");
    }
}