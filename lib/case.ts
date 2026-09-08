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
  { id: 1, name: 'Salón', title: 'Las agujas inmóviles', description: 'Un reloj detenido marca las 00:06. Registra la lectura antes de compararla con los acontecimientos de la noche.', caution: 'La hora que muestra no demuestra por sí sola cuándo ni por qué se detuvo.' },
  { id: 2, name: 'Cocina / Comedor', title: 'El vaso sin terminar', description: 'Queda agua en un vaso. Examínalo y anota su presencia en el comedor.', caution: 'Sin más información no puedes atribuir el vaso a una persona ni afirmar qué contiene además de agua.' },
  { id: 3, name: 'Pasillo', title: 'Una llave pequeña', description: 'Encuentras una pequeña llave en el pasillo. Regístrala entre los objetos de la investigación.', caution: 'Todavía no has comprobado qué cerradura abre ni a quién pertenece.' },
  { id: 5, name: 'Habitación de Samuel', title: 'El documento doblado', description: 'Un documento doblado merece quedar registrado. Su relación con Samuel abre una nueva línea de investigación.', caution: 'Antes de atribuirle un motivo a alguien, habrá que esclarecer el contenido y la procedencia del documento.' },
] as const;
export const witnesses = [
  { id: 'daniel', name: 'Daniel González', profile: 'Tranquilo, observador y siempre atento.', secret: 'Vio una discusión importante.', essential: true, statement: 'Vi a Samuel discutiendo con Inés antes del apagón. No distinguí las palabras y no puedo afirmar qué ocurrió después.' },
  { id: 'karalee', name: 'Karalee Rhuman', profile: 'Entiende español, pero no lo habla con soltura.', secret: 'Vio a alguien durante el apagón.', essential: true, statement: 'Durante el apagón vi una silueta dirigirse hacia la zona de servicio. Con aquella oscuridad no pude reconocer a la persona.' },
  { id: 'maria', name: 'María Gómez', profile: 'Muy protectora con sus hijos.', secret: 'Recibió un mensaje de Samuel.', essential: true, statement: 'Samuel me escribió antes de desaparecer. Quería hablar sobre Valdemora y me pidió que cuidara de los niños. No mencionó a quién esperaba.' },
  { id: 'ines', name: 'Inés Robles', profile: 'Vecina de la zona. Escuchó algo durante la noche.', secret: 'Asegura que sólo oyó la discusión.', essential: true, statement: 'Oí voces, pero no entré en la casa. Me marché antes del apagón y no utilicé ninguna puerta lateral.' },
  { id: 'veronica', name: 'Verónica Benítez', profile: 'Muy nerviosa y curiosa.', secret: 'Samuel sabía algo que ella ocultaba.', essential: false, statement: 'Samuel conocía un asunto privado mío. Lo oculté por miedo a que me juzgaran, pero no estaba relacionado con Valdemora.' },
  { id: 'javier', name: 'Javier López', profile: 'Analiza cada situación.', secret: 'Samuel lo amenazó con revelar algo.', essential: false, statement: 'Samuel amenazó con revelar un error que cometí. Mentí para protegerme, pero no estuve en su habitación durante el apagón.' },
  { id: 'alejandra', name: 'María Alejandra de Anta Armas', profile: 'Sociable, expresiva y espontánea.', secret: 'Entró en un lugar donde no debía.', essential: false, statement: 'Entré en una habitación sin permiso antes de cenar. Me avergonzaba admitirlo; no vi los documentos de Samuel.' },
  { id: 'jhonatan', name: 'Jhonatan Vaca', profile: 'Bombero con experiencia en emergencias.', secret: 'Dejó una puerta entreabierta.', essential: false, statement: 'Dejé una puerta entreabierta al salir. Lo oculté porque parecía irresponsable, pero fue antes de que empezara el apagón.' },
  { id: 'jairo', name: 'Jairo Varela', profile: 'Tranquilo, lee y observa con paciencia.', secret: 'Se separó de Daniel durante unos minutos.', essential: false, statement: 'Me separé de Daniel unos minutos. Estaba solo y por eso no tengo quién confirme mi recorrido.' },
] as const;
export const requiredWitnesses = witnesses.filter(witness => witness.essential).map(witness => witness.id);
export type GameState = { version: 1; found: number[]; deduction: boolean; answers: string[]; testimony: boolean; exterior: boolean; interior: boolean; interviews: string[]; reconstruction: boolean; solved: boolean; giftOpened: boolean };
export const initialState: GameState = { version: 1, found: [], deduction: false, answers: [], testimony: false, exterior: false, interior: false, interviews: [], reconstruction: false, solved: false, giftOpened: false };
export type Action = { type: 'discover'; id?: 1 | 2 | 3 | 4 | 5 | 6 | 7 } | { type: 'deduce' } | { type: 'answer'; id: string } | { type: 'testimony' } | { type: 'exterior' } | { type: 'interior' } | { type: 'interview'; id: string } | { type: 'reconstruct' } | { type: 'solve' } | { type: 'gift' };
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
  if (action.type === 'reconstruct' && state.interior && requiredWitnesses.every(id => state.interviews.includes(id))) return { ...state, reconstruction: true };
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
    const reconstruction = interior && requiredWitnesses.every(id => interviews.includes(id)) && value.reconstruction === true;
    const solved = reconstruction && value.solved === true;
    return { version: 1, found, deduction, answers, testimony, exterior, interior, interviews, reconstruction, solved, giftOpened: solved && value.giftOpened === true };
  } catch { return initialState; }
}
