// Outlaw Alley 2 — vista desde arriba en diagonal, con el arte de caricatura de la versión 1.
// Se recorre un pueblo más grande que la pantalla juntando estrellas de sheriff; con la última aparece el jefe y
// voltearlo pasa de nivel. Edificios, barriles y carretas no se atraviesan y frenan las balas (sirven de cobertura).
// Computadora: WASD o flechas (diagonales apretando dos), mouse apunta, clic izquierdo dispara, clic derecho rueda, R recarga.
// Celular: joystick izquierdo mueve en cualquier dirección; el derecho apunta y dispara mientras está apretado; botón RODAR.

const TEXTOS = {
  en: {
    titulo: 'OUTLAW ALLEY 2', subtitulo: 'prototype',
    tocaParaJugar: 'Tap or click to play',
    objetivo: 'Collect every sheriff star, then take down the boss',
    consejo: 'Shoot the bank safes to get a shotgun',
    ctrlMover: 'Move', ctrlDisparar: 'Aim & shoot', ctrlRodar: 'Roll to dodge',
    record: (n) => `Best: ${n}`,
    puntosHud: (n) => `Score ${n}`,
    nivelHud: (n) => `Level ${n}`,
    recargar: 'RELOAD',
    nivel: (n, total) => `Level ${n}\nFind ${total} sheriff stars`,
    llegoJefe: 'All stars! The boss is here!',
    jefe: 'BOSS', rol: 'ROLL',
    vidaExtra: 'Extra life!',
    premioEscopeta: (n) => `Shotgun x${n}!`,
    premioCorazon: '+1 heart',
    nivelSuperado: (n) => `Level ${n} complete!`,
    resumenNivel: (puntos, vidas, siguiente) => `Score: ${puntos}\nLives: ${vidas}\n\nNext: Level ${siguiente}`,
    teDieron: "You're hit!",
    vidaPerdida: (vidas, conJefe, puntos) => `You lost a life. ${vidas} left.\n\n${conJefe ? 'The boss is back at full health' : 'Your stars are kept'}\nScore: ${puntos}`,
    seguir: 'Tap or click to continue',
    finTitulo: 'Game over',
    finDatos: (puntos, nuevo) => `${nuevo ? 'New best score!\n' : ''}Score: ${puntos}`,
    volverAJugar: 'Tap or click to play again',
    videoVidas: 'Watch a video: +3 lives',
    sinVideo: 'No video available right now',
    deVuelta: 'Back in the game!',
    deVueltaDatos: (vidas, nivel, puntos) => `You have ${vidas} lives.\nKeep going on level ${nivel}\nScore: ${puntos}`,
    girar: 'Rotate your phone to play',
  },
  es: {
    titulo: 'OUTLAW ALLEY 2', subtitulo: 'prototipo',
    tocaParaJugar: 'Toca o haz clic para jugar',
    objetivo: 'Junta todas las estrellas de sheriff y derrota al jefe',
    consejo: 'Dispara a las cajas fuertes para conseguir una escopeta',
    ctrlMover: 'Moverte', ctrlDisparar: 'Apuntar y disparar', ctrlRodar: 'Rodar y esquivar',
    record: (n) => `Récord: ${n}`,
    puntosHud: (n) => `Puntos ${n}`,
    nivelHud: (n) => `Nivel ${n}`,
    recargar: 'RECARGANDO',
    nivel: (n, total) => `Nivel ${n}\nEncuentra ${total} estrellas de sheriff`,
    llegoJefe: '¡Todas las estrellas! ¡Llegó el jefe!',
    jefe: 'JEFE', rol: 'RODAR',
    vidaExtra: '¡Vida extra!',
    premioEscopeta: (n) => `¡Escopeta x${n}!`,
    premioCorazon: '+1 corazón',
    nivelSuperado: (n) => `¡Nivel ${n} superado!`,
    resumenNivel: (puntos, vidas, siguiente) => `Puntos: ${puntos}\nVidas: ${vidas}\n\nSiguiente: Nivel ${siguiente}`,
    teDieron: '¡Te dieron!',
    vidaPerdida: (vidas, conJefe, puntos) => `Perdiste una vida. Te ${vidas === 1 ? 'queda 1' : `quedan ${vidas}`}.\n\n${conJefe ? 'El jefe vuelve con la vida completa' : 'Las estrellas que juntaste se mantienen'}\nPuntaje: ${puntos}`,
    seguir: 'Toca o haz clic para seguir',
    finTitulo: 'Fin del juego',
    finDatos: (puntos, nuevo) => `${nuevo ? '¡Nuevo récord!\n' : ''}Puntos: ${puntos}`,
    volverAJugar: 'Toca o haz clic para volver a jugar',
    videoVidas: 'Mira un video: +3 vidas',
    sinVideo: 'No hay videos disponibles ahora',
    deVuelta: '¡De vuelta al juego!',
    deVueltaDatos: (vidas, nivel, puntos) => `Tienes ${vidas} vidas.\nSigues en el nivel ${nivel}\nPuntos: ${puntos}`,
    girar: 'Gira el teléfono para jugar',
  },
};
const IDIOMA_PEDIDO = new URLSearchParams(location.search).get('lang');
const IDIOMA = TEXTOS[IDIOMA_PEDIDO] ? IDIOMA_PEDIDO : (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
const T = TEXTOS[IDIOMA];
document.documentElement.lang = IDIOMA;

// Tipografía del Oeste (Rye, licencia SIL OFL, en fuente/), la misma de la versión 1.
const FUENTE = 'Rye, Georgia, serif';

const CLAVE_RECORD = 'outlaw-alley-2-record';
function leerRecord() {
  try { return Number(localStorage.getItem(CLAVE_RECORD)) || 0; } catch (e) { return 0; }
}
function guardarRecord(puntos) {
  try { localStorage.setItem(CLAVE_RECORD, String(puntos)); } catch (e) { /* sin guardado: no pasa nada */ }
}

const ANCHO = 960;
const ALTO = 540;
// El juego se piensa en 960x540, pero se dibuja al doble (1920x1080) para que en pantalla completa se vea nítido:
// la cámara agranda todo x2 y los textos se rasterizan a doble resolución.
const ZOOM = 2;
const fabricaDeTexto = Phaser.GameObjects.GameObjectFactory.prototype.text;
Phaser.GameObjects.GameObjectFactory.prototype.text = function (x, y, texto, estilo) {
  return fabricaDeTexto.call(this, x, y, texto, { resolution: ZOOM, ...estilo });
};
// En el celular el juego llena el ancho de la pantalla (los teléfonos son más anchos que 16:9): se ve más grande y, a
// cambio, se ve un poco menos de alto (hasta 110 px). Suelto (no dentro de un portal) se mide la pantalla entera,
// porque al primer toque pasa a pantalla completa; dentro del portal, el lugar que el portal le da.
const ES_CELULAR = window.matchMedia('(pointer: coarse)').matches;
const SUELTO = window.top === window.self;
const LADOS_PANTALLA = SUELTO ? [screen.width, screen.height] : [innerWidth, innerHeight];
const ALTO_VISTO = ES_CELULAR
  ? Phaser.Math.Clamp(Math.round(ANCHO * Math.min(...LADOS_PANTALLA) / Math.max(...LADOS_PANTALLA)), ALTO - 110, ALTO)
  : ALTO;
const MUNDO_W = 2880;           // el pueblo: 3 pantallas de ancho por 3 de alto (de 540)
const MUNDO_H = 1620;
const INICIO = { x: 1440, y: 820 };

// Pueblo: [x, y, ancho, alto] desde la esquina de arriba a la izquierda.
// Dos filas de edificios con callejones entre medio, la calle principal en el centro y una calle de atrás arriba y abajo.
const EDIFICIOS = [
  [150, 220, 420, 400], [720, 220, 380, 400], [1280, 220, 360, 400], [1880, 220, 380, 400], [2440, 220, 300, 400],
  [150, 1020, 380, 400], [700, 1020, 420, 400], [1300, 1020, 340, 400], [1880, 1020, 420, 400], [2480, 1020, 260, 400],
];
// Cobertura chica: barriles y cajones (cuadrados) y carretas (alargadas).
const COBERTURA = [
  [500, 760, 50, 50], [980, 900, 60, 40], [1600, 740, 120, 60], [2100, 880, 50, 50], [2600, 760, 60, 60],
  [300, 880, 40, 40], [1340, 880, 40, 40], [800, 700, 120, 60], [2350, 930, 120, 60],
  [400, 100, 50, 50], [1500, 80, 60, 40], [2200, 120, 50, 50], [800, 1500, 60, 40], [1700, 1480, 50, 50], [2600, 1520, 50, 50],
];
// De dónde salen los bandidos: puntas de las calles y de los callejones.
const APARICIONES = [
  [30, 110], [1440, 30], [2850, 110], [30, 1520], [1440, 1590], [2850, 1520], [30, 820], [2850, 820],
  [645, 110], [1190, 1520], [2350, 110], [1760, 1520], [645, 1520], [2350, 1520],
];
// Dónde pueden caer las estrellas: calles de atrás, callejones y puntas de la calle principal.
const LUGARES_ESTRELLA = [
  [300, 110], [900, 130], [1450, 160], [2050, 100], [2700, 130], [640, 420], [1190, 420], [1760, 420], [2350, 420],
  [610, 1220], [1210, 1220], [1760, 1220], [2390, 1220], [300, 1520], [1000, 1510], [1450, 1540], [2100, 1500],
  [2700, 1530], [120, 820], [2760, 820], [1000, 690], [2000, 960], [60, 400], [2820, 1250],
];

const VELOCIDAD_JUGADOR = 250;
const RADIO_JUGADOR = 16;
const CADENCIA_MS = 400;
// Escopeta: sale de la caja fuerte del banco al abrirla de un tiro. 15 disparos de a tres en abanico (como el premio de
// la versión 1) y después vuelve el revólver.
const ESCOPETA_TIROS = 15;
const ABANICO_ESCOPETA = 0.15;
const CADENCIA_ESCOPETA_MS = 480;
const ESCALA_ESCOPETA = 64 / 320;   // la escopeta del piso mide 64 px de largo (el dibujo, 320)
// Cada cinco bandidos volteados, el último deja un corazón donde cayó; hay que ir a buscarlo. Con la energía llena
// queda en el piso para más tarde.
const BAJAS_POR_CORAZON = 5;
const BALAS_TAMBOR = 6;
const RECARGA_MS = 1100;
const VELOCIDAD_BALA = 900;
const ROL_MS = 380;
const ROL_DISTANCIA = 210;
const ROL_ESPERA_MS = 650;
const VIDAS = 3;
const BOTON_VIDEO_Y = 340;    // alto del botón del video con premio, en el cartel de fin del juego
const BOTON_VIDEO_MEDIO = 230; // medio ancho de ese botón
const ESPERA_VIDEO_S = 10;    // segundos que espera el botón antes de volver al inicio
const ENERGIA = 3;
const PUNTOS_VIDA_EXTRA = 5000;
const PUNTOS_BANDIDO = 100;
const PUNTOS_ESTRELLA = 200;
const PUNTOS_JEFE = 500;
const RADIO_BANDIDO = 14;
const VELOCIDAD_BANDIDO = 110;
const ALCANCE_BANDIDO = 340;    // a esta distancia, si te ve, se frena y apunta
const RADIO_JEFE = 26;
const VELOCIDAD_JEFE = 90;
const VIDA_JEFE = 10;
const ABANICO_JEFE = 0.22;
// Celular: dos joysticks, como en la versión 1.
// Joysticks chicos y pegados a las esquinas de abajo, para que los pulgares tapen lo menos posible (como en la versión 1).
const JOY_RADIO = 62;
const JOY_ZONA = JOY_RADIO * 1.6;
const JOY_X = 100;
const JOY_Y = ALTO_VISTO - 90;
const APUNTA_X = ANCHO - 100;
const APUNTA_Y = JOY_Y;
const APUNTA_MUERTA = 0.3;
const AYUDA_PUNTERIA = Phaser.Math.DegToRad(14); // celular: hasta este desvío, el brazo se corrige hacia el enemigo (era 12, +15 %)
const ROL_X = APUNTA_X - 150;   // abajo, a la izquierda del joystick de puntería
const ROL_Y = ALTO_VISTO - 45;
const ROL_RADIO = 38;

const COLOR = {
  tierra: 0xd9a066, calle: 0xc98e55, edificio: 0x7a4a2a, techo: 0x5b351c, cobertura: 0x8f6a3e,
  piso: 0xb88a5a, pared: 0x4a2a14, mueble: 0x6b4423,
  jugador: 0x3b6fd6, bandido: 0xb52a2a, jefe: 0x5a1010, estrella: 0xffd23f, balaMia: 0xfff2a0, balaEnemiga: 0xff8c00,
};

// Edificios por dentro: cuatro paredes con puertas, piso, muebles para cubrirse y un techo que se va al entrar.
// Todo se ve en tres cuartos (de frente y un poco desde arriba): de cada edificio se ve la pared de abajo, así que ahí
// va el frente con su cartel y la puerta principal. Los que no son salón tienen otra puerta en la pared de arriba.
const MURO = 20;     // grosor de las paredes (más que lo que avanza una bala en medio paso, para que no la atraviese)
const PUERTA = 76;   // ancho del hueco de cada puerta
const PARED_ALTO = 60; // por dentro se ve la cara de la pared de arriba: es más gruesa y nadie camina sobre ella
const TIPOS = ['salon', 'banco', 'tienda'];
const CASAS = EDIFICIOS.map(([x, y, w, h], i) => {
  const tipo = TIPOS[i % TIPOS.length];
  const frenteY = y + h - MURO;
  const fondoY = y;
  const puertas = [{ x: Math.round(x + w / 2), y: frenteY }];
  if (tipo !== 'salon') puertas.push({ x: Math.round(x + w * 0.3), y: fondoY }); // el salón tiene la barra contra el fondo
  return { x, y, w, h, tipo, frenteY, fondoY, puertas, interior: new Phaser.Geom.Rectangle(x + MURO, y + MURO + PARED_ALTO, w - 2 * MURO, h - 2 * MURO - PARED_ALTO) };
});

function paredesDe(c) {
  const r = [];
  // Pared horizontal a la altura py, cortada donde caen las puertas.
  const horizontal = (py, alto) => {
    const huecos = c.puertas.filter((p) => p.y === py).map((p) => [p.x - PUERTA / 2, p.x + PUERTA / 2]).sort((a, b) => a[0] - b[0]);
    let x0 = c.x;
    for (const [a, b] of huecos) { r.push([x0, py, a - x0, alto]); x0 = b; }
    r.push([x0, py, c.x + c.w - x0, alto]);
  };
  horizontal(c.y, MURO + PARED_ALTO);
  horizontal(c.y + c.h - MURO, MURO);
  const lado = c.h - 2 * MURO - PARED_ALTO;
  r.push([c.x, c.y + MURO + PARED_ALTO, MURO, lado], [c.x + c.w - MURO, c.y + MURO + PARED_ALTO, MURO, lado]);
  return r;
}

// Muebles distintos según el edificio, para que cada uno se reconozca y tenga dónde cubrirse. Dejan libre el paso
// de las puertas.
function mueblesDe(c) {
  const { x, w } = c;
  const i = c.interior;
  const medioY = Math.round(i.centerY);
  const fondo = i.y + 14;        // contra la pared del fondo
  const frente = i.bottom - 54;  // cerca de la pared del frente
  const cx = Math.round(x + w / 2);
  if (c.tipo === 'salon') {
    // La barra contra el fondo, a la derecha; el piano en el rincón de la izquierda; cuatro mesas.
    const mesa = (fx, fy) => [Math.round(x + w * fx) - 18, fy - 18, 36, 36, 'mueble_mesa'];
    const barraX = Math.round(i.x + i.width * 0.36);
    return [[barraX, fondo, i.right - 24 - barraX, 24, 'mueble_barra'], [i.x + 10, i.y + 4, 58, 26, 'adentro_piano'],
      mesa(0.25, medioY - 20), mesa(0.75, medioY - 20), mesa(0.25, medioY + 70), mesa(0.75, medioY + 70)];
  }
  if (c.tipo === 'banco') {
    // El mostrador cruza el banco con un paso en el medio; la caja fuerte, en un rincón del fondo; el escritorio,
    // adelante a la izquierda, lejos de las dos puertas.
    return [[i.x + 30, medioY - 12, cx - 55 - (i.x + 30), 24, 'mueble_barra'], [cx + 55, medioY - 12, i.right - 30 - (cx + 55), 24, 'mueble_barra'],
      [i.right - 74, fondo, 44, 44, 'mueble_caja'], [i.x + 16, frente, 60, 26, 'adentro_escritorio']];
  }
  // Tienda: dos estanterías, el mostrador cerca de la entrada, bolsas de harina al fondo y un barril de manzanas.
  return [[Math.round(x + w * 0.2) - 45, medioY - 40, 90, 26, 'mueble_estante'], [Math.round(x + w * 0.8) - 45, medioY - 40, 90, 26, 'mueble_estante'],
    [Math.round(x + w * 0.62), frente, 90, 22, 'mueble_barra'], [i.right - 70, fondo, 56, 28, 'adentro_bolsas'], [i.x + 14, frente, 36, 30, 'adentro_manzanas']];
}

// Adornos de adentro que no frenan a nadie: [x, base, dibujo, ancho, en el piso]. Las alfombras van en el piso, debajo
// de todo; banquetas, sillas, perchero y salivadera se ordenan con los personajes.
function adornosDe(c) {
  const i = c.interior;
  const cx = Math.round(c.x + c.w / 2);
  const medioY = Math.round(i.centerY);
  const fondo = i.y + 14;
  const frente = i.bottom - 54;
  if (c.tipo === 'salon') {
    const barraX = Math.round(i.x + i.width * 0.36);
    const largo = i.right - 24 - barraX;
    return [[cx, medioY + 50, 'adentro_alfombra_redonda', 110, true],
      [barraX + largo * 0.25, fondo + 54, 'adentro_taburete', 20], [barraX + largo * 0.65, fondo + 54, 'adentro_taburete', 20],
      [i.right - 12, fondo + 56, 'adentro_escupidera', 16], [i.x + 14, i.bottom - 2, 'adentro_perchero', 22]];
  }
  if (c.tipo === 'banco') {
    return [[cx, i.bottom - 2, 'adentro_alfombra', 92, true], [i.x + 46, frente - 2, 'adentro_silla', 22], [i.right - 14, i.bottom - 2, 'adentro_perchero', 22]];
  }
  return [[cx, i.bottom - 2, 'adentro_alfombra', 92, true], [Math.round(c.x + c.w * 0.62) + 100, frente + 18, 'adentro_silla', 22]];
}

const PAREDES = CASAS.flatMap(paredesDe);
const MUEBLES = CASAS.flatMap(mueblesDe);
const todosLosMuros = PAREDES.concat(MUEBLES, COBERTURA).map(([x, y, w, h]) => new Phaser.Geom.Rectangle(x, y, w, h));

// Adornos de la calle que no frenan a nadie: [x, base, dibujo, ancho]. En las veredas, faroles y bancos; en la calle,
// palenques y bebederos (lejos de puertas y de la cobertura); en las orillas del pueblo, cactus, fardos, el pozo y un
// cartel indicador.
function adornosDeLaCalle() {
  const r = [];
  const lejosDePuertas = (x, y) => !CASAS.some((c) => c.puertas.some((p) => Math.abs(p.x - x) < 70 && Math.abs(p.y - y) < 120));
  CASAS.forEach((c, i) => {
    const pie = c.y + c.h;
    r.push([c.x + 12, pie + 24, 'adorno_farol', 20]);
    r.push([Math.round(c.x + c.w * 0.22), pie + 16, 'adorno_banco', 56]);
    const x = Math.round(c.x + c.w * 0.8);
    if (lejosDePuertas(x, pie + 62) && !dentroDeMuro(x, pie + 62, 40)) r.push([x, pie + 62, i % 2 ? 'adorno_bebedero' : 'adorno_palenque', 58]);
  });
  r.push([40, 190, 'adorno_saguaro', 46], [2852, 640, 'adorno_saguaro', 46], [1190, 196, 'adorno_saguaro', 40], [2390, 1612, 'adorno_saguaro', 44],
    [610, 186, 'adorno_cactus', 30], [2010, 64, 'adorno_cactus', 28], [310, 1612, 'adorno_cactus', 30], [1770, 1608, 'adorno_cactus', 26],
    [70, 1004, 'adorno_fardo', 50], [2826, 1004, 'adorno_fardo', 50], [1530, 176, 'adorno_pozo', 52], [1210, 1004, 'adorno_cartel', 40]);
  return r.filter(([x, y]) => !dentroDeMuro(x, y, 6));
}

// En qué edificio cae un punto (contando las paredes), o -1.
function edificioDe(x, y) {
  return CASAS.findIndex((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h);
}
// En qué edificio está adentro un punto (ya pasó la puerta), o -1.
function adentroDe(x, y) {
  return CASAS.findIndex((c) => c.interior.contains(x, y));
}

function lineaLibre(x1, y1, x2, y2) {
  const linea = new Phaser.Geom.Line(x1, y1, x2, y2);
  return !todosLosMuros.some((r) => Phaser.Geom.Intersects.LineToRectangle(linea, r));
}
function dentroDeMuro(x, y, margen = 0) {
  return todosLosMuros.some((r) => x > r.x - margen && x < r.right + margen && y > r.y - margen && y < r.bottom + margen);
}

// ---------- Personajes en diagonal (arte de la versión 1) ----------
// Cada personaje es un contenedor con su dibujo, centrado sobre el círculo de choque (que ya no se ve). Por dentro
// usa las medidas de la versión 1 (el vaquero mide 130 y apoya los pies 40 debajo del centro; el bandido mide 87 con
// los pies 55 debajo); el contenedor se escala al tamaño de este juego.
const ALTO_VAQUERO = 72;          // alto en pantalla del vaquero
const ALTO_MALO = 62;             // del bandido
const ALTO_JEFE = 84;             // del jefe
const ESCALA_VAQUERO = ALTO_VAQUERO / 130;
const CENTRO_VAQUERO = 40 - 130 / 2;   // centro del dibujo respecto del origen del contenedor (medidas de la versión 1)
// Brazo (brazo.png, 459 x 120): el hombro en el borde izquierdo al 55% del alto; la boca del caño, en el borde derecho,
// 54 px por encima del hombro.
const HOMBRO_X = 13;
const HOMBRO_Y = -59;
const LARGO_BRAZO = 58;
const BRAZO_HOMBRO_Y = 0.55;
const BOCA_CANO_Y = -LARGO_BRAZO * 54 / 459;
const HOMBRO_PERFIL_X = 14;
const HOMBRO_PERFIL_Y = -60;
// Piernas de la carrera de perfil, animadas por código debajo del guardapolvo.
const CADERA_X = 13;
const CADERA_Y = -19;
const MUSLO = 25;
const CANILLA = 25;
const TOBILLO_PISO = CADERA_Y + MUSLO + CANILLA;
const AMPLITUD_MUSLO = 0.6;
const PASO = 2 * (MUSLO + CANILLA) * Math.sin(AMPLITUD_MUSLO);
const PIERNA_VAQUERO = { x: CADERA_X, y: CADERA_Y, muslo: MUSLO, canilla: CANILLA, amplitud: AMPLITUD_MUSLO, dobla: 1.3, grosor: 11 };
const PIERNA_QUIETO = { ...PIERNA_VAQUERO, amplitud: 0.22, dobla: 0.2 }; // parado de perfil: piernas apenas abiertas
const ALTO_BOLITA = 80;
const ALTO_BANDIDO = 87;
const PIES_BANDIDO = 55;
const CENTRO_BANDIDO = PIES_BANDIDO - ALTO_BANDIDO / 2;
const conPaso = (q) => ({ ...q, tobillo: q.y + q.muslo + q.canilla, paso: 2 * (q.muslo + q.canilla) * Math.sin(q.amplitud) });
const PIERNA_BANDIDO = conPaso({ x: -3, y: 25, muslo: 10, canilla: 10, amplitud: 0.6, dobla: 0.8, grosor: 7 });
const PIERNA_JEFE = conPaso({ x: -9, y: 27, muslo: 10.5, canilla: 10.5, amplitud: 0.8, dobla: 0.7, grosor: 9 });
// Mientras no esté el dibujo de espaldas, se usa el de frente (provisorio).
const ARTE_BANDIDO = { frente: 'bandido_frente', espalda: 'bandido_espalda', torso: 'bandido_torso', bota: 'bandido_bota', herido: 'bandido_herido', pierna: PIERNA_BANDIDO };
const ARTE_JEFE = { frente: 'jefe_frente', espalda: 'jefe_espalda', torso: 'jefe_torso', bota: 'jefe_bota', herido: 'jefe_herido', pierna: PIERNA_JEFE };
// De frente y de espaldas el dibujo trae las piernas: se corta a esta altura (fracción del alto, desde arriba), debajo
// del guardapolvo o del chaleco, y cada pierna se levanta por turno.
const CORTE_PIERNAS = { jugador_espalda: 0.8, vaquero_frente: 0.8, bandido_frente: 0.7, bandido_espalda: 0.7, jefe_frente: 0.8, jefe_espalda: 0.8 };
const IMAGENES = ['jugador_espalda', 'vaquero_frente', 'correr_cuerpo', 'bota', 'rol_bolita', 'brazo',
  'bandido_frente', 'bandido_espalda', 'bandido_torso', 'bandido_bota', 'bandido_herido',
  'jefe_frente', 'jefe_espalda', 'jefe_torso', 'jefe_bota', 'jefe_herido',
  'tierra', 'piso', 'techo_salon', 'techo_banco', 'techo_tienda',
  'mueble_mesa', 'mueble_barra', 'mueble_caja', 'mueble_estante', 'mueble_barril', 'mueble_cajon', 'mueble_carreta', 'escopeta',
  'frente_salon', 'frente_banco', 'frente_tienda', 'pared_salon', 'pared_banco', 'pared_tienda', 'calle',
  'adorno_saguaro', 'adorno_palenque', 'adorno_cactus', 'adorno_bebedero', 'adorno_farol', 'adorno_cartel', 'adorno_rodante',
  'adorno_banco', 'adorno_fardo', 'adorno_pozo',
  'adentro_piano', 'adentro_taburete', 'adentro_alfombra_redonda', 'adentro_alfombra', 'adentro_escritorio', 'adentro_silla',
  'adentro_bolsas', 'adentro_manzanas', 'adentro_perchero', 'adentro_escupidera'];

// Muslo que va y viene; la rodilla se dobla mientras la pierna vuelve hacia adelante y casi no en el apoyo.
function calcularPierna(fase, q) {
  const muslo = q.amplitud * Math.sin(fase);
  const rodilla = 0.15 + q.dobla * Math.max(0, Math.cos(fase));
  const canilla = muslo - rodilla;
  const r = { x: q.x + q.muslo * Math.sin(muslo), y: q.y + q.muslo * Math.cos(muslo) };
  return { rodilla: r, tobillo: { x: r.x + q.canilla * Math.sin(canilla), y: r.y + q.canilla * Math.cos(canilla) }, canilla };
}

// Con contorno negro abajo, para que la pierna combine con los dibujos de borde negro.
function dibujarPierna(g, bota, pierna, color, q, y) {
  g.clear();
  for (const [c, extra] of [[0x111111, 2], [color, 0]]) {
    g.lineStyle(q.grosor + extra, c, 1);
    g.lineBetween(q.x, q.y + y, pierna.rodilla.x, pierna.rodilla.y + y);
    g.lineStyle(q.grosor - 1 + extra, c, 1);
    g.lineBetween(pierna.rodilla.x, pierna.rodilla.y + y, pierna.tobillo.x, pierna.tobillo.y + y);
    g.fillStyle(c, 1);
    g.fillCircle(pierna.rodilla.x, pierna.rodilla.y + y, (q.grosor - 1 + extra) / 2);
  }
  bota.setPosition(pierna.tobillo.x, pierna.tobillo.y + y - 1).setRotation(-pierna.canilla * 0.6);
}

// Hacia dónde se ve a alguien según un ángulo: de costado, de frente (hacia abajo de la pantalla) o de espaldas.
// Con un margen, para que cerca del límite no cambie a cada rato.
function vistaSegun(angulo, antes) {
  const c = Math.abs(Math.cos(angulo));
  if (antes === 'costado' ? c > 0.6 : c > 0.8) return 'costado';
  return Math.sin(angulo) > 0 ? 'frente' : 'espalda';
}

// Qué tan adelante se dibuja un personaje: el que está más abajo tapa al de más arriba. Adentro de un edificio queda
// debajo de los techos (si el techo está puesto, no se lo ve); afuera, por encima, salvo que esté justo detrás de un
// edificio (los pies le quedan tapados por el techo).
function profundidad(x, y, alto) {
  if (adentroDe(x, y) >= 0) return 5 + y / 10000;
  const casa = edificioDe(x, y);
  if (casa >= 0 && y < CASAS[casa].y + MURO + PARED_ALTO + 4) return 8 + y / 10000; // cruzando la pared del fondo
  const pies = y + alto / 2;
  const detras = CASAS.some((c) => x > c.x - 10 && x < c.x + c.w + 10 && pies > c.y && y < c.y);
  return (detras ? 8 : 9.2) + y / 10000;
}

// ---------- Avisos ----------

// Avisos de CrazyGames entre partes del juego: al pasar de nivel, al perder una vida y al terminar. El aviso lo pone
// CrazyGames con su SDK y decide cuándo hay uno (como mucho uno cada 3 minutos). En el Basic Launch contesta que están
// apagados; fuera de CrazyGames, o con un bloqueador, el SDK no está. En todos esos casos el juego sigue de largo.
const SDK_CRAZY = { listo: false, sinAvisos: false, iniciando: false, fila: [], jugando: false, cargaHecha: false, mudo: false };
// En el Basic Launch CrazyGames contesta que los avisos están apagados: desde ahí no se ofrece el video con premio,
// que no tendría nada para mostrar. Casi siempre se sabe antes del final, porque cada vida perdida ya pidió un aviso.
const anotarError = (e) => { if (e && e.code === 'adsDisabledBasicLaunch') SDK_CRAZY.sinAvisos = true; };
(async () => {
  try {
    const sdk = window.CrazyGames && window.CrazyGames.SDK;
    if (!sdk) return;
    SDK_CRAZY.iniciando = true;
    await sdk.init();
    // Solo en CrazyGames. En la PC de prueba (localhost) el SDK pone un cartel de "acá iría un aviso" que traba unos
    // segundos al pasar de nivel o morir: ahí no se piden avisos.
    SDK_CRAZY.listo = sdk.environment === 'crazygames';
    if (SDK_CRAZY.listo) {
      for (const evento of SDK_CRAZY.fila) mandarSdk(evento);
      // Si el jugador silencia el juego desde la página de CrazyGames, se respeta (también si lo cambia en medio).
      const revisarMudo = () => {
        SDK_CRAZY.mudo = !!(sdk.game.settings && sdk.game.settings.muteAudio);
        if (window.juego instanceof Phaser.Game) window.juego.sound.mute = SDK_CRAZY.mudo;
      };
      revisarMudo();
      sdk.game.addSettingsChangeListener(revisarMudo);
    }
  } catch (e) { /* sin SDK el juego anda igual */ }
  SDK_CRAZY.iniciando = false;
  SDK_CRAZY.fila = [];
})();

// Eventos del juego para CrazyGames: cuándo carga, cuándo hay partida en curso y cuándo se corta (lo piden ya en el
// Basic Launch si el SDK está integrado; con eso miden la carga y el tiempo de juego), y un festejo al voltear al jefe.
// Si el SDK todavía se está iniciando, quedan en fila y salen apenas esté; fuera de CrazyGames no hacen nada.
function mandarSdk(evento) {
  if (SDK_CRAZY.listo) {
    try { window.CrazyGames.SDK.game[evento](); } catch (e) { /* nada */ }
  } else if (SDK_CRAZY.iniciando) SDK_CRAZY.fila.push(evento);
}
function avisarSdk(evento) {
  if (evento === 'gameplayStart' || evento === 'gameplayStop') {
    const jugando = evento === 'gameplayStart';
    if (SDK_CRAZY.jugando === jugando) return; // sin repetir el mismo aviso dos veces seguidas
    SDK_CRAZY.jugando = jugando;
  }
  if (evento === 'loadingStart' && SDK_CRAZY.cargaHecha) return; // la carga se avisa una sola vez
  if (evento === 'loadingStop') {
    if (SDK_CRAZY.cargaHecha) return;
    SDK_CRAZY.cargaHecha = true;
  }
  mandarSdk(evento);
}

function publicidadEntrePartes(escena, alTerminar) {
  const sdk = SDK_CRAZY.listo ? window.CrazyGames.SDK : null;
  if (!sdk) { alTerminar(); return; }
  const mudoAntes = escena.sound.mute;
  let empezo = false, termino = false;
  const fin = () => {
    if (termino) return;
    termino = true;
    escena.sound.mute = mudoAntes;
    alTerminar();
  };
  // Si el SDK no contesta, el juego no se queda trabado esperando.
  setTimeout(() => { if (!empezo) fin(); }, 5000);
  try {
    sdk.ad.requestAd('midgame', {
      adStarted: () => { if (termino) return; empezo = true; escena.sound.mute = true; }, // sin sonido mientras se ve el aviso
      adFinished: fin,
      adError: (e) => { anotarError(e); fin(); },
    });
  } catch (e) { fin(); }
}

// Video con premio: lo pide el jugador, y el premio se da solo si lo vio entero (alPremio). Si no hay video, alFallar.
const VIDAS_POR_VIDEO = 3;
function videoConPremio(escena, alPremio, alFallar) {
  const sdk = SDK_CRAZY.listo ? window.CrazyGames.SDK : null;
  if (!sdk) { alFallar(); return; }
  const mudoAntes = escena.sound.mute;
  let empezo = false, termino = false;
  const fin = (premio) => {
    if (termino) return;
    termino = true;
    escena.sound.mute = mudoAntes;
    (premio ? alPremio : alFallar)();
  };
  setTimeout(() => { if (!empezo) fin(false); }, 8000); // si el SDK no contesta, no se queda trabado
  try {
    sdk.ad.requestAd('rewarded', {
      adStarted: () => { if (termino) return; empezo = true; escena.sound.mute = true; },
      adFinished: () => fin(true),
      adError: (e) => { anotarError(e); fin(false); },
    });
  } catch (e) { fin(false); }
}

// ---------- Sonido ----------

// Sonidos cortos generados en el momento, estilo arcade (los mismos de la versión 1). Pasan por el volumen general de
// Phaser, así que un silencio general también los calla. Sin Web Audio, o antes del primer toque, no suenan.
function sintetizar(escena, tipo) {
  const sm = escena.sound;
  const ctx = sm.context;
  if (!ctx || !sm.masterMuteNode || ctx.state !== 'running') return;
  const t0 = ctx.currentTime;
  const salida = sm.masterMuteNode;
  const tono = (frec, desde, dura, { forma = 'square', vol = 0.15, hasta = frec } = {}) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = forma;
    o.frequency.setValueAtTime(frec, t0 + desde);
    if (hasta !== frec) o.frequency.exponentialRampToValueAtTime(hasta, t0 + desde + dura);
    g.gain.setValueAtTime(vol, t0 + desde);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + desde + dura);
    o.connect(g).connect(salida);
    o.start(t0 + desde);
    o.stop(t0 + desde + dura + 0.02);
  };
  const ruido = (desde, dura, vol, corte) => {
    const n = Math.floor(ctx.sampleRate * dura);
    const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const fuente = ctx.createBufferSource();
    fuente.buffer = buffer;
    const filtro = ctx.createBiquadFilter();
    filtro.type = 'lowpass';
    filtro.frequency.value = corte;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, t0 + desde);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + desde + dura);
    fuente.connect(filtro).connect(g).connect(salida);
    fuente.start(t0 + desde);
  };
  const notas = (lista, separacion, dura, opciones) => lista.forEach((f, i) => tono(f, i * separacion, dura, opciones));
  switch (tipo) {
    case 'jefe':         // le pegás al jefe sin voltearlo: golpe grave
      ruido(0, 0.16, 0.6, 900);
      tono(110, 0, 0.22, { forma: 'sine', vol: 0.6, hasta: 40 });
      break;
    case 'teDieron':
      ruido(0, 0.1, 0.4, 600);
      tono(220, 0, 0.25, { forma: 'sawtooth', vol: 0.15, hasta: 90 });
      break;
    case 'vidaExtra':
      notas([523.25, 659.25, 783.99, 1046.5], 0.08, 0.12, { vol: 0.1 });
      break;
    case 'nivel':
      notas([392, 523.25, 659.25, 783.99], 0.11, 0.16, { vol: 0.1 });
      tono(1046.5, 0.44, 0.5, { forma: 'triangle', vol: 0.25 });
      break;
    case 'vidaPerdida':
      notas([392, 349.23, 311.13, 261.63], 0.16, 0.2, { forma: 'triangle', vol: 0.3 });
      break;
    case 'finJuego':
      notas([392, 349.23, 311.13], 0.22, 0.26, { forma: 'triangle', vol: 0.3 });
      tono(196, 0.66, 0.9, { forma: 'triangle', vol: 0.3 });
      break;
    case 'clic':
      tono(1800, 0, 0.03, { vol: 0.08 });
      break;
    case 'premio':       // agarrás la escopeta o un corazón: dos notas que suben
      notas([783.99, 1174.66], 0.07, 0.12, { forma: 'triangle', vol: 0.3 });
      break;
    case 'estrella':     // juntás una estrella de sheriff: tres notas brillantes
      notas([1046.5, 1318.51, 1567.98], 0.06, 0.1, { forma: 'triangle', vol: 0.28 });
      break;
    case 'caja':         // se abre la caja fuerte: golpe metálico y la puerta que chirría
      ruido(0, 0.12, 0.5, 2500);
      tono(180, 0, 0.3, { forma: 'square', vol: 0.12, hasta: 120 });
      tono(900, 0.12, 0.25, { forma: 'sawtooth', vol: 0.05, hasta: 1400 });
      break;
  }
}

// ---------- Tablas de madera, corazones y controles dibujados (como en la versión 1) ----------

// Tabla de madera: fondo marrón con vetas, borde oscuro y dos clavos.
function dibujarTabla(g, x, y, w, h) {
  g.fillStyle(0x000000, 0.35).fillRoundedRect(x + 3, y + 4, w, h, 8);
  g.fillStyle(0x8a5a2e, 1).fillRoundedRect(x, y, w, h, 8);
  g.lineStyle(2, 0x6d4422, 0.8);
  for (let vy = y + 10; vy < y + h - 4; vy += 11) g.lineBetween(x + 10, vy, x + w - 10, vy + 2);
  g.lineStyle(3, 0x3b2010, 1).strokeRoundedRect(x, y, w, h, 8);
  g.fillStyle(0x2b2b2b, 1).fillCircle(x + 8, y + h / 2, 3).fillCircle(x + w - 8, y + h / 2, 3);
}

function dibujarCorazon(g, x, y, r, lleno) {
  g.fillStyle(lleno ? 0xe0302e : 0x4a2a1a, 1).lineStyle(2, 0x2b0a08, 1);
  const puntos = [];
  for (let i = 0; i <= 24; i++) {
    const t = (i / 24) * Math.PI * 2;
    puntos.push(new Phaser.Math.Vector2(
      x + r * 0.065 * 16 * Math.pow(Math.sin(t), 3),
      y - r * 0.065 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
    ));
  }
  g.fillPoints(puntos, true).strokePoints(puntos, true);
}

function dibujarEstrella(g, x, y, r) {
  const puntos = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 5;
    const d = i % 2 ? r * 0.45 : r;
    puntos.push(new Phaser.Math.Vector2(x + Math.cos(a) * d, y + Math.sin(a) * d));
  }
  g.fillStyle(0xffd23f, 1).lineStyle(2, 0x8a5a00, 1).fillPoints(puntos, true).strokePoints(puntos, true);
}

// Los controles, dibujados en la portada (durante la partida no se tapa nada). Una columna por control: arriba el
// dibujo, abajo una palabra. En la PC, teclas y mouse; en el celular, las palancas y el botón de rodar.
function cartelControles(escena, x, y, tactil) {
  const COL = 220, alto = 124;
  const nombres = ['mover', 'disparar', 'rodar'];
  const w = COL * nombres.length + 24;
  const g = escena.add.graphics();
  const partes = [g];
  dibujarTabla(g, -w / 2, -alto / 2, w, alto);
  nombres.forEach((nombre, i) => {
    const cx = -w / 2 + 12 + COL * (i + 0.5), cy = -18;
    if (tactil) {
      if (nombre === 'mover') dibujarPalanca(g, cx, cy, 0xffffff);
      else if (nombre === 'disparar') dibujarPalanca(g, cx, cy, 0xff4444);
      else {
        g.fillStyle(0x44aaff, 0.6).fillCircle(cx, cy, 26).lineStyle(3, 0x2b160a, 1).strokeCircle(cx, cy, 26);
        partes.push(escena.add.text(cx, cy, T.rol, { fontFamily: FUENTE, fontSize: '13px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }).setOrigin(0.5));
      }
    } else if (nombre === 'mover') {
      // W A S D y las flechas, cada grupo en forma de cruz.
      for (const [gx, letras] of [[cx - 52, ['W', 'A', 'S', 'D']], [cx + 52, ['^', '<', 'v', '>']]]) {
        dibujarTecla(escena, g, partes, gx, cy - 16, letras[0]);
        dibujarTecla(escena, g, partes, gx - 32, cy + 16, letras[1]);
        dibujarTecla(escena, g, partes, gx, cy + 16, letras[2]);
        dibujarTecla(escena, g, partes, gx + 32, cy + 16, letras[3]);
      }
    } else if (nombre === 'disparar') {
      dibujarRaton(g, cx - 20, cy, 'izq');
      g.lineStyle(3, 0xd62828, 1).strokeCircle(cx + 26, cy, 11);
      g.lineBetween(cx + 10, cy, cx + 42, cy).lineBetween(cx + 26, cy - 16, cx + 26, cy + 16);
    } else {
      dibujarRaton(g, cx, cy, 'der');
    }
    const texto = { mover: T.ctrlMover, disparar: T.ctrlDisparar, rodar: T.ctrlRodar }[nombre];
    partes.push(escena.add.text(cx, 40, texto, { fontFamily: FUENTE, fontSize: '19px', color: '#ffe9b0', stroke: '#2b160a', strokeThickness: 4 }).setOrigin(0.5));
  });
  return escena.add.container(x, y, partes);
}

// Una tecla clara con su letra; las flechas (<, >, ^, v) van dibujadas porque la tipografía del Oeste no las trae.
function dibujarTecla(escena, g, partes, x, y, letra) {
  g.fillStyle(0x2b160a, 1).fillRoundedRect(x - 15, y - 13, 30, 30, 6);
  g.fillStyle(0xffe9b0, 1).fillRoundedRect(x - 15, y - 15, 30, 28, 6);
  g.lineStyle(2, 0x2b160a, 1).strokeRoundedRect(x - 15, y - 15, 30, 28, 6);
  const flecha = { '<': [-1, 0], '>': [1, 0], '^': [0, -1], v: [0, 1] }[letra];
  if (flecha) {
    const [dx, dy] = flecha, px = -dy, py = dx, cy = y - 1;
    g.fillStyle(0x2b160a, 1).fillTriangle(x + 7 * dx, cy + 7 * dy, x - 5 * dx + 7 * px, cy - 5 * dy + 7 * py, x - 5 * dx - 7 * px, cy - 5 * dy - 7 * py);
  } else {
    partes.push(escena.add.text(x, y - 1, letra, { fontFamily: FUENTE, fontSize: '17px', color: '#2b160a' }).setOrigin(0.5));
  }
}

// Un mouse con el botón que se usa pintado: rojo el izquierdo (disparar), azul el derecho (rodar).
function dibujarRaton(g, x, y, boton) {
  g.fillStyle(0xffe9b0, 1).fillRoundedRect(x - 14, y - 21, 28, 42, 13);
  if (boton === 'izq') g.fillStyle(0xd62828, 1).fillRoundedRect(x - 14, y - 21, 14, 17, { tl: 13, tr: 0, bl: 0, br: 0 });
  else g.fillStyle(0x44aaff, 1).fillRoundedRect(x, y - 21, 14, 17, { tl: 0, tr: 13, bl: 0, br: 0 });
  g.lineStyle(2, 0x2b160a, 1).strokeRoundedRect(x - 14, y - 21, 28, 42, 13);
  g.lineBetween(x, y - 21, x, y - 4).lineBetween(x - 14, y - 4, x + 14, y - 4);
}

function dibujarPalanca(g, x, y, color) {
  g.fillStyle(color, 0.45).fillCircle(x, y, 23).lineStyle(3, 0x2b160a, 1).strokeCircle(x, y, 23);
  g.fillStyle(color, 1).fillCircle(x + 7, y - 5, 10).lineStyle(2, 0x2b160a, 1).strokeCircle(x + 7, y - 5, 10);
}

class Portada extends Phaser.Scene {
  constructor() { super('portada'); }

  preload() {
    avisarSdk('loadingStart');
    // Los dibujos que todavía no llegaron se reemplazan solos por uno provisorio (ver texturaO). Si una imagen falla
    // (una conexión mala en el celular), se vuelve a pedir hasta dos veces.
    const intentos = {};
    this.load.on('loaderror', (archivo) => {
      const n = (intentos[archivo.key] || 0) + 1;
      if (archivo.type !== 'image' || n > 2) return;
      intentos[archivo.key] = n;
      this.load.image(archivo.key, archivo.url);
    });
    for (const clave of IMAGENES) this.load.image(clave, `arte/${clave}.png`);
    this.load.image('portada_fondo', 'arte/portada_fondo.jpg');
    // Los mismos sonidos de la versión 1 (CC0: revólver, escopeta y recarga de Freesound; música "Spaghetti Western"
    // de Spring Spring, OpenGameArt). La música va en ogg y mp3: se baja la que el navegador puede reproducir.
    this.load.audio('revolver', 'sonido/revolver.wav');
    this.load.audio('escopeta', 'sonido/escopeta.wav');
    this.load.audio('recarga', 'sonido/recarga.wav');
    this.load.audio('malo_muerto', 'sonido/malo_muerto.wav');
    this.load.audio('jefe_muerto', 'sonido/jefe_muerto.wav');
    this.load.audio('musica', ['sonido/musica.ogg', 'sonido/musica.mp3']);
  }

  create() {
    avisarSdk('loadingStop');
    if (SDK_CRAZY.mudo) this.sound.mute = true;
    // La ilustración del vaquero de la versión 1, con el título encima, el objetivo y los controles dibujados.
    this.cameras.main.setOrigin(0, 0).setZoom(ZOOM);
    // En el celular se recorta abajo (las piernas del vaquero), no arriba, para no cortar el título.
    this.add.image(ANCHO / 2, ALTO / 2, 'portada_fondo').setDisplaySize(ANCHO, ALTO);
    const estilo = { fontFamily: FUENTE, color: '#ffd23f', stroke: '#3b1d0a', strokeThickness: 8, align: 'center' };
    this.add.text(ANCHO / 2, 66, T.titulo, { ...estilo, fontSize: '68px', color: '#ffb732', strokeThickness: 11, shadow: { offsetX: 4, offsetY: 5, color: '#1a0802', blur: 6, fill: true, stroke: true } }).setOrigin(0.5);
    const record = leerRecord();
    if (record > 0) this.add.text(ANCHO / 2, 128, T.record(record), { ...estilo, fontSize: '26px', color: '#ffffff', strokeThickness: 6 }).setOrigin(0.5);
    const tactil = this.registry.get('tactil') || window.matchMedia('(pointer: coarse)').matches;
    this.add.text(ANCHO / 2, ALTO_VISTO - 232, T.objetivo, { ...estilo, fontSize: '22px', color: '#ffe9b0', strokeThickness: 6 }).setOrigin(0.5);
    this.add.text(ANCHO / 2, ALTO_VISTO - 202, T.consejo, { ...estilo, fontSize: '19px', color: '#ffffff', strokeThickness: 5 }).setOrigin(0.5);
    cartelControles(this, ANCHO / 2, ALTO_VISTO - 112, tactil);
    const empezar = this.add.text(ANCHO / 2, ALTO_VISTO - 26, T.tocaParaJugar, { ...estilo, fontSize: '26px', color: '#ffffff', strokeThickness: 6 }).setOrigin(0.5);
    this.tweens.add({ targets: empezar, alpha: 0.25, duration: 650, yoyo: true, repeat: -1 });
    this.add.text(ANCHO - 12, ALTO_VISTO - 8, 'by Varka', { fontFamily: FUENTE, fontSize: '15px', color: '#ffffff', stroke: '#000000', strokeThickness: 3 }).setOrigin(1, 1).setAlpha(0.8);
    this.game.canvas.style.cursor = 'default';
    const jugar = () => {
      sintetizar(this, 'clic');
      this.scene.start('juego');
    };
    this.input.once('pointerdown', (p) => {
      if (p.wasTouch) this.registry.set('tactil', true);
      jugar();
    });
    this.input.keyboard.once('keydown-SPACE', jugar);
    this.input.keyboard.once('keydown-ENTER', jugar);
  }
}

class Juego extends Phaser.Scene {
  constructor() { super('juego'); }

  create() {
    avisarSdk('gameplayStart');
    this.vidas = VIDAS;
    this.usoVideoVidas = false; // el video con premio se ofrece una vez por partida
    this.energia = ENERGIA;
    this.puntos = 0;
    this.nivel = 1;
    this.recordAlEmpezar = leerRecord();
    this.municion = BALAS_TAMBOR;
    this.recargandoHasta = 0;
    this.ultimoDisparo = 0;
    this.invulnerableHasta = 0;
    this.rodandoHasta = 0;
    this.rolListo = 0;
    this.rolDir = { x: 1, y: 0 };
    this.ultimaDir = { x: 0, y: -1 };
    this.angulo = -Math.PI / 2;
    this.enemigos = [];
    this.balas = [];
    this.misBalas = [];
    this.estrellas = [];
    this.premios = [];      // escopetas tiradas en el piso, para agarrar
    this.escopeta = 0;      // tiros de escopeta que quedan (0 = revólver)
    this.jefe = null;
    this.etapaJefe = null;   // null, 'pelea' o 'derrotado'
    this.terminado = false;
    this.enPausa = false;
    this.usaTactil = false;
    this.pedirRol = false;

    this.esperarSoltar = true; // el clic que empezó la partida no dispara
    if (!this.sound.get('musica') && this.cache.audio.exists('musica')) this.sound.add('musica', { loop: true, volume: 0.35 }).play();
    this.bajas = 0;          // bandidos volteados en la partida (cada BAJAS_POR_CORAZON, un corazón)
    this.physics.world.setBounds(0, 0, MUNDO_W, MUNDO_H);
    this.armarPueblo();
    this.armarJugador();
    this.armarHud();
    this.armarControles();
    if (this.registry.get('tactil')) this.activarTactil();

    this.cameras.main.setZoom(ZOOM).setBounds(0, 0, MUNDO_W, MUNDO_H);
    this.cameras.main.startFollow(this.jugador, true, 0.12, 0.12);
    this.juntarPantalla();
    this.empezarNivel();
  }

  armarPueblo() {
    // Tierra en todo el pueblo; las calles, apenas más claras.
    this.add.tileSprite(0, 0, MUNDO_W, MUNDO_H, 'tierra').setOrigin(0).setTileScale(0.8).setDepth(0);
    // La calle principal, de tierra apisonada con huellas de carretas; las de atrás, apenas más claras.
    this.add.tileSprite(0, 648, MUNDO_W, 364, 'calle').setOrigin(0).setTileScale(0.9).setAlpha(0.5).setDepth(0.05);
    const g = this.add.graphics().setDepth(0.1);
    g.fillStyle(0xfff1d6, 0.08).fillRect(0, 0, MUNDO_W, 200).fillRect(0, 1440, MUNDO_W, 180);
    this.muros = this.physics.add.staticGroup();
    // Umbrales: barreras invisibles en las puertas que frenan solo a los bandidos (cada uno se queda de su lado);
    // el vaquero y las balas pasan.
    this.umbrales = this.physics.add.staticGroup();
    this.techos = [];
    this.marcas = [];
    this.cajas = [];
    for (const c of CASAS) {
      this.add.tileSprite(c.x, c.y, c.w, c.h, 'piso').setOrigin(0).setTileScale(0.5).setTint(0xc8a07a).setDepth(1);
      for (const [x, y, w, h] of paredesDe(c)) this.muros.add(this.add.rectangle(x + w / 2, y + h / 2, w, h, COLOR.pared).setStrokeStyle(2, 0x1e0f06).setDepth(3));
      this.paredDeAdentro(c);
      for (const [x, y, w, h, clave] of mueblesDe(c)) {
        this.muros.add(this.add.rectangle(x + w / 2, y + h / 2, w, h).setVisible(false));
        const img = this.dibujarMueble(x, y, w, h, clave, false);
        if (clave === 'mueble_caja') this.cajas.push({ rect: new Phaser.Geom.Rectangle(x, y, w, h), img, casa: CASAS.indexOf(c), abierta: false, extras: [] });
      }
      for (const [x, y, clave, ancho, enPiso] of adornosDe(c)) this.ponerAdorno(x, y, clave, ancho, enPiso ? 1.2 : 5 + y / 10000);
      for (const p of c.puertas) {
        this.umbrales.add(this.add.rectangle(p.x, p.y + MURO / 2, PUERTA, MURO).setVisible(false));
        if (p.y === c.frenteY) continue; // la del frente ya viene dibujada en el frente del edificio
        // La de atrás: desde la calle de atrás se ve como un hueco en el borde del techo, con su escalón de madera;
        // por dentro corta la pared del fondo.
        this.add.rectangle(p.x, c.y - 9, PUERTA + 18, 18, 0xa0703f).setStrokeStyle(2, 0x3b2010).setDepth(2);
        this.add.rectangle(p.x, p.y + MURO / 2, PUERTA, MURO + 4, COLOR.piso).setStrokeStyle(3, 0x2b160a).setDepth(9.1);
        this.add.rectangle(p.x, c.y + MURO + PARED_ALTO / 2, PUERTA, PARED_ALTO, 0x2b1608).setDepth(3.2);
      }
      // Vereda de madera delante del frente.
      this.add.tileSprite(c.x - 6, c.y + c.h, c.w + 12, 26, 'piso').setOrigin(0).setTileScale(0.3).setTint(0x9c6b3f).setDepth(1.5);
      this.add.rectangle(c.x + c.w / 2, c.y + c.h + 26, c.w + 12, 3, 0x3b2010).setDepth(1.55);
      // Desde afuera se ve el techo y, abajo, el frente con su cartel; al entrar se desvanecen los dos. La estrella
      // sobre el techo avisa que adentro hay una.
      const techo = this.add.image(0, 0, `techo_${c.tipo}`).setDisplaySize(c.w, c.h);
      const frente = this.add.image(0, c.h / 2 + 2, `frente_${c.tipo}`).setOrigin(0.5, 1);
      frente.setScale((c.w + 10) / frente.width);
      const marca = this.add.star(0, -c.h / 2 + (c.h - frente.displayHeight) / 2, 5, 12, 26, COLOR.estrella).setStrokeStyle(3, 0x8a5a00).setVisible(false);
      this.techos.push(this.add.container(c.x + c.w / 2, c.y + c.h / 2, [techo, frente, marca]).setDepth(9));
      this.marcas.push(marca);
    }
    this.edificioActual = -1;
    // Cobertura de la calle: las largas son carretas; las chicas, barriles y cajones alternados.
    COBERTURA.forEach(([x, y, w, h], i) => {
      this.muros.add(this.add.rectangle(x + w / 2, y + h / 2, w, h).setVisible(false));
      this.dibujarMueble(x, y, w, h, w >= 100 ? 'mueble_carreta' : i % 2 ? 'mueble_cajon' : 'mueble_barril', true);
    });
    for (const [x, y, clave, ancho] of adornosDeLaCalle()) this.ponerAdorno(x, y, clave, ancho, 9.2 + y / 10000, clave !== 'adorno_farol');
    this.plantaRodante();
  }

  // La cara de adentro de la pared del fondo, con lo de cada edificio (espejo y botellas, carteles, estantes). El dibujo
  // es más ancho que alto que la pared: se lo ajusta al ancho y se recorta arriba y abajo (o al revés si es angosta).
  paredDeAdentro(c) {
    const ancho = c.w - 2 * MURO;
    const img = this.add.image(0, 0, `pared_${c.tipo}`).setOrigin(0).setDepth(3.1);
    const fw = img.width, fh = img.height;
    let esc = ancho / fw;
    let cx = 0, cy = 0, cw = fw, ch = fh;
    if (fh * esc >= PARED_ALTO) { ch = PARED_ALTO / esc; cy = (fh - ch) / 2; }
    else { esc = PARED_ALTO / fh; cw = ancho / esc; cx = (fw - cw) / 2; }
    img.setScale(esc).setCrop(cx, cy, cw, ch).setPosition(c.x + MURO - cx * esc, c.y + MURO - cy * esc);
  }

  // Un adorno parado sobre su base, con una sombra suave en el piso si se pide.
  ponerAdorno(x, y, clave, ancho, prof, conSombra = false) {
    if (!this.textures.exists(clave)) return null; // si el dibujo no llegó, mejor nada que un cuadrado negro
    const img = this.add.image(x, y, clave).setOrigin(0.5, 1);
    img.setScale(ancho / img.width).setDepth(prof);
    if (conSombra) this.add.ellipse(x, y - 2, ancho * 0.85, Math.max(8, ancho * 0.2), 0x000000, 0.18).setDepth(1.6);
    return img;
  }

  // De vez en cuando una planta rodante cruza la calle principal, para que el pueblo no esté quieto.
  plantaRodante() {
    this.time.delayedCall(Phaser.Math.Between(4000, 12000), () => {
      if (!this.textures.exists('adorno_rodante')) return;
      const izq = Math.random() < 0.5;
      const y = Phaser.Math.Between(700, 980);
      const r = this.add.image(izq ? -40 : MUNDO_W + 40, y - 18, 'adorno_rodante');
      r.setScale(36 / r.width).setDepth(9.2 + y / 10000);
      this.tweens.add({ targets: r, angle: izq ? 360 : -360, duration: 1400, repeat: -1 });
      this.tweens.add({ targets: r, y: y - 30, duration: 350, yoyo: true, repeat: -1, ease: 'Sine.Out' });
      this.tweens.add({ targets: r, x: izq ? MUNDO_W + 40 : -40, duration: 18000, onComplete: () => { this.tweens.killTweensOf(r); r.destroy(); } });
      this.plantaRodante();
    });
  }

  // Cada mueble se dibuja apoyado en su lugar de choque (el rectángulo invisible) y sale hacia arriba, como los
  // personajes. Se ordena con ellos por altura en la pantalla: el que está más abajo tapa al de más arriba.
  dibujarMueble(x, y, w, h, clave, afuera) {
    const fuente = this.textures.get(clave).getSourceImage();
    let ancho, alto;
    if (clave === 'mueble_barra') { ancho = w + 6; alto = Math.max(h + 22, 44); } // la barra se estira a lo largo
    else {
      ancho = w * ({ mueble_mesa: 2, mueble_carreta: 1.15, mueble_estante: 1, adentro_piano: 1.25, adentro_escritorio: 1.25, adentro_bolsas: 1.15, adentro_manzanas: 1.2 }[clave] || 1.1);
      alto = ancho * fuente.height / fuente.width;
    }
    return this.add.image(x + w / 2, y + h + 4, clave).setOrigin(0.5, 1).setDisplaySize(ancho, alto)
      .setDepth((afuera ? 9.2 : 5) + (y + h) / 10000);
  }

  armarJugador() {
    // El círculo de choque no se ve: lo que se ve es el dibujo, que lo sigue.
    this.jugador = this.add.circle(INICIO.x, INICIO.y, RADIO_JUGADOR, COLOR.jugador).setVisible(false);
    this.physics.add.existing(this.jugador);
    this.jugador.body.setCircle(RADIO_JUGADOR).setCollideWorldBounds(true);
    this.physics.add.collider(this.jugador, this.muros);
    this.sombraJugador = this.add.ellipse(0, 0, ALTO_VAQUERO * 0.55, ALTO_VAQUERO * 0.16, 0x000000, 0.25).setDepth(4.5);
    // Igual que en la versión 1: piernas (solo de perfil), cuerpo y brazo con revólver que gira desde el hombro.
    this.cuerpoJugador = this.add.image(0, 40, 'jugador_espalda').setOrigin(0.5, 1);
    const brazo = this.add.image(0, 0, 'brazo').setOrigin(0, BRAZO_HOMBRO_Y);
    brazo.setScale(LARGO_BRAZO / brazo.width);
    this.brazo = this.add.container(HOMBRO_X, HOMBRO_Y, [brazo]);
    this.piernaLejos = this.add.graphics();
    this.piernaCerca = this.add.graphics();
    this.botaLejos = this.add.image(0, 0, 'bota').setOrigin(0.28, 0.05).setTint(0x8a8a8a).setScale(130 / 520);
    this.botaCerca = this.add.image(0, 0, 'bota').setOrigin(0.28, 0.05).setScale(130 / 520);
    this.piernas = this.add.container(0, 0, [this.piernaLejos, this.botaLejos, this.piernaCerca, this.botaCerca]).setVisible(false);
    this.pieIzq = this.add.image(0, 40, 'jugador_espalda').setOrigin(0.5, 1).setVisible(false);
    this.pieDer = this.add.image(0, 40, 'jugador_espalda').setOrigin(0.5, 1).setVisible(false);
    this.figura = this.add.container(INICIO.x, INICIO.y, [this.piernas, this.pieIzq, this.pieDer, this.cuerpoJugador, this.brazo]).setScale(ESCALA_VAQUERO);
    this.poseJugador = null;
    this.vistaJugador = 'frente';
    this.faseCarrera = 0;
  }

  // De frente o de espaldas: el dibujo se corta a la altura de las rodillas y cada pierna (mitad izquierda y derecha de lo
  // de abajo) se levanta por turno, por detrás del cuerpo. Así camina con las piernas del dibujo en vez de deslizarse.
  pasoDeFrente(cuerpo, izq, der, fase, alzada, pisoY) {
    const corte = CORTE_PIERNAS[cuerpo.texture.key] || 0.75;
    const w = cuerpo.frame.width, h = cuerpo.frame.height;
    const yc = Math.round(h * corte);
    cuerpo.setCrop(0, 0, w, yc);
    for (const [pie, x0, lado] of [[izq, 0, 1], [der, w / 2, -1]]) {
      pie.setTexture(cuerpo.texture.key).setFlipX(cuerpo.flipX).setOrigin(cuerpo.originX, cuerpo.originY).setScale(cuerpo.scaleX, cuerpo.scaleY)
        .setCrop(x0, yc, w / 2, h - yc).setVisible(true);
      pie.setPosition(cuerpo.x, pisoY - alzada * Math.max(0, lado * Math.sin(fase)));
    }
  }

  sinPasoDeFrente(cuerpo, izq, der) {
    cuerpo.setCrop();
    izq.setVisible(false);
    der.setVisible(false);
  }

  // Lo fijo en la pantalla (marcador, flechas, mira, joysticks, carteles) se mide en la pantalla de 960 de ancho. Con la
  // cámara al doble y centrada, un objeto fijo en (x, y) se vería en otro lado: se lo junta todo en una capa corrida
  // media pantalla, que la cámara deja justo en su lugar (y al doble de nitidez). Se respeta el orden de profundidad.
  juntarPantalla() {
    const fijos = this.children.list.filter((o) => o.scrollFactorX === 0).sort((a, b) => a.depth - b.depth);
    this.capaPantalla = this.add.container(ANCHO / 2, ALTO_VISTO / 2, fijos).setScrollFactor(0, 0, true).setDepth(20);
  }

  // La textura pedida, o la de reemplazo si ese dibujo todavía no está.
  texturaO(clave, reemplazo) {
    return this.textures.exists(clave) && clave !== '__MISSING' ? clave : reemplazo;
  }

  ponerPose(clave, espejada) {
    const id = clave + espejada;
    if (this.poseJugador === id) return;
    this.poseJugador = id;
    const c = this.cuerpoJugador.setTexture(clave).setFlipX(espejada);
    if (clave === 'rol_bolita') {
      c.setOrigin(0.5).setScale(ALTO_BOLITA / c.height);
      c.y = 40 - ALTO_BOLITA / 2;
    } else {
      c.setOrigin(0.5, 1).setScale(130 / c.height);
      c.y = 40;
    }
    this.piernas.setVisible(clave === 'correr_cuerpo').setScale(espejada ? -1 : 1, 1);
  }

  armarHud() {
    // Tres tablas de madera arriba: a la izquierda corazones, vidas y munición; al centro las estrellas; a la derecha
    // puntos y nivel. Se redibujan solo cuando algo cambia.
    this.hudG = this.add.graphics();
    const estiloHud = { fontFamily: FUENTE, fontSize: '20px', color: '#ffe9b0', stroke: '#2b160a', strokeThickness: 5 };
    this.hudVidas = this.add.text(150, 25, '', estiloHud).setOrigin(0, 0.5);
    this.hudMunicion = this.add.text(214, 25, '', { ...estiloHud, fontSize: '17px' }).setOrigin(0, 0.5);
    this.hudEstrellas = this.add.text(ANCHO / 2 - 6, 26, '', estiloHud).setOrigin(0, 0.5);
    this.hudPuntos = this.add.text(ANCHO - 20, 25, '', estiloHud).setOrigin(1, 0.5);
    this.hudNivel = this.add.text(ANCHO - 20, 58, '', { ...estiloHud, fontSize: '16px' }).setOrigin(1, 0.5);
    this.hudEscopeta = this.add.image(240, 26, 'escopeta').setScale(50 / 320).setAngle(12).setVisible(false);
    for (const o of [this.hudG, this.hudVidas, this.hudMunicion, this.hudEstrellas, this.hudPuntos, this.hudNivel, this.hudEscopeta]) o.setScrollFactor(0).setDepth(20);
    this.firmaHud = '';
    this.textoCentro = this.add.text(ANCHO / 2, ALTO_VISTO / 2 - 60, '', { fontFamily: FUENTE, fontSize: '38px', color: '#ffd23f', stroke: '#3b1d0a', strokeThickness: 8, align: 'center' })
      .setOrigin(0.5).setScrollFactor(0).setDepth(21);
    this.flechas = this.add.graphics().setScrollFactor(0).setDepth(19);
    this.barraJefe = this.add.graphics().setScrollFactor(0).setDepth(20);
    this.textoJefe = this.add.text(ANCHO / 2 - 128, 64, T.jefe, { fontFamily: FUENTE, fontSize: '17px', color: '#fff', stroke: '#000', strokeThickness: 4 })
      .setOrigin(1, 0.5).setScrollFactor(0).setDepth(20).setVisible(false);
    this.mira = this.add.container(0, 0, [
      this.add.circle(0, 0, 14).setStrokeStyle(3, 0xff2222),
      this.add.rectangle(0, 0, 34, 2, 0xff2222),
      this.add.rectangle(0, 0, 2, 34, 0xff2222),
    ]).setScrollFactor(0).setDepth(22);
    // Nivel superado, vida perdida y fin del juego: un cartel de madera colgado, sobre el pueblo oscurecido.
    const fondo = this.add.rectangle(ANCHO / 2, ALTO / 2, ANCHO * 2, ALTO * 2, 0x000000, 0.45); // de sobra: en el celular el cartel se achica
    const cartel = this.add.graphics();
    dibujarTabla(cartel, ANCHO / 2 - 280, 70, 560, 400);
    cartel.fillStyle(0x6d4422, 1).lineStyle(3, 0x3b2010, 1);
    cartel.fillRect(ANCHO / 2 - 150, 40, 14, 34).strokeRect(ANCHO / 2 - 150, 40, 14, 34); // tirantes que lo cuelgan
    cartel.fillRect(ANCHO / 2 + 136, 40, 14, 34).strokeRect(ANCHO / 2 + 136, 40, 14, 34);
    const estilo = { fontFamily: FUENTE, color: '#ffe9b0', stroke: '#2b160a', strokeThickness: 5, align: 'center' };
    this.tituloPausa = this.add.text(ANCHO / 2, 125, '', { ...estilo, fontSize: '40px', color: '#ffd23f', strokeThickness: 7 }).setOrigin(0.5);
    this.datosPausa = this.add.text(ANCHO / 2, 180, '', { ...estilo, fontSize: '25px', lineSpacing: 10 }).setOrigin(0.5, 0);
    this.seguirPausa = this.add.text(ANCHO / 2, 432, '', { ...estilo, fontSize: '20px' }).setOrigin(0.5);
    this.tweens.add({ targets: this.seguirPausa, alpha: 0.35, duration: 650, yoyo: true, repeat: -1 });
    // Si en el celular se ve menos alto, el cartel se achica para que entre entero.
    const escala = ALTO_VISTO / ALTO;
    this.pantallaPausa = this.add.container(ANCHO * (1 - escala) / 2, 0, [fondo, cartel, this.tituloPausa, this.datosPausa, this.seguirPausa])
      .setScale(escala).setScrollFactor(0).setDepth(30).setVisible(false);
    this.armarBotonVideo(this.pantallaPausa, ANCHO / 2);
    this.game.canvas.style.cursor = 'none';
  }

  armarControles() {
    this.teclas = this.input.keyboard.addKeys('W,A,S,D,UP,DOWN,LEFT,RIGHT,R');
    this.input.mouse.disableContextMenu();
    this.input.addPointer(2);
    this.joyPunteroId = null;
    this.apuntaPunteroId = null;
    const fijo = (o) => o.setScrollFactor(0).setVisible(false);
    this.joyBase = fijo(this.add.circle(JOY_X, JOY_Y, JOY_RADIO, 0xffffff, 0.18).setStrokeStyle(3, 0xffffff, 0.5).setDepth(18));
    this.joyPerilla = fijo(this.add.circle(JOY_X, JOY_Y, 26, 0xffffff, 0.45).setStrokeStyle(2, 0x000000, 0.4).setDepth(19));
    this.apuntaBase = fijo(this.add.circle(APUNTA_X, APUNTA_Y, JOY_RADIO, 0xff4444, 0.18).setStrokeStyle(3, 0xff4444, 0.6).setDepth(18));
    this.apuntaPerilla = fijo(this.add.circle(APUNTA_X, APUNTA_Y, 26, 0xff6a6a, 0.5).setStrokeStyle(2, 0x000000, 0.4).setDepth(19));
    this.botonRol = fijo(this.add.circle(ROL_X, ROL_Y, ROL_RADIO, 0x44aaff, 0.25).setStrokeStyle(3, 0x44aaff, 0.6).setDepth(18));
    this.textoRol = fijo(this.add.text(ROL_X, ROL_Y, T.rol, { fontFamily: FUENTE, fontSize: '15px', color: '#fff', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5).setDepth(19));

    this.input.on('pointerdown', (p) => {
      if (p.wasTouch) {
        this.activarTactil();
        const px = p.x / ZOOM, py = p.y / ZOOM; // el lienzo está al doble
        if (Phaser.Math.Distance.Between(px, py, ROL_X, ROL_Y) < ROL_RADIO * 1.4) this.pedirRol = true;
        else if (this.joyPunteroId === null && Phaser.Math.Distance.Between(px, py, JOY_X, JOY_Y) < JOY_ZONA) this.joyPunteroId = p.id;
        else if (this.apuntaPunteroId === null && Phaser.Math.Distance.Between(px, py, APUNTA_X, APUNTA_Y) < JOY_ZONA) this.apuntaPunteroId = p.id;
      } else if (p.rightButtonDown()) this.pedirRol = true;
      if (this.terminado) {
        if (this.esperandoAviso) return;
        if (this.tocaBotonVideo(p)) { this.pedirVideoVidas(); return; }
        sintetizar(this, 'clic');
        this.scene.start('portada');
      }
      else this.intentarContinuar();
    });
    this.input.on('pointerup', (p) => {
      if (p.id === this.joyPunteroId) { this.joyPunteroId = null; this.joyPerilla.setPosition(JOY_X, JOY_Y); }
      if (p.id === this.apuntaPunteroId) { this.apuntaPunteroId = null; this.apuntaPerilla.setPosition(APUNTA_X, APUNTA_Y); }
    });
    this.input.keyboard.on('keydown-SPACE', () => this.intentarContinuar());
    this.input.keyboard.on('keydown-ENTER', () => this.intentarContinuar());
  }

  activarTactil() {
    this.usaTactil = true;
    this.registry.set('tactil', true);
    for (const o of [this.joyBase, this.joyPerilla, this.apuntaBase, this.apuntaPerilla, this.botonRol, this.textoRol]) o.setVisible(true);
    this.mira.setVisible(false);
  }

  moverPerilla(perilla, cx, cy, p) {
    const px = p.x / ZOOM, py = p.y / ZOOM;
    const ang = Phaser.Math.Angle.Between(cx, cy, px, py);
    const dist = Math.min(Phaser.Math.Distance.Between(cx, cy, px, py), JOY_RADIO);
    perilla.setPosition(cx + Math.cos(ang) * dist, cy + Math.sin(ang) * dist);
    return { x: (perilla.x - cx) / JOY_RADIO, y: (perilla.y - cy) / JOY_RADIO };
  }

  // ---------- Niveles, estrellas y jefe ----------

  cantidadEstrellas() { return Math.min(8, 4 + this.nivel); }
  // Cuántos bandidos de la calle puede haber a la vez: crece con cada nivel (4 en el 1, 7 en el 4, 10 en el 6, 14 en
  // el 10) hasta un tope de 16. Con el jefe en la calle siguen viniendo igual (pedido de Gonzalo).
  maximoEnemigos() {
    if (this.etapaJefe === 'derrotado') return 0;
    return Math.min(16, Math.round((2 + this.nivel) * 1.2));
  }

  // Cada cuánto aparece uno nuevo: también más seguido en cada nivel, hasta la mitad del tiempo del primero.
  esperaAparicion() {
    const factor = Math.max(0.5, 1 - 0.05 * (this.nivel - 1));
    return Phaser.Math.Between(750, 1330) * factor;
  }

  empezarNivel() {
    this.limpiar();
    this.cerrarCajas();
    this.etapaJefe = null;
    this.estrellasJuntadas = 0;
    const total = this.cantidadEstrellas();
    const enCasas = Math.min(2 + Math.floor((this.nivel - 1) / 3), 4); // algunas, adentro de edificios
    // Las de afuera: lugares al azar, lejos del vaquero y separados entre sí.
    const libres = Phaser.Utils.Array.Shuffle(LUGARES_ESTRELLA.filter(([x, y]) => !dentroDeMuro(x, y, 20) && edificioDe(x, y) < 0));
    const elegidos = [];
    for (const [x, y] of libres) {
      if (elegidos.length >= total - enCasas) break;
      if (Phaser.Math.Distance.Between(x, y, this.jugador.x, this.jugador.y) < 300) continue;
      if (elegidos.some(([ex, ey]) => Phaser.Math.Distance.Between(x, y, ex, ey) < 250)) continue;
      elegidos.push([x, y]);
    }
    const ponerEstrella = (x, y, casa) => {
      // Siempre a la vista: adentro, por encima de muebles y personajes pero debajo del techo (desde afuera avisa la
      // marca del techo); en la calle, por encima de carretas y adornos.
      const forma = this.add.star(x, y, 5, 8, 18, COLOR.estrella).setStrokeStyle(2, 0x8a5a00).setDepth(casa >= 0 ? 8.9 : 9.9);
      this.tweens.add({ targets: forma, angle: 360, duration: 3000, repeat: -1 });
      forma.casa = casa;
      this.estrellas.push(forma);
    };
    for (const [x, y] of elegidos) ponerEstrella(x, y, -1);
    // Las de adentro, cada una en un edificio distinto y cuidada por bandidos que esperan ahí.
    for (const casa of Phaser.Utils.Array.Shuffle(CASAS.map((_, i) => i)).slice(0, enCasas)) {
      const p = this.lugarAdentro(casa, []);
      ponerEstrella(p.x, p.y, casa);
      this.marcas[casa].setVisible(true);
    }
    this.totalEstrellas = this.estrellas.length;
    this.poblarCasas();
    this.proximaAparicion = this.time.now + 2000;
    this.avisar(T.nivel(this.nivel, this.totalEstrellas), 2000);
  }

  juntarEstrellas() {
    for (const e of this.estrellas) {
      if (!e.active) continue;
      if (Phaser.Math.Distance.Between(e.x, e.y, this.jugador.x, this.jugador.y) < RADIO_JUGADOR + 18) {
        e.destroy();
        if (e.casa >= 0) this.marcas[e.casa].setVisible(false);
        this.estrellasJuntadas += 1;
        sintetizar(this, 'estrella');
        this.sumarPuntos(PUNTOS_ESTRELLA);
        if (this.estrellasJuntadas >= this.totalEstrellas && this.etapaJefe === null) this.empezarJefe();
      }
    }
    this.estrellas = this.estrellas.filter((e) => e.active);
  }

  // Un lugar libre adentro de un edificio: lejos de las puertas (para que al entrar haya un momento) y de los muebles.
  lugarAdentro(casa, lejosDe) {
    const c = CASAS[casa];
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(c.interior.x + 40, c.interior.right - 40);
      const y = Phaser.Math.Between(c.interior.y + 40, c.interior.bottom - 40);
      if (dentroDeMuro(x, y, 26)) continue;
      if (c.puertas.some((p) => Phaser.Math.Distance.Between(x, y, p.x, p.y) < 130)) continue;
      if (lejosDe.some((o) => Phaser.Math.Distance.Between(x, y, o.x, o.y) < 70)) continue;
      return { x, y };
    }
    return { x: c.x + c.w / 2, y: c.y + c.h / 2 };
  }

  // Bandidos que cuidan las estrellas de adentro: uno por edificio (dos desde el nivel 3). Se vuelven a poner al
  // perder una vida, en los edificios que todavía tienen su estrella.
  poblarCasas() {
    for (const estrella of this.estrellas) {
      if (!estrella.active || estrella.casa < 0) continue;
      const ocupados = [estrella];
      for (let k = 0; k < (this.nivel >= 3 ? 2 : 1); k++) {
        const p = this.lugarAdentro(estrella.casa, ocupados);
        ocupados.push(p);
        const e = this.crearEnemigo(p.x, p.y);
        e.casa = estrella.casa;
        e.estado = 'guardia';
      }
    }
  }

  // El techo del edificio donde está el vaquero se desvanece para ver adentro; al salir, vuelve.
  revisarTechos() {
    const dentro = adentroDe(this.jugador.x, this.jugador.y);
    if (dentro === this.edificioActual) return;
    if (this.edificioActual >= 0) this.tweens.add({ targets: this.techos[this.edificioActual], alpha: 1, duration: 250 });
    if (dentro >= 0) this.tweens.add({ targets: this.techos[dentro], alpha: 0, duration: 250 });
    this.edificioActual = dentro;
  }

  empezarJefe() {
    this.etapaJefe = 'pelea';
    // Los bandidos que ya están se quedan y siguen viniendo como siempre: el jefe se suma a ellos.
    const p = this.puntoDeAparicion() || APARICIONES[0];
    this.jefe = this.crearEnemigo(p[0], p[1], true);
    this.avisar(T.llegoJefe, 1800);
    this.dibujarBarraJefe();
  }

  // Un punto de aparición fuera de la pantalla y lejos del vaquero.
  puntoDeAparicion() {
    const vista = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.cameras.main.worldView), 60, 60);
    const opciones = APARICIONES.filter(([x, y]) => !vista.contains(x, y) && Phaser.Math.Distance.Between(x, y, this.jugador.x, this.jugador.y) > 500);
    return opciones.length ? Phaser.Utils.Array.GetRandom(opciones) : null;
  }

  // ---------- Enemigos ----------

  crearEnemigo(x, y, esJefe = false) {
    const radio = esJefe ? RADIO_JEFE : RADIO_BANDIDO;
    const cuerpo = this.add.circle(x, y, radio, esJefe ? COLOR.jefe : COLOR.bandido).setVisible(false);
    this.physics.add.existing(cuerpo);
    cuerpo.body.setCircle(radio).setCollideWorldBounds(true);
    this.physics.add.collider(cuerpo, this.muros);
    if (!esJefe) this.physics.add.collider(cuerpo, this.umbrales); // el jefe sí entra y sale de los edificios
    const aviso = this.add.text(x, y - radio - 6, '!', { fontFamily: FUENTE, fontSize: '28px', color: '#ff2222', stroke: '#000', strokeThickness: 4 })
      .setOrigin(0.5, 1).setDepth(9.97).setVisible(false);
    const e = {
      cuerpo, aviso, radio, jefe: esJefe, vida: esJefe ? VIDA_JEFE : 1, vivo: true, casa: -1,
      estado: 'acercarse', hasta: 0, entrando: esJefe, apunta: 0, destino: null, desvio: null, ultimaPos: { x, y, t: this.time.now },
    };
    this.armarFiguraEnemigo(e);
    this.enemigos.push(e);
    return e;
  }

  // Dibujo del bandido o del jefe, como en la versión 1: de frente, de espaldas, caminando de perfil (torso con piernas
  // por código) o herido.
  armarFiguraEnemigo(e) {
    e.arte = e.jefe ? ARTE_JEFE : ARTE_BANDIDO;
    e.alto = e.jefe ? ALTO_JEFE : ALTO_MALO;
    e.escala = e.alto / ALTO_BANDIDO;
    e.imagen = this.add.image(0, PIES_BANDIDO, e.arte.frente).setOrigin(0.5, 1);
    const bota = () => this.add.image(0, 0, e.arte.bota).setOrigin(0.3, 0.05).setScale(ALTO_BANDIDO / 360);
    e.piernaLejos = this.add.graphics();
    e.piernaCerca = this.add.graphics();
    e.botaLejos = bota().setTint(0x8a8a8a);
    e.botaCerca = bota();
    e.piernas = this.add.container(0, 0, [e.piernaLejos, e.botaLejos, e.piernaCerca, e.botaCerca]);
    e.pieIzq = this.add.image(0, PIES_BANDIDO, e.arte.frente).setOrigin(0.5, 1).setVisible(false);
    e.pieDer = this.add.image(0, PIES_BANDIDO, e.arte.frente).setOrigin(0.5, 1).setVisible(false);
    e.figura = this.add.container(0, 0, [e.piernas, e.pieIzq, e.pieDer, e.imagen]).setScale(e.escala);
    e.sombra = this.add.ellipse(0, 0, e.alto * 0.55, e.alto * 0.16, 0x000000, 0.25).setDepth(4.5);
    e.fase = Math.random() * 6;
    e.vista = 'frente';
    this.dibujoEnemigo(e, 'frente');
    this.ubicarFiguraEnemigo(e);
  }

  dibujoEnemigo(e, tipo, espejado = false) {
    let clave = e.arte[tipo];
    if (tipo === 'espalda') clave = this.texturaO(clave, e.arte.frente);
    e.imagen.setTexture(clave).setFlipX(espejado);
    e.imagen.setScale(ALTO_BANDIDO * (tipo === 'herido' ? 1.2 : 1) / e.imagen.height);
    e.piernas.setVisible(tipo === 'torso').setScale(espejado ? -1 : 1, 1);
  }

  // Caminando se lo ve según hacia dónde va; quieto (apuntando o esperando), según hacia dónde está el vaquero.
  animarEnemigo(e, dt) {
    const v = e.cuerpo.body.velocity;
    const rapidez = Math.hypot(v.x, v.y);
    let rebote = 0;
    e.figura.angle = 0;
    if (rapidez > 5) {
      const ang = Math.atan2(v.y, v.x);
      e.vista = vistaSegun(ang, e.vista);
      e.fase += rapidez * dt / e.escala / e.arte.pierna.paso * Math.PI;
      if (e.vista === 'costado') {
        this.sinPasoDeFrente(e.imagen, e.pieIzq, e.pieDer);
        this.dibujoEnemigo(e, 'torso', v.x < 0); // el dibujo camina hacia la derecha
        const lejos = calcularPierna(e.fase + Math.PI, e.arte.pierna);
        const cerca = calcularPierna(e.fase, e.arte.pierna);
        rebote = e.arte.pierna.tobillo - Math.max(lejos.tobillo.y, cerca.tobillo.y);
        dibujarPierna(e.piernaLejos, e.botaLejos, lejos, 0x26262a, e.arte.pierna, 0);
        dibujarPierna(e.piernaCerca, e.botaCerca, cerca, 0x3c3c41, e.arte.pierna, 0);
      } else {
        this.dibujoEnemigo(e, e.vista);
        e.figura.angle = Math.sin(e.fase) * 2;
        this.pasoDeFrente(e.imagen, e.pieIzq, e.pieDer, e.fase, 8, PIES_BANDIDO);
      }
    } else {
      const vista = vistaSegun(e.apunta, e.vista === 'costado' ? 'frente' : e.vista);
      e.vista = vista === 'espalda' ? 'espalda' : 'frente';
      this.dibujoEnemigo(e, e.vista);
      this.sinPasoDeFrente(e.imagen, e.pieIzq, e.pieDer);
    }
    e.rebote = rebote;
    this.ubicarFiguraEnemigo(e);
  }

  ubicarFiguraEnemigo(e) {
    const c = e.cuerpo;
    e.figura.setPosition(c.x, c.y + ((e.rebote || 0) - CENTRO_BANDIDO) * e.escala).setDepth(profundidad(c.x, c.y, e.alto));
    e.sombra.setPosition(c.x, c.y + e.alto / 2 - 4);
    e.aviso.setPosition(c.x, c.y - e.alto / 2 - 2);
  }

  moverEnemigos(tiempo) {
    const j = this.jugador;
    for (const e of this.enemigos) {
      if (!e.vivo) continue;
      const c = e.cuerpo;
      // El que cuida un edificio solo pelea con el vaquero adentro de ese edificio: si no está, espera quieto. Así
      // nunca dispara desde abajo de un techo, donde no se lo ve.
      if (e.casa >= 0 && this.edificioActual !== e.casa) {
        c.body.setVelocity(0, 0);
        if (e.estado !== 'guardia') { e.estado = 'guardia'; e.aviso.setVisible(false); }
        continue;
      }
      if (e.estado === 'guardia') e.estado = 'acercarse';
      const dist = Phaser.Math.Distance.Between(c.x, c.y, j.x, j.y);
      const ve = lineaLibre(c.x, c.y, j.x, j.y);
      e.apunta = Phaser.Math.Angle.Between(c.x, c.y, j.x, j.y);
      const velocidad = e.jefe ? VELOCIDAD_JEFE : VELOCIDAD_BANDIDO;
      const alcance = e.jefe ? 320 : ALCANCE_BANDIDO;

      if (e.estado === 'acercarse') {
        let objetivo = e.destino || { x: j.x, y: j.y };
        // El jefe, si el vaquero está en otro lado de una pared, va por la puerta: así meterse en un edificio no
        // es un escondite seguro.
        if (e.jefe) objetivo = this.caminoDelJefe(c) || objetivo;
        // Trabado contra un edificio: se corre de costado un rato.
        if (tiempo - e.ultimaPos.t > 500) {
          if (Phaser.Math.Distance.Between(c.x, c.y, e.ultimaPos.x, e.ultimaPos.y) < 10) {
            const lado = Math.random() < 0.5 ? 1 : -1;
            e.desvio = { ang: e.apunta + lado * Math.PI / 2, hasta: tiempo + 700 };
          }
          e.ultimaPos = { x: c.x, y: c.y, t: tiempo };
        }
        let ang = Phaser.Math.Angle.Between(c.x, c.y, objetivo.x, objetivo.y);
        if (e.desvio && tiempo < e.desvio.hasta) ang = e.desvio.ang;
        c.body.setVelocity(Math.cos(ang) * velocidad, Math.sin(ang) * velocidad);
        const llegoDestino = e.destino && (Phaser.Math.Distance.Between(c.x, c.y, e.destino.x, e.destino.y) < 20 || tiempo > e.destino.hasta);
        if (llegoDestino) e.destino = null;
        if (!e.destino && ve && dist < alcance) this.plantarse(e, tiempo);
      } else if (e.estado === 'apuntar') {
        c.body.setVelocity(0, 0);
        if (tiempo >= e.hasta) {
          e.aviso.setVisible(false);
          this.dispararEnemigo(e);
          e.tiros -= 1;
          if (e.tiros > 0) e.hasta = tiempo + 380;
          else { e.estado = 'esperar'; e.hasta = tiempo + (e.jefe ? 300 : Phaser.Math.Between(900, 1600)); }
        }
      } else if (e.estado === 'esperar') {
        c.body.setVelocity(0, 0);
        if (tiempo >= e.hasta) {
          e.estado = 'acercarse';
          // El jefe, después de tirar, se mueve a otro lugar cerca del vaquero; el bandido vuelve a buscarlo.
          // (con el vaquero adentro de un edificio, lo sigue buscando directo, sin dar vueltas afuera)
          if (e.jefe && this.edificioActual < 0) e.destino = this.lugarCercaDe(j.x, j.y, tiempo);
        }
      }
    }
  }

  // A dónde camina el jefe para pasar por una puerta, o null si está del mismo lado que el vaquero.
  // Si está adentro de otro edificio, primero sale; si el vaquero está adentro, entra por la puerta más cercana.
  caminoDelJefe(c) {
    const casaJefe = adentroDe(c.x, c.y);
    const casaVaquero = this.edificioActual;
    if (casaJefe === casaVaquero) return null;
    const saliendo = casaJefe >= 0;
    const casa = CASAS[saliendo ? casaJefe : casaVaquero];
    const desde = saliendo ? this.jugador : c;
    const puerta = casa.puertas.reduce((a, b) => (Phaser.Math.Distance.Between(desde.x, desde.y, a.x, a.y) < Phaser.Math.Distance.Between(desde.x, desde.y, b.x, b.y) ? a : b));
    const haciaAfuera = puerta.y === casa.y ? -1 : 1;
    const grosor = puerta.y === casa.y ? MURO + PARED_ALTO : MURO; // la pared de arriba es más gruesa
    const medio = puerta.y + grosor / 2;
    const afuera = { x: puerta.x, y: medio + haciaAfuera * (grosor / 2 + 35) };
    const adentro = { x: puerta.x, y: medio - haciaAfuera * (grosor / 2 + 35) };
    const [primero, despues] = saliendo ? [adentro, afuera] : [afuera, adentro];
    // Primero se pone frente a la puerta; ya ahí (o en el hueco), la cruza.
    const enLaPuerta = Math.abs(c.x - puerta.x) < 20 && Math.abs(c.y - medio) < grosor / 2 + 40;
    if (enLaPuerta || Phaser.Math.Distance.Between(c.x, c.y, primero.x, primero.y) < 20) return despues;
    // Si la puerta da al otro lado del edificio, lo rodea por el callejón más cercano: primero se corre de costado
    // hasta salir de enfrente del edificio y después sigue por el callejón hasta la altura de la puerta.
    const delOtroLado = haciaAfuera === 1 ? c.y < casa.y + casa.h + 10 : c.y > casa.y - 10;
    if (!saliendo && delOtroLado) {
      const ladoX = c.x < casa.x + casa.w / 2 ? casa.x - 45 : casa.x + casa.w + 45;
      if (c.x > casa.x - 30 && c.x < casa.x + casa.w + 30) return { x: ladoX, y: c.y };
      return { x: ladoX, y: afuera.y };
    }
    return primero;
  }

  lugarCercaDe(x, y, tiempo) {
    for (let i = 0; i < 12; i++) {
      const ang = Math.random() * Math.PI * 2;
      const d = Phaser.Math.Between(180, 300);
      const px = Phaser.Math.Clamp(x + Math.cos(ang) * d, 40, MUNDO_W - 40);
      const py = Phaser.Math.Clamp(y + Math.sin(ang) * d, 40, MUNDO_H - 40);
      if (!dentroDeMuro(px, py, RADIO_JEFE + 6) && edificioDe(px, py) < 0) return { x: px, y: py, hasta: tiempo + 1800 };
    }
    return null;
  }

  // Se frena, muestra el "!" y dispara. El bandido apunta más rápido en cada nivel; el jefe con poca vida tira dos veces.
  plantarse(e, tiempo) {
    e.estado = 'apuntar';
    e.entrando = false;
    e.aviso.setVisible(true);
    const espera = e.jefe ? Math.max(500, 650 - (this.nivel - 1) * 30) : Math.max(450, 750 - (this.nivel - 1) * 40);
    e.hasta = tiempo + espera;
    e.tiros = e.jefe && e.vida <= VIDA_JEFE / 2 ? 2 : 1;
  }

  dispararEnemigo(e) {
    const c = e.cuerpo;
    if (e.jefe) this.sound.play('escopeta', { volume: 0.6 });
    else this.sound.play('revolver', { volume: 0.22, detune: Phaser.Math.Between(-450, -300) });
    const velocidad = 230 + (this.nivel - 1) * 20;
    for (const desvio of e.jefe ? [-ABANICO_JEFE, 0, ABANICO_JEFE] : [0]) {
      const ang = e.apunta + desvio;
      const x = c.x + Math.cos(ang) * (e.radio + 14);
      const y = c.y + Math.sin(ang) * (e.radio + 14);
      if (!lineaLibre(c.x, c.y, x, y)) continue; // igual que el vaquero: pegado a la pared, el tiro no sale
      const forma = this.add.circle(x, y, 6, COLOR.balaEnemiga).setStrokeStyle(2, 0x000000).setDepth(9.95);
      this.balas.push({ forma, vx: Math.cos(ang) * velocidad, vy: Math.sin(ang) * velocidad });
    }
  }

  quitarEnemigo(e, conDibujo = true) {
    e.vivo = false;
    e.cuerpo.destroy();
    e.aviso.destroy();
    e.sombra.destroy();
    if (conDibujo) e.figura.destroy();
    this.enemigos = this.enemigos.filter((o) => o !== e);
  }

  herirEnemigo(e) {
    if (e.entrando) return; // el jefe recién llegado no recibe daño hasta que se planta por primera vez
    e.vida -= 1;
    if (e.vida > 0) {
      sintetizar(this, 'jefe');
      e.imagen.setTintFill(0xffffff);
      this.time.delayedCall(70, () => { if (e.vivo) e.imagen.clearTint(); });
      this.dibujarBarraJefe();
      return;
    }
    // Salta para atrás con el dibujo de herido y se desvanece, como en la versión 1.
    const x = e.cuerpo.x, y = e.cuerpo.y; // donde cae (ahí queda el corazón, si le toca)
    this.quitarEnemigo(e, false);
    const f = e.figura;
    e.imagen.clearTint();
    this.sinPasoDeFrente(e.imagen, e.pieIzq, e.pieDer);
    this.dibujoEnemigo(e, 'herido', Math.random() < 0.5);
    this.tweens.add({ targets: f, y: f.y - 10, duration: 140, ease: 'Quad.Out' });
    this.tweens.add({ targets: f, alpha: 0, y: f.y + 14, angle: Phaser.Math.Between(-15, 15), delay: 220, duration: 380, ease: 'Quad.In', onComplete: () => f.destroy() });
    this.sumarPuntos(e.jefe ? PUNTOS_JEFE : PUNTOS_BANDIDO);
    // El "ouch" del bandido cambia un poco de tono cada vez, para que no canse; el jefe tiene su propio quejido.
    if (e.jefe) this.sound.play('jefe_muerto', { volume: 0.7 });
    else this.sound.play('malo_muerto', { volume: 0.6, detune: Phaser.Math.Between(-250, 150) });
    this.bajas += 1;
    if (this.bajas % BAJAS_POR_CORAZON === 0) this.soltarCorazon(x, y);
    if (e.jefe) {
      this.jefe = null;
      this.etapaJefe = 'derrotado';
      avisarSdk('happytime'); // la página de CrazyGames festeja
      this.dibujarBarraJefe();
      this.time.delayedCall(1200, () => { if (this.etapaJefe === 'derrotado' && !this.enPausa && !this.terminado) this.completarNivel(); });
    }
  }

  dibujarBarraJefe() {
    const g = this.barraJefe.clear();
    this.textoJefe.setVisible(this.jefe !== null);
    if (!this.jefe) return;
    const ancho = 240, x = ANCHO / 2 - ancho / 2, y = 58;
    g.fillStyle(0x000000, 0.6).fillRect(x - 3, y - 3, ancho + 6, 18);
    g.fillStyle(0xd62828, 1).fillRect(x, y, ancho * this.jefe.vida / VIDA_JEFE, 12);
    g.lineStyle(2, 0x000000, 1);
    for (let i = 1; i < VIDA_JEFE; i++) g.lineBetween(x + ancho * i / VIDA_JEFE, y, x + ancho * i / VIDA_JEFE, y + 12);
  }

  // ---------- Bucle ----------

  update(tiempo, delta) {
    if (this.terminado || this.enPausa) {
      this.jugador.body.setVelocity(0, 0);
      for (const e of this.enemigos) e.cuerpo.body.setVelocity(0, 0);
      return;
    }
    const dt = delta / 1000;
    const disparando = this.leerControles(tiempo);

    if (this.municion === 0 && tiempo >= this.recargandoHasta) this.municion = BALAS_TAMBOR;
    if (Phaser.Input.Keyboard.JustDown(this.teclas.R) && this.municion > 0 && this.municion < BALAS_TAMBOR) this.recargar(tiempo);
    if (disparando && tiempo >= this.rodandoHasta && this.escopeta > 0) {
      if (tiempo - this.ultimoDisparo >= CADENCIA_ESCOPETA_MS) {
        this.ultimoDisparo = tiempo;
        this.escopeta -= 1;
        this.disparar(true);
      }
    } else if (disparando && tiempo >= this.rodandoHasta && this.municion > 0 && tiempo - this.ultimoDisparo >= CADENCIA_MS) {
      this.ultimoDisparo = tiempo;
      this.municion -= 1;
      this.disparar();
      if (this.municion === 0) this.recargar(tiempo);
    }

    if (this.enemigos.filter((e) => !e.jefe && e.casa < 0).length < this.maximoEnemigos() && tiempo >= this.proximaAparicion) {
      const p = this.puntoDeAparicion();
      if (p) this.crearEnemigo(p[0], p[1]);
      this.proximaAparicion = tiempo + this.esperaAparicion();
    }

    this.moverEnemigos(tiempo);
    for (const e of this.enemigos) this.animarEnemigo(e, dt);
    this.moverMisBalas(dt);
    this.moverBalas(dt, tiempo);
    this.juntarEstrellas();
    this.revisarPremios();
    this.revisarTechos();
    this.dibujarJugador(tiempo);
    this.dibujarFlechas();
    this.refrescarHud();
  }

  // Devuelve true si el jugador está pidiendo disparar.
  leerControles(tiempo) {
    let dx = 0, dy = 0, disparando = false;
    const k = this.teclas;
    if (k.A.isDown || k.LEFT.isDown) dx -= 1;
    if (k.D.isDown || k.RIGHT.isDown) dx += 1;
    if (k.W.isDown || k.UP.isDown) dy -= 1;
    if (k.S.isDown || k.DOWN.isDown) dy += 1;

    if (this.usaTactil) {
      const punteros = [this.input.pointer1, this.input.pointer2, this.input.pointer3];
      const pj = punteros.find((p) => p && p.isDown && p.id === this.joyPunteroId);
      if (pj) {
        const c = this.moverPerilla(this.joyPerilla, JOY_X, JOY_Y, pj);
        if (Math.hypot(c.x, c.y) > 0.2) { dx = c.x; dy = c.y; }
      }
      const pa = punteros.find((p) => p && p.isDown && p.id === this.apuntaPunteroId);
      this.apuntaBase.setFillStyle(0xff4444, pa ? 0.35 : 0.18);
      if (pa) {
        disparando = true;
        const c = this.moverPerilla(this.apuntaPerilla, APUNTA_X, APUNTA_Y, pa);
        if (Math.hypot(c.x, c.y) > APUNTA_MUERTA) this.angulo = this.ayudarPunteria(Math.atan2(c.y, c.x));
      }
    } else {
      const m = this.input.mousePointer;
      this.mira.setPosition(m.x / ZOOM, m.y / ZOOM);
      const mundo = this.cameras.main.getWorldPoint(m.x, m.y);
      const h = this.hombro();
      this.angulo = Phaser.Math.Angle.Between(h.x, h.y, mundo.x, mundo.y);
      if (!m.leftButtonDown()) this.esperarSoltar = false;
      else if (!this.esperarSoltar) disparando = true;
    }

    // La velocidad no aumenta en diagonal (y con el joystick, inclinarlo poco camina más lento).
    const largo = Math.hypot(dx, dy);
    const factor = largo > 1 ? 1 / largo : 1;
    if (largo > 0) this.ultimaDir = { x: dx / largo, y: dy / largo };

    if (this.pedirRol) {
      this.pedirRol = false;
      if (tiempo >= this.rolListo) {
        // Rueda hacia donde camina; quieto, hacia donde apunta.
        this.rolDir = largo > 0 ? { x: dx / largo, y: dy / largo } : { x: Math.cos(this.angulo), y: Math.sin(this.angulo) };
        this.rodandoHasta = tiempo + ROL_MS;
        this.rolListo = this.rodandoHasta + ROL_ESPERA_MS;
      }
    }
    if (tiempo < this.rodandoHasta) {
      const v = ROL_DISTANCIA / (ROL_MS / 1000);
      this.jugador.body.setVelocity(this.rolDir.x * v, this.rolDir.y * v);
      return false;
    }
    this.jugador.body.setVelocity(dx * factor * VELOCIDAD_JUGADOR, dy * factor * VELOCIDAD_JUGADOR);
    return disparando;
  }

  // Ayuda de puntería del celular: si el joystick apunta cerca de un enemigo a la vista (hasta AYUDA_PUNTERIA), el brazo
  // se corrige justo hacia él. No elige objetivos por su cuenta ni apunta a través de las paredes.
  ayudarPunteria(angulo) {
    const j = this.jugador;
    let mejor = null;
    for (const e of this.enemigos) {
      if (!e.vivo || e.entrando || !lineaLibre(j.x, j.y, e.cuerpo.x, e.cuerpo.y)) continue;
      const a = Phaser.Math.Angle.Between(j.x, j.y, e.cuerpo.x, e.cuerpo.y);
      const diferencia = Math.abs(Phaser.Math.Angle.Wrap(a - angulo));
      if (diferencia <= AYUDA_PUNTERIA && (!mejor || diferencia < mejor.diferencia)) mejor = { a, diferencia };
    }
    return mejor ? mejor.a : angulo;
  }

  // El dibujo mira hacia donde apunta: de frente, de espaldas o de perfil. De perfil y caminando mueve las piernas como en
  // la versión 1; de frente o de espaldas, se balancea. El brazo con el revólver gira hacia la mira.
  dibujarJugador(tiempo) {
    const j = this.jugador;
    const f = this.figura;
    const rodando = tiempo < this.rodandoHasta;
    const parpadea = tiempo < this.invulnerableHasta && Math.floor(tiempo / 90) % 2 === 0;
    f.setAlpha(parpadea ? 0.3 : 1);
    const v = j.body.velocity;
    const rapidez = Math.hypot(v.x, v.y);
    const avance = rapidez * this.game.loop.delta / 1000 / ESCALA_VAQUERO; // en medidas de la versión 1
    f.setPosition(j.x, j.y - CENTRO_VAQUERO * ESCALA_VAQUERO).setDepth(profundidad(j.x, j.y, ALTO_VAQUERO));
    this.sombraJugador.setPosition(j.x, j.y + ALTO_VAQUERO / 2 - 4);
    let rebote = 0;
    f.angle = 0;
    if (rodando) {
      // Hecho bolita, girando hacia donde rueda.
      this.sinPasoDeFrente(this.cuerpoJugador, this.pieIzq, this.pieDer);
      this.ponerPose('rol_bolita', this.rolDir.x < 0);
      this.brazo.setVisible(false);
      const progreso = 1 - (this.rodandoHasta - tiempo) / ROL_MS;
      f.angle = 360 * progreso * (this.rolDir.x < 0 ? -1 : 1);
      return;
    }
    this.brazo.setVisible(true);
    const vista = vistaSegun(this.angulo, this.vistaJugador);
    this.vistaJugador = vista;
    const izquierda = Math.cos(this.angulo) < 0;
    if (vista === 'costado') {
      this.sinPasoDeFrente(this.cuerpoJugador, this.pieIzq, this.pieDer);
      this.ponerPose('correr_cuerpo', izquierda);
      const mirada = izquierda ? -1 : 1;
      let lejos, cerca;
      if (rapidez > 10) {
        // Si camina hacia el lado contrario al que mira, va de espaldas: el ciclo va al revés.
        const sentido = Math.abs(v.x) > 5 && Math.sign(v.x) !== mirada ? -1 : 1;
        this.faseCarrera = Phaser.Math.Wrap(this.faseCarrera + sentido * avance / PASO * Math.PI, 0, Math.PI * 2);
        lejos = calcularPierna(this.faseCarrera + Math.PI, PIERNA_VAQUERO);
        cerca = calcularPierna(this.faseCarrera, PIERNA_VAQUERO);
      } else {
        lejos = calcularPierna(Math.PI * 1.5, PIERNA_QUIETO);
        cerca = calcularPierna(Math.PI * 0.5, PIERNA_QUIETO);
      }
      rebote = TOBILLO_PISO - Math.max(lejos.tobillo.y, cerca.tobillo.y);
      dibujarPierna(this.piernaLejos, this.botaLejos, lejos, 0x121216, PIERNA_VAQUERO, rebote);
      dibujarPierna(this.piernaCerca, this.botaCerca, cerca, 0x24242a, PIERNA_VAQUERO, rebote);
      this.brazo.setPosition(izquierda ? -HOMBRO_PERFIL_X : HOMBRO_PERFIL_X, HOMBRO_PERFIL_Y + rebote);
    } else {
      const frente = vista === 'frente';
      this.ponerPose(frente ? this.texturaO('vaquero_frente', 'jugador_espalda') : 'jugador_espalda', false);
      if (rapidez > 10) {
        this.faseCarrera = Phaser.Math.Wrap(this.faseCarrera + avance / PASO * Math.PI, 0, Math.PI * 2);
        f.angle = Math.sin(this.faseCarrera) * 2;
        this.pasoDeFrente(this.cuerpoJugador, this.pieIzq, this.pieDer, this.faseCarrera, 12, 40);
      } else {
        this.sinPasoDeFrente(this.cuerpoJugador, this.pieIzq, this.pieDer);
      }
      // De espaldas, el brazo derecho queda a la derecha de la pantalla; de frente, a la izquierda.
      this.brazo.setPosition(frente ? -HOMBRO_X : HOMBRO_X, HOMBRO_Y + rebote);
    }
    this.cuerpoJugador.y = 40 + rebote;
    this.brazo.rotation = this.angulo;
    // Apuntando a la izquierda el dibujo del brazo quedaría dado vuelta (revólver abajo): se espeja.
    this.brazo.scaleY = izquierda ? -1 : 1;
  }

  // Dónde está el hombro y dónde la boca del caño, en el mundo.
  hombro() {
    const f = this.figura;
    return { x: f.x + this.brazo.x * ESCALA_VAQUERO, y: f.y + this.brazo.y * ESCALA_VAQUERO };
  }

  bocaDelCano() {
    const h = this.hombro();
    const a = this.angulo;
    const bocaY = BOCA_CANO_Y * (Math.cos(a) < 0 ? -1 : 1);
    return { x: h.x + (Math.cos(a) * LARGO_BRAZO - Math.sin(a) * bocaY) * ESCALA_VAQUERO, y: h.y + (Math.sin(a) * LARGO_BRAZO + Math.cos(a) * bocaY) * ESCALA_VAQUERO };
  }

  // Flechas en el borde de la pantalla hacia lo que hay que buscar: la estrella más cercana, o el jefe.
  dibujarFlechas() {
    const g = this.flechas.clear();
    const vista = this.cameras.main.worldView;
    const j = this.jugador;
    let objetivo = null, color = COLOR.estrella;
    if (this.jefe) { objetivo = this.jefe.cuerpo; color = 0xff3030; }
    else if (this.estrellas.length) {
      objetivo = this.estrellas.reduce((a, b) => (Phaser.Math.Distance.Between(j.x, j.y, a.x, a.y) < Phaser.Math.Distance.Between(j.x, j.y, b.x, b.y) ? a : b));
    }
    if (!objetivo || vista.contains(objetivo.x, objetivo.y)) return;
    const ang = Phaser.Math.Angle.Between(j.x, j.y, objetivo.x, objetivo.y);
    // Punto del borde (con margen) en esa dirección, desde el centro de la pantalla. Arriba el margen es más grande,
    // para que la flecha quede debajo de las tablas del marcador y no tapada por ellas.
    const cx = ANCHO / 2, cy = ALTO_VISTO / 2;
    const izq = 40, der = ANCHO - 40, arriba = 100, abajo = ALTO_VISTO - 40;
    const dx = Math.cos(ang), dy = Math.sin(ang);
    const tx = dx > 0 ? (der - cx) / dx : dx < 0 ? (izq - cx) / dx : Infinity;
    const ty = dy > 0 ? (abajo - cy) / dy : dy < 0 ? (arriba - cy) / dy : Infinity;
    const t = Math.min(tx, ty);
    const px = cx + Math.cos(ang) * t, py = cy + Math.sin(ang) * t;
    const punta = (a, d) => [px + Math.cos(a) * d, py + Math.sin(a) * d];
    const [ax, ay] = punta(ang, 18), [bx, by] = punta(ang + 2.5, 16), [ccx, ccy] = punta(ang - 2.5, 16);
    g.fillStyle(color, 1).lineStyle(3, 0x000000, 1);
    g.fillTriangle(ax, ay, bx, by, ccx, ccy).strokeTriangle(ax, ay, bx, by, ccx, ccy);
  }

  disparar(conEscopeta = false) {
    const j = this.jugador;
    const { x, y } = this.bocaDelCano();
    if (conEscopeta) this.sound.play('escopeta', { volume: 0.55 });
    else this.sound.play('revolver', { volume: 0.5, detune: Phaser.Math.Between(-80, 80) }); // un poco distinto cada vez
    // Pegado a una pared o a un mueble, la punta del arma queda del otro lado: el tiro suena y pega ahí mismo, sin
    // bala que vuele. Si lo que tiene adelante es una caja fuerte cerrada, la abre igual.
    if (!lineaLibre(j.x, j.y, x, y)) {
      const tramo = new Phaser.Geom.Line(j.x, j.y, x, y);
      const caja = this.cajas.find((c) => !c.abierta && Phaser.Geom.Intersects.LineToRectangle(tramo, c.rect));
      if (caja) this.abrirCaja(caja);
      return;
    }
    for (const desvio of conEscopeta ? [-ABANICO_ESCOPETA, 0, ABANICO_ESCOPETA] : [0]) {
      const a = this.angulo + desvio;
      const forma = this.add.circle(x, y, 4, COLOR.balaMia).setStrokeStyle(1, 0x000000).setDepth(9.95);
      this.misBalas.push({ forma, vx: Math.cos(a) * VELOCIDAD_BALA, vy: Math.sin(a) * VELOCIDAD_BALA });
    }
  }

  recargar(tiempo) {
    this.sound.play('recarga', { volume: 0.7 });
    this.municion = 0;
    this.recargandoHasta = tiempo + RECARGA_MS;
  }

  // Fuera del mapa, o con una pared en el tramo que recorrió desde (x0, y0): así ninguna pared fina se saltea.
  fueraOMuro(x, y, x0 = x, y0 = y) {
    return x < 0 || y < 0 || x > MUNDO_W || y > MUNDO_H || dentroDeMuro(x, y) || !lineaLibre(x0, y0, x, y);
  }

  moverMisBalas(dt) {
    for (const b of this.misBalas) {
      if (!b.forma.active) continue;
      // En dos medios pasos, para que una bala rápida no saltee a un enemigo o una pared fina.
      for (let paso = 0; paso < 2 && b.forma.active; paso++) {
        const x0 = b.forma.x, y0 = b.forma.y;
        b.forma.x += b.vx * dt / 2;
        b.forma.y += b.vy * dt / 2;
        if (this.fueraOMuro(b.forma.x, b.forma.y, x0, y0)) {
          const tramo = new Phaser.Geom.Line(x0, y0, b.forma.x, b.forma.y);
          const caja = this.cajas.find((c) => !c.abierta && (c.rect.contains(b.forma.x, b.forma.y) || Phaser.Geom.Intersects.LineToRectangle(tramo, c.rect)));
          if (caja) this.abrirCaja(caja);
          b.forma.destroy();
          break;
        }
        // En el celular el impacto cuenta un poco más lejos: con el pulgar se apunta peor que con el mouse.
        const margen = this.usaTactil ? 12 : 4; // en el celular, 15 % más de alcance que antes (radio + margen: 23 → 26)
        const e = this.enemigos.find((o) => o.vivo && Phaser.Math.Distance.Between(o.cuerpo.x, o.cuerpo.y, b.forma.x, b.forma.y) < o.radio + margen);
        if (e) { b.forma.destroy(); this.herirEnemigo(e); }
      }
    }
    this.misBalas = this.misBalas.filter((b) => b.forma.active);
  }

  moverBalas(dt, tiempo) {
    const j = this.jugador;
    for (const b of this.balas) {
      if (!b.forma.active) continue;
      const x0 = b.forma.x, y0 = b.forma.y;
      b.forma.x += b.vx * dt;
      b.forma.y += b.vy * dt;
      if (this.fueraOMuro(b.forma.x, b.forma.y, x0, y0)) { b.forma.destroy(); continue; }
      const toca = Phaser.Math.Distance.Between(j.x, j.y, b.forma.x, b.forma.y) < RADIO_JUGADOR + 5;
      if (toca && tiempo >= this.invulnerableHasta && tiempo >= this.rodandoHasta && this.etapaJefe !== 'derrotado') {
        b.forma.destroy();
        this.recibirDisparo(tiempo);
      }
    }
    this.balas = this.balas.filter((b) => b.forma.active);
  }

  // ---------- Caja fuerte y escopeta ----------

  // La caja fuerte del banco se abre de un tiro: se sacude, queda con la puerta abierta y suelta una escopeta hacia el
  // medio del banco. Se vuelve a cerrar en el nivel siguiente.
  abrirCaja(caja) {
    caja.abierta = true;
    const img = caja.img;
    const ancho = img.displayWidth, alto = img.displayHeight, cx = img.x, base = img.y;
    this.tweens.add({ targets: img, x: cx + 3, duration: 40, yoyo: true, repeat: 3 });
    const g = this.add.graphics().setDepth(img.depth + 0.00001);
    g.fillStyle(0x161616, 1).lineStyle(2, 0x000000, 1);
    g.fillRect(cx - ancho * 0.32, base - alto * 0.74, ancho * 0.64, alto * 0.58).strokeRect(cx - ancho * 0.32, base - alto * 0.74, ancho * 0.64, alto * 0.58);
    g.fillStyle(0xd9a43b, 1).fillCircle(cx - ancho * 0.12, base - alto * 0.22, 3).fillCircle(cx + ancho * 0.05, base - alto * 0.22, 3).fillCircle(cx - ancho * 0.03, base - alto * 0.27, 3);
    // La puerta, abierta hacia un costado.
    g.fillStyle(0x6a6a72, 1).lineStyle(2, 0x111111, 1);
    g.fillRect(cx + ancho * 0.32, base - alto * 0.78, ancho * 0.16, alto * 0.66).strokeRect(cx + ancho * 0.32, base - alto * 0.78, ancho * 0.16, alto * 0.66);
    caja.extras.push(g);
    // La escopeta sale volando hacia el medio del banco.
    const c = CASAS[caja.casa];
    const desde = { x: caja.rect.centerX, y: caja.rect.centerY };
    const ang = Phaser.Math.Angle.Between(desde.x, desde.y, c.x + c.w / 2, c.y + c.h / 2);
    const destino = { x: desde.x + Math.cos(ang) * 60, y: desde.y + Math.sin(ang) * 60 };
    const forma = this.add.image(desde.x, desde.y, 'escopeta').setDepth(4.6).setScale(ESCALA_ESCOPETA * 0.3);
    this.tweens.add({ targets: forma, x: destino.x, y: destino.y, scale: ESCALA_ESCOPETA, duration: 450, ease: 'Back.Out' });
    this.tweens.add({ targets: forma, angle: { from: -8, to: 8 }, duration: 700, yoyo: true, repeat: -1, delay: 450 });
    this.premios.push({ forma, tipo: 'escopeta' });
    this.cameras.main.shake(120, 0.004);
    sintetizar(this, 'caja');
  }

  // Corazón en el piso, latiendo para que se vea.
  soltarCorazon(x, y) {
    if (!this.textures.exists('premio_corazon')) {
      const g = this.make.graphics({ add: false });
      dibujarCorazon(g, 18, 18, 15, true);
      g.generateTexture('premio_corazon', 36, 34);
      g.destroy();
    }
    const forma = this.add.image(x, y, 'premio_corazon').setDepth(4.6).setScale(0.3);
    this.tweens.add({ targets: forma, scale: 1, duration: 300, ease: 'Back.Out' });
    this.tweens.add({ targets: forma, scale: 1.15, duration: 420, yoyo: true, repeat: -1, delay: 300 });
    this.premios.push({ forma, tipo: 'corazon' });
  }

  // Se agarra pasando por encima. El corazón, solo si falta energía (si no, queda para después).
  revisarPremios() {
    const j = this.jugador;
    for (const p of this.premios) {
      if (!p.forma.active || Phaser.Math.Distance.Between(p.forma.x, p.forma.y, j.x, j.y) > RADIO_JUGADOR + 22) continue;
      if (p.tipo === 'corazon' && this.energia >= ENERGIA) continue;
      this.tweens.killTweensOf(p.forma);
      p.forma.destroy();
      sintetizar(this, 'premio');
      if (p.tipo === 'corazon') {
        this.energia += 1;
        this.textoFlotante(j.x, j.y - ALTO_VAQUERO / 2, T.premioCorazon, '#ff7a6a');
      } else {
        this.escopeta = ESCOPETA_TIROS;
        this.textoFlotante(j.x, j.y - ALTO_VAQUERO / 2, T.premioEscopeta(ESCOPETA_TIROS), '#ffe9b0');
      }
    }
    this.premios = this.premios.filter((p) => p.forma.active);
  }

  textoFlotante(x, y, texto, color) {
    const t = this.add.text(x, y, texto, { fontFamily: FUENTE, fontSize: '22px', color, stroke: '#2b160a', strokeThickness: 5 })
      .setOrigin(0.5).setDepth(25);
    this.tweens.add({ targets: t, y: y - 40, alpha: 0, delay: 350, duration: 700, onComplete: () => t.destroy() });
  }

  // Nivel nuevo: las cajas vuelven a estar cerradas y no queda ninguna escopeta tirada.
  cerrarCajas() {
    for (const caja of this.cajas) {
      caja.abierta = false;
      for (const o of caja.extras) o.destroy();
      caja.extras = [];
    }
    for (const p of this.premios) { this.tweens.killTweensOf(p.forma); p.forma.destroy(); }
    this.premios = [];
  }

  // ---------- Puntos, vidas y pausas ----------

  sumarPuntos(n) {
    const antes = this.puntos;
    this.puntos += n;
    if (this.puntos > leerRecord()) guardarRecord(this.puntos);
    if (Math.floor(this.puntos / PUNTOS_VIDA_EXTRA) > Math.floor(antes / PUNTOS_VIDA_EXTRA)) {
      this.vidas += 1;
      sintetizar(this, 'vidaExtra');
      this.avisar(T.vidaExtra, 1200, '#7dff6a');
    }
  }

  recibirDisparo(tiempo) {
    sintetizar(this, 'teDieron');
    this.energia -= 1;
    this.invulnerableHasta = tiempo + 1300;
    this.cameras.main.shake(150, 0.008);
    if (this.energia <= 0) this.perderVida();
  }

  // Al perder una vida se vuelve al centro del pueblo con la calle limpia. Las estrellas juntadas se mantienen;
  // si fue peleando con el jefe, el jefe vuelve a aparecer con la vida completa.
  perderVida() {
    this.vidas -= 1;
    if (this.vidas <= 0) { this.terminar(); return; }
    sintetizar(this, 'vidaPerdida');
    const conJefe = this.etapaJefe === 'pelea';
    this.energia = ENERGIA;
    this.municion = BALAS_TAMBOR;
    this.recargandoHasta = 0;
    this.escopeta = 0; // la escopeta se pierde con la vida
    this.pausar(T.teDieron, '#ff5a3c', T.vidaPerdida(this.vidas, conJefe, this.puntos));
    this.alSeguir = () => {
      this.jugador.setPosition(INICIO.x, INICIO.y);
      this.limpiarEnemigos();
      this.poblarCasas();
      this.proximaAparicion = this.time.now + 1500;
      if (conJefe) { this.etapaJefe = null; this.empezarJefe(); }
    };
  }

  completarNivel() {
    sintetizar(this, 'nivel');
    const superado = this.nivel;
    this.nivel += 1;
    this.energia = ENERGIA;
    this.pausar(T.nivelSuperado(superado), '#ffd23f', T.resumenNivel(this.puntos, this.vidas, this.nivel));
    this.alSeguir = () => {
      this.jugador.setPosition(INICIO.x, INICIO.y);
      this.empezarNivel();
    };
  }

  pausar(titulo, color, datos, conAviso = true) {
    this.enPausa = true;
    avisarSdk('gameplayStop');
    this.pausaDesde = this.time.now;
    for (const b of this.balas.concat(this.misBalas)) b.forma.destroy();
    this.balas = [];
    this.misBalas = [];
    this.tituloPausa.setText(titulo).setColor(color);
    this.datosPausa.setText(datos);
    this.seguirPausa.setText('');
    this.pantallaPausa.setVisible(true);
    this.mira.setVisible(false);
    this.game.canvas.style.cursor = 'default';
    this.time.delayedCall(600, () => { if (this.enPausa) this.seguirPausa.setText(T.seguir); });
    if (conAviso) this.pedirAviso();
  }

  // Mientras CrazyGames decide si muestra un aviso, no se puede seguir (lo pide su reglamento). Después del aviso, la
  // pausa corta de siempre antes de poder tocar, para que un toque apurado no siga de largo.
  pedirAviso() {
    this.esperandoAviso = true;
    publicidadEntrePartes(this, () => { this.esperandoAviso = false; this.pausaDesde = this.time.now; });
  }

  // Pasaron los 10 segundos del botón del video sin tocarlo: vuelve a la portada.
  volverAlInicio() {
    this.scene.start('portada');
  }

  // Botón del video con premio, dentro del cartel de madera. Solo se muestra en el fin del juego.
  armarBotonVideo(contenedor, cx) {
    const g = this.add.graphics();
    g.fillStyle(0x2f7d32, 1).lineStyle(3, 0x14361a, 1);
    g.fillRoundedRect(-BOTON_VIDEO_MEDIO, -28, BOTON_VIDEO_MEDIO * 2, 56, 12).strokeRoundedRect(-BOTON_VIDEO_MEDIO, -28, BOTON_VIDEO_MEDIO * 2, 56, 12);
    g.fillStyle(0xffffff, 1).fillTriangle(-206, -14, -206, 14, -182, 0); // el "play"
    g.fillStyle(0x14361a, 1).fillCircle(196, 0, 19);                     // donde corre la cuenta regresiva
    this.textoBotonVideo = this.add.text(-2, 0, '', { fontFamily: FUENTE, fontSize: '22px', color: '#ffffff', stroke: '#14361a', strokeThickness: 4 }).setOrigin(0.5);
    this.cuentaBotonVideo = this.add.text(196, 1, '', { fontFamily: FUENTE, fontSize: '20px', color: '#ffd23f' }).setOrigin(0.5);
    this.botonVideo = this.add.container(cx, BOTON_VIDEO_Y, [g, this.textoBotonVideo, this.cuentaBotonVideo]).setVisible(false);
    this.botonVideo.setScrollFactor(0, 0, true);
    this.botonVideoX = cx;
    contenedor.add(this.botonVideo);
  }

  // El cartel se achica y se corre en el celular: se pasa el toque a medidas del cartel.
  tocaBotonVideo(p) {
    if (!this.botonVideo.visible || this.botonVideo.alpha < 1) return false;
    const escala = ALTO_VISTO / ALTO;
    const x = (p.x / ZOOM - ANCHO * (1 - escala) / 2) / escala;
    const y = p.y / ZOOM / escala;
    return Math.abs(x - this.botonVideoX) < BOTON_VIDEO_MEDIO && Math.abs(y - BOTON_VIDEO_Y) < 28;
  }

  // En el fin del juego, una vez por partida, se ofrece el video para seguir. Si no se ofrece, va el aviso común:
  // CrazyGames no deja ofrecer los dos en la misma pantalla. El botón espera 10 segundos: si no se toca, vuelve al inicio.
  ofrecerVideoOAviso() {
    if (SDK_CRAZY.listo && !SDK_CRAZY.sinAvisos && !this.usoVideoVidas) {
      this.textoBotonVideo.setText(T.videoVidas);
      this.botonVideo.setVisible(true).setAlpha(1);
      let quedan = ESPERA_VIDEO_S;
      this.cuentaBotonVideo.setText(String(quedan));
      this.relojVideo = this.time.addEvent({ delay: 1000, repeat: ESPERA_VIDEO_S - 1, callback: () => {
        quedan -= 1;
        this.cuentaBotonVideo.setText(String(quedan));
        if (quedan === 0 && this.terminado && !this.esperandoAviso) this.volverAlInicio();
      } });
    } else this.pedirAviso();
  }

  pedirVideoVidas() {
    sintetizar(this, 'clic');
    if (this.relojVideo) this.relojVideo.remove();
    this.cuentaBotonVideo.setText('');
    this.usoVideoVidas = true;
    this.esperandoAviso = true;
    videoConPremio(this, () => {
      this.esperandoAviso = false;
      this.botonVideo.setVisible(false);
      this.seguirConVidasExtra();
    }, () => {
      this.esperandoAviso = false;
      this.textoBotonVideo.setText(T.sinVideo);
      this.botonVideo.setAlpha(0.6);
      this.time.delayedCall(1500, () => this.botonVideo.setVisible(false));
    });
  }

  // Vio el video entero: vuelve con 3 vidas y la energía llena, en el mismo nivel, con las mismas estrellas y puntos
  // (como al perder una vida: si estaba peleando con el jefe, vuelve el jefe).
  seguirConVidasExtra() {
    this.terminado = false;
    const conJefe = this.etapaJefe === 'pelea';
    this.vidas = VIDAS_POR_VIDEO;
    this.energia = ENERGIA;
    this.municion = BALAS_TAMBOR;
    this.recargandoHasta = 0;
    this.escopeta = 0;
    this.pausar(T.deVuelta, '#ffd23f', T.deVueltaDatos(this.vidas, this.nivel, this.puntos), false);
    this.alSeguir = () => {
      this.jugador.setPosition(INICIO.x, INICIO.y);
      this.limpiarEnemigos();
      this.poblarCasas();
      this.proximaAparicion = this.time.now + 1500;
      if (conJefe) { this.etapaJefe = null; this.empezarJefe(); }
    };
  }

  intentarContinuar() {
    if (!this.enPausa || this.esperandoAviso || this.time.now - this.pausaDesde < 600) return;
    sintetizar(this, 'clic');
    this.enPausa = false;
    avisarSdk('gameplayStart');
    this.pantallaPausa.setVisible(false);
    if (!this.usaTactil) this.mira.setVisible(true);
    this.game.canvas.style.cursor = 'none';
    this.ultimoDisparo = this.time.now;
    this.esperarSoltar = true;
    if (this.alSeguir) { const f = this.alSeguir; this.alSeguir = null; f(); }
  }

  limpiarEnemigos() {
    for (const e of [...this.enemigos]) this.quitarEnemigo(e);
    this.jefe = null;
    this.dibujarBarraJefe();
    for (const b of this.balas.concat(this.misBalas)) b.forma.destroy();
    this.balas = [];
    this.misBalas = [];
  }

  limpiar() {
    this.limpiarEnemigos();
    for (const s of this.estrellas) s.destroy();
    this.estrellas = [];
    for (const m of this.marcas) m.setVisible(false);
  }

  avisar(texto, ms, color = '#ffffff') {
    this.textoCentro.setText(texto).setColor(color);
    if (this.avisoTimer) this.avisoTimer.remove();
    this.avisoTimer = this.time.delayedCall(ms, () => this.textoCentro.setText(''));
  }

  refrescarHud() {
    const firma = [this.vidas, this.energia, this.municion, this.escopeta, this.estrellasJuntadas, this.totalEstrellas, this.puntos, this.nivel, !!this.jefe].join(',');
    if (firma === this.firmaHud) return;
    this.firmaHud = firma;
    const g = this.hudG.clear();
    dibujarTabla(g, 8, 6, 384, 40);
    dibujarTabla(g, ANCHO - 230, 6, 222, 70);
    for (let i = 0; i < ENERGIA; i++) dibujarCorazon(g, 32 + i * 30, 26, 11, i < this.energia);
    // Vidas: un sombrerito y la cantidad.
    g.fillStyle(0x3d3d44, 1).lineStyle(2, 0x111111, 1);
    g.fillEllipse(130, 30, 30, 9).strokeEllipse(130, 30, 30, 9);
    g.fillRoundedRect(122, 17, 16, 13, 4).strokeRoundedRect(122, 17, 16, 13, 4);
    this.hudVidas.setText(`x${this.vidas}`);
    // Munición: la escopeta con sus tiros, o las balas del tambor, o el aviso de recarga.
    this.hudEscopeta.setVisible(this.escopeta > 0);
    if (this.escopeta > 0) {
      this.hudMunicion.setText(`x${this.escopeta}`).setX(270);
    } else if (this.municion === 0) {
      this.hudMunicion.setX(214);
      this.hudMunicion.setText(T.recargar);
    } else {
      for (let i = 0; i < BALAS_TAMBOR; i++) {
        const x = 220 + i * 16;
        g.fillStyle(i < this.municion ? 0xd9a43b : 0x4a3220, 1).lineStyle(2, 0x2b160a, 1);
        g.fillRoundedRect(x, 15, 9, 20, { tl: 4, tr: 4, bl: 1, br: 1 }).strokeRoundedRect(x, 15, 9, 20, { tl: 4, tr: 4, bl: 1, br: 1 });
      }
      this.hudMunicion.setText('').setX(214);
    }
    // Estrellas juntadas, al centro (con el jefe en la calle, ahí va su barra de vida).
    this.hudEstrellas.setVisible(!this.jefe);
    if (!this.jefe) {
      dibujarTabla(g, ANCHO / 2 - 66, 6, 132, 40);
      dibujarEstrella(g, ANCHO / 2 - 28, 26, 13);
      this.hudEstrellas.setText(`${this.estrellasJuntadas}/${this.totalEstrellas}`);
    }
    this.hudPuntos.setText(T.puntosHud(this.puntos));
    this.hudNivel.setText(T.nivelHud(this.nivel));
  }

  terminar() {
    this.terminado = true;
    avisarSdk('gameplayStop');
    sintetizar(this, 'finJuego');
    this.figura.setAlpha(1);
    this.mira.setVisible(false);
    this.game.canvas.style.cursor = 'default';
    if (this.avisoTimer) this.avisoTimer.remove();
    const nuevo = this.puntos > this.recordAlEmpezar;
    this.textoCentro.setText('');
    this.limpiarEnemigos();
    this.refrescarHud();
    // El mismo cartel de madera de las pausas, con el puntaje.
    this.tituloPausa.setText(T.finTitulo).setColor('#ff5a3c');
    this.datosPausa.setText(T.finDatos(this.puntos, nuevo));
    this.seguirPausa.setText('');
    this.pantallaPausa.setVisible(true);
    this.time.delayedCall(600, () => this.seguirPausa.setText(T.volverAJugar));
    this.ofrecerVideoOAviso();
  }
}

// El juego arranca cuando la tipografía ya cargó; si falla o tarda más de 3 segundos, arranca igual.
// Ojo: antes de arrancar, window.juego es el <div id="juego"> (el navegador expone los id como variables).
const yaArranco = () => window.juego instanceof Phaser.Game;
const arrancar = () => {
  if (yaArranco()) return;
  window.juego = new Phaser.Game(CONFIG);
  revisarOrientacion();
};
const CONFIG = {
  type: Phaser.AUTO,
  parent: 'juego',
  width: ANCHO * ZOOM,
  height: ALTO_VISTO * ZOOM,
  backgroundColor: '#000000',
  physics: { default: 'arcade', arcade: { debug: false } },
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  input: { activePointers: 3 },
  scene: [Portada, Juego],
};

// En el celular se juega acostado: en vertical se tapa el juego con un aviso y se pausa hasta que lo giren.
const avisoGirar = document.createElement('div');
avisoGirar.id = 'girar';
avisoGirar.textContent = `↻\n${T.girar}`;
document.body.appendChild(avisoGirar);
const enVertical = window.matchMedia('(orientation: portrait) and (pointer: coarse)');
function revisarOrientacion() {
  avisoGirar.style.display = enVertical.matches ? 'flex' : 'none';
  if (!yaArranco()) return;
  if (enVertical.matches) window.juego.pause();
  else window.juego.resume();
}
enVertical.addEventListener('change', revisarOrientacion);
revisarOrientacion();
(document.fonts ? document.fonts.load('32px Rye') : Promise.resolve()).then(arrancar, arrancar);
setTimeout(arrancar, 3000);
const trabarHorizontal = () => {
  if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
};
document.addEventListener('pointerdown', () => { if (document.fullscreenElement) trabarHorizontal(); });
// En el celular, suelto, la barra de la dirección del navegador come un pedazo de pantalla: al tocar se pasa a pantalla
// completa (Android sí; el iPhone no lo permite). Tiene que ser al levantar el dedo: al apoyarlo el navegador no deja.
document.addEventListener('pointerup', (ev) => {
  if (ev.pointerType !== 'touch' || !SUELTO || document.fullscreenElement || !document.documentElement.requestFullscreen) return;
  document.documentElement.requestFullscreen({ navigationUI: 'hide' }).then(trabarHorizontal, () => {});
});

