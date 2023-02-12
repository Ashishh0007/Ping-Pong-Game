//assign all id from html
var rod1 = document.getElementById("rod1");
var rod2 = document.getElementById("rod2");
var circle = document.getElementById("circle");
var display = document.getElementById("display");
var spin = document.getElementById("spin");


//variables declaration
var movement = 20;
const rod_a = "Team A";
const rod_b = "Team B";
const store_name = "abc";
const store_score = "123";
let rodName;
let highScore;
let moveX = 2;
let moveY = 2;
let circleMoving;
let score;
let border = 12;
let gameStart = false;


//storage declaration
localStorage.setItem(store_score, "null");
localStorage.setItem(store_name, "null");


//initial part of moving rod and game reset
(function() {
    highScore = localStorage.getItem(store_score);
    rodName = localStorage.getItem(store_name);
    if(highScore === 'null' || rodName === 'null') {
        alert(' Hey!\n This is your first game. \n Press "Left Arrow" or Key "A" for moving left direction. \n Press "Right Arrow" or Key "D" for moving right direction. \n Press "Enter" to Start the Game!')

        spin.classList.remove("fa-spin");
        highScore = 0;
        rodName = rod_a;
    } 
    else {
        alert(rodName + " has a maximum score of " + highScore*100);
    }
    gameReset(rodName);
})();


//game reset
function gameReset(barName) {
    rod1.style.left = ((window.innerWidth - rod1.offsetWidth)/2) + "px";
    rod2.style.left = ((window.innerWidth - rod2.offsetWidth)/2) + "px";
    circle.style.left = ((window.innerWidth - circle.offsetWidth)/2) + "px";

    if(barName === rod_a) {
        circle.style.top = rod2.getBoundingClientRect().y - rod2.getBoundingClientRect().height + "px";
        moveY = -2;
    }
    else if(barName === rod_b) {
        circle.style.top = rod1.getBoundingClientRect().height + "px";
        moveY = 2;
    }

    score = 0;
    gameStart = false;
    spin.classList.remove("fa-spin");
}


//set the key function control with left arrow, right arrow or key A, key D
document.addEventListener('keydown', function(event) {

    if(gameStart) {
        //moving right direction
        if(event.code == "KeyD" || event.code == "ArrowRight") {
            if(parseInt(rod1.style.left) < (window.innerWidth - rod1.offsetWidth - border)) {
                rod1.style.left = parseInt(rod1.style.left) + movement + 'px';
                rod2.style.left = rod1.style.left;
            }
        }
        
        //moving left direction
        if(event.code == "KeyA" || event.code == "ArrowLeft") {
            if(parseInt(rod1.style.left) > border) {
                rod1.style.left = parseInt(rod1.style.left) - movement + 'px';
                rod2.style.left = rod1.style.left;
            }
        }
    }
    
    //press Enter for start and ball movement
    if(event.code == 'Enter') {

        display.textContent = "";

        if(!gameStart) {
            spin.classList.add("fa-spin");
            gameStart = true;

            let circleRect = circle.getBoundingClientRect();
            let circleX = circleRect.x;
            let circleY = circleRect.y;
            let circleDia = circleRect.width;
            let rod1height=rod1.offsetHeight;
            let rod2height=rod2.offsetHeight;
            let rod1width=rod1.offsetWidth;
            let rod2width=rod2.offsetWidth;

            circleMoving = setInterval(function() {
                let rod1X = rod1.getBoundingClientRect().x;
                let rod2X = rod2.getBoundingClientRect().x;
                let circleCenter = circleX + circleDia/2;
                
                circleX += moveX;
                circleY += moveY;

                circle.style.top = circleY + 'px';
                circle.style.left = circleX + 'px';

                if(((circleX + circleDia) > window.innerWidth) || (circleX < 0)) {
                    moveX = -moveX;
                }

                if(circleY <= rod1height) {
                    moveY = -moveY;
                    score++;
                    if((circleX + circleDia) < rod1X || circleX > (rod1X + rod1width)) {
                        dataStoring(score, rod_b);
                    }
                }

                if((circleY + circleDia) >= (window.innerHeight - rod2height)) {
                    moveY = -moveY;
                    score++;
                    if((circleX + circleDia) < rod2X || circleX > (rod2X + rod2width)) {
                        dataStoring(score, rod_a);
                    }
                }

            }, 10);
        }
    }
});


//storage declaration
function dataStoring(scoreObt, winRod) {
    if(scoreObt > highScore) {
        highScore = scoreObt;
        localStorage.setItem(store_name, winRod);
        localStorage.setItem(store_score, highScore);
    }

    clearInterval(circleMoving);
    gameReset(winRod);

    display.textContent = winRod + " wins with score of " + (scoreObt*100) + ". Maximum score is " + (highScore*100) +".";

    alert("Game Over! \n"+ winRod + " wins with the score of " + (scoreObt*100) + ".\nMaximum score: " + (highScore*100));
}
