
//Abastracta
export class Character{
    constructor(x, y){
        this.origenX = x;
        this.origenY = y;
        this.vidas = 3;
    
        this.elemento = null;
        this.posX = this.origenX;
        this.posY = this.origenY;
        this.velocidad = 0;

        this.scale = 0;
        this.width = 0;
        this.height = 0;
        this.offsetX = 20;
        this.offsetY = 25;
    }

    init(){
        //Metodo abtrascto ya que los personajes no inician de la misma forma
    }

    move() {
        this.posX += this.velocidad;
        this.elemento.style.left = this.posX + "px";
    }

    getTop(){
        return this.posY + this.offsetY;
    }

    getBottom(){
        return this.posY + this.height - this.offsetY;
    }

    getLeft(){
        return this.posX + this.offsetX;
    }

    getRight(){
        return this.posX + this.width - this.offsetX;
    }

    
}