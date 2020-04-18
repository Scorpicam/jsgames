var gamePiece;
var obstacles = [];
var score;

function startGame() {
    document.getElementById("lose").innerHTML = "";
    gamePiece = new component(30, 30, "darkgreen", 10, 120);
    score = new component("30px", "Consolas", "dimgrey", 280, 40, "text");
    gameArea.start();
}

var gameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNum = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            gameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            gameArea.key = false;
        })
        window.addEventListener('mousedown', function (e) {
            gameArea.mouse = e.pageX;
        })
        window.addEventListener('mouseup', function (e) {
            gameArea.mouse = false;
        })
        window.addEventListener('touchstart', function (e) {
            gameArea.touch = e.pageX;
        })
        window.addEventListener('touchend', function (e) {
            gameArea.touch = false;
        })
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stopGame : function() {
        clearInterval(this.interval);
        document.getElementById("lose").innerHTML = "You Lose!";
    }
}

function everyinterval(n) {
    if ((gameArea.frameNum / n) % 1 == 0) {
        return true;
    }
    return false;
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedY = 0;
    this.gravity = .05;
    this.gravitySpeed = 0;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.y += this.speedY + this.gravitySpeed;
        this.hit();
    }
    this.hit = function() {
        var bottom = gameArea.canvas.height - this.height;
        if (this.y > bottom) {
            this.y = bottom;
        }
        if (this.y == bottom) {
            gameArea.stopGame();
        }
    }
    this.crashTest = function(obj) {
        var left = this.x;
        var right = this.x + (this.width);
        var top = this.y;
        var bottom = this.y + (this.height);

        var objLeft = obj.x;
        var objRight = obj.x + (obj.width);
        var objTop = obj.y;
        var objBottom = obj.y + (obj.height);

        var crash = true;

        if ((bottom < objTop) ||
        (top > objBottom) ||
        (right < objLeft) ||
        (left > objRight)) {
            crash = false;
        }

        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minH, maxH, minG, maxG;

    for (i = 0; i < obstacles.length; i++) {
        if (gamePiece.crashTest(obstacles[i])) {
            gameArea.stopGame();
            return;
        }
    }

    gameArea.clear();

    if (gameArea.key && (gameArea.key == 32 || gameArea.key == 38)) {
        accelerate(-0.2);
    }
    else if (gameArea.mouse && gameArea.mouse != -1) {
        accelerate(-0.2);
    }
    else if (gameArea.touch && gameArea.touch != -1) {
        accelerate(-0.2);
    } else {
        accelerate(0.1);
    }

    gameArea.frameNum++;
    if (gameArea.frameNum == 1 || everyinterval(150)) {
        x = gameArea.canvas.width;
        minH = 20;
        maxH = 200;
        height = Math.floor(Math.random() * (maxH - minH + 1) + minH);
        minG = 50;
        maxG = 200;
        gap = Math.floor(Math.random() * (maxG - minG + 1) + minG);
        obstacles.push(new component(10, height, "black", x, 0));
        obstacles.push(new component(10, x - height - gap, "black", x, height + gap));
    }

    for (i = 0; i < obstacles.length; i++) {
        obstacles[i].x--;
        obstacles[i].update();
    }
    var scoreNum = (Math.floor((gameArea.frameNum / 155)) - 2);
    if (scoreNum < 0) {
        scoreNum = 0;
    }

    score.text = "SCORE: " + scoreNum;
    score.update();

    gamePiece.newPos();
    gamePiece.update();
}

function accelerate(n) {
    gamePiece.gravity = n;
}
function stop() {
    gamePiece.speedY = 0;
}
