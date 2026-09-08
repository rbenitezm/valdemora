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
export type GameState = { version: 1; found: number[]; deduction: boolean; answers: string[]; testimony: boolean; exterior: boolean; interior: boolean };
export const initialState: GameState = { version: 1, found: [], deduction: false, answers: [], testimony: false, exterior: false, interior: false };
export type Action = { type: 'discover'; id?: 1 | 2 | 3 | 4 | 5 | 6 | 7 } | { type: 'deduce' } | { type: 'answer'; id: string } | { type: 'testimony' } | { type: 'exterior' } | { type: 'interior' };
export function advance(state: GameState, action: Action): GameState {
  if (action.type === 'discover') {
    const id = action.id ?? 4;
    if (id !== 4 && !state.testimony) return state;
    if ([1, 2, 3, 5].includes(id) && !state.exterior) return state;
    return { ...state, found: [...new Set([...state.found, id])].sort((a, b) => a - b) };
  }
  if (action.type === 'exterior' && state.testimony && [4, 6, 7].every(id => state.found.includes(id))) return { ...state, exterior: true };
  if (action.type === 'interior' && state.exterior && clues.every(clue => state.found.includes(clue.id))) return { ...state, interior: true };
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
    return { version: 1, found, deduction, answers, testimony, exterior, interior: exterior && found.length === 7 && value.interior === true };
  } catch { return initialState; }
}
