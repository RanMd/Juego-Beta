const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
//------------------------SPRITES--------------------------------//
let spritePlayer = new Image();
spritePlayer.src = "./images/iconoPlayer.svg"

let spriteCoin = new Image();
spriteCoin.src = "./images/iconCoin.svg"

let spriteEnemy = new Image();
spriteEnemy.src = "./images/iconEnemy.svg"
//------------------------PUNTOS--------------------------------//
let pointsDiv = document.getElementById("points");
let fragment = document.createDocumentFragment()
let pointSpan = document.createElement("SPAN")
let points = 0;

pointSpan.textContent = points;
fragment.appendChild(pointSpan)
pointsDiv.appendChild(fragment)
//------------------------TIEMPO--------------------------------//
let timeDiv = document.getElementById("timer");
let fragmentTime = document.createDocumentFragment();
let timeSpan= document.createElement("SPAN");
let time = 60;

timeSpan.textContent = time;
fragmentTime.appendChild(timeSpan)
timeDiv.appendChild(fragmentTime)
//------------------------TIEMPO--------------------------------//
let nitroDiv = document.getElementById("nitro");
let nitroRemaining = 100;
nitroDiv.style.backgroundSize = nitroRemaining + "%";


class character {
    constructor(tipo, posX, posY, step, ancho, enemigo) {
        this.enemigo = enemigo
        this.x = posX;
        this.y = posY;
        this.w = ancho;
        this.tipo = tipo;
        this.step = step;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.spaceBar = false;
        this.timer = 0;
        this.loseStatus = false;
    }

    evaluar() {
        if (this.tipo == "jugador") {
            ctx.drawImage(spritePlayer,this.x,this.y,this.w,this.w);
            this.move()
        } else if (this.tipo == "enemigo"){
            ctx.drawImage(spriteEnemy,this.x,this.y,this.w,this.w);
            this.chase(this.enemigo)
            this.collision(this.enemigo)
        } else if (this.tipo == "coin"){
            ctx.drawImage(spriteCoin,this.x,this.y,this.w,this.w);
            this.summon()
            this.collision(this.enemigo)
        }
        }
    
    collision(player) {
        if (player.x + player.w/2 > this.x && player.x < this.x + this.w/2 &&
            player.y + player.w/2 > this.y && player.y < this.y + this.w/2) {
                if (this.tipo == "enemigo") {
                    this.loseStatus = true;
                } else if (this.tipo == "coin") {
                    points++;
                    this.addPlayer()
                    this.x = Math.round(Math.random()*canvas.width)
                    this.y = Math.round(Math.random()*canvas.height)
                    this.timer = 0;
                }
        }
    } 

    move() {
        if (this.x >= canvas.width - 40) {
            this.x = canvas.width - 40;  
        } else if (this.right) {
            this.x += this.step 
        } 

        if (this.x <= 10) {
            this.x = 10;
        } else if (this.left) {
            this.x -= this.step
        }

        if (this.y <= 10) {
            this.y = 10
        } else if (this.up) {
            this.y -= this.step  
        }

        if (this.y >= canvas.height - 40) {
            this.y = canvas.height - 40;  
        } else if (this.down) {
            this.y += this.step   
        }

        //---------------------------------NITRO--------------------------------//

        if (this.x >= canvas.width - 40) {
            this.x = canvas.width - 40;  
        } else if (this.spaceBar && this.right && nitroRemaining >= 50) {
            this.x += this.step;
        }

        if (this.y >= canvas.height - 40) {
            this.y = canvas.height - 40;  
        } else if (this.spaceBar && this.down && nitroRemaining >= 50) {
            this.y += this.step;
        }

        if (this.x <= 10) {
            this.x = 10;
        } else if (this.spaceBar && this.left && nitroRemaining >= 50) {
            this.x -= this.step;
        }

        if (this.y <= 10) {
            this.y = 10
        } else if (this.spaceBar && this.up && nitroRemaining >= 50) {
            this.y -= this.step;
        }

        if (nitroRemaining < 50) {
            this.spaceBar = false
        }

        if (this.spaceBar) {
            nitroRemaining--;
            nitroDiv.style.backgroundSize = nitroRemaining + "%";
        }
    }

    chase(player) {
        if (this.x != player.x || this.y != player.y) {
            if (this.x < player.x) {
                this.x += this.step
            } else if (this.x > player.x) {
                this.x -= this.step
            }

            if (this.y < player.y) {
                this.y += this.step
            } else if (this.y > player.y) {
                this.y -= this.step
            }
        }
    }
    
    summon() {
        this.timer++
            if (this.timer == 100) {
                    this.x = Math.round(Math.random()*canvas.width -40);
                    this.y = Math.round(Math.random()*canvas.height -40);
                    this.timer = 0;
            }
    }

    addPlayer() {
        pointSpan.textContent = points;
        fragment.appendChild(pointSpan)
        pointsDiv.appendChild(fragment)
    }

    playerWin() {
        if (points == 20) {
            location.reload();
            alert("Ganaste culo roto");
        }
    }

    playerLose(){
        if (this.loseStatus == true) {
            location.reload();
            alert("culo roto") 
        }
        
        if (time == 0) {
            location.reload();
            alert("culo roto") 
        }
    }
}




window.addEventListener("load", ()=> {
    const player = new character("jugador", 10, 10, 6, 30);

    const enemy = new character("enemigo", canvas.width-40, canvas.height - 40, 4, 30, player)

    const coin = new character("coin", canvas.width/2 - 10, canvas.height/2 - 10,0,25, player)
    
    gameLoop();
    

    onkeydown = (key)=> {
        if (key.code == "ArrowRight") {
            player.right = true;
        }

        if (key.code == "ArrowLeft") {
            player.left = true;
        }

        if (key.code == "ArrowUp") {
            player.up = true;
        }

        if (key.code == "ArrowDown") {
            player.down = true;
        }

        if (key.code == "Space") {
            player.spaceBar = true;
        }
    }

    onkeyup = (key)=> {
        if (key.code == "ArrowRight") {
            player.right = false;
        }

        if (key.code == "ArrowLeft") {
            player.left = false;
        }

        if (key.code == "ArrowUp") {
            player.up = false;
        }

        if (key.code == "ArrowDown") {
            player.down = false;
        }

        if (key.code == "Space") {
            player.spaceBar = false;
        }
    }

    const count = setInterval(()=>{
        time--;
        timeSpan.textContent = time;
        fragmentTime.appendChild(timeSpan)
        timeDiv.appendChild(fragmentTime)
    },1000)

    function gameLoop() {
        canvas.width = canvas.width;
        enemy.playerLose()
        player.playerWin()
        player.evaluar()
        enemy.evaluar()
        coin.evaluar()
        requestAnimationFrame(gameLoop); 
    }
})

