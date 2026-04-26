const boardElement = document.querySelector(".board");
const mainMenu = document.querySelector(".mainMenu");
const gameGround = document.querySelector(".gameGround");
const modals = document.querySelector(".modals");
const pause = modals.querySelector(".menuPause");
const WinLose = modals.querySelector(".menuShit");
const numberButtons = document.querySelectorAll(".numbers div");
const lives = gameGround.querySelector(".lives");
let finalTime = "";
let inGame = false
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
            
            if(input.classList.contains("grid")){
                input.classList.remove("grid");
                input.classList.add("cell");
                input.innerHTML = "";

            }
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
                    winlose(true);
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
    notesGridCreation();
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
    inGame = true;
});

/* NUMBER BUTTON */
numberButtons.forEach(button => {
    button.addEventListener("click", () => { 
        removeHighlight(true);

        button.classList.add("active");
        number = button.innerHTML;
        highlighter();
    });

});

document.addEventListener("keydown", (event)=>{
    removeHighlight(true);
    let key = event.key;
    if(event.key >= '1' && event.key <= '9' && !(gameGround.querySelector(`.numbers .num-${key}`).classList.contains("disabled"))) {
        gameGround.querySelector(`.numbers .num-${event.key}`).classList.add("active");
        number = event.key;
    }
    else if(key.toLocaleLowerCase() == "escape" && inGame) {
        number = event.key;
        menuFunc();
    }
    else{
        number = 0;
        console.log(event.key);
    }
    highlighter();
});



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
    if (pinakatimer) return;

    pinakatimer = setInterval(() => {
        seconds++;

        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;

        let formatted = 
            String(mins).padStart(2, '0') + ":" + 
            String(secs).padStart(2, '0');

        Timer.innerHTML = formatted;

        finalTime = formatted;
    }, 1000);
}

function stopTimer(yas){

    if(yas === "reset"){
        seconds = 0;
        Timer.innerHTML = "00:00";
        life = 3;
        livesCounter();
        removeHighlight(false);
    }
    clearInterval(pinakatimer);
    pinakatimer = null;
    
}

/* MENU MODALS */
const menu = gameGround.querySelector(".nav .menu");
menu.addEventListener("click", () => {
    menuFunc();
});
function menuFunc(){
    if(modals.classList.contains("hide")){
        stopTimer();
        modals.classList.toggle("hide");
        pause.classList.toggle("hide");
    }
    else{
        timer();
        modals.classList.toggle("hide");
        pause.classList.toggle("hide");
    }
}
const newGame = modals.querySelectorAll("div .newGame");
newGame.forEach(element => {
    element.addEventListener("click", () => {
        createBoard();
        puzzle = generateSudoku();
        stopTimer("reset")
        displayBoard(puzzle);
        modals.classList.toggle("hide");
        WinLose.classList.toggle("hide");
    });
});

const resume = modals.querySelectorAll("div .resume");
resume.forEach(element => {
    element.addEventListener("click", () => {
        modals.classList.toggle("hide");
        pause.classList.toggle("hide");
        timer();
    });
});

const exit = modals.querySelectorAll("div .exit ");
exit.forEach(element => {
    element.addEventListener("click", ()=>{
        location.reload();
    });
});

/* LIVE COUNTER */
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
        winlose(false);
    }
}
function winlose(victory){
    modals.classList.toggle("hide");
    WinLose.classList.toggle("hide");
    if(victory){
        WinLose.querySelector("h1").innerHTML = finalTime;
    }
    else{
        WinLose.querySelector("h1").innerHTML = "Game Over";
    }
    removeHighlight(true);
    stopTimer();
}

/* HIGHLIGHTS */
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
function removeHighlight(eto){
    if(eto)
        numberButtons.forEach(btn => btn.classList.remove("active"));
    else
        numberButtons.forEach(btn => btn.classList.remove("disabled"));
}


//FOR NOTES FUNCTIONS
function notesGridCreation(){
    const cell = gameGround.querySelectorAll(".cell");

    cell.forEach(cell => {
        cell.addEventListener("contextmenu", (e)=>{
            e.preventDefault();

            if(cell.classList.contains("grid")){
                notesWrite();
            }
            else{
                cell.innerHTML = "";
                cell.classList.add("grid");
                cell.classList.remove("cell");
                
                console.log("trying notes");

                for(let i = 1; i <= 9; i++){
                    const cellNotes = document.createElement("div");
                    cellNotes.classList.add(`cellNotes`);
                    cellNotes.classList.add(`num-${i}`);
                    cell.appendChild(cellNotes);
                }
                notesWrite();
            }
        });
    });
    
}

function notesWrite(){
    const notesCell = gameGround.querySelector(`.board .num-${number}`);
    notesCell.innerHTML = number;
}