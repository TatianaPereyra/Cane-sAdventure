"use strict";

import { KeyController } from "./KeyController.js";
import { Player } from "./character/Player.js";
import { Game } from "./Game.js";


//-------------------------------------------------------------------------------------------
//                              ESCENARIO Y ELEMENTOS 
//-------------------------------------------------------------------------------------------
const CANVAS = document.querySelector("#canvas"); 
const CTX = CANVAS.getContext("2d");

//Creacion del suelo
const TILESET = new Image();
TILESET.src = "../assets/img/tiles/tiles.png";

let fondoX = 0; //donde comienzo a crear el suelo

let tiles = [];
let cantidadTiles = Math.ceil(CANVAS.width / 128) + 2;

for (let i = 0; i < cantidadTiles; i++) {
    tiles.push(i * 128);
}

//inicializo jugador con las coordenadas donde se debe dibujar
const PLAYER = new Player(100, 520, CTX);
PLAYER.init();
let playerX = 100;
let playerY = 510;
 

//Manejo del juego
const game = new Game(PLAYER);
let gameOver = false;


TILESET.onload = () => {
    renderizar();
};


//-------------------------------------------------------------------------------------------
//                                     PARTIDA 
//-------------------------------------------------------------------------------------------

function generateFloor(offset){
    for (let i = 0; i < cantidadTiles; i++) {
        let x = Math.round(i * 128 - offset);

        CTX.drawImage(
            TILESET,
            0, 0, 30, 30, //tile
            x, 600, //posicion en pantalla
            128,128//tamaño visual final
        );
    }

}

function renderizar() {
    CTX.imageSmoothingEnabled = false;
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    fondoX += game.getScroll();
    let offset = fondoX % 128;

    generateFloor(offset);
   
    game.gameLoop();
    requestAnimationFrame(renderizar);
}

export function drawLife() {
    let life = new Image();
    life.src = "../assets/img/ChickenLeg.png";

    for(let i = 0; i < PLAYER.getVidas(); i++){
        CTX.drawImage(life, 20 + i * 40, 20, 60, 60)
    }

}

export function showScore(score) {
    CTX.fillStyle = "white";
    CTX.font = "30px Arial";
    CTX.fillText("Score: " + score, CANVAS.width - 150, 50);
}


