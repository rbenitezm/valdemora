# Valdemora — primera investigación

Fuente: https://giorgiosjd-tech.github.io/Valdemora-/ (copia consultada el 8 de septiembre de 2026).

## Hechos preservados

Las siete pistas y nueve horarios se transcriben en `lib/case.ts`. La fotografía es la pista 4 y se encuentra en el bosque; Hugo oye un ruido metálico a las 00:00. La observación de la puerta no cuenta como una octava prueba.

La resolución original: Samuel había citado a Inés por unos documentos relativos a Valdemora. Una discusión deriva en forcejeo y caída fatal; Inés abandona el lugar por la puerta lateral sin pedir ayuda. No mostrar esta resolución antes de que el jugador pueda deducirla.

Personajes nombrados en el código original: Samuel, Inés Robles, Javier López, Verónica Benítez, María Gómez, Hugo, Laura; animales Django y Ginger. Los nombres adicionales del prototipo visual deben contrastarse con el material gráfico antes de ampliar sus biografías.

## Adaptación de esta entrega

Las tres respuestas de Hugo y la pregunta de deducción son texto nuevo. Se limitan a distinguir una observación de una identificación; no agregan una coartada, ubicación ni sospechoso. El interrogatorio se desbloquea tras relacionar la fotografía y el acceso lateral.

## Alcance jugable

Introducción → mapa → fotografía del bosque → deducción → tres preguntas a Hugo → registrar testimonio → acceso lateral y establos → humedad y pieza metálica → hipótesis del recorrido exterior. Tres de las siete pruebas están disponibles; las cuatro del interior y la acusación siguen pendientes. El final del recorrido lo indica explícitamente.

La segunda deducción es una adaptación: trata el recorrido exterior como hipótesis compatible con las pruebas. No inventa un encaje físico de la pieza en la puerta, una hora para la humedad ni una identificación. Las partidas anteriores se conservan; las zonas exteriores requieren el testimonio registrado y la segunda deducción exige ambas nuevas pruebas.

Guardado local bajo `valdemora-rebuild-v1`, con validación y recuperación de datos dañados. No migra la clave del prototipo original. Reiniciar requiere confirmación. No se incluye IA en el juego.

## Verificación

`node --experimental-strip-types --test lib/case.test.ts` valida requisitos, duplicados, recuperación y recorrido completo. `npm run build` valida compilación. La vista previa se mantiene local durante esta iteración.
