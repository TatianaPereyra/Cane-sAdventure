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
const PLAYER = new Player(100, 500, CTX);
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
//                                     INICIALIZACION 
//-------------------------------------------------------------------------------------------

/**
 * 
 * @param {Num} offset - desplazamiento del fondo para crear efecto de movimiento continuo. 
 * Se calcula a partir de la posición del fondo y el ancho de los tiles.
 * 
 * Genera el suelo del juego. Utiliza un tileset para dibujar los tiles del suelo en el canvas. 
 * El desplazamiento del fondo se calcula a partir de la posición actual del fondo y el ancho de los tiles para crear un efecto de movimiento continuo.
 * Se generan los necesarios para cubrir el canvas y algunos adicionales para evitar que se vean espacios vacíos al moverse.
 */
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

/**
 * Genera las plataformas y las posiciona de acuerdo a sus coordenadas. 
 * Solo se muestran si están dentro del área visible o a punto de entrar.
 */
function generatePlataformas() {
    game.getPlatforms().forEach(p => {
        if (!p.elemento) {
            let el = document.createElement("div");
            el.classList.add("platform");
            el.style.position = "absolute";
            document.querySelector("#platforms").appendChild(el);
            p.elemento = el;
        }
        
        p.elemento.style.left = (p.x - game.getScroll()) + "px";
        p.elemento.style.top = p.y + "px";
        p.elemento.style.width = p.width + "px";
        p.elemento.style.height = p.height + "px";

        // Solo mostrar si está en pantalla o a punto de entrar
        if (p.x - game.getScroll() < CANVAS.width + 200 && 
            p.x - game.getScroll() + p.width > -200) {
            p.elemento.style.display = "block";
        } else {
            p.elemento.style.display = "none";
        }
    });
}

//Renderizado del juego. Se encarga de dibujar el fondo, las plataformas y el jugador en cada frame.
function renderizar() {
    CTX.imageSmoothingEnabled = false;
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

    fondoX += game.getScroll();
    let offset = fondoX % 128;

    generateFloor(offset);
    generatePlataformas();

    game.gameLoop();
    requestAnimationFrame(renderizar);
}

//Dibuja la cantidad de vidas del jugador
export function drawLife() {
    let life = new Image();
    life.src = "../assets/img/ChickenLeg.png";

    for(let i = 0; i < PLAYER.getVidas(); i++){
        CTX.drawImage(life, 20 + i * 40, 20, 60, 60)
    }

}

//Dibuja el puntaje del jugador
export function showScore(score) {
    CTX.fillStyle = "white";
    CTX.font = "30px Arial";
    CTX.fillText("Score: " + score, CANVAS.width - 170, 50);
}


