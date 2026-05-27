export class Platform {
    constructor(x, y, width, height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.offsetX = 10; 
        this.offsetY = 5;

        this.elemento = null;
    }

    getPosX(){
        return this.x;
    }

    getPosY(){
        return this.y;
    }

    setPosX(newX){
        this.x = newX;
    }

    setPosY(newY){
        this.y = newY;
    }

    getLeft(){
        return this.x + this.offsetX;
    }   

    getRight(){
        return this.x + this.width - this.offsetX;
    }

    getTop(){
        return this.y + this.offsetY;
    }

    getBottom(){
        return this.y + this.height - this.offsetY;
    }

    setWidth(newWidth){
        this.width = newWidth;
    }

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

}