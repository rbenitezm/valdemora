'use client';

import { useEffect, useState } from 'react';
import { advance, initialState, restore, clues, timeline, questions, rooms, witnesses, requiredWitnesses, confrontations, cast, type Action } from '@/lib/case';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Eye,
  FileText,
  Fingerprint,
  Map,
  MapPin,
  Search,
  Users,
  Gavel,
  Gift,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { play, setMuted } from '@/lib/sound';

import { Button } from '@/components/ui/button';

type View = 'intro' | 'finca' | 'bosque' | 'deducciones' | 'hugo' | 'cronologia' | 'acceso' | 'establos' | 'casa' | 'personas' | 'confrontacion' | 'conclusion' | 'regalo';

const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`;
// Photographs cropped from the original evidence panel (panel-pistas.jpg).
const clueImages: Record<number, { src: string; width: number }> = {
  1: { src: '/assets/pistas/01-reloj.jpg', width: 75 },
  2: { src: '/assets/pistas/02-vaso.jpg', width: 75 },
  3: { src: '/assets/pistas/03-llave.jpg', width: 75 },
  4: { src: '/assets/pistas/04-fotografia.jpg', width: 77 },
  5: { src: '/assets/pistas/05-recibo.jpg', width: 75 },
  6: { src: '/assets/pistas/06-humedad.jpg', width: 135 },
  7: { src: '/assets/pistas/07-pieza.jpg', width: 103 },
};
// Portraits cropped from the original character sheet (personajes.jpg).
const portraits: Record<string, string> = {
  daniel: '/assets/retratos/daniel.jpg', karalee: '/assets/retratos/karalee.jpg', maria: '/assets/retratos/maria.jpg', ines: '/assets/retratos/ines.jpg',
  veronica: '/assets/retratos/veronica.jpg', javier: '/assets/retratos/javier.jpg', alejandra: '/assets/retratos/alejandra.jpg', jhonatan: '/assets/retratos/jhonatan.jpg',
  jairo: '/assets/retratos/jairo.jpg', hugo: '/assets/retratos/hugo.jpg', samuel: '/assets/retratos/samuel.jpg', inspector: '/assets/retratos/inspector.jpg',
  laura: '/assets/retratos/laura.jpg', jorge: '/assets/retratos/jorge.jpg', daniela: '/assets/retratos/daniela.jpg', eva: '/assets/retratos/eva.jpg', alba: '/assets/retratos/alba.jpg',
  django: '/assets/retratos/django.jpg', ginger: '/assets/retratos/ginger.jpg', uno: '/assets/retratos/uno.jpg', dos: '/assets/retratos/dos.jpg',
};
const castGroups = [...new Set(cast.map(item => item.group))];
// `decorative` portraits sit next to text that already names the person, so they add nothing to the accessible name.
function Portrait({ id, name, size = 'small', decorative = false }: { id: string; name: string; size?: 'small' | 'large'; decorative?: boolean }) {
  const src = portraits[id];
  if (!src) return null;
  return <Image className={`portrait ${size}`} src={assetPath(src)} alt={decorative ? '' : `Retrato original de ${name}`} aria-hidden={decorative || undefined} width={96} height={108} />;
}
type Box = { left: string; top: string; width: string; height: string };
// Areas highlighted on the original house plan and estate map, as percentages of each image.
const roomBoxes: Record<number, Box> = {
  1: { left: '7%', top: '51%', width: '36%', height: '28%' },
  2: { left: '7%', top: '28%', width: '36%', height: '13%' },
  3: { left: '62%', top: '44%', width: '31%', height: '8%' },
  5: { left: '74%', top: '57%', width: '19%', height: '19%' },
};
const zoneBoxes: Record<'acceso' | 'establos', Box> = {
  acceso: { left: '4%', top: '55%', width: '31%', height: '12%' },
  establos: { left: '69%', top: '61%', width: '22%', height: '11%' },
};

type Tone = '' | 'hit' | 'miss' | 'win';
type FeedbackState = { text: string; tone: Tone; nonce: number };
const silentFeedback: FeedbackState = { text: '', tone: '', nonce: 0 };
// The nonce changes on every message so the animation restarts even when the text repeats.
function Feedback({ text, tone, nonce, className = '' }: FeedbackState & { className?: string }) {
  return <output key={nonce} className={`feedback ${tone} ${className}`.trim()}>{(tone === 'hit' || tone === 'win') && <Check aria-hidden="true" />}{tone === 'miss' && <X aria-hidden="true" />}{text}</output>;
}

function CluePhoto({ id }: { id: number }) {
  const clue = clues.find(item => item.id === id);
  const image = clueImages[id];
  if (!clue || !image) return null;
  return <figure className="clue-photo"><Image src={assetPath(image.src)} alt={`Fotografía original de la prueba: ${clue.title}`} width={image.width} height={91} /><figcaption>Prueba 0{id} · Fotografía del panel original</figcaption></figure>;
}

function SceneReference({ src, alt, box, caption, plan = false }: { src: string; alt: string; box: Box; caption: string; plan?: boolean }) {
  return <figure className={plan ? 'scene-reference plan-reference' : 'scene-reference'}><div className="scene-frame"><Image src={assetPath(src)} alt={alt} width={plan ? 315 : 275} height={plan ? 325 : 370} /><span className="scene-ring" style={box} aria-hidden="true" /></div><figcaption>{caption}</figcaption></figure>;
}

export default function Home() {
  const [view, setView] = useState<View>('intro');
  const [game, setGame] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Cargando partida…');
  const [resetOpen, setResetOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState>(silentFeedback);
  const [sound, setSound] = useState(true);
  const [exteriorSearch, setExteriorSearch] = useState<View | null>(null);
  const [roomSearch, setRoomSearch] = useState<number | null>(null);
  const [roomId, setRoomId] = useState<number>(1);
  const [witnessId, setWitnessId] = useState('daniel');
  const [accused, setAccused] = useState('');
  const [eventTheory, setEventTheory] = useState('');
  const [exitTheory, setExitTheory] = useState('');
  const [notice, setNotice] = useState('');
  const room = rooms.find(item => item.id === roomId) ?? rooms[0];
  const witness = witnesses.find(item => item.id === witnessId) ?? witnesses[0];
  const observationFound = game.found.includes(4);
  const progress = Math.round(game.found.length / 7 * 100);
  const exteriorLock = !observationFound ? 'Esta zona se abre tras registrar el testimonio de Hugo. Empieza por examinar la fotografía del bosque norte.' : !game.deduction ? 'Esta zona se abre tras registrar el testimonio de Hugo. Resuelve primero la deducción de la fotografía.' : 'Esta zona se abre tras registrar el testimonio de Hugo. Completa sus tres preguntas y registra la declaración.';
  const houseLock = !game.testimony ? 'La casa se abre al resolver la deducción del recorrido exterior. Antes necesitas el testimonio de Hugo.' : ![6, 7].every(id => game.found.includes(id)) ? 'La casa se abre al resolver la deducción del recorrido exterior. Registra la humedad de la puerta y la pieza de los establos.' : 'La casa se abre al resolver la deducción del recorrido exterior en Deducciones.';
  const locations: { name: string; detail: string; active: boolean; view: View; lock: string }[] = [
    { name: 'Bosque norte', detail: observationFound ? 'Fotografía registrada' : 'Inspeccionar el sendero', active: true, view: 'bosque', lock: '' },
    { name: 'Casa principal', detail: game.exterior ? 'Cuatro estancias disponibles' : 'Completa la deducción del exterior', active: game.exterior, view: 'casa', lock: houseLock },
    { name: 'Acceso lateral', detail: game.found.includes(6) ? 'Humedad registrada' : game.testimony ? 'Inspeccionar la puerta' : 'Registra el testimonio de Hugo', active: game.testimony, view: 'acceso', lock: exteriorLock },
    { name: 'Establos', detail: game.found.includes(7) ? 'Pieza metálica registrada' : game.testimony ? 'Inspeccionar el suelo' : 'Registra el testimonio de Hugo', active: game.testimony, view: 'establos', lock: exteriorLock },
  ];
  const pendingRooms = rooms.filter(item => !game.found.includes(item.id)).length;
  const pendingInterviews = requiredWitnesses.filter(id => !game.interviews.includes(id)).length;
  const interviewsDone = game.interior && pendingInterviews === 0;
  const pendingConfrontations = confrontations.filter(item => !game.confrontations.includes(item.id)).length;
  const confronted = interviewsDone && pendingConfrontations === 0;
  const currentConfrontation = confrontations.find(item => !game.confrontations.includes(item.id));
  const sectionLocks = {
    hugo: !observationFound ? 'Para interrogar a Hugo, examina primero la fotografía antigua en el bosque norte.' : 'Para interrogar a Hugo, resuelve la deducción de la fotografía en Deducciones.',
    personas: !game.exterior ? 'Las personas del caso se desbloquean tras reunir las siete pruebas y resolver la deducción del reloj. Completa antes el recorrido exterior.' : pendingRooms > 0 ? `Las personas del caso se desbloquean tras reunir las siete pruebas y resolver la deducción del reloj. Faltan ${pendingRooms} pruebas de la casa.` : 'Las personas del caso se desbloquean al resolver la deducción del reloj en Deducciones.',
    conclusion: !game.interior ? 'La conclusión requiere las siete pruebas, la deducción del reloj y las declaraciones de las personas del caso.' : pendingInterviews > 0 ? 'La conclusión se abre al registrar las declaraciones pendientes en Personas.' : `La conclusión se abre tras confrontar a Inés con el expediente. Quedan ${pendingConfrontations} afirmaciones por rebatir.`,
    regalo: 'El regalo de Laura se abre al resolver correctamente la acusación final.',
  };
  const dispatch = (action: Action) => setGame(current => advance(current, action));
  // Feedback with an optional cue: 'hit' and 'miss' animate the message, 'win' celebrates the final accusation.
  const note = (text: string, tone: Tone = '') => { setFeedback(current => ({ text, tone, nonce: current.nonce + 1 })); if (tone) play(tone); };
  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    setMuted(!next);
    try { localStorage.setItem('valdemora-rebuild-sound', next ? 'on' : 'off'); } catch { /* Preference stays for this session only. */ }
    if (next) play('tap');
  };
  // Storage is browser-only: restore after hydration before enabling game actions.
  /* oxlint-disable react/react-compiler */
  useEffect(() => {
    try {
      setGame(restore(localStorage.getItem('valdemora-rebuild-v1')));
      if (localStorage.getItem('valdemora-rebuild-sound') === 'off') { setSound(false); setMuted(true); }
    }
    catch { setSaveStatus('Guardado no disponible en este navegador.'); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('valdemora-rebuild-v1', JSON.stringify(game)); setSaveStatus('Partida guardada en este dispositivo'); }
    catch { setSaveStatus('No se pudo guardar. Puedes seguir jugando en esta sesión.'); }
  }, [game, ready]);
  /* oxlint-enable react/react-compiler */
  const navigate = (next: View) => { setView(next); setFeedback(silentFeedback); setNotice(''); setExteriorSearch(null); setRoomSearch(null); };
  const resumeView = (): View => {
    if (game.solved) return 'regalo';
    if (game.reconstruction || confronted) return 'conclusion';
    if (interviewsDone) return 'confrontacion';
    if (game.interior) return 'personas';
    if (game.found.length === 7) return 'deducciones';
    if (game.exterior) return 'casa';
    if (game.testimony) {
      if (![6, 7].every(id => game.found.includes(id))) return game.found.includes(6) ? 'establos' : 'acceso';
      return 'deducciones';
    }
    if (game.deduction) return 'hugo';
    if (observationFound) return 'deducciones';
    return 'finca';
  };
  const nextStepLabel = () => {
    if (game.solved) return 'Ver regalo';
    if (game.reconstruction || confronted) return 'Ir a la conclusión';
    if (interviewsDone) return 'Confrontar a Inés';
    if (game.interior) return 'Continuar testimonios';
    if (game.found.length === 7) return 'Resolver deducción interior';
    if (game.exterior) return 'Entrar en la casa';
    if (game.testimony && [6, 7].every(id => game.found.includes(id))) return 'Resolver deducción exterior';
    if (game.testimony) return 'Continuar recorrido exterior';
    if (game.deduction) return 'Continuar interrogatorio';
    if (observationFound) return 'Relacionar la fotografía';
    return 'Comenzar investigación';
  };

  const openMap = () => setView('finca');
  // Locked sections lead to the pending step and explain what unlocks them.
  const goToPending = (reason: string) => { navigate(resumeView()); setNotice(reason); };

  return (
    <main className="game-shell">
      <div className="grain" aria-hidden="true" />

      <header className="case-header">
        <button className="case-mark" onClick={() => setView('intro')}>
          <Fingerprint aria-hidden="true" />
          <span>
            <strong>Caso 001</strong>
            <small>Valdemora</small>
          </span>
        </button>

        <div className="case-tools">
          <div className="case-status" aria-live="polite">
            <span className="status-dot" />
            {game.solved ? 'Caso resuelto' : 'Investigación abierta'}
            <b key={game.found.length} className="count-pop">{game.found.length} / 7 pruebas</b>
          </div>
          <button type="button" className="sound-toggle" aria-pressed={sound} aria-label={sound ? 'Silenciar sonidos' : 'Activar sonidos'} title={sound ? 'Silenciar sonidos' : 'Activar sonidos'} onClick={toggleSound}>
            {sound ? <Volume2 aria-hidden="true" /> : <VolumeX aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className="workspace">
        <nav className="case-nav" aria-label="Secciones del caso">
          <p>Expediente</p>
          <button className={view === 'intro' ? 'active' : ''} onClick={() => setView('intro')}>
            <FileText aria-hidden="true" />
            El caso
          </button>
          <button aria-label="La finca" className={['finca', 'bosque', 'acceso', 'establos', 'casa'].includes(view) ? 'active' : ''} onClick={openMap}>
            <Map aria-hidden="true" />
            La finca
          </button>
          <button aria-label="Cronología" className={view === 'cronologia' ? 'active' : ''} onClick={() => navigate('cronologia')}>
            <Clock3 aria-hidden="true" />
            Cronología
          </button>
          <button aria-label="Pruebas y deducciones" className={view === 'deducciones' ? 'active' : ''} onClick={() => navigate('deducciones')}>
            <Search aria-hidden="true" />
            Deducciones
          </button>
          <button aria-label="Interrogar a Hugo" aria-disabled={!game.deduction} title={game.deduction ? undefined : sectionLocks.hugo} className={`${view === 'hugo' ? 'active' : ''} ${game.deduction ? '' : 'locked'}`} onClick={() => game.deduction ? navigate('hugo') : goToPending(sectionLocks.hugo)}>
            <FileText aria-hidden="true" /> Hugo {!game.deduction && <span className="lock-dot" aria-hidden="true" />}
          </button>
          <button aria-label="Personas del caso" aria-disabled={!game.interior} title={game.interior ? undefined : sectionLocks.personas} className={`${view === 'personas' || view === 'confrontacion' ? 'active' : ''} ${game.interior ? '' : 'locked'}`} onClick={() => game.interior ? navigate('personas') : goToPending(sectionLocks.personas)}>
            <Users aria-hidden="true" /> Personas {!game.interior && <span className="lock-dot" aria-hidden="true" />}
          </button>
          <button aria-label="Reconstrucción y acusación" aria-disabled={!confronted} title={confronted ? undefined : sectionLocks.conclusion} className={`${view === 'conclusion' ? 'active' : ''} ${confronted ? '' : 'locked'}`} onClick={() => confronted ? navigate('conclusion') : goToPending(sectionLocks.conclusion)}>
            <Gavel aria-hidden="true" /> Conclusión {!confronted && <span className="lock-dot" aria-hidden="true" />}
          </button>
          <button aria-label="Regalo de Laura" aria-disabled={!game.solved} title={game.solved ? undefined : sectionLocks.regalo} className={`${view === 'regalo' ? 'active' : ''} ${game.solved ? '' : 'locked'}`} onClick={() => game.solved ? navigate('regalo') : goToPending(sectionLocks.regalo)}>
            <Gift aria-hidden="true" /> Regalo {!game.solved && <span className="lock-dot" aria-hidden="true" />}
          </button>

          <div className="case-progress">
            <div>
              <span>Pruebas reunidas</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <i style={{ width: `${progress}%` }} />
            </div>
            <small>La verdad aparece al conectar pruebas, testimonios y horarios.</small>
          </div>
        </nav>

        <section className="case-content">
          <div className="save-bar"><output>{saveStatus}</output><div className="save-actions"><Button className="next-step" disabled={!ready} onClick={() => navigate(resumeView())}>{nextStepLabel()} <ArrowRight /></Button><Button variant="ghost" disabled={!ready} onClick={() => setResetOpen(true)}>Reiniciar partida</Button></div></div>
          {notice && <output className="lock-notice">{notice}</output>}
          {!ready ? <p className="map-view">Abriendo el expediente…</p> : <>
          {view === 'intro' && (
            <div className="intro-view">
              <div className="eyebrow">El último fin de semana</div>
              <h1>La celebración terminó antes del amanecer.</h1>
              <p className="lead">
                Laura Domínguez Jul y Jorge de Castro llegan a Valdemora para celebrar un cumpleaños.
                Horas después, Samuel Valdés aparece muerto y nadie cuenta la misma historia.
              </p>

              <div className="hero-frame">
                <Image
                  className="hero-image"
                  src={assetPath('/assets/original/menu-principal.jpg')}
                  alt="La finca Valdemora durante una noche de tormenta"
                  fill
                  priority
                  sizes="(max-width: 620px) 100vw, (max-width: 900px) 85vw, 70vw"
                />
                <div className="hero-caption">
                  <span>Finca Valdemora · 00:17</span>
                  <strong>La escena permanece aislada.</strong>
                </div>
              </div>

              <div className="briefing-grid">
                <article className="brief-card priority">
                  <span>Objetivo inicial</span>
                  <h2>Reconstruir los minutos del apagón</h2>
                  <p>Empieza por el exterior. Observa antes de interpretar y registra sólo lo que puedas demostrar.</p>
                  <Button className="primary-action" onClick={() => navigate(resumeView())}>
                    {observationFound ? 'Continuar investigación' : 'Comenzar investigación'} <ArrowRight aria-hidden="true" />
                  </Button>
                </article>
                <article className="brief-card note-card">
                  <Portrait id="inspector" name="Álvaro Mena" />
                  <span className="note-label">Nota del inspector</span>
                  <blockquote>«Una pista aislada puede mentir. Tres que encajan empiezan a contar la verdad.»</blockquote>
                  <small>Inspector Álvaro Mena</small>
                </article>
              </div>
            </div>
          )}

          {view === 'finca' && (
            <div className="map-view">
              <div className="view-heading">
                <div>
                  <div className="eyebrow">Recorrido exterior</div>
                  <h1>Mapa de la finca</h1>
                  <p>{game.testimony ? 'El testimonio de Hugo abre la investigación del acceso lateral y los establos.' : 'Selecciona una zona para inspeccionarla. Empieza por el bosque norte.'}</p>
                </div>
                <Button variant="outline" className="quiet-action" onClick={() => setView('intro')}>
                  <ArrowLeft aria-hidden="true" /> Volver al expediente
                </Button>
              </div>

              <div className="map-layout">
                <div className="map-board">
                  <Image
                    src={assetPath('/assets/original/mapa-finca.jpg')}
                    alt="Mapa ilustrado de la finca Valdemora"
                    width={275}
                    height={370}
                    sizes="(max-width: 900px) 100vw, 60vw"
                  />
                  {locations.map(location => (
                    <button
                      key={location.view}
                      className={`map-marker marker-${location.view} ${location.active ? '' : 'locked'}`}
                      aria-disabled={!location.active}
                      title={location.active ? undefined : location.detail}
                      onClick={() => location.active ? navigate(location.view) : goToPending(location.lock)}
                    >
                      <span /> {location.name}
                    </button>
                  ))}
                  <div className="map-coordinate">40° 24′ N · Recorrido 01</div>
                </div>

                <aside className="locations-panel">
                  <p className="panel-kicker">Zonas registradas</p>
                  {locations.map((location, index) => (
                    <button
                      key={location.name}
                      className={!location.active ? 'locked-location' : ''}
                      aria-disabled={!location.active}
                      onClick={() => location.active ? navigate(location.view) : goToPending(location.lock)}
                    >
                      <span className="location-index">0{index + 1}</span>
                      <span>
                        <strong>{location.name}</strong>
                        <small>{location.detail}</small>
                      </span>
                      {location.active ? <ArrowRight aria-hidden="true" /> : <span className="lock-dot" aria-hidden="true" />}
                    </button>
                  ))}
                </aside>
              </div>
            </div>
          )}

          {view === 'bosque' && (
            <div className="inspection-view">
              <div className="inspection-topbar">
                <Button variant="outline" className="quiet-action" onClick={openMap}>
                  <ArrowLeft aria-hidden="true" /> Mapa de la finca
                </Button>
                <span>Recorrido 01 · Bosque norte</span>
              </div>

              <div className="inspection-stage">
                <div className="scene-visual">
                  <div className="scene-vignette" />
                  <div className="scene-copy">
                    <span>Zona de observación</span>
                    <h1>El sendero de servicio</h1>
                    <p>La lluvia ha borrado casi todas las huellas. Una línea de visión continúa despejada hacia la casa.</p>
                  </div>
                  <button
                    className={`evidence-hotspot ${observationFound ? 'found' : ''}`}
                    onClick={() => { if (!observationFound) play('hit'); dispatch({ type: 'discover' }); }}
                    aria-label="Examinar la fotografía antigua de Valdemora"
                  >
                    {observationFound ? <Check aria-hidden="true" /> : <Eye aria-hidden="true" />}
                    <span>{observationFound ? 'Observación registrada' : 'Examinar'}</span>
                  </button>
                </div>

                <aside className="field-notes">
                  <div className="field-title">
                    <MapPin aria-hidden="true" />
                    <span>
                      <small>Posición actual</small>
                      <strong>Bosque norte</strong>
                    </span>
                  </div>

                  {observationFound ? (
                    <div className="finding-card">
                      <span className="finding-number">Prueba 04 · Fotografía</span>
                      <h2>{clues[3].title}</h2>
                      <CluePhoto id={4} />
                      <p>La fotografía permite reconocer una puerta lateral. Desde el bosque puedes relacionar ese acceso con la disposición actual de la casa.</p>
                      <div className="finding-rule" />
                      <small>Esto es una observación. Todavía no demuestra quién utilizó la puerta.</small>
                      <Button className="primary-action" onClick={() => navigate('deducciones')}>Examinar la relación <ArrowRight /></Button>
                    </div>
                  ) : (
                    <div className="empty-finding">
                      <Eye aria-hidden="true" />
                      <h2>Observa el entorno</h2>
                      <p>Busca un punto de interés en la escena. No todas las observaciones son pruebas concluyentes.</p>
                    </div>
                  )}
                </aside>
              </div>
            </div>
          )}
          {view === 'deducciones' && <div className="map-view">
            <div className="eyebrow">Mesa de investigación</div><h1>Pruebas y deducciones</h1>
            {game.exterior && <article className="brief-card deduction-card"><span>Interior · Deducción 03</span><h2>Las 00:06, dentro del apagón</h2>
              {game.found.length === clues.length && <figure className="evidence-board"><Image src={assetPath('/assets/original/panel-pistas.jpg')} alt="Panel original con las siete pruebas reunidas" width={375} height={325} /><figcaption>Panel de pruebas completo · Documento original del caso</figcaption></figure>}
              <div className="evidence-register">{clues.map(clue => <div key={clue.id}>{game.found.includes(clue.id) ? <Image src={assetPath(clueImages[clue.id].src)} alt={`Fotografía original: ${clue.title}`} width={clueImages[clue.id].width} height={91} /> : <span className="thumb-empty" aria-hidden="true" />}<div><span>{game.found.includes(clue.id) ? '✓' : '—'} {clue.location}</span><strong>{game.found.includes(clue.id) ? clue.title : 'Pendiente de inspección'}</strong></div></div>)}</div>
              {game.interior ? <><h3>Relación temporal registrada</h3><p>Las 00:06 están entre el apagón de las 23:58 y el regreso de la luz a las 00:09. El reloj aporta una referencia que todavía necesita explicación.</p><p>Las siete pruebas están reunidas. La reconstrucción y los testimonios de los sospechosos serán la siguiente parte de la investigación.</p><Button onClick={() => navigate('cronologia')}>Consultar la cronología</Button></> : game.found.length === 7 ? <div className="question-list"><p>¿Qué puedes afirmar al comparar el reloj con los horarios?</p><Button variant="outline" onClick={() => note('Un reloj detenido no determina por sí solo la hora de la muerte.', 'miss')}>Samuel murió exactamente a las 00:06.</Button><Button variant="outline" onClick={() => { dispatch({ type: 'interior' }); note('Relación temporal registrada. Aún falta explicar por qué se detuvo el reloj.', 'hit'); }}>La hora del reloj cae dentro del apagón, pero no demuestra cuándo murió Samuel.</Button><Button variant="outline" onClick={() => note('La luz volvió a las 00:09, tres minutos después de la hora que marca el reloj.', 'miss')}>El reloj se detuvo después de volver la luz.</Button></div> : <><p>Reúne las cuatro pruebas de la casa para contrastar el conjunto.</p><Button onClick={() => navigate('casa')}>Inspeccionar la casa</Button></>}
              <Feedback {...feedback} />
            </article>}
            {game.testimony && <article className="brief-card deduction-card"><span>Recorrido exterior · Deducción 02</span><h2>Una puerta, una pieza, un sonido</h2>
              <div className="question-list">{clues.filter(c => c.id === 6 || c.id === 7).map(c => <div key={c.id}><strong>{game.found.includes(c.id) ? c.title : 'Prueba pendiente de inspección'}</strong><p>{c.location}</p></div>)}</div>
              {game.exterior ? <div className="completion"><h3>Hipótesis del recorrido registrada</h3><p>La humedad, la pieza metálica y el testimonio justifican investigar un posible recorrido exterior. No identifican a una persona ni fijan la hora de paso.</p><p>El interior de la casa está disponible. Busca allí las otras cuatro pruebas.</p><Button onClick={() => navigate('casa')}>Entrar en la casa</Button></div> : [6, 7].every(id => game.found.includes(id)) ? <div className="question-list"><p>Hugo oyó un ruido metálico a las 00:00. ¿Qué relación puedes establecer?</p><Button variant="outline" onClick={() => note('No sabemos si esta pieza produjo el ruido. Coincidir en el material no demuestra el origen del sonido.', 'miss')}>La pieza produjo con certeza el ruido de medianoche.</Button><Button variant="outline" onClick={() => { dispatch({ type: 'exterior' }); note('Hipótesis registrada. Quedan por comprobar la hora y la persona.', 'hit'); }}>Las pruebas son compatibles con un recorrido exterior que debemos contrastar.</Button><Button variant="outline" onClick={() => note('La humedad no permite determinar quién pasó ni a qué hora. Falta evidencia para acusar.', 'miss')}>La humedad identifica al responsable de la muerte.</Button></div> : <><p>Necesitas registrar la humedad de la puerta y la pieza de los establos antes de relacionarlas.</p><Button onClick={openMap}>Volver a las zonas de inspección</Button></>}
            </article>}
            {!observationFound ? <article className="brief-card"><h2>Aún no has registrado pruebas</h2><p>Explora el bosque y examina la fotografía antigua.</p><Button onClick={() => navigate('bosque')}>Ir al bosque</Button></article> : <>
              <div className="briefing-grid"><article className="brief-card"><span>Prueba 04 · Bosque</span><h2>{clues[3].title}</h2><p>En la fotografía aparece una puerta lateral de la casa.</p></article><article className="brief-card"><span>Observación del lugar</span><h2>Un acceso visible desde el bosque</h2><p>La disposición del edificio permite relacionar la fotografía con esa puerta.</p></article></div>
              <article className="brief-card deduction-card"><h2>¿Qué puedes concluir con lo que sabes?</h2>
                {game.deduction ? <><p>Existe un acceso lateral que merece investigarse. Aún no sabes quién lo utilizó ni cuándo.</p><Button onClick={() => navigate('hugo')}>Interrogar a Hugo <ArrowRight /></Button></> : <div className="question-list">
                  <Button variant="outline" onClick={() => note('La fotografía muestra un acceso, pero no identifica a ninguna persona.', 'miss')}>La fotografía identifica al responsable.</Button>
                  <Button variant="outline" onClick={() => { dispatch({ type: 'deduce' }); note('Deducción registrada. Puedes contrastarla con el testimonio de Hugo.', 'hit'); }}>Existe otra vía de entrada o salida que debemos comprobar.</Button>
                  <Button variant="outline" onClick={() => note('Una fotografía antigua no demuestra qué ocurrió durante el apagón.', 'miss')}>La puerta se utilizó durante el apagón.</Button>
                </div>}
                <Feedback {...feedback} />
              </article>
            </>}
          </div>}
          {view === 'casa' && game.exterior && <div className="map-view">
            <Button variant="outline" className="quiet-action" onClick={openMap}><ArrowLeft /> Mapa de la finca</Button><div className="eyebrow exterior-heading">Recorrido interior</div><h1>Dentro de Valdemora</h1><p className="lead">Recorre las cuatro estancias y registra los objetos antes de interpretar su relación con la noche.</p>
            <div className="house-layout"><div><SceneReference plan src="/assets/original/plano-casa.jpg" alt="Plano original de la casa Valdemora" box={roomBoxes[room.id]} caption={`Plano original · ${room.name}`} /><div className="question-list" aria-label="Entradas a las estancias de la casa">{rooms.map(item => <Button key={item.id} variant={item.id === room.id ? 'default' : 'outline'} aria-label={`Entrar en ${item.name}`} aria-pressed={item.id === room.id} onClick={() => { setRoomId(item.id); setRoomSearch(null); setFeedback(silentFeedback); }}>{game.found.includes(item.id) && <Check aria-hidden="true" />}Entrar: {item.name}</Button>)}</div></div>
              <article className="brief-card"><span>{room.name}</span><h2>{room.title}</h2><p>{room.description}</p>
                {game.found.includes(room.id) && roomSearch !== room.id ? <><div className="registered-stamp"><Check /> Prueba registrada</div><Button variant="outline" className="review-inspection" onClick={() => { setRoomSearch(room.id); note('Repaso abierto. Elige un punto de la estancia.'); }}>Revisar la inspección</Button></> : roomSearch !== room.id ? <Button className="primary-action" onClick={() => { setRoomSearch(room.id); note('Inspección abierta. Elige un punto de la estancia.'); }}><Eye /> Iniciar inspección</Button> : <div className="search-area"><p>Selecciona un punto para examinar:</p><div className="question-list">{room.spots.map(spot => <Button key={spot.label} variant="outline" onClick={() => { note(spot.message, spot.correct ? 'hit' : 'miss'); if (spot.correct) dispatch({ type: 'discover', id: room.id }); }}>{spot.label}</Button>)}</div></div>}
                <Feedback {...feedback} className="inspection-feedback" />
                {game.found.includes(room.id) && <div className="interior-finding"><h3>{clues.find(clue => clue.id === room.id)?.title}</h3><CluePhoto id={room.id} /><p>{room.caution}</p><Button variant="outline" onClick={() => { const next = rooms.find(item => !game.found.includes(item.id)); if (next) { setRoomId(next.id); setRoomSearch(null); setFeedback(silentFeedback); } else navigate('deducciones'); }}>{rooms.some(item => !game.found.includes(item.id)) ? 'Ir a una estancia pendiente' : 'Relacionar las siete pruebas'} <ArrowRight /></Button></div>}
              </article>
            </div>
          </div>}
          {view === 'personas' && game.interior && <div className="map-view">
            <div className="eyebrow">Fase 04 · Testimonios</div><h1>Todos ocultan algo</h1><p className="lead">Un secreto puede explicar una mentira sin convertirla en asesinato. Registra las declaraciones y decide por ti mismo cuáles afectan a la noche del apagón.</p>
            <div className="interview-layout"><div className="witness-list" aria-label="Personas disponibles">{witnesses.map(item => <button key={item.id} className={item.id === witness.id ? 'active' : ''} onClick={() => setWitnessId(item.id)}><span className="portrait-cell"><Portrait id={item.id} name={item.name} decorative />{game.interviews.includes(item.id) && <i className="portrait-check" aria-hidden="true">✓</i>}</span><div><strong>{item.name}</strong><small>{game.interviews.includes(item.id) ? 'Declaración registrada' : 'Pendiente'}</small></div></button>)}</div>
              <article className="brief-card witness-card"><Portrait id={witness.id} name={witness.name} size="large" /><span>Entrevista · {witness.name}</span><h2>{witness.profile}</h2><p>Pregunta por aquello que no contó al comenzar la investigación.</p>{game.interviews.includes(witness.id) ? <><h3>Secreto: {witness.secret}</h3><blockquote className="testimony">«{witness.statement}»</blockquote><small>Declaración adaptada a partir de la ficha original.</small></> : <><p className="secret-pending">Secreto: todavía no lo ha contado.</p><Button className="primary-action" onClick={() => { play('tap'); dispatch({ type: 'interview', id: witness.id }); }}>Registrar declaración</Button></>}</article>
            </div>
            <details className="cast-details">
              <summary>Ficha completa del caso: investigadores, niños, víctima, inspector y animales</summary>
              {castGroups.map(group => <div key={group}><p className="cast-group">{group}</p><div className="cast-grid">{cast.filter(item => item.group === group).map(item => <div className="cast-card" key={item.id}><Portrait id={item.id} name={item.name} decorative /><div><strong>{item.name}</strong><small>{item.profile}</small>{item.tag && <em>{item.tag}</em>}</div></div>)}</div></div>)}
              <p className="cast-source">Textos transcritos de la ficha gráfica original.</p>
            </details>
            <article className="brief-card interview-progress"><span>Declaraciones registradas</span><h2>{game.interviews.length} / {witnesses.length}</h2>{interviewsDone ? <><p>Inés es la única que niega lo que otros afirman. Confróntala con el expediente antes de ordenar los hechos.</p><Button onClick={() => navigate('confrontacion')}>{confronted ? 'Revisar la confrontación' : 'Confrontar a Inés'} <ArrowRight /></Button></> : <p>Escucha a todas las personas del caso. No todas las mentiras tienen que ver con la muerte de Samuel.</p>}</article>
          </div>}
          {view === 'confrontacion' && interviewsDone && <div className="map-view">
            <Button variant="outline" className="quiet-action" onClick={() => navigate('personas')}><ArrowLeft /> Personas del caso</Button>
            <div className="eyebrow exterior-heading">Fase 05 · Confrontación</div><h1>La versión de Inés</h1><p className="lead">Inés Robles sostiene tres afirmaciones. Para cada una, elige la prueba o declaración del expediente que la contradice. Esto no la acusa todavía: sólo pone a prueba su relato.</p>
            <div className="confrontation-progress" aria-label="Afirmaciones rebatidas">{confrontations.map((item, index) => <span key={item.id} className={game.confrontations.includes(item.id) ? 'done' : item.id === currentConfrontation?.id ? 'current' : ''}>0{index + 1}</span>)}</div>
            {confrontations.map((item, index) => {
              const settled = game.confrontations.includes(item.id);
              if (!settled && item.id !== currentConfrontation?.id) return null;
              return <article key={item.id} className={`brief-card confrontation ${settled ? 'settled' : ''}`}><Portrait id="ines" name="Inés Robles" size="large" /><span>Afirmación 0{index + 1} · Inés Robles</span><blockquote className="testimony">«{item.claim}»</blockquote>
                {settled ? <><h3>Respuesta de Inés</h3><blockquote className="testimony reply">«{item.reply}»</blockquote><p>{item.note}</p></> : <><p>¿Qué contradice esta afirmación?</p><div className="question-list">{item.options.map(option => <Button key={option.label} variant="outline" onClick={() => { note(option.message, option.correct ? 'hit' : 'miss'); if (option.correct) dispatch({ type: 'confront', id: item.id }); }}>{option.label}</Button>)}</div></>}
              </article>;
            })}
            <Feedback {...feedback} className="inspection-feedback" />
            {confronted && <article className="brief-card completion"><span>Confrontación completada</span><h2>El relato de Inés ha cambiado dos veces</h2><p>Admitió la discusión y su motivo, y guardó silencio sobre la puerta lateral. Ahora te corresponde ordenar los hechos con las siete pruebas, los horarios y las declaraciones.</p><Button onClick={() => navigate('conclusion')}>Reconstruir la noche <ArrowRight /></Button></article>}
          </div>}
          {view === 'conclusion' && confronted && <div className="map-view">
            <div className="eyebrow">Fases 06 y 07 · La verdad</div><h1>Reconstrucción del caso</h1><p className="lead">Ordena únicamente lo que encaja con las siete pruebas, los horarios y las declaraciones.</p>
            {!game.reconstruction ? <article className="brief-card deduction-card"><h2>¿Qué relato explica mejor el conjunto?</h2><div className="question-list">
              <Button variant="outline" onClick={() => note('La hora del reloj no basta para demostrar un plan previo, y varias mentiras tienen motivos personales.', 'miss')}>Javier planeó la muerte y preparó el apagón para ocultarla.</Button>
              <Button variant="outline" onClick={() => { dispatch({ type: 'reconstruct' }); note('Reconstrucción coherente. Ya puedes formular una acusación completa.', 'hit'); }}>Samuel citó a alguien por los documentos; hubo una discusión y una caída, seguida de una huida por el acceso lateral.</Button>
              <Button variant="outline" onClick={() => note('La pieza metálica y la puerta justifican investigar un recorrido, pero no prueban que un intruso desconocido matara a Samuel.', 'miss')}>Un intruso entró desde los establos y atacó a Samuel a las 00:06.</Button>
            </div><Feedback {...feedback} /></article> : <>
              <article className="brief-card reconstruction"><Portrait id="samuel" name="Samuel Valdés" size="large" /><span>Relato compatible con las pruebas</span><h2>Una discusión, una caída y una decisión</h2><ol><li>Samuel había citado a Inés para hablar de documentos relacionados con Valdemora.</li><li>La conversación se volvió tensa y, durante un forcejeo, Samuel cayó y se golpeó la cabeza.</li><li>El apagón impidió que los demás vieran con claridad lo ocurrido.</li><li>Inés no pidió ayuda y abandonó el lugar por la puerta lateral.</li></ol><p>Esta reconstrucción conserva la resolución del prototipo original. La acusación debe identificar tanto la responsabilidad como la conducta posterior.</p></article>
              {!game.solved ? <article className="brief-card accusation"><span>Acusación final</span><h2>Presenta una teoría completa</h2>
                <fieldset><legend>¿A quién acusas?</legend><RadioGroup name="accused" value={accused} onValueChange={value => setAccused(String(value))}>{[['ines','Inés Robles'],['javier','Javier López'],['veronica','Verónica Benítez'],['maria','María Gómez']].map(([value,label]) => { const id = `accused-${value}`; return <label className="radio-option" htmlFor={id} key={value}><RadioGroupItem id={id} value={value} /><Portrait id={value} name={label} decorative /><span>{label}</span></label>; })}</RadioGroup></fieldset>
                <fieldset><legend>¿Qué ocurrió?</legend><RadioGroup name="event-theory" value={eventTheory} onValueChange={value => setEventTheory(String(value))}>{[['fall','Una discusión terminó en una caída fatal.'],['attack','Fue un ataque premeditado durante el apagón.'],['accident','Samuel sufrió un accidente estando solo.']].map(([value,label]) => { const id = `event-${value}`; return <label className="radio-option" htmlFor={id} key={value}><RadioGroupItem id={id} value={value} /><span>{label}</span></label>; })}</RadioGroup></fieldset>
                <fieldset><legend>¿Qué hizo después?</legend><RadioGroup name="exit-theory" value={exitTheory} onValueChange={value => setExitTheory(String(value))}>{[['side','Se marchó por la puerta lateral sin pedir ayuda.'],['stable','Ocultó las pruebas en los establos.'],['stay','Permaneció con el grupo hasta las 00:17.']].map(([value,label]) => { const id = `exit-${value}`; return <label className="radio-option" htmlFor={id} key={value}><RadioGroupItem id={id} value={value} /><span>{label}</span></label>; })}</RadioGroup></fieldset>
                <Button className="primary-action" onClick={() => { if (!accused || !eventTheory || !exitTheory) note('Completa las tres partes de la acusación.'); else if (accused === 'ines' && eventTheory === 'fall' && exitTheory === 'side') { dispatch({ type: 'solve' }); note('Acusación correcta.', 'win'); } else note('La teoría no encaja con todo el expediente. Revisa quién discutió con Samuel, la naturaleza de la caída y el acceso lateral.', 'miss'); }}>Confirmar acusación</Button><Feedback {...feedback} />
              </article> : <article className="case-solved"><span>Caso 001 · Cerrado</span><h2>Acusación correcta</h2><p>Has distinguido las mentiras personales de los hechos relevantes y has explicado las siete pruebas sin atribuirles más de lo que demuestran.</p><div className="final-actions"><Button onClick={() => navigate('regalo')}>Abrir el regalo de Laura <Gift /></Button><Button variant="outline" onClick={() => navigate('cronologia')}>Revisar el expediente</Button></div></article>}
            </>}
          </div>}
          {view === 'regalo' && game.solved && <div className="gift-view">
            {!game.giftOpened ? <article className="gift-sealed"><Gift aria-hidden="true" /><div className="eyebrow">Una última sorpresa</div><h1>El caso está cerrado.</h1><p>Laura dejó algo para cuando terminara la investigación. La recompensa original de Valdemora está preparada.</p><Button className="primary-action" onClick={() => { play('win'); dispatch({ type: 'gift' }); }}>Abrir el sobre</Button></article> : <>
              <div className="eyebrow">Regalo de Laura</div><h1>Una noche diferente en Madrid.</h1><p className="lead">La invitación queda fuera del expediente. Esta parte es sólo para vosotros.</p><div className="gift-ticket"><Image src={assetPath('/assets/original/regalo-laura.jpg')} alt="Invitación de Laura para una experiencia en StreetXO Madrid" width={1536} height={1024} priority sizes="(max-width: 900px) 100vw, 80vw" /></div><div className="final-actions"><Button variant="outline" onClick={() => navigate('conclusion')}>Volver al caso cerrado</Button><Button variant="outline" onClick={() => navigate('intro')}>Volver al inicio</Button></div>
            </>}
          </div>}
          {(view === 'acceso' || view === 'establos') && game.testimony && <div className="map-view">
            <Button variant="outline" className="quiet-action" onClick={openMap}><ArrowLeft /> Mapa de la finca</Button>
            <div className="eyebrow exterior-heading">Recorrido exterior · {view === 'acceso' ? '02' : '03'}</div>
            <h1>{view === 'acceso' ? 'La puerta lateral' : 'El suelo de los establos'}</h1>
            <p className="lead">{view === 'acceso' ? 'El acceso que reconociste en la fotografía está frente a ti. Busca una alteración relevante sin asumir todavía cuándo se produjo.' : 'El recorrido continúa por los establos. Busca un objeto que pueda guardar relación con el sonido de medianoche.'}</p>
            <div className="briefing-grid"><article className="brief-card"><span>Inspección del lugar</span><h2>{view === 'acceso' ? 'Puerta de servicio' : 'Zona de paso'}</h2>
              <SceneReference src="/assets/original/mapa-finca.jpg" alt="Mapa original de la finca" box={zoneBoxes[view]} caption={`Mapa original · ${view === 'acceso' ? 'Acceso lateral' : 'Establos'}`} />
              {game.found.includes(view === 'acceso' ? 6 : 7) && exteriorSearch !== view ? <><p>Esta zona ya fue inspeccionada y la prueba permanece guardada en tu partida.</p><div className="registered-stamp"><Check /> Prueba registrada</div><Button variant="outline" className="review-inspection" onClick={() => { setExteriorSearch(view); note('Repaso abierto. Elige un punto del entorno.'); }}>Revisar la inspección</Button></> : exteriorSearch !== view ? <><p>Abre la inspección y decide qué parte del entorno merece quedar registrada.</p><Button className="primary-action" onClick={() => { setExteriorSearch(view); note('Inspección abierta. Elige un punto del entorno.'); }}><Eye /> Iniciar inspección</Button></> : <div className="search-area"><p>Selecciona un punto para examinar:</p><div className="question-list">{(view === 'acceso' ? [
                ['La manilla y la cerradura', 'La cerradura no presenta daños visibles. No puedes deducir que la puerta fuera forzada.', false],
                ['El marco superior', 'El marco está intacto. No encuentras nada que deba incorporarse como prueba.', false],
                ['El umbral y el suelo', 'La humedad junto a la puerta es una observación verificable. Prueba registrada.', true],
              ] : [
                ['Las monturas', 'Las monturas están colocadas. No explican el objeto metálico del expediente.', false],
                ['El montón de paja', 'No encuentras ninguna alteración relevante entre la paja.', false],
                ['El suelo junto al paso', 'Encuentras una pieza metálica suelta. Prueba registrada.', true],
              ]).map(([label, message, correct]) => <Button key={String(label)} variant="outline" onClick={() => { note(String(message), correct ? 'hit' : 'miss'); if (correct) dispatch({ type: 'discover', id: view === 'acceso' ? 6 : 7 }); }}>{label}</Button>)}</div></div>}
              <Feedback {...feedback} className="inspection-feedback" />
            </article>
              <aside className="brief-card"><span>Cuaderno de campo</span>{game.found.includes(view === 'acceso' ? 6 : 7) ? <><h2>{view === 'acceso' ? clues[5].title : clues[6].title}</h2><CluePhoto id={view === 'acceso' ? 6 : 7} /><p>Prueba {view === 'acceso' ? '06' : '07'} incorporada al expediente. Relaciónala con la fotografía y el testimonio.</p><Button onClick={() => navigate(game.found.includes(view === 'acceso' ? 7 : 6) ? 'deducciones' : view === 'acceso' ? 'establos' : 'acceso')}>{game.found.includes(view === 'acceso' ? 7 : 6) ? 'Relacionar las pruebas' : view === 'acceso' ? 'Continuar a los establos' : 'Inspeccionar la puerta'} <ArrowRight /></Button></> : <><h2>Observación pendiente</h2><p>Examina el punto de interés para incorporar la prueba al expediente.</p></>}</aside></div>
          </div>}
          {view === 'hugo' && game.deduction && <div className="map-view">
            <div className="eyebrow">Testimonio 01 · El apagón</div><h1>Lo que escuchó Hugo</h1><p className="lead">Separa lo que oyó de lo que pudo ver. Una posibilidad todavía no es una prueba.</p>
            <div className="witness-banner"><Portrait id="hugo" name="Hugo" size="large" /><div><strong>Hugo</strong><small>Hijo de Verónica y Daniel. Asustadizo y muy enérgico. Importante testigo.</small></div></div>
            <div className="question-list">{questions.map(q => <article className="brief-card" key={q.id}><Button variant="outline" onClick={() => dispatch({ type: 'answer', id: q.id })}>{game.answers.includes(q.id) && <Check />}{q.question}</Button>{game.answers.includes(q.id) && <blockquote className="testimony">«{q.answer}»</blockquote>}</article>)}</div>
            {game.answers.length === questions.length && <article className="brief-card deduction-card"><h2>Un ruido, ninguna identificación</h2><p>Hugo sitúa el sonido metálico a las 00:00, durante el apagón. Su declaración no identifica a nadie ni demuestra que se abriera la puerta.</p><Button disabled={game.testimony} onClick={() => { play('hit'); dispatch({ type: 'testimony' }); }}>{game.testimony ? 'Testimonio registrado' : 'Registrar testimonio'}</Button></article>}
            {game.testimony && <article className="brief-card completion"><span>Primer recorrido completado</span><h2>La siguiente pregunta está en la puerta</h2><p>El acceso lateral y los establos están disponibles. Contrasta las pruebas del exterior con el ruido que escuchó Hugo.</p><Button onClick={() => navigate('acceso')}>Inspeccionar el acceso lateral <ArrowRight /></Button></article>}
          </div>}
          {view === 'cronologia' && <div className="map-view"><div className="eyebrow">Registro de la noche</div><h1>Los minutos del apagón</h1><p className="lead">Horarios recogidos en el expediente inicial. Los testimonios ayudarán a interpretarlos.</p><ol className="timeline-list">{timeline.map(([time, event]) => <li key={time}><time>{time}</time><div>{event}{time === '00:00' && game.testimony && <small>Declaración de Hugo registrada · no identifica al responsable.</small>}</div></li>)}</ol></div>}
          </>}
        </section>
      </div>
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}><AlertDialogContent><AlertDialogTitle>¿Reiniciar la investigación?</AlertDialogTitle><AlertDialogDescription>Se borrarán las pruebas, deducciones y respuestas de esta partida en este dispositivo.</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel>Conservar partida</AlertDialogCancel><AlertDialogAction onClick={() => { setGame(initialState); navigate('intro'); setResetOpen(false); }}>Reiniciar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </main>
  );
}
