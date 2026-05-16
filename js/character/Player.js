import { Character } from "./Character.js";

export class Player  extends Character{
    constructor(x, y,) {
        super(x, y);
        this.elemento = document.querySelector("#player");
        this.estado = "idle";
        this.posX = this.origenX;
        this.posY = this.origenY;
        this.velocidad = 0;
        this.isJumping = false;
        this.velY = 0;
        this.gravedad = 0.5; 
        this.jumpForce = 14; 
    }

    init() {
        this.elemento.style.left = this.origenX + "px";
        this.elemento.style.top = this.origenY + "px";
        this.elemento.classList.replace("inactive", "idle");
    }

    jump() {
        if (this.isJumping) return;
        this.isJumping = true;
        this.velY = -this.jumpForce; // impulso hacia arriba
        this.setEstado("jump-up");
    }

    /**
     * Actualizacion de salto. Verifica el estado del salto para mostar la animacion correspondiente
     * y ubicar al elemento en el lugar adecuado.
     * 
     * @returns corta en caso de que no este saltando (evita salto constante)
     */

    updateJump() {
        if (!this.isJumping) {
            return;
        }

        this.velY += this.gravedad;
        this.posY += this.velY;

        if (this.velY > 0 && this.estado !== "jump-down") {
            this.setEstado("jump-down");
        }

        if (this.posY >= this.origenY) {
            this.posY = this.origenY;
            this.isJumping = false;
            this.velY = 0;
            this.setEstado("idle");
        }

        this.elemento.style.top = this.posY + "px";
    }

    /**
     * @param {String} estado - actividad del personaje
     * 
     * Modifica clases del elemento segun el estado, controlando asi
     * el cambio de animaciones según corresponda.
     */

    setEstado(estado) {
        if (estado === this.estado) return;
        this.elemento.classList.remove(this.estado);
        this.elemento.classList.add(estado);
        this.estado = estado;
    }

    setVelocidad(numero) {
        this.velocidad = numero;
    }

}