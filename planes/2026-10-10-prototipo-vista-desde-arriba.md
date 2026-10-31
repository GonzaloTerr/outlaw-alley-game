# Outlaw Alley 2: prototipo con vista desde arriba

## Qué resuelve
Saber si el formato nuevo es divertido (recorrer un mapa, juntar estrellas de sheriff, voltear al jefe) antes de gastar tiempo en arte. Se prueba con figuras simples, como se hizo con la versión 1.

## Qué voy a hacer
1. **Lo más riesgoso primero: moverse y apuntar en un mapa grande.** Pueblo de unos 3 × 2 pantallas, con la cámara siguiendo al vaquero. Edificios, barriles y carretas como bloques que no se atraviesan y que **frenan las balas** (sirven de cobertura).
   - Computadora: WASD o flechas (las diagonales salen apretando dos), mouse para apuntar, clic izquierdo dispara, clic derecho rueda, R recarga.
   - Celular: los dos joysticks de la versión 1. El izquierdo mueve en cualquier dirección; el derecho apunta y dispara mientras está apretado. Botón RODAR.
2. **Estrellas de sheriff:** 5 por nivel, repartidas por el mapa, con un contador arriba y una flecha en el borde de la pantalla que apunta a la más cercana (si no, se pierde tiempo buscando).
3. **Bandidos:** aparecen fuera de la vista (puertas, callejones, bordes del mapa), caminan hacia el vaquero, se frenan a distancia de tiro, avisan con el "!" y disparan. Tope de bandidos a la vez que sube con el nivel.
4. **Jefe:** cuando se junta la última estrella aparece en un punto del mapa, con escopeta en abanico y barra de vida, como en la versión 1. Voltearlo pasa de nivel: mapa con más estrellas y más bandidos.
5. Lo que se copia de la versión 1, porque ya está probado: revólver de 6 balas y recarga, rol invulnerable, 3 vidas con 3 corazones, vida extra cada 5.000 puntos, récord, textos en inglés y castellano.

## Qué NO voy a hacer
- Arte: todo son figuras (círculos, rectángulos). El arte se decide si la versión 1 muestra jugadores.
- Varios mapas: uno solo; cada nivel cambia dónde están las estrellas y cuántos bandidos hay.
- Tipos nuevos de enemigos, armas distintas, tienda, mejoras, minimapa.
- Sonido nuevo: si hace falta, se reusan los de la versión 1.
- Portada, videos, SDK y subida a portales.

## Qué no se tiene que romper
- **La versión 1 no se toca:** `Desktop\juego-tirador` (código, arte, sonido) y los paquetes de `entrega`, que están esperando la aprobación de CrazyGames. Todo lo nuevo va en `Desktop\outlaw-alley-2`.
- El servidor de la versión 1 en el puerto 8080 sigue igual; el prototipo usa otro puerto.

## Cómo verifico
- Pruebas automáticas en el navegador sin pantalla: que el vaquero choque con los bloques, que las balas se frenen en la cobertura, que juntar las 5 estrellas haga aparecer al jefe y que voltearlo pase de nivel. Sin errores en la consola.
- Gonzalo lo juega en la computadora y en el celular y dice si es divertido. Esa es la prueba que importa.
- Al final, confirmar que la carpeta de la versión 1 y los paquetes de `entrega` no cambiaron.
