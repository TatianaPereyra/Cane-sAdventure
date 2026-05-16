
//Abastracta
export class Character{
    constructor(x, y){
        this.origenX = x;
        this.origenY = y;
        this.elemento = null;
    }

    init(){
        //Metodo abtrascto ya que los personajes no inician de la misma forma
    }

    move() {
        this.posX += this.velocidad;
        this.elemento.style.left = this.posX + "px";
    }
    
}