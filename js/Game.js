import { KeyController } from "./KeyController.js";

export class Game{
    constructor(player){
        this.player = player;
        this.score = 0;
        this.enemies = [];
        this.keys = new KeyController();
        this.estadoJugador = "idle";

    }

    update(){
        this.handleInput();
        this.handlePlayer();
        this.handleColision();
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

        //verifico colisiones.(hasColision)

            //Verifico de enemigos

            //Verifico de premios

    }

    hasColision(){
        //retorno booleano
    }



    



}