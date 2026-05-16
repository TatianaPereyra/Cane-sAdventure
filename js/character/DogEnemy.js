import { Character } from "./Character.js";

export class DogEnemy extends Character{
    constructor(x, y){
        super(x, y);
        this.velocidad = -5; //velocidad por defecto (hacia la izquierda)
        this.elemento = null;
        this.posX = x;
        this.posY = y;
        this.type = "dog";
    }

    init(){
        //creo el elemento de forma dinamica
        let contenedor = document.querySelector("#enemies");

        let enemigo = document.createElement("div");
        enemigo.classList.add("dogEnemy");

        contenedor.appendChild(enemigo);

        enemigo.style.left = this.origenX + "px";
        enemigo.style.top = this.origenY + "px";

        this.elemento = enemigo;

    }


}