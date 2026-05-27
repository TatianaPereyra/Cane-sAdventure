import { Character } from "./Character.js";

export class Player  extends Character{
    constructor(x, y,) {
        super(x, y);
        this.elemento = document.querySelector("#player");
        this.sound = new Audio("../../assets/audio/jump.mpeg");
        this.estado = "idle";
        this.vidas = 3;
        this.currentPlatform = null;

        this.isJumping = false;
        this.velY = 0;
        this.prevY = this.posY;
        this.gravedad = 0.5; 
        this.jumpForce = 16; 

        //guarda sus dimensiones para las colisiones (medidas del sprite * escala)
        this.scale = 4;
        this.width = 54 * this.scale;
        this.height = 32 * this.scale;
        this.offsetX = 30;
        this.offsetY = 50;
    }


    init() {
        this.elemento.style.left = this.origenX + "px";
        this.elemento.style.top = this.origenY + "px";
        this.elemento.classList.replace("inactive", "idle");
    }

    jump() {
         console.log("jump() llamado, isJumping:", this.isJumping);
        if (this.isJumping) return;
        this.isJumping = true;
        this.velY = -this.jumpForce; // impulso hacia arriba
        this.setEstado("jump-up");
        
        this.playSound();
    }

    /**
     * Actualizacion de salto. Verifica el estado del salto para mostar la animacion correspondiente
     * y ubicar al elemento en el lugar adecuado.
     * 
     * @returns corta en caso de que no este saltando (evita salto constante)
     */
    updateJump() {
        if (!this.isJumping) return;

        this.velY += this.gravedad;
        this.posY += this.velY;

        if (this.velY > 0 && this.estado !== "jump-down") {
            this.setEstado("jump-down");
        }

        if (this.currentPlatform) {
            if (this.posY + this.height >= this.currentPlatform.y) {
                this.posY = this.currentPlatform.y - this.height;
                this.isJumping = false;
                this.velY = 0;
                this.currentPlatform = null;
                this.setEstado("idle");
            }
        } else if (this.posY >= this.origenY) {  // >= atrapa el sobrepaso
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

    restLife(){
        if(this.vidas < 0){
            this.vidas = 0;
            
        }else{
            this.vidas--;
        }
    }

    playHit() {
        this.elemento.classList.add("hit");
        this.elemento.addEventListener("animationend", () => {
            this.elemento.classList.remove("hit");
        }, { once: true }); // once: true para que se desregistre solo
    }

    getVidas(){
        return this.vidas;
    }

    setVidas(vidas){
        this.vidas = vidas;
    }

    setCurrentPlatform(platform){
        this.currentPlatform = platform;
    }

    getCurrentPlatform(){
        return this.currentPlatform;
    }

    setPrevY(){
        this.prevY = this.posY;
    }
}