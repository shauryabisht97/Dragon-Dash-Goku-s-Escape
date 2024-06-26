let score = 0;
let cross = true;
let passedObstacle = false; // Flag to track if Goku passed an obstacle
let bestScore = localStorage.getItem('bestScore') ? parseInt(localStorage.getItem('bestScore')) : 0;

const audio_ingame = new Audio('music.mp3');
const audio_gameover = new Audio('gameover.mp3');

// Set in-game audio to loop
audio_ingame.loop = true;

const goku = document.querySelector('.goku');
const gameOver = document.querySelector('.gameOver');
const obstacle = document.querySelector('.obstacle');
const scoreCount = document.getElementById('scoreCount');
const bestScoreCount = document.getElementById('bestScoreCount');
const restartButton = document.querySelector('.restartButton');

document.onkeydown = handleKeyDown;

function handleKeyDown(e) {
    console.log("Key pressed: ", e.key);

    // Play in-game audio on first keypress
    if (audio_ingame.paused) {
        audio_ingame.play().catch(error => {
            console.error("Error playing in-game audio:", error);
        });
    }

    switch (e.key) {
        case "ArrowUp":
            if (!goku.classList.contains('animateGoku')) {
                goku.classList.add('animateGoku');
                setTimeout(() => {
                    goku.classList.remove('animateGoku');
                }, 700);
            }
            break;
        case "ArrowRight":
            moveGoku(112);
            break;
        case "ArrowLeft":
            moveGoku(-112);
            break;
    }
}

function moveGoku(offset) {
    let gokuX = parseInt(window.getComputedStyle(goku, null).getPropertyValue('left'));
    goku.style.left = (gokuX + offset) + "px";
}

function updateScore(score) {
    scoreCount.innerHTML = "Your Score = " + score;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreCount.innerHTML = "Best Score = " + bestScore;
    }
}

function checkCollision() {
    const gx = parseInt(window.getComputedStyle(goku, null).getPropertyValue('left'));
    const gy = parseInt(window.getComputedStyle(goku, null).getPropertyValue('top'));
    const ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    const oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));

    const offsetX = Math.abs(gx - ox);
    const offsetY = Math.abs(gy - oy);

    if (offsetX < 73 && offsetY < 52) {
        gameOver.style.visibility = 'visible';
        restartButton.style.visibility = 'visible';
        obstacle.classList.remove('obstacleDragon');

        // Stop in-game audio and play game over audio
        audio_ingame.pause();
        audio_ingame.currentTime = 0; // Reset in-game audio

        audio_gameover.play().catch(error => {
            console.error("Error playing game over audio:", error);
        });

        // Stop further game logic after game over
        cancelAnimationFrame(gameLoop);
        document.onkeydown = null;
    } else if (offsetX < 145 && gx < ox && cross) {
        score += 1;
        passedObstacle = true; // Goku successfully passed an obstacle
        updateScore(score);

        cross = false;
        setTimeout(() => {
            cross = true;
        }, 1000);

        setTimeout(() => {
            let animation_duration = parseFloat(window.getComputedStyle(obstacle, null).getPropertyValue('animation-duration'));
            let new_duration = animation_duration - 0.1;
            obstacle.style.animationDuration = new_duration + 's';
            console.log('New animation duration', new_duration);
        }, 500);
    }

    // Reset passedObstacle flag after updating score
    if (passedObstacle) {
        passedObstacle = false;
    }

    // Continue the game loop
    gameLoop = requestAnimationFrame(checkCollision);
}

// Start the game loop
let gameLoop = requestAnimationFrame(checkCollision);

function restartGame() {
    score = 0;
    cross = true;
    passedObstacle = false;

    // Hide game over message and restart button
    gameOver.style.visibility = 'hidden';
    restartButton.style.visibility = 'hidden';

    // Reset Goku's position
    goku.style.left = '12px';

    // Reset obstacle position and animation
    obstacle.style.animation = 'none';
    obstacle.offsetHeight; // Trigger reflow
    obstacle.style.animation = null;
    obstacle.classList.add('obstacleDragon');

    // Reset score display
    updateScore(score);

    // Start game logic again
    document.onkeydown = handleKeyDown;
    gameLoop = requestAnimationFrame(checkCollision);

    // Play in-game audio and stop game over audio
    audio_gameover.pause();
    audio_gameover.currentTime = 0; // Reset game over audio
    audio_ingame.play().catch(error => {
        console.error("Error playing in-game audio:", error);
    });
}

// Display the best score on page load
bestScoreCount.innerHTML = "Best Score = " + bestScore;

// Attach restart function to the restart button
restartButton.addEventListener('click', restartGame);
