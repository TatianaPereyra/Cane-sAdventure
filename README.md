# Cane's Adventure
Juego 2D Side Scroller

## Description
Cane's Adventure es un juego 2D side scroller desarrollado utilizando **JavaScript**, **HTML5 Canvas** y **CSS3**.

El jugador puede realizar las siguientes acciones:
- Saltar
- Caminar
- Correr

El objetivo del juego es obtener la mayor cantidad de puntos posible antes de que el tiempo se agote, recolectando premios y evitando enemigos que aparecen de forma aleatoria a lo largo del escenario.

Para esquivar enemigos y desplazarse estratégicamente, el jugador puede utilizar distintas plataformas distribuidas por el mapa.


## Features
- Sistema de vidas
- Temporizador de partida
- Puntaje dinámico
- Enemigos y premios generados aleatoriamente
- Movimiento lateral continuo
- Plataformas interactivas
- Pantalla de Game Over
- Música de fondo y efectos de sonido


## Gameplay
El jugador comienza la partida con **3 vidas**.

Cada colisión con un enemigo:
- resta **1 vida**
- descuenta **100 puntos** del puntaje total

El desafío consiste en sobrevivir el mayor tiempo posible y alcanzar la puntuación más alta.


## Technologies
- JavaScript (ES6 Modules)
- HTML5 Canvas
- CSS3

## Warning
Actualmente las plataformas pueden presentar algunos bugs de colisión debido al sistema de físicas implementado.  
En determinadas situaciones, el jugador puede quedar sujeto o colisionar desde distintos lados de la plataforma y no únicamente desde la parte superior central.

