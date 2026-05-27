import { Character } from "./character/Character.js";
import { Chicken } from "./character/Chicken.js";
import { DogEnemy } from "./character/DogEnemy.js";
import { KeyController } from "./KeyController.js";
import { drawLife, showScore, showTimer, showGameOverScreen } from "./Main.js";
import { Platform } from "./Platforms.js";

export class Game{
    constructor(player){
        this.player = player;
        this.estadoJugador = "idle";
        this.margenX = 800; //cuantos px puede avanzar el jugador hasta que comience a avanzar la pantalla
        this.isGameOver = false;

        this.scroll = 0; //desplazamiento para el fondo
        this.score = 0;
        this.keys = new KeyController();
        this.jumpPressed = false;

        this.premios = [];

        this.enemies = [];
        this.enemyTimeOut = null;
        this.spawnEnemy();

        this.plataformas = [];
        this.generatePlatforms();

        this.tiempoRestante = 90; //tiempo en segundos
        this.timerInterval = null;
        this.startTimer();
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

        if (this.isGameOver) return;

        if (this.score < 0) this.score = 0;

        drawLife();
        showScore(this.score);
        showTimer(this.tiempoRestante);

        this.player.setPrevY();

        this.handleInput();
        this.handleColision();
        this.handlePlayer();

        this.updatePlatforms(); 
        this.recyclePlatforms();
        this.updateChickens();

        this.enemies.forEach(enemy => {
             console.log("velocidad enemigo:", -5 - this.scroll, "scroll:", this.scroll);
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
            case "jump": break;
        }

        if (this.player.posX >= this.margenX) {
            this.player.posX = this.margenX;

            if (!this.player.isJumping) {
                this.scroll = this.player.velocidad;
            }

        } else {
            this.scroll = 0;
        }

        if(this.keys.getIsJumping()){
            if(!this.jumpPressed && !this.player.isJumping){
                this.player.jump();
                this.jumpPressed = true;
            }
        } else {
            this.jumpPressed = false; // resetea cuando suelta la tecla
        }

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
            enemy.playSound();

            this.enemies = this.enemies.filter(e => e !== enemy);//lo elimino

                if(enemy.getType() === "dog"){
                    this.player.restLife();
                    this.player.playHit();
                    this.score -= 100;
                }

            enemy.delete();
        
            }
        });

        this.premios.forEach(premio => {
            if(this.hasColision(this.player, premio)){
                premio.playSound();

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
                    //calcula el centro horizontal del jugador.
                    let playerCenterX = this.player.posX + this.player.width / 2;
                    //verifico si esta dentro de la plataforma en el eje X
                    let onPlatformX =
                        playerCenterX > plataforma.getLeft() &&
                        playerCenterX < plataforma.getRight();

                    if (onPlatformX) {
                        // se apoya sobre la plataforma y detiene su caida
                        this.player.posY = plataforma.getTop() - this.player.height;
                        this.player.isJumping = false;
                        this.player.velY = 0;
                        this.player.setEstado("idle");
                        this.player.setCurrentPlatform(plataforma); //almacena la plataforma actual
                    }
                }
            }
        });

        // después de revisar colisiones, verifico si sigue dentro de la plataforma actual
        if (this.player.currentPlatform) {
            let p = this.player.currentPlatform;
            //verifico si el jugador se salió por la izquierda o derecha de la plataforma. Si es así, lo dejo caer nuevamente.
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

        this.enemyTimeout = setTimeout(() => {
            this.spawnEnemy();
        }, intervalo);
    }

    spawnChicken(){
        let chicken = new Chicken(900 - this.scroll, 560);
        this.premios.push(chicken);

        chicken.init();
    }

    updateChickens() {
        this.premios.forEach(premio => {
            premio.posX -= this.scroll;
            premio.elemento.style.left = premio.posX + "px"; // agregá esta línea
        });
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

    recyclePlatforms() {
        this.plataformas.forEach(plataforma => {
            // Si salió completamente de la pantalla por la izquierda
            if (plataforma.x + plataforma.width < 0) {
                let maxX = 0;
                //encuentra la plataforma mas a la derecha
                this.plataformas.forEach(p => {
                    if (p.x > maxX) maxX = p.x;
                });

                let posibilidad = (Math.round(Math.random() * 5) + 1);

                // Calcular la nueva posición primero
                let newX = maxX + 300 + Math.floor(Math.random() * 200);
                let newY = 200 + Math.floor(Math.random() * 300);
                let newWidth = 150 + Math.floor(Math.random() * 150);

                if (posibilidad % 2 === 0) {
                    let chicken = new Chicken(newX + newWidth / 2 - this.scroll, newY - 50);
                    this.premios.push(chicken);
                    chicken.init();
                } else if (posibilidad % 5 === 0) {
                    this.spawnChicken();
                }

                plataforma.x = newX;
                plataforma.y = newY;
                plataforma.width = newWidth;

                if (plataforma.elemento) {
                    plataforma.elemento.remove();
                    plataforma.elemento = null;
                }
            }
        });
    }

    /**
     * Inicia un temporizador que decrementa el tiempo restante cada segundo.
     *  Si el tiempo llega a cero finaliza el juego el juego.
     */
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.tiempoRestante--;
            if (this.tiempoRestante <= 0) {
                clearInterval(this.timerInterval);
                this.gameOver();
            }
        }, 1000);
    }

    getPlatforms(){
        return this.plataformas;
    }


    gameOver(){
        this.isGameOver = true;
        this.player.setVidas(0);
        clearInterval(this.timerInterval);
        clearTimeout(this.enemyTimeout);

        if(this.score < 0) this.score = 0;

        showGameOverScreen(this.score, this.tiempoRestante);
    }

}