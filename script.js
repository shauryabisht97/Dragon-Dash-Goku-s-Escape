let score = 0;
let cross = true;
let passedObstacle = false; // Flag to track if Goku passed an obstacle

let audio_ingame = new Audio('music.mp3');
let audio_gameover = new Audio('gameover.mp3');

// Set in-game audio to loop
audio_ingame.loop = true;

document.onkeydown = function (e) {
    console.log("Key pressed: ", e.key);

    // Play in-game audio on first keypress
    if (audio_ingame.paused) {
        audio_ingame.play().catch(error => {
            console.error("Error playing in-game audio:", error);
        });
    }

    let goku = document.querySelector('.goku');
    if (e.key === "ArrowUp") {
        goku.classList.add('animateGoku');
        setTimeout(() => {
            goku.classList.remove('animateGoku');
        }, 700);
    }

    if (e.key === "ArrowRight") {
        let gokuX = parseInt(window.getComputedStyle(goku, null).getPropertyValue('left'));
        goku.style.left = (gokuX + 112) + "px";
    }

    if (e.key === "ArrowLeft") {
        let gokuX = parseInt(window.getComputedStyle(goku, null).getPropertyValue('left'));
        goku.style.left = (gokuX - 112) + "px";
    }
}

let gameInterval = setInterval(() => {
    let goku = document.querySelector('.goku');
    let gameOver = document.querySelector('.gameOver');
    let obstacle = document.querySelector('.obstacle');

    let gx = parseInt(window.getComputedStyle(goku, null).getPropertyValue('left'));
    let gy = parseInt(window.getComputedStyle(goku, null).getPropertyValue('top'));
    let ox = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('left'));
    let oy = parseInt(window.getComputedStyle(obstacle, null).getPropertyValue('top'));

    let offsetX = Math.abs(gx - ox);
    let offsetY = Math.abs(gy - oy);

    if (offsetX < 73 && offsetY < 52) {
        gameOver.style.visibility = 'visible';
        obstacle.classList.remove('obstacleDragon');

        // Stop in-game audio and play game over audio
        audio_ingame.pause();
        audio_ingame.currentTime = 0; // Reset in-game audio

        audio_gameover.play().catch(error => {
            console.error("Error playing game over audio:", error);
        });

        // Stop further game logic after game over
        clearInterval(gameInterval);
        document.onkeydown = null;
    } else if (offsetX < 145 && cross) {
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
            console.log('New animation duration', new_duration)
        }, 500);
    }

    // Reset passedObstacle flag after updating score
    if (passedObstacle) {
        passedObstacle = false;
    }
}, 10);

function updateScore(score) {
    scoreCount.innerHTML = "Your Score = " + score;
}
