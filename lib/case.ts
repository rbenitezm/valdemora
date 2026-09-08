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
export type GameState = { version: 1; found: number[]; deduction: boolean; answers: string[]; testimony: boolean };
export const initialState: GameState = { version: 1, found: [], deduction: false, answers: [], testimony: false };
export type Action = { type: 'discover' } | { type: 'deduce' } | { type: 'answer'; id: string } | { type: 'testimony' };
export function advance(state: GameState, action: Action): GameState {
  if (action.type === 'discover') return { ...state, found: [4] };
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
    return { version: 1, found, deduction, answers, testimony: answers.length === questions.length && value.testimony === true };
  } catch { return initialState; }
}
