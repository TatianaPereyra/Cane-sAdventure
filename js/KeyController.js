export class KeyController{
    constructor(){
        this.isMoving = false;
        this.isJumping = false;
        this.isRunning = false;
        this.keys = [];
        this.waitEvents();
    }


    waitEvents(){

        document.addEventListener("keydown", (e) => {
            //Evito que se agregue la tecla si se mantiene
            if (!this.keys.includes(e.key)) {
                this.keys.push(e.key);
            }

            if (this.keys.includes("ArrowRight") ||this.keys.includes("d")) {
                this.isMoving = true;

                //si ademas de caminar sostiene sifht entonces esta corriendo
                if(this.keys.includes("Shift")){
                    this.isRunning = true;
                }
            }

        
            if(this.keys.includes("ArrowUp") || this.keys.includes(" ") || this.keys.includes("w")){
                this.isJumping = true;
            }

        });

        document.addEventListener("keyup", (e) =>{
            this.keys = this.keys.filter((k) => k !== e.key);

            if (!this.keys.includes("ArrowRight") && !this.keys.includes("d")) {
                this.isMoving = false;
                this.isRunning = false;

            }else if (!this.keys.includes("Shif")){
                this.isRunning = false;
            }

            if(!this.keys.includes("ArrowUp") && !this.keys.includes(" ") && !this.keys.includes("w")){
                this.isJumping = false;
            }
        });
        
    }


    getIsWalking(){
        return this.isMoving;
    }

    getIsJumping(){
        return this.isJumping;
    }

    getIsRunning(){
        return this.isRunning;
    }


}