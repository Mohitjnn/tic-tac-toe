
time = JSON.parse(localStorage.getItem('stop-watch-time'))||{
    seconds: 0,
    minutes: 0,
    hours: 0
}
let showtime = () => {
    document.getElementById('stopwatch').innerHTML = `${time.hours}:${time.minutes}:${time.seconds}`;
}
showtime();
let player1 = localStorage.getItem('player1name') || 'player1';
let player2 = localStorage.getItem('player2name') || 'player2';

document.getElementById('player1').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        player1 = document.getElementById('player1').value;
        localStorage.setItem('player1name', player1);
        updateScore();
        document.getElementById('player1').value = '';

    }
});
document.getElementById('player2').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        player2 = document.getElementById('player2').value;
        localStorage.setItem('player2name', player2);
        updateScore();
        document.getElementById('player2').value = '';
    }
});


let turn = 0;
let xMoves = [];
let oMoves = [];
const buttons = [];
let score = JSON.parse(localStorage.getItem('score')) || {
    xwins: 0,
    owins: 0,
    tie: 0,
};
updateScore();
let highScore = JSON.parse(localStorage.getItem('highScore')) || 0;
showHighScore(highScore);


for (let i = 0; i < 9; i++) {
    let button = document.getElementById(`number${i + 1}`)

    if (button) {
        buttons.push(button);
        button.addEventListener('click', assignValue);
    }
}
console.log(buttons);
document.getElementById('resetButton').addEventListener('click', () => {
    player1 = 'Player 1';
    player2 = 'player 2';
    score.xwins = 0;
    score.owins = 0;
    score.tie = 0;
    updateScore();
    time.seconds = 0;
    time.minutes = 0;
    time.hours = 0;
    showtime();
});


let startTimer = 1;
function assignValue(event) {
    if (startTimer == 1) {
        interval = setInterval(stopwatch, 1000);
        startTimer = 0;
    }
    var declareResult;
    var clickButtonId = event.target.id;
    console.log(clickButtonId);
    var clickButtonValue = clickButtonId.replace('number', '');
    console.log(clickButtonValue);
    var index = buttons.findIndex(button => button.id === clickButtonId);
    console.log(index);
    if (index != -1) {
        if (turn === 0) {
            document.getElementById(`${clickButtonId}`).querySelector('span').innerText = 'X';
            xMoves.push(parseInt(clickButtonValue, 10));
            declareResult = checkWinner(xMoves);
            if (declareResult) {

                WinnerAndLoser(player1, player2)
                score.xwins++;
                updateScore();
                setTimeout(() => location.reload(), 3500);

            }
            console.log(xMoves);
            turn = 1;
        }
        else if (turn === 1) {
            document.getElementById(`${clickButtonId}`).querySelector('span').innerText = 'O';

            oMoves.push(parseInt(clickButtonValue, 10));
            declareResult = checkWinner(oMoves);
            if (declareResult) {
                WinnerAndLoser(player2, player1);

                score.owins++;
                updateScore();
                setTimeout(() => location.reload(), 3000);

            }
            console.log(oMoves);
            turn = 0;
        }
        buttons.splice(index, 1);
        if (!declareResult && buttons.length === 0) {
            const WinnerSideTie = document.getElementById('winner');
            const LoserSideTie = document.getElementById('loser');
            const ttext = "The game is a tie!";
            score.tie++;
            updateScore();
            textTypingEffect(WinnerSideTie, ttext);
            textTypingEffect(LoserSideTie, ttext);

            setTimeout(() => location.reload(), 3000);
        }
        console.log(buttons)
    }

}

function updateScore() {
    localStorage.setItem('score', JSON.stringify(score));
    document.querySelector('.result').innerHTML = `<span> ${player1}: ${score.xwins}</span><span> ${player2}: ${score.owins}</span><span>Tie: ${score.tie}</span>`;
}

function showHighScore(highScore) {
    highScore = score.xwins >= score.owins ? score.xwins : score.owins;
    localStorage.setItem('highScore', JSON.stringify(highScore));
    document.getElementById('highScore').innerHTML = `High Score: ${highScore}`
};

function checkWinner(array) {
    arrayOfValues = [[1, 2, 3], [4, 5, 6], [7, 8, 9], // Rows
    [1, 4, 7], [2, 5, 8], [3, 6, 9], // Columns
    [1, 5, 9], [3, 5, 7]]//diagonals


    return arrayOfValues.some(values => values.every(value => array.includes(value))
    );

}

function stopwatch() {


    if (time.seconds === 59) {
        time.minutes++;
        time.seconds = 0;
    }
    if (time.minutes === 59) {
        time.hours++;
        time.minutes = 0;
    }
    showtime();
    time.seconds++;
    localStorage.setItem('stop-watch-time', JSON.stringify(time));
}

function WinnerAndLoser(p1, p2) {
    const winnerAnim = document.querySelector('#winner');
    const wtext = `Congrats ${p1}. You win!`;
    var wimage = document.createElement('img');
    wimage.src = 'pictures/smileyimage.png'
    wimage.classList.add('emoji');
    textTypingEffect(winnerAnim, wtext);
    wimage.onload = function () {
        console.log("Image loaded successfully!");
        setTimeout(() => winnerAnim.appendChild(wimage), 2000);
    }

    wimage.onerror = function () {
        console.error("Error loading the image.");
    };

    const loserAnim = document.querySelector('#loser');
    const ltext = `Oh no ${p2}. You lose!`;
    var limage = document.createElement('img');
    limage.src = 'pictures/sademoji.webp'
    limage.classList.add('emoji');
    textTypingEffect(loserAnim, ltext);
    limage.onload = function () {
        console.log("Image loaded successfully!");
        setTimeout(() => loserAnim.appendChild(limage), 2000);
    }

    limage.onerror = function () {
        console.error("Error loading the image.");
    };

}

function textTypingEffect(element, text, i = 0) {
    if (i === 0) {
        element.textContent = "";
    }
    element.textContent += text[i];

    if (i === text.length - 1) {
        return;
    }
    setTimeout(() => {
        textTypingEffect(element, text, i + 1)
    }, 50);

}
