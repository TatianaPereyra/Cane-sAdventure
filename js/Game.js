import { Character } from "./character/Character.js";
import { Chicken } from "./character/Chicken.js";
import { DogEnemy } from "./character/DogEnemy.js";
import { KeyController } from "./KeyController.js";
import { drawLife } from "./Main.js";
import { showScore } from "./Main.js";

export class Game{
    constructor(player){
        this.player = player;
        this.estadoJugador = "idle";
        this.margenX = 900; //cuantos px puede avanzar el jugador hasta que comience a avanzar la pantalla

        this.scroll = 0; //desplazamiento para el fondo
        this.score = 0;
        this.keys = new KeyController();

        this.premios = [];
        setInterval(() => this.spawnChicken(), 2000);

        this.enemies = [];
        this.spawnEnemy();

    }

    gameLoop(){
        //cuando no tenga vidas corto
        if(this.player.getVidas() === 0){
            this.gameOver();
            return;
        }

        if(this.score < 0){
            this.score = 0;
        }

        drawLife();
        showScore(this.score);

        this.handleInput();
        this.handlePlayer();
        this.handleColision();

        
        this.enemies.forEach(enemy => {
            enemy.setVelocidad(-5 - this.scroll);
            enemy.move();
        });

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

        if (this.player.posX < this.margenX) {
        this.player.move();
        this.scroll = 0;
        } else {
            this.player.posX = this.margenX;
            this.scroll = this.player.velocidad;
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

    this.premios.forEach(premio => {
        if(this.hasColision(this.player, premio)){
            this.premios = this.premios.filter(e => e !== premio);

            this.score += 100;

            premio.delete();
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

    /**
     * Genera enemigos de manera aleatoria con un tiempo de intervalo de minimo 5 segundos
     */
    spawnEnemy(){
        let enemigo = new DogEnemy(1400, 540);
        enemigo.init();

        this.enemies.push(enemigo);

        let intervalo = 5000 + Math.random() * 1000;
        setTimeout(() => this.spawnEnemy(), intervalo);
    }

    spawnChicken(){
        let chicken = new Chicken(900, 560);
        this.premios.push(chicken);

        chicken.init();
    }

    gameOver(){
        //finaliza el juego
    }

    getScroll(){
        return this.scroll;
    }

}