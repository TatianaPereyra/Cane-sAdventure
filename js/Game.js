import { Character } from "./character/Character.js";
import { Chicken } from "./character/Chicken.js";
import { DogEnemy } from "./character/DogEnemy.js";
import { KeyController } from "./KeyController.js";
import { drawLife } from "./Main.js";
import { showScore } from "./Main.js";
import { Platform } from "./Platforms.js";

export class Game{
    constructor(player){
        this.player = player;
        this.estadoJugador = "idle";
        this.margenX = 800; //cuantos px puede avanzar el jugador hasta que comience a avanzar la pantalla

        this.scroll = 0; //desplazamiento para el fondo
        this.score = 0;
        this.keys = new KeyController();

        this.premios = [];
        setInterval(() => this.spawnChicken(), 2000);

        this.enemies = [];
        this.spawnEnemy();

        this.plataformas = [];
        this.generatePlatforms();
    }

    /**
     * GameLoop principal del juego.
     *  Se encarga de actualizar el estado del juego en cada frame, 
     * incluyendo el movimiento del jugador, el desplazamiento del fondo,
     *  la generación y actualización de plataformas, y la verificación de colisiones.
     */
    gameLoop() {
        if (this.player.getVidas() === 0) {
            this.gameOver();
            return;
        }

        if (this.score < 0) this.score = 0;

        drawLife();
        showScore(this.score);

        this.player.setPrevY();

        this.handleInput();
        this.handlePlayer();

        this.updatePlatforms(); 
        this.recyclePlatforms();

        this.handleColision();

        this.enemies.forEach(enemy => {
            enemy.setVelocidad(-5 - this.scroll);
            enemy.move();
        });
    }


    /**
     * Maneja la entrada del jugador. Verifica el estado de las teclas para determinar el estado del jugador.
     */

    handleInput(){
        if(this.keys.getIsRunning()){
            this.estadoJugador = "running";

        }else if(this.keys.getIsWalking()){
            this.estadoJugador = "walking";

        }else{
            this.estadoJugador = "idle";
        }

        if(this.keys.getIsJumping()){
            this.estadoJugador = "jump";
        }
    }

    /**
     * Maneja el movimiento del jugador y el desplazamiento del fondo en base al movimiento del jugador.
     */
    handlePlayer(){
        switch(this.estadoJugador){
            case "idle": 
                this.player.setEstado("idle");
                this.player.setVelocidad(0);
                break;
            case "walking":
                this.player.setEstado("walking")
                this.player.setVelocidad(2);
                break;
            case "running": 
                this.player.setEstado("running")
                this.player.setVelocidad(5);
                break;
        }

        if (this.player.posX >= this.margenX) {

            this.player.posX = this.margenX;
            this.scroll = this.player.velocidad;

        } else {

            this.scroll = 0;
        }

        if(this.keys.getIsJumping()){
            this.player.jump();
        }

        this.player.setPrevY();
        this.player.updateJump();
        this.player.move();

    }

    /**
     * Maneja las colisiones entre el jugador y los enemigos, premios y plataformas.
     * Para los enemigos, si hay colision, se elimina el enemigo y se resta una vida al jugador. Si el enemigo es un perro, también se resta puntaje.
     * Para los premios, si hay colision, se elimina el premio y se suma puntaje.
     */

    handleColision(){
        this.enemies.forEach(enemy => {
            if (this.hasColision(this.player, enemy)) {
            this.enemies = this.enemies.filter(e => e !== enemy);//lo elimino

                if(enemy.getType() === "dog"){
                    this.player.restLife();
                    this.score -= 100;
                }

            enemy.delete();
        
            }
        });

        this.premios.forEach(premio => {
            if(this.hasColision(this.player, premio)){
                this.premios = this.premios.filter(e => e !== premio);

                this.score += 100;

                premio.delete();
            }
        });


        /**
         * plataformas
         * Verifico si el jugador colisiona con alguna plataforma. Si es así, y el jugador viene cayendo,
         *  lo apoyo sobre la plataforma y detengo su caída.
         * Luego verifico si el jugador sigue dentro de la plataforma actual. 
         * Si se sale por la izquierda o derecha, lo dejo caer nuevamente.
         */
        this.plataformas.forEach(plataforma => {
            if (this.hasColision(this.player, plataforma)) {
                // solo si viene cayendo
                if (this.player.velY >= 0) {
                    const playerCenterX = this.player.posX + this.player.width / 2;
                    const onPlatformX =
                        playerCenterX > plataforma.getLeft() &&
                        playerCenterX < plataforma.getRight();

                    if (onPlatformX) {
                        // se apoya sobre la plataforma
                        this.player.posY = plataforma.getTop() - this.player.height;
                        this.player.isJumping = false;
                        this.player.velY = 0;
                        this.player.setEstado("idle");
                        this.player.setCurrentPlatform(plataforma);
                    }
                }
            }
        });
        // después de revisar colisiones, verifico si sigue dentro de la plataforma actual
        if (this.player.currentPlatform) {
            let p = this.player.currentPlatform;
            if (this.player.getRight() < p.x || this.player.getLeft() > p.x + p.width) {
                this.player.isJumping = true;
                this.player.velY = 1; 
                this.player.currentPlatform = null;
            }
        }

    }


    /**
     * @param {Character} objA - Primer personaje 
     * @param {Character} objB - Segundo personaje 
     * 
     * Comprueba las coordenadas de los personajes y verifica si estan 
     * superpuestas para determinar colision
     * 
     * @returns - boolean
     */

    hasColision(objA, objB){
        return (
            objA.getRight() > objB.getLeft() &&
            objA.getLeft() < objB.getRight() &&
            objA.getBottom() > objB.getTop() &&
            objA.getTop() < objB.getBottom()
        );
        
        
    }

    /**
     * Genera enemigos de manera aleatoria con un tiempo de intervalo de minimo 5 segundos
     */
    spawnEnemy(){
        let enemigo = new DogEnemy(1400, 540);
        enemigo.init();

        this.enemies.push(enemigo);

        let intervalo = 5000 + Math.random() * 1000;
        setTimeout(() => this.spawnEnemy(), intervalo);
    }

    spawnChicken(){
        let chicken = new Chicken(900, 560);
        this.premios.push(chicken);

        chicken.init();
    }

    getScroll(){
        return this.scroll;
    }

    /**
     * Genera plataformas de manera aleatoria. Si ya hay plataformas, toma la última y genera una nueva a partir de esa, con un espacio de 200px entre ellas. 
     * La altura y el ancho de cada plataforma son aleatorios dentro de un rango determinado.
     * Las plataformas se almacenan en un array para luego ser renderizadas y para verificar colisiones con el jugador.
     * Por este motivo se consideran parte del estado del juego, aunque no sean personajes ni premios.
     */

    generatePlatforms() {
        for (let i = 0; i < 5; i++) {
            let baseX = i * (128 + 200) + 200;
            let y = 400;
            y += Math.floor(Math.random() * 100) - 50; 
            y = Math.max(200, Math.min(500, y)); 

            let width = 150 + Math.floor(Math.random() * 150); 
            let height = 32;

            let plataforma = new Platform(baseX, y, width, height);
            this.plataformas.push(plataforma);
        }
    }

    //Actualizo la posicion de la plataforma segun el scroll del fondo, para que se muevan junto con el jugador
    updatePlatforms() {
        this.plataformas.forEach(plataforma => {
            plataforma.x -= this.scroll;  
        });
    }

    /**
     * Recicla las plataformas que han salido completamente de la pantalla por la izquierda.
     */
    recyclePlatforms() {
        this.plataformas.forEach(plataforma => {
            // Si salió completamente de la pantalla por la izquierda
            if (plataforma.x + plataforma.width < 0) {
                // Buscar la plataforma más a la derecha
                let maxX = 0;
                this.plataformas.forEach(p => {
                    if (p.x > maxX) maxX = p.x;
                });
                
                // Reposicionarla al final con nueva altura aleatoria
                plataforma.x = maxX + 300 + Math.floor(Math.random() * 200);
                plataforma.y = 200 + Math.floor(Math.random() * 300);
                plataforma.width = 150 + Math.floor(Math.random() * 150);
                
                if (plataforma.elemento) {
                    plataforma.elemento.remove();
                    plataforma.elemento = null;
                }
            }
            });
        }

    getPlatforms(){
        return this.plataformas;
    }


    
    gameOver(){
        //finaliza el juego
    }

}