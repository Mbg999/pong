"use strict";
class Ball {
    constructor(){
        this.x = undefined;
        this.y = undefined;
        this.radius = undefined;
        // default speed movement
        this.dx = 3; // x movement
        this.dy = 1; // y movement
    }

    draw(ctx){
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        ctx.fill();
    }

    move(){
        this.x += this.dx;
        this.y += this.dy;
    }
}

class Paddle {
    constructor(){
        this.x = undefined;
        this.y = undefined;
        this.width = undefined;
        this.height = undefined;
        // default speed movement on Y
        this.dyUp = -5; // up on y
        this.dyDown = 5; // down on y
    }

    moveUp(){
        if(this.y > 0)
        this.y += this.dyUp;
    }

    moveDown(canvasHeight){
        if(this.y+this.height < canvasHeight)
        this.y += this.dyDown;
    }

    draw(ctx){
        ctx.fillStyle = "red";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}