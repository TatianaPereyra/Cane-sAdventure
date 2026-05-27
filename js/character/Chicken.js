import { Character } from "./Character.js";

export class Chicken extends Character{
    constructor(x, y){
        super(x, y);
        this.elemento = null;
        this.contenedor = null;
        this.sound = new Audio("/assets/audio/chickenSound.mp3");

        this.scale = 2;
        this.width = 48;
        this.height = 48;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    init(){
        //creo el elemento de forma dinamica
        this.contenedor = document.querySelector("#chicken");

        let premio = document.createElement("div");
        premio.classList.add("chicken");

        this.contenedor.appendChild(premio);

        premio.style.left = this.origenX + "px";
        premio.style.top = this.origenY + "px";

        this.elemento = premio;
    }

    delete(){
        this.contenedor.removeChild(this.elemento); 
    }

}