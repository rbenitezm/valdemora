// Facts transcribed from the original Valdemora prototype. Dialogue is an adaptation.
export const clues = [
  { id: 1, title: 'Reloj detenido a las 00:06', location: 'Salón' },
  { id: 2, title: 'Vaso de agua sin terminar', location: 'Cocina / Comedor' },
  { id: 3, title: 'Pequeña llave', location: 'Pasillo' },
  { id: 4, title: 'Fotografía antigua de Valdemora', location: 'Bosque' },
  { id: 5, title: 'Recibo/documento doblado', location: 'Habitación de Samuel' },
  { id: 6, title: 'Marca de humedad junto a la puerta', location: 'Acceso lateral' },
  { id: 7, title: 'Pieza metálica en el suelo', location: 'Establos' },
] as const;
export const timeline = [
  ['23:47', 'Samuel abandona el comedor.'], ['23:56', 'Las luces parpadean.'],
  ['23:58', 'Apagón.'], ['00:00', 'Hugo escucha un ruido metálico.'],
  ['00:03', 'Django ladra.'], ['00:05', 'Maullidos de Ginger.'],
  ['00:07', 'Se escucha un sonido parecido a un grito.'], ['00:09', 'La luz vuelve.'],
  ['00:17', 'Encuentran a Samuel.'],
] as const;
export const questions = [
  { id: 'sound', question: '¿Qué escuchaste durante el apagón?', answer: 'Un ruido metálico. Fue a medianoche, mientras seguíamos a oscuras. No puedo decirte qué lo produjo.' },
  { id: 'sight', question: '¿Viste a alguien utilizar la puerta lateral?', answer: 'No. Escuchar un ruido no es lo mismo que ver a alguien pasar. No puedo identificar a ninguna persona.' },
  { id: 'photo', question: 'Esta fotografía muestra otro acceso. ¿El ruido prueba que se utilizó?', answer: 'Podría estar relacionado, pero no lo sé. Tendríais que examinar la puerta y averiguar qué pudo hacer ese sonido.' },
] as const;
export const rooms = [
  { id: 1, name: 'Salón', title: 'El salón en silencio', description: 'La estancia quedó como estaba al terminar la noche. Recorre sus puntos principales antes de interpretar nada.', caution: 'La hora que muestra no demuestra por sí sola cuándo ni por qué se detuvo.', spots: [
    { label: 'La chimenea', message: 'Hay ceniza fría, pero nada permite relacionarla con los hechos.', correct: false },
    { label: 'La mesa central', message: 'Los objetos de la mesa no aportan una observación verificable al caso.', correct: false },
    { label: 'El reloj de pared', message: 'Las agujas están detenidas a las 00:06. La lectura queda registrada.', correct: true },
  ] },
  { id: 2, name: 'Cocina / Comedor', title: 'La mesa después de la cena', description: 'Vajilla y objetos cotidianos siguen en el comedor. Busca qué elemento quedó sin terminar.', caution: 'Sin más información no puedes atribuir el vaso a una persona ni afirmar qué contiene además de agua.', spots: [
    { label: 'El fregadero', message: 'No encuentras ningún objeto que deba incorporarse al expediente.', correct: false },
    { label: 'Los armarios', message: 'Permanecen cerrados y no presentan alteraciones relevantes.', correct: false },
    { label: 'El servicio de mesa', message: 'Un vaso de agua quedó sin terminar. La observación queda registrada.', correct: true },
  ] },
  { id: 3, name: 'Pasillo', title: 'El paso entre habitaciones', description: 'El pasillo conecta las estancias durante el apagón. Examina el recorrido a ras de suelo.', caution: 'Todavía no has comprobado qué cerradura abre ni a quién pertenece.', spots: [
    { label: 'El cuadro de la pared', message: 'Está bien sujeto y no oculta nada relevante.', correct: false },
    { label: 'La alfombra', message: 'No conserva una marca que pueda atribuirse a la noche del crimen.', correct: false },
    { label: 'El suelo junto al zócalo', message: 'Encuentras una pequeña llave. Su procedencia sigue sin aclarar.', correct: true },
  ] },
  { id: 5, name: 'Habitación de Samuel', title: 'El espacio privado de la víctima', description: 'La habitación y el antiguo almacén guardan objetos personales. Examina sin anticipar su significado.', caution: 'Antes de atribuirle un motivo a alguien, habrá que esclarecer el contenido y la procedencia del documento.', spots: [
    { label: 'El armario', message: 'La ropa no aporta información verificable sobre los hechos.', correct: false },
    { label: 'La mesilla', message: 'No encuentras señales de forcejeo ni un objeto relacionado con el caso.', correct: false },
    { label: 'Los papeles del escritorio', message: 'Entre ellos aparece un documento doblado. Queda incorporado al expediente.', correct: true },
  ] },
] as const;
export const witnesses = [
  { id: 'daniel', name: 'Daniel González', profile: 'Tranquilo, observador y siempre atento.', secret: 'Vio una discusión importante.', essential: true, statement: 'Vi a Samuel discutiendo con Inés antes del apagón. No distinguí las palabras y no puedo afirmar qué ocurrió después.' },
  { id: 'karalee', name: 'Karalee Rhuman', profile: 'De Texas. Entiende español pero no lo habla a la perfección.', secret: 'Vio a alguien durante el apagón.', essential: true, statement: 'Durante el apagón vi una silueta dirigirse hacia la zona de servicio. Con aquella oscuridad no pude reconocer a la persona.' },
  { id: 'maria', name: 'María Gómez', profile: 'Muy protectora con sus hijas.', secret: 'Recibió un mensaje de Samuel.', essential: true, statement: 'Samuel me escribió antes de desaparecer. Quería hablar sobre Valdemora y me pidió que cuidara de los niños. No mencionó a quién esperaba.' },
  { id: 'ines', name: 'Inés Robles', profile: 'Vecina de la zona. Escuchó algo durante la noche del crimen.', secret: 'Asegura que sólo oyó la discusión.', essential: true, statement: 'Oí voces, pero no entré en la casa. Me marché antes del apagón y no utilicé ninguna puerta lateral.' },
  { id: 'veronica', name: 'Verónica Benítez', profile: 'Muy nerviosa y curiosa. Hace siempre muchas preguntas.', secret: 'Samuel sabía algo que ella ocultaba.', essential: false, statement: 'Samuel conocía un asunto privado mío. Lo oculté por miedo a que me juzgaran, pero no estaba relacionado con Valdemora.' },
  { id: 'javier', name: 'Javier López', profile: 'Muy inteligente. Analiza cada situación.', secret: 'Samuel lo amenazó con revelar algo.', essential: false, statement: 'Samuel amenazó con revelar un error que cometí. Mentí para protegerme, pero no estuve en su habitación durante el apagón.' },
  { id: 'alejandra', name: 'María Alejandra de Anta Armas', profile: 'Sociable, expresiva y espontánea.', secret: 'Entró en un lugar donde no debía.', essential: false, statement: 'Entré en una habitación sin permiso antes de cenar. Me avergonzaba admitirlo; no vi los documentos de Samuel.' },
  { id: 'jhonatan', name: 'Jhonatan Vaca', profile: 'Bombero, empático, con mucha experiencia ante emergencias.', secret: 'Dejó una puerta de emergencia preparada.', essential: false, statement: 'Dejé preparada una puerta de emergencia, entreabierta, al salir. Lo oculté porque parecía irresponsable, pero fue antes de que empezara el apagón.' },
  { id: 'jairo', name: 'Jairo Varela', profile: 'Tranquilo, leal y paciente.', secret: 'Se separó de Daniel durante unos minutos.', essential: false, statement: 'Me separé de Daniel unos minutos. Estaba solo y por eso no tengo quién confirme mi recorrido.' },
] as const;
// Everyone else on the original character sheet, transcribed. They do not give statements in this adaptation.
export const cast = [
  { id: 'laura', name: 'Laura Domínguez Jul', group: 'Investigadores', profile: 'Investigadora. Observadora, intuitiva y detallista.', tag: 'Pista personal: habrá pistas dirigidas solo a ti.' },
  { id: 'jorge', name: 'Jorge de Castro', group: 'Investigadores', profile: 'Investigador. Analítico, lógico y metódico.', tag: 'Pista personal: habrá pistas dirigidas solo a ti.' },
  { id: 'daniela', name: 'Daniela', group: 'Los niños', profile: 'Hija de Verónica y Daniel. Nerviosa y no sabe guardar secretos.', tag: 'Importante testigo.' },
  { id: 'hugo', name: 'Hugo', group: 'Los niños', profile: 'Hijo de Verónica y Daniel. Asustadizo y muy enérgico.', tag: 'Importante testigo.' },
  { id: 'eva', name: 'Eva', group: 'Los niños', profile: 'Hija de Javier y María. Tierna, curiosa y algo tímida.', tag: 'Importante testigo.' },
  { id: 'alba', name: 'Alba', group: 'Los niños', profile: 'Hija de Javier y María. Muy espabilada y de mal genio.', tag: 'Importante testigo.' },
  { id: 'samuel', name: 'Samuel Valdés', group: 'Personajes secundarios', profile: 'Propietario de la casa rural Valdemora.', tag: 'Víctima.' },
  { id: 'inspector', name: 'Inspector Álvaro Mena', group: 'Personajes secundarios', profile: 'Inspector de policía. Llegará más tarde para ayudar con la investigación.', tag: '' },
  { id: 'django', name: 'Django', group: 'Los animales', profile: 'Beagle. Muy leal y detecta cuando algo no va bien. Durante el apagón ladra insistentemente.', tag: '' },
  { id: 'ginger', name: 'Ginger', group: 'Los animales', profile: 'Gato naranja. Muy comunicativo, hace maullidos largos, como si hablara.', tag: '' },
  { id: 'uno', name: 'Uno', group: 'Los animales', profile: 'Gato blanco y negro. Más tímido y reservado. Se esconde cuando se asusta. Tiene los ojos verdes.', tag: '' },
  { id: 'dos', name: 'Dos', group: 'Los animales', profile: 'Gato blanco y negro. Personalidad peculiar, se comunica con maullidos extraños y muy insistentes.', tag: '' },
] as const;
// Confrontation of Inés's statement with evidence already in the file. Her replies are an adaptation:
// she admits the argument and its subject (the original resolution) but never confesses, and the exterior route still identifies nobody.
export const confrontations = [
  { id: 'argument', claim: 'Oí voces desde fuera, nada más. Yo no hablé con Samuel aquella noche.', reply: 'Está bien. Hablé con Samuel y discutimos. Eso no significa nada más.', note: 'Inés admite la discusión que Daniel presenció.', options: [
    { label: 'Declaración de Daniel: vio a Samuel discutiendo con Inés antes del apagón.', message: 'Daniel la sitúa discutiendo con Samuel, no escuchando desde fuera. La afirmación no se sostiene.', correct: true },
    { label: 'Declaración de Karalee: una silueta hacia la zona de servicio.', message: 'Karalee no reconoció a nadie. Su declaración no sitúa a Inés con Samuel.', correct: false },
    { label: 'Vaso de agua sin terminar en el comedor.', message: 'El vaso no puede atribuirse a ninguna persona.', correct: false },
    { label: 'Reloj detenido a las 00:06.', message: 'El reloj marca una hora; no dice quién estaba con Samuel.', correct: false },
  ] },
  { id: 'documents', claim: 'No sé de qué quería hablar Samuel. Fue una conversación sin importancia.', reply: 'Unos papeles. Samuel decía que había cosas de Valdemora que debían aclararse. Discutimos por eso y después me fui.', note: 'Inés reconoce el motivo de la discusión: los documentos relativos a Valdemora.', options: [
    { label: 'Mensaje a María y documento doblado: Samuel quería hablar sobre Valdemora.', message: 'Samuel había anunciado el tema y guardaba un documento en su habitación. La conversación no era casual.', correct: true },
    { label: 'Fotografía antigua de Valdemora.', message: 'La fotografía muestra un acceso, no el tema de una conversación.', correct: false },
    { label: 'Declaración de Jairo: se separó de Daniel unos minutos.', message: 'Que Jairo estuviera solo no explica de qué hablaba Samuel.', correct: false },
    { label: 'Pequeña llave encontrada en el pasillo.', message: 'Todavía no sabes qué abre la llave ni a quién pertenece.', correct: false },
  ] },
  { id: 'exit', claim: 'Me marché antes del apagón y no utilicé ninguna puerta lateral.', reply: 'No tengo nada más que decir.', note: 'Inés no responde. El recorrido exterior sigue sin identificar a una persona; eres tú quien debe decidir si su versión se sostiene.', options: [
    { label: 'Recorrido exterior: silueta hacia el servicio, ruido metálico a las 00:00 y humedad junto a la puerta lateral.', message: 'Alguien utilizó el acceso lateral durante el apagón. Inés ya ha cambiado su versión dos veces.', correct: true },
    { label: 'Declaración de Jhonatan: dejó una puerta entreabierta.', message: 'Jhonatan lo hizo antes del apagón y no vio a nadie utilizarla.', correct: false },
    { label: 'Declaración de Verónica: Samuel conocía un asunto privado suyo.', message: 'El secreto de Verónica no está relacionado con Valdemora ni con la puerta.', correct: false },
    { label: 'Reloj detenido a las 00:06.', message: 'La hora cae dentro del apagón, pero no sitúa a Inés en la casa.', correct: false },
  ] },
] as const;
export const confrontationIds = confrontations.map(item => item.id);
// The four statements the original resolution relies on. Every statement must be registered before confronting Inés,
// so the interface never reveals which ones matter.
export const keyWitnesses = witnesses.filter(witness => witness.essential).map(witness => witness.id);
export const requiredWitnesses = witnesses.map(witness => witness.id);
export type GameState = { version: 1; found: number[]; deduction: boolean; answers: string[]; testimony: boolean; exterior: boolean; interior: boolean; interviews: string[]; confrontations: string[]; reconstruction: boolean; solved: boolean; giftOpened: boolean };
export const initialState: GameState = { version: 1, found: [], deduction: false, answers: [], testimony: false, exterior: false, interior: false, interviews: [], confrontations: [], reconstruction: false, solved: false, giftOpened: false };
export type Action = { type: 'discover'; id?: 1 | 2 | 3 | 4 | 5 | 6 | 7 } | { type: 'deduce' } | { type: 'answer'; id: string } | { type: 'testimony' } | { type: 'exterior' } | { type: 'interior' } | { type: 'interview'; id: string } | { type: 'confront'; id: string } | { type: 'reconstruct' } | { type: 'solve' } | { type: 'gift' };
export function advance(state: GameState, action: Action): GameState {
  if (action.type === 'discover') {
    const id = action.id ?? 4;
    if (id !== 4 && !state.testimony) return state;
    if ([1, 2, 3, 5].includes(id) && !state.exterior) return state;
    return { ...state, found: [...new Set([...state.found, id])].sort((a, b) => a - b) };
  }
  if (action.type === 'exterior' && state.testimony && [4, 6, 7].every(id => state.found.includes(id))) return { ...state, exterior: true };
  if (action.type === 'interior' && state.exterior && clues.every(clue => state.found.includes(clue.id))) return { ...state, interior: true };
  if (action.type === 'interview' && state.interior && witnesses.some(witness => witness.id === action.id)) return { ...state, interviews: [...new Set([...state.interviews, action.id])] };
  if (action.type === 'confront' && state.interior && requiredWitnesses.every(id => state.interviews.includes(id)) && confrontationIds.includes(action.id as typeof confrontationIds[number])) return { ...state, confrontations: [...new Set([...state.confrontations, action.id])] };
  if (action.type === 'reconstruct' && state.interior && confrontationIds.every(id => state.confrontations.includes(id))) return { ...state, reconstruction: true };
  if (action.type === 'solve' && state.reconstruction) return { ...state, solved: true };
  if (action.type === 'gift' && state.solved) return { ...state, giftOpened: true };
  if (action.type === 'deduce' && state.found.includes(4)) return { ...state, deduction: true };
  if (action.type === 'answer' && state.deduction && questions.some(q => q.id === action.id)) return { ...state, answers: [...new Set([...state.answers, action.id])] };
  if (action.type === 'testimony' && questions.every(q => state.answers.includes(q.id))) return { ...state, testimony: true };
  return state;
}
export function restore(raw: string | null): GameState {
  try {
    const value = JSON.parse(raw ?? 'null');
    if (value?.version !== 1) return initialState;
    const found = Array.isArray(value.found) && value.found.includes(4) ? [4] : [];
    const deduction = found.length > 0 && value.deduction === true;
    const answers = deduction && Array.isArray(value.answers) ? questions.filter(q => value.answers.includes(q.id)).map(q => q.id) : [];
    const testimony = answers.length === questions.length && value.testimony === true;
    if (testimony) for (const id of [6, 7]) if (value.found.includes(id)) found.push(id);
    const exterior = testimony && found.length === 3 && value.exterior === true;
    if (exterior) for (const id of [1, 2, 3, 5]) if (value.found.includes(id)) found.push(id);
    found.sort((a, b) => a - b);
    const interior = exterior && found.length === 7 && value.interior === true;
    const interviews = interior && Array.isArray(value.interviews) ? witnesses.filter(witness => value.interviews.includes(witness.id)).map(witness => witness.id) : [];
    // Saves made when only the four key statements were required keep their confrontation progress.
    const legacyProgress = value.reconstruction === true || (Array.isArray(value.confrontations) && value.confrontations.length > 0);
    const interviewed = interior && (requiredWitnesses.every(id => interviews.includes(id)) || (legacyProgress && keyWitnesses.every(id => interviews.includes(id))));
    // Saves from before the confrontation phase keep a finished reconstruction: treat them as fully confronted.
    const confronted: string[] = !interviewed ? [] : Array.isArray(value.confrontations) ? confrontationIds.filter(id => value.confrontations.includes(id)) : value.reconstruction === true ? [...confrontationIds] : [];
    const reconstruction = interviewed && confronted.length === confrontationIds.length && value.reconstruction === true;
    const solved = reconstruction && value.solved === true;
    return { version: 1, found, deduction, answers, testimony, exterior, interior, interviews, confrontations: confronted, reconstruction, solved, giftOpened: solved && value.giftOpened === true };
  } catch { return initialState; }
}
