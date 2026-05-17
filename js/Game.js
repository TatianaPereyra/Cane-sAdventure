import { Character } from "./character/character.js";
import { DogEnemy } from "./character/DogEnemy.js";
import { KeyController } from "./KeyController.js";
import { drawLife } from "./Main.js";

export class Game{
    constructor(player){
        this.player = player;
        this.estadoJugador = "idle";

        this.score = 0;
        this.keys = new KeyController();
        
        setInterval(() => this.spawnEnemy(), 5000);
        this.enemies = [];

        setInterval(() => this.spawnChicken(), 2000);
    }

    update(){
        //cuando no tenga vidas corto
        if(this.player.getVidas() === 0){
            this.gameOver();
            return;
        }

        drawLife();

        this.handleInput();
        this.handlePlayer();
        this.handleColision();

        
        this.enemies.forEach(enemy => enemy.move());

    }


    handleInput(){
        if(this.keys.getIsRunning()){
            this.estadoJugador = "running";

        }else if(this.keys.getIsWalking()){
            this.estadoJugador = "walking";

        }else{
            this.estadoJugador = "idle";
        }

        if(this.keys.getIsJumping()){
            this.estadoJugador = "jump";
        }
    }

    handlePlayer(){

        switch(this.estadoJugador){
            case "idle": 
                this.player.setEstado("idle");
                this.player.setVelocidad(0);
                break;
            case "walking":
                this.player.setEstado("walking")
                this.player.setVelocidad(2);
                break;
            case "running": 
                this.player.setEstado("running")
                this.player.setVelocidad(5);
                break;
        }

        if(this.keys.getIsJumping()){
            this.player.jump();
        }

        this.player.updateJump();
        this.player.move();

    }

    handleColision(){
    // enemigos
    this.enemies.forEach(enemy => {

        if (this.hasColision(this.player, enemy)) {
           this.enemies = this.enemies.filter(e => e !== enemy);//lo elimino

            if(enemy.getType() === "dog"){
                this.player.restLife();
                this.score -= 100;
            }

           enemy.delete();
    
        }
    });




    }


    /**
     * @param {Character} objA - Primer personaje 
     * @param {Character} objB - Segundo personaje 
     * 
     * Comprueba las coordenadas de los personajes y verifica si estan 
     * superpuestas para determinar colision
     * 
     * @returns - boolean
     */

    hasColision(objA, objB){
        return (
            objA.getRight() > objB.getLeft() &&
            objA.getLeft() < objB.getRight() &&
            objA.getBottom() > objB.getTop() &&
            objA.getTop() < objB.getBottom()
        );
        
    }

    spawnEnemy(){
        let enemigo = new DogEnemy(1300, 540);
        enemigo.init();

        this.enemies.push(enemigo);
    }

    spawnChicken(){
        let chicken = new Chicken();
        chicken.init();
    }

    gameOver(){
        alert("Perdiste");
    }

}