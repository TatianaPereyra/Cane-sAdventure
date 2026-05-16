"use strict";

import { KeyController } from "./KeyController.js";
import { Player } from "./character/Player.js";
import { Game } from "./Game.js";


//-------------------------------------------------------------------------------------------
//                              ESCENARIO Y ELEMENTOS 
//-------------------------------------------------------------------------------------------
const CANVAS = document.querySelector("#canvas"); 
const CTX = CANVAS.getContext("2d");
const GROUND_Y = 669; //esquina inferior izquierda en mi pantalla para dibujar


//Creacion del suelo
const TILESET = new Image();
TILESET.src = "../assets/img/tiles/Terrain(16x16).png";

let fondoX = 0;

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


function renderizar(){
    CTX.imageSmoothingEnabled = false;
    CTX.clearRect(0,0,CANVAS.width,CANVAS.height);

    // cantidad necesaria para llenar pantalla
    let cantidadTiles = Math.ceil(CANVAS.width / 128) + 2;

    for(let i = 0; i < cantidadTiles; i++){

        CTX.drawImage(TILESET, 
            97, 1, //coordenadas dentro del tileSet
            46, 46, //tamaño del tile
            fondoX + (i * 128), 600, //donde empiezo a dibujar
            128, 128 //tamaño visual final
        );

    }

    game.update();

    requestAnimationFrame(renderizar);

}


renderizar();