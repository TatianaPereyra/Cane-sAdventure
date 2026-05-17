import { Character } from "./Character.js";

export class DogEnemy extends Character{
    constructor(x, y){
        super(x, y);
        this.contenedor = null;

        this.velocidad = -5; //velocidad por defecto (hacia la izquierda)
        this.elemento = null;

        this.type = "dog";

        this.scale = 4;
        this.width = 48 * this.scale;
        this.height = 48 * this.scale;
    }

    init(){
        //creo el elemento de forma dinamica
        this.contenedor = document.querySelector("#enemies");

        let enemigo = document.createElement("div");
        enemigo.classList.add("dogEnemy");

        this.contenedor.appendChild(enemigo);

        enemigo.style.left = this.origenX + "px";
        enemigo.style.top = this.origenY + "px";

        this.elemento = enemigo;
    }

    delete(){
        this.contenedor.removeChild(this.elemento); //lo borro del DOM
    }

    getType(){
        return this.type;
    }


}