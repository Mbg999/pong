"use strict";

// variables
let canvas;
let ctx;
let ball;
let paddle1;
let paddle2;
let intervalo;
let linesWidth;
let paddle1Up, paddle1Down;
let paddle2Up, paddle2Down;
let paddle1Points;
let paddle2Points;
let pongSound;
let pointSound;
let pointPongs;

// script body
window.addEventListener("load", ()=>{
    canvas = document.getElementById("pista");
    if(canvas.getContext){
        // canvas context
        ctx = canvas.getContext("2d");
        
        // audio
        pongSound = new Audio("sounds/pong.ogg");
        pointSound = new Audio("sounds/point.ogg");
        
        // ball setting
        ball = new Ball();
        
        // paddles settings
        linesWidth = canvas.width/100*2;
        // paddle1
        paddle1 = new Paddle();
        
        // paddle2
        paddle2 = new Paddle();

        // movement listeners
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        document.getElementById("start").addEventListener("click", function(){
            this.innerText = "Restart";
            start();
        });
    }
    
});

// functions
function start(){
    clearInterval(intervalo);
    // counters
    paddle1Points = 0;
    paddle2Points = 0;
    pointPongs = 0; // total pongs in a point

    // setting ball and paddles
    setBall(Math.random());
    setPaddles();
    
    // starting to draw the game
    intervalo = setInterval(draw, 10);
}

function pong(){
    ball.dx = -ball.dx;
    pongSound.play();
    pointPongs++;
}

function addPoint(paddle){
    if(paddle < 0.6){ // paddle2
        paddle2Points++;
    } else { // paddle1
        paddle1Points++;
    }
    pointPongs = 0;
    setPaddles();
    setBall(paddle);
    if(!pointSound.paused){
        pointSound.currentTime = 0;
    }
    pointSound.play();
}

function setBall(punch){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.radius = canvas.width/100*2;
    if(punch < 0.6){ // paddle1
        ball.dx = 3;
    } else { // paddle2
        ball.dx = -3;
    }
    ball.dy = (Math.random() < 0.6) ? -1 : 1;
}

function setPaddles(){
    let pHeight = canvas.height/100*25
    paddle1.x = 5;
    paddle1.y = canvas.height/2-pHeight/2;
    paddle1.width = linesWidth;
    paddle1.height = pHeight;
    
    paddle2.x = canvas.width-linesWidth-5;
    paddle2.y = canvas.height/2-pHeight/2;
    paddle2.width = linesWidth;
    paddle2.height = pHeight;
}

function handleKeyDown(e){
    let evento = e || window.event; // compatibilidad
    // 87 w 83 s
    if(evento.keyCode === 87){
        paddle1Up = true;
    } else if(evento.keyCode === 83){
        paddle1Down = true;
        
    }
    // arrowup 38 arrowdown 40
    if(evento.keyCode === 38){
        paddle2Up = true;
    } else if(evento.keyCode === 40){
        paddle2Down = true;
    }
}

function handleKeyUp(e){
    let evento = e || window.event; // compatibilidad
    // 87 w 83 s
    if(evento.keyCode === 87){
        paddle1Up = false;
    } else if(evento.keyCode === 83){
        paddle1Down = false;
        
    }
    // arrowup 38 arrowdown 40
    if(evento.keyCode === 38){
        paddle2Up = false;
    } else if(evento.keyCode === 40){
        paddle2Down = false;
    }
}

function drawMiddleLine(){
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = linesWidth-2;
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.stroke();
    ctx.restore();
}

function drawScore(){
    ctx.beginPath();
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${paddle1Points} - ${paddle2Points}`, canvas.width/2, 25);
    if(pointPongs > 4){
        ctx.font = "20px Arial";
        ctx.fillText(`Pongs combo: ${pointPongs}`, canvas.width/2, canvas.height-20);
    }
    ctx.fill();
}

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawMiddleLine();
    ball.draw(ctx);
    paddle1.draw(ctx);
    paddle2.draw(ctx);
    
    // movimientos paddle1
    if(paddle1Up){
        paddle1.moveUp();
    } else if(paddle1Down){
        paddle1.moveDown(canvas.height);
    }
    
    // movimientos paddle2
    if(paddle2Up){
        paddle2.moveUp();
    } else if(paddle2Down){
        paddle2.moveDown(canvas.height);
    }
    
    
    // COLISIONES BALL
    // colision x
    if(ball.x-ball.radius > paddle1.x && // ball ha de estar por delante de la linea de la izquierda de paddle1 
        ball.x-ball.radius < paddle1.x+paddle1.width && // ball ha de estar detras de la linea de la derecha de paddle1
        ball.y-ball.radius > paddle1.y && // ball ha de estar por debajo de la linea superior de paddle1
        ball.y+ball.radius < paddle1.y+paddle1.height){ // ball ha de estar por encima de la linea inferior de paddle1
            // rebote sobre paddle1
            pong();
            
        } else if(ball.x+ball.radius < paddle2.x+paddle2.width && // ball ha de estar por delante de la linea de la derecha de paddle2
            ball.x+ball.radius > paddle2.x && // ball ha de estar por detras de la linea de la izquierda de paddle2
            ball.y-ball.radius > paddle2.y && // ball ha de estar por debajo de la linea superior de paddle2
            ball.y+ball.radius < paddle2.y+paddle2.height){ // ball ha de estar por encima de la linea inferior de paddle2
                // rebote sobre paddle2
                pong();
                
            } else if(ball.x-ball.radius < 0){
                // punto para paddle2
                addPoint(0);
            } 
            else if(ball.x+ball.radius > canvas.width){
                // punto para paddle1
                addPoint(1);
            }
            
            // colision y
            if(ball.y < ball.radius || ball.y > canvas.height-ball.radius){
                ball.dy = -ball.dy;
            }
            // /COLISIONES BALL
            drawScore()
            ball.move();
        }