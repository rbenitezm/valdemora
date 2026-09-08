# Valdemora — primera investigación

Fuente: https://giorgiosjd-tech.github.io/Valdemora-/ (copia consultada el 8 de septiembre de 2026).

## Hechos preservados

Las siete pistas y nueve horarios se transcriben en `lib/case.ts`. La fotografía es la pista 4 y se encuentra en el bosque; Hugo oye un ruido metálico a las 00:00. La observación de la puerta no cuenta como una octava prueba.

La resolución original: Samuel había citado a Inés por unos documentos relativos a Valdemora. Una discusión deriva en forcejeo y caída fatal; Inés abandona el lugar por la puerta lateral sin pedir ayuda. No mostrar esta resolución antes de que el jugador pueda deducirla.

Personajes nombrados en el código original: Samuel, Inés Robles, Javier López, Verónica Benítez, María Gómez, Hugo, Laura; animales Django y Ginger. Los nombres adicionales del prototipo visual deben contrastarse con el material gráfico antes de ampliar sus biografías.

## Adaptación de esta entrega

Las tres respuestas de Hugo y la pregunta de deducción son texto nuevo. Se limitan a distinguir una observación de una identificación; no agregan una coartada, ubicación ni sospechoso. El interrogatorio se desbloquea tras relacionar la fotografía y el acceso lateral.

## Alcance jugable

Introducción → mapa → fotografía del bosque → deducción → tres preguntas a Hugo → registrar testimonio → acceso lateral y establos → humedad y pieza metálica → hipótesis del recorrido exterior → cuatro estancias de la casa → siete pruebas → deducción temporal del reloj → declaraciones → reconstrucción → acusación final.

Las descripciones de las estancias son adaptación de los nombres de pistas originales. No se inventa el contenido del documento, la cerradura de la llave ni un análisis del vaso. La deducción temporal sólo establece que las 00:06 caen dentro del apagón, no que sea la hora de la muerte. Las pruebas de la casa requieren completar el exterior; su deducción requiere las siete pruebas. El porcentaje de la interfaz representa pruebas reunidas, no un caso resuelto.

Entrar en una estancia no registra su prueba. Cada habitación tiene una inspección en dos pasos con tres puntos examinables; sólo el reloj, el servicio de mesa, el suelo junto al zócalo y los papeles del escritorio producen los cuatro hallazgos originales. La colocación concreta de esos objetos y las observaciones descartadas son adaptación para convertir la búsqueda en una acción jugable. Una prueba ya guardada permite repetir la inspección.

Los perfiles, secretos y papel de Daniel, Karalee, María Gómez, Inés, Verónica, Javier, María Alejandra, Jhonatan y Jairo proceden de la ficha gráfica original. El texto exacto de sus declaraciones es adaptación. Para sostener la resolución original, la adaptación especifica que Daniel vio discutir a Samuel con Inés, que Karalee sólo distinguió una silueta hacia la zona de servicio y que Inés niega haber usado el acceso lateral. La declaración de María no atribuye destinatario al mensaje. Sólo las cuatro declaraciones clave desbloquean la reconstrucción; las demás explican mentiras sin asociarlas automáticamente a la muerte. La interfaz no distingue unas de otras: la lista muestra las nueve personas sin marcas ni etiquetas, y el contador cuenta declaraciones registradas sobre nueve, para que el jugador decida cuáles importan.

Entre las declaraciones y la reconstrucción hay una fase de confrontación, que es adaptación. Inés sostiene tres afirmaciones y el jugador debe elegir, entre pruebas y declaraciones ya registradas, la que contradice cada una: Daniel la vio discutir con Samuel; el mensaje a María y el documento doblado muestran que Samuel quería hablar de Valdemora; el recorrido exterior muestra que alguien usó la puerta lateral durante el apagón. Inés admite la discusión y su motivo, coherentes con la resolución original, pero no confiesa: ante la puerta lateral guarda silencio, porque el recorrido exterior sigue sin identificar a nadie. Las opciones descartadas explican por qué no rebaten la afirmación. Las partidas anteriores con la reconstrucción hecha conservan su progreso.

La reconstrucción reproduce la resolución del prototipo original: cita por documentos relativos a Valdemora, discusión, caída fatal y salida de Inés sin pedir ayuda. La acusación requiere elegir a Inés, la caída durante la discusión y la huida por la puerta lateral. Una respuesta incorrecta conserva la partida y permite revisar el expediente.

El regalo original de Laura permanece sellado hasta resolver correctamente la acusación. Abrirlo se guarda en la partida. El botón de continuar calcula la siguiente fase pendiente y, tras cerrar el caso, conduce al regalo.

La barra superior mantiene visible ese siguiente paso durante toda la partida. Las zonas todavía bloqueadas del mapa ya no son controles muertos: al pulsarlas llevan al requisito pendiente. En la casa, cada control se etiqueta como entrada a una estancia para distinguir la navegación de la prueba que se registra dentro.

Las secciones bloqueadas del menú lateral (Hugo, Personas, Conclusión y Regalo) tampoco son controles muertos: al pulsarlas llevan al paso pendiente y muestran un aviso con lo que falta para desbloquearlas. El mapa de la finca marca las cuatro zonas sobre la ilustración original; las bloqueadas se muestran con trazo discontinuo y siguen la misma regla.

Las fotografías de las siete pruebas son recortes del panel original (`public/assets/pistas`) y sólo se muestran cuando la prueba queda registrada. Durante una inspección se muestra el plano o el mapa original con la zona señalada; no existen fotografías de los puntos descartados, así que esas observaciones siguen siendo sólo texto.

La segunda deducción es una adaptación: trata el recorrido exterior como hipótesis compatible con las pruebas. No inventa un encaje físico de la pieza en la puerta, una hora para la humedad ni una identificación. Las partidas anteriores se conservan; las zonas exteriores requieren el testimonio registrado y la segunda deducción exige ambas nuevas pruebas.

El acceso lateral y los establos usan una inspección en dos pasos. Entrar en la zona no registra una prueba: el jugador abre la inspección y elige el punto pertinente entre tres opciones. Las observaciones erróneas explican por qué no se incorporan al expediente. Si la prueba ya estaba guardada, la interfaz lo indica expresamente.

Los aciertos y fallos se acompañan de una animación y de un aviso sonoro breve sintetizado con Web Audio (`lib/sound.ts`); no se incluyen archivos de audio. La acusación correcta y la apertura del regalo usan un acorde más largo. El botón de sonido de la cabecera silencia los avisos y la preferencia se guarda en `valdemora-rebuild-sound`. Con `prefers-reduced-motion` las animaciones quedan desactivadas.

Guardado local bajo `valdemora-rebuild-v1`, con validación y recuperación de datos dañados. No migra la clave del prototipo original. Reiniciar requiere confirmación. No se incluye IA en el juego.

## Verificación

`node --experimental-strip-types --test lib/case.test.ts` valida requisitos, duplicados, recuperación y recorrido completo. `npm run build` valida compilación. La vista previa se mantiene local durante esta iteración.
