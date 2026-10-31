# Outlaw Alley 2: entrar a los edificios

## Qué resuelve
Hoy los edificios son bloques macizos: el pueblo se recorre por afuera y siempre se ve igual. Poder entrar, con bandidos y estrellas adentro, da lugares distintos para explorar y pelear, y hace que el mapa no sea repetitivo.

## Qué voy a hacer
1. **Lo más riesgoso primero: edificios huecos con puertas.** Cada edificio pasa a ser cuatro paredes con una o dos puertas (un hueco en la pared que da a la calle o al callejón). Las paredes frenan al vaquero, a los bandidos y a las balas; por la puerta se pasa y se tira.
2. **Techo que desaparece al entrar.** Desde afuera el edificio se ve con su techo, como ahora. Cuando el vaquero cruza la puerta, el techo de ese edificio se desvanece y se ve el interior; al salir, vuelve. Todo en el mismo mapa, sin pantallas de carga.
3. **Interiores con cobertura.** Adentro, muebles que frenan balas y sirven para cubrirse: la barra y las mesas del salón, el mostrador del banco, estantes de la tienda. Uno distinto por edificio para que cada uno se reconozca.
4. **Estrellas y bandidos adentro.** En cada nivel, parte de las estrellas (por ejemplo 2 de 5) caen dentro de edificios, cada una cuidada por uno o dos bandidos que esperan adentro y reaccionan cuando entrás o te ven por la puerta. La flecha del borde sigue señalando la estrella más cercana, esté afuera o adentro.
5. Lo demás sigue igual: juntar todas las estrellas trae al jefe (en la calle), voltearlo pasa de nivel, mismos controles en PC y celular.

## Qué NO voy a hacer
- Arte: sigue con figuras simples, como todo el prototipo.
- Interiores en pantallas aparte, puertas que se abren y cierran, llaves, escaleras o pisos de arriba.
- Que los bandidos de la calle entren a buscarte, ni que los de adentro salgan: cada uno se queda en su lado. Si en la prueba se siente raro, se ve después.
- Enemigos, armas o premios nuevos.

## Qué no se tiene que romper
- **La versión 1 no se toca:** `Desktop\juego-tirador` y sus paquetes de `entrega` (está en Basic Launch en CrazyGames). El servidor del puerto 8080 sigue igual.
- **El prototipo 2 tiene que seguir andando como hoy** en todo lo demás: moverse, apuntar, rodar, recargar, estrellas, jefe, pasar de nivel, controles táctiles. Sigue en el puerto 8095.

## Cómo verifico
- Pruebas automáticas en el navegador sin pantalla: que el vaquero entre por la puerta y no atraviese las paredes, que el techo se vaya al entrar y vuelva al salir, que las balas se frenen en las paredes y pasen por la puerta, que las estrellas de adentro cuenten y que al juntarlas todas aparezca el jefe. Sin errores en la consola.
- Gonzalo lo juega en la computadora y en el celular y dice si así es más interesante. Esa es la prueba que importa.
- Al final, confirmar que la carpeta de la versión 1 no cambió.
