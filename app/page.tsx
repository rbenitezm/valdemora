'use client';

import { useEffect, useState } from 'react';
import { advance, initialState, restore, clues, timeline, questions, rooms, witnesses, requiredWitnesses, type Action } from '@/lib/case';
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';

type View = 'intro' | 'finca' | 'bosque' | 'deducciones' | 'hugo' | 'cronologia' | 'acceso' | 'establos' | 'casa' | 'personas' | 'conclusion';

export default function Home() {
  const [view, setView] = useState<View>('intro');
  const [game, setGame] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Cargando partida…');
  const [resetOpen, setResetOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [roomId, setRoomId] = useState<number>(1);
  const [witnessId, setWitnessId] = useState('daniel');
  const [accused, setAccused] = useState('');
  const [eventTheory, setEventTheory] = useState('');
  const [exitTheory, setExitTheory] = useState('');
  const room = rooms.find(item => item.id === roomId) ?? rooms[0];
  const witness = witnesses.find(item => item.id === witnessId) ?? witnesses[0];
  const observationFound = game.found.includes(4);
  const progress = Math.round(game.found.length / 7 * 100);
  const locations: { name: string; detail: string; active: boolean; view: View }[] = [
    { name: 'Bosque norte', detail: observationFound ? 'Fotografía registrada' : 'Inspeccionar el sendero', active: true, view: 'bosque' },
    { name: 'Casa principal', detail: game.exterior ? 'Cuatro estancias disponibles' : 'Completa la deducción del exterior', active: game.exterior, view: 'casa' },
    { name: 'Acceso lateral', detail: game.found.includes(6) ? 'Humedad registrada' : game.testimony ? 'Inspeccionar la puerta' : 'Registra el testimonio de Hugo', active: game.testimony, view: 'acceso' },
    { name: 'Establos', detail: game.found.includes(7) ? 'Pieza metálica registrada' : game.testimony ? 'Inspeccionar el suelo' : 'Registra el testimonio de Hugo', active: game.testimony, view: 'establos' },
  ];
  const dispatch = (action: Action) => setGame(current => advance(current, action));
  // Storage is browser-only: restore after hydration before enabling game actions.
  /* oxlint-disable react/react-compiler */
  useEffect(() => {
    try { setGame(restore(localStorage.getItem('valdemora-rebuild-v1'))); }
    catch { setSaveStatus('Guardado no disponible en este navegador.'); }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem('valdemora-rebuild-v1', JSON.stringify(game)); setSaveStatus('Partida guardada en este dispositivo'); }
    catch { setSaveStatus('No se pudo guardar. Puedes seguir jugando en esta sesión.'); }
  }, [game, ready]);
  /* oxlint-enable react/react-compiler */
  const navigate = (next: View) => { setView(next); setFeedback(''); };

  const openMap = () => setView('finca');

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

        <div className="case-status" aria-live="polite">
          <span className="status-dot" />
          {game.solved ? 'Caso resuelto' : 'Investigación abierta'}
          <b>{game.found.length} / 7 pruebas</b>
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
          <button aria-label="Interrogar a Hugo" disabled={!game.deduction} className={view === 'hugo' ? 'active' : ''} onClick={() => navigate('hugo')}>
            <FileText aria-hidden="true" /> Hugo
          </button>
          <button aria-label="Personas del caso" disabled={!game.interior} className={view === 'personas' ? 'active' : ''} onClick={() => navigate('personas')}>
            <Users aria-hidden="true" /> Personas
          </button>
          <button aria-label="Reconstrucción y acusación" disabled={!requiredWitnesses.every(id => game.interviews.includes(id))} className={view === 'conclusion' ? 'active' : ''} onClick={() => navigate('conclusion')}>
            <Gavel aria-hidden="true" /> Conclusión
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
          <div className="save-bar"><output>{saveStatus}</output><Button variant="ghost" disabled={!ready} onClick={() => setResetOpen(true)}>Reiniciar partida</Button></div>
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
                  src="/assets/original/menu-principal.jpg"
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
                  <Button className="primary-action" onClick={openMap}>
                    {observationFound ? 'Continuar investigación' : 'Comenzar investigación'} <ArrowRight aria-hidden="true" />
                  </Button>
                </article>
                <article className="brief-card note-card">
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
                    src="/assets/original/mapa-finca.jpg"
                    alt="Mapa ilustrado de la finca Valdemora"
                    width={275}
                    height={370}
                    sizes="(max-width: 900px) 100vw, 60vw"
                  />
                  <button className="map-marker marker-forest" onClick={() => setView('bosque')}>
                    <span /> Bosque norte
                  </button>
                  <div className="map-coordinate">40° 24′ N · Recorrido 01</div>
                </div>

                <aside className="locations-panel">
                  <p className="panel-kicker">Zonas registradas</p>
                  {locations.map((location, index) => (
                    <button
                      key={location.name}
                      disabled={!location.active}
                      onClick={() => navigate(location.view)}
                    >
                      <span className="location-index">0{index + 1}</span>
                      <span>
                        <strong>{location.name}</strong>
                        <small>{location.detail}</small>
                      </span>
                      {location.active ? <ArrowRight aria-hidden="true" /> : <span className="lock-dot" />}
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
                    onClick={() => dispatch({ type: 'discover' })}
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
              <div className="evidence-register">{clues.map(clue => <div key={clue.id}><span>{game.found.includes(clue.id) ? '✓' : '—'} {clue.location}</span><strong>{game.found.includes(clue.id) ? clue.title : 'Pendiente de inspección'}</strong></div>)}</div>
              {game.interior ? <><h3>Relación temporal registrada</h3><p>Las 00:06 están entre el apagón de las 23:58 y el regreso de la luz a las 00:09. El reloj aporta una referencia que todavía necesita explicación.</p><p>Las siete pruebas están reunidas. La reconstrucción y los testimonios de los sospechosos serán la siguiente parte de la investigación.</p><Button onClick={() => navigate('cronologia')}>Consultar la cronología</Button></> : game.found.length === 7 ? <div className="question-list"><p>¿Qué puedes afirmar al comparar el reloj con los horarios?</p><Button variant="outline" onClick={() => setFeedback('Un reloj detenido no determina por sí solo la hora de la muerte.')}>Samuel murió exactamente a las 00:06.</Button><Button variant="outline" onClick={() => { dispatch({ type: 'interior' }); setFeedback('Relación temporal registrada. Aún falta explicar por qué se detuvo el reloj.'); }}>La hora del reloj cae dentro del apagón, pero no demuestra cuándo murió Samuel.</Button><Button variant="outline" onClick={() => setFeedback('La luz volvió a las 00:09, tres minutos después de la hora que marca el reloj.')}>El reloj se detuvo después de volver la luz.</Button></div> : <><p>Reúne las cuatro pruebas de la casa para contrastar el conjunto.</p><Button onClick={() => navigate('casa')}>Inspeccionar la casa</Button></>}
              <output>{feedback}</output>
            </article>}
            {game.testimony && <article className="brief-card deduction-card"><span>Recorrido exterior · Deducción 02</span><h2>Una puerta, una pieza, un sonido</h2>
              <div className="question-list">{clues.filter(c => c.id === 6 || c.id === 7).map(c => <div key={c.id}><strong>{game.found.includes(c.id) ? c.title : 'Prueba pendiente de inspección'}</strong><p>{c.location}</p></div>)}</div>
              {game.exterior ? <div className="completion"><h3>Hipótesis del recorrido registrada</h3><p>La humedad, la pieza metálica y el testimonio justifican investigar un posible recorrido exterior. No identifican a una persona ni fijan la hora de paso.</p><p>El interior de la casa está disponible. Busca allí las otras cuatro pruebas.</p><Button onClick={() => navigate('casa')}>Entrar en la casa</Button></div> : [6, 7].every(id => game.found.includes(id)) ? <div className="question-list"><p>Hugo oyó un ruido metálico a las 00:00. ¿Qué relación puedes establecer?</p><Button variant="outline" onClick={() => setFeedback('No sabemos si esta pieza produjo el ruido. Coincidir en el material no demuestra el origen del sonido.')}>La pieza produjo con certeza el ruido de medianoche.</Button><Button variant="outline" onClick={() => { dispatch({ type: 'exterior' }); setFeedback('Hipótesis registrada. Quedan por comprobar la hora y la persona.'); }}>Las pruebas son compatibles con un recorrido exterior que debemos contrastar.</Button><Button variant="outline" onClick={() => setFeedback('La humedad no permite determinar quién pasó ni a qué hora. Falta evidencia para acusar.')}>La humedad identifica al responsable de la muerte.</Button></div> : <><p>Necesitas registrar la humedad de la puerta y la pieza de los establos antes de relacionarlas.</p><Button onClick={openMap}>Volver a las zonas de inspección</Button></>}
            </article>}
            {!observationFound ? <article className="brief-card"><h2>Aún no has registrado pruebas</h2><p>Explora el bosque y examina la fotografía antigua.</p><Button onClick={() => navigate('bosque')}>Ir al bosque</Button></article> : <>
              <div className="briefing-grid"><article className="brief-card"><span>Prueba 04 · Bosque</span><h2>{clues[3].title}</h2><p>En la fotografía aparece una puerta lateral de la casa.</p></article><article className="brief-card"><span>Observación del lugar</span><h2>Un acceso visible desde el bosque</h2><p>La disposición del edificio permite relacionar la fotografía con esa puerta.</p></article></div>
              <article className="brief-card deduction-card"><h2>¿Qué puedes concluir con lo que sabes?</h2>
                {game.deduction ? <><p>Existe un acceso lateral que merece investigarse. Aún no sabes quién lo utilizó ni cuándo.</p><Button onClick={() => navigate('hugo')}>Interrogar a Hugo <ArrowRight /></Button></> : <div className="question-list">
                  <Button variant="outline" onClick={() => setFeedback('La fotografía muestra un acceso, pero no identifica a ninguna persona.')}>La fotografía identifica al responsable.</Button>
                  <Button variant="outline" onClick={() => { dispatch({ type: 'deduce' }); setFeedback('Deducción registrada. Puedes contrastarla con el testimonio de Hugo.'); }}>Existe otra vía de entrada o salida que debemos comprobar.</Button>
                  <Button variant="outline" onClick={() => setFeedback('Una fotografía antigua no demuestra qué ocurrió durante el apagón.')}>La puerta se utilizó durante el apagón.</Button>
                </div>}
                <output>{feedback}</output>
              </article>
            </>}
          </div>}
          {view === 'casa' && game.exterior && <div className="map-view">
            <Button variant="outline" className="quiet-action" onClick={openMap}><ArrowLeft /> Mapa de la finca</Button><div className="eyebrow exterior-heading">Recorrido interior</div><h1>Dentro de Valdemora</h1><p className="lead">Recorre las cuatro estancias y registra los objetos antes de interpretar su relación con la noche.</p>
            <div className="house-layout"><div><Image className="house-plan" src="/assets/original/plano-casa.jpg" alt="Plano original de la casa Valdemora" width={315} height={325} /><div className="question-list" aria-label="Estancias de la casa">{rooms.map(item => <Button key={item.id} variant={item.id === room.id ? 'default' : 'outline'} aria-pressed={item.id === room.id} onClick={() => setRoomId(item.id)}>{game.found.includes(item.id) && <Check aria-hidden="true" />}{item.name}</Button>)}</div></div>
              <article className="brief-card"><span>{room.name}</span><h2>{room.title}</h2><p>{room.description}</p><Button className="primary-action" disabled={game.found.includes(room.id)} onClick={() => dispatch({ type: 'discover', id: room.id })}>{game.found.includes(room.id) ? 'Prueba registrada' : 'Examinar y registrar'}</Button>{game.found.includes(room.id) && <div className="interior-finding"><h3>{clues.find(clue => clue.id === room.id)?.title}</h3><p>{room.caution}</p><Button variant="outline" onClick={() => { const next = rooms.find(item => !game.found.includes(item.id)); if (next) setRoomId(next.id); else navigate('deducciones'); }}>{rooms.some(item => !game.found.includes(item.id)) ? 'Ir a una estancia pendiente' : 'Relacionar las siete pruebas'} <ArrowRight /></Button></div>}</article>
            </div>
          </div>}
          {view === 'personas' && game.interior && <div className="map-view">
            <div className="eyebrow">Fase 04 · Testimonios</div><h1>Todos ocultan algo</h1><p className="lead">Un secreto puede explicar una mentira sin convertirla en asesinato. Registra las cuatro declaraciones clave para reconstruir la noche; las demás amplían el expediente.</p>
            <Image className="character-board" src="/assets/original/personajes.jpg" alt="Fichas originales de personajes del caso Valdemora" width={1536} height={1024} sizes="(max-width: 900px) 100vw, 70vw" />
            <div className="interview-layout"><div className="witness-list" aria-label="Personas disponibles">{witnesses.map(item => <button key={item.id} className={item.id === witness.id ? 'active' : ''} onClick={() => setWitnessId(item.id)}><span>{game.interviews.includes(item.id) ? '✓' : item.essential ? '!' : '·'}</span><div><strong>{item.name}</strong><small>{item.essential ? 'Declaración clave' : 'Declaración adicional'}</small></div></button>)}</div>
              <article className="brief-card witness-card"><span>Entrevista · {witness.name}</span><h2>{witness.profile}</h2><p>Pregunta por aquello que no contó al comenzar la investigación.</p>{game.interviews.includes(witness.id) ? <><h3>{witness.secret}</h3><blockquote className="testimony">«{witness.statement}»</blockquote><small>Declaración adaptada a partir de la ficha original.</small></> : <Button className="primary-action" onClick={() => dispatch({ type: 'interview', id: witness.id })}>Registrar declaración</Button>}</article>
            </div>
            <article className="brief-card interview-progress"><span>Declaraciones clave</span><h2>{requiredWitnesses.filter(id => game.interviews.includes(id)).length} / {requiredWitnesses.length}</h2>{requiredWitnesses.every(id => game.interviews.includes(id)) ? <><p>Ya puedes ordenar los hechos sin confundir los secretos personales con la responsabilidad por la muerte.</p><Button onClick={() => navigate('conclusion')}>Reconstruir la noche <ArrowRight /></Button></> : <p>Busca las fichas marcadas con un signo de exclamación.</p>}</article>
          </div>}
          {view === 'conclusion' && game.interior && requiredWitnesses.every(id => game.interviews.includes(id)) && <div className="map-view">
            <div className="eyebrow">Fases 06 y 07 · La verdad</div><h1>Reconstrucción del caso</h1><p className="lead">Ordena únicamente lo que encaja con las siete pruebas, los horarios y las declaraciones.</p>
            {!game.reconstruction ? <article className="brief-card deduction-card"><h2>¿Qué relato explica mejor el conjunto?</h2><div className="question-list">
              <Button variant="outline" onClick={() => setFeedback('La hora del reloj no basta para demostrar un plan previo, y varias mentiras tienen motivos personales.')}>Javier planeó la muerte y preparó el apagón para ocultarla.</Button>
              <Button variant="outline" onClick={() => { dispatch({ type: 'reconstruct' }); setFeedback('Reconstrucción coherente. Ya puedes formular una acusación completa.'); }}>Samuel citó a alguien por los documentos; hubo una discusión y una caída, seguida de una huida por el acceso lateral.</Button>
              <Button variant="outline" onClick={() => setFeedback('La pieza metálica y la puerta justifican investigar un recorrido, pero no prueban que un intruso desconocido matara a Samuel.')}>Un intruso entró desde los establos y atacó a Samuel a las 00:06.</Button>
            </div><output>{feedback}</output></article> : <>
              <article className="brief-card reconstruction"><span>Relato compatible con las pruebas</span><h2>Una discusión, una caída y una decisión</h2><ol><li>Samuel había citado a Inés para hablar de documentos relacionados con Valdemora.</li><li>La conversación se volvió tensa y, durante un forcejeo, Samuel cayó y se golpeó la cabeza.</li><li>El apagón impidió que los demás vieran con claridad lo ocurrido.</li><li>Inés no pidió ayuda y abandonó el lugar por la puerta lateral.</li></ol><p>Esta reconstrucción conserva la resolución del prototipo original. La acusación debe identificar tanto la responsabilidad como la conducta posterior.</p></article>
              {!game.solved ? <article className="brief-card accusation"><span>Acusación final</span><h2>Presenta una teoría completa</h2>
                <fieldset><legend>¿A quién acusas?</legend><RadioGroup value={accused} onValueChange={value => setAccused(String(value))}>{[['ines','Inés Robles'],['javier','Javier López'],['veronica','Verónica Benítez'],['maria','María Gómez']].map(([value,label]) => <label key={value}><RadioGroupItem value={value} />{label}</label>)}</RadioGroup></fieldset>
                <fieldset><legend>¿Qué ocurrió?</legend><RadioGroup value={eventTheory} onValueChange={value => setEventTheory(String(value))}>{[['fall','Una discusión terminó en una caída fatal.'],['attack','Fue un ataque premeditado durante el apagón.'],['accident','Samuel sufrió un accidente estando solo.']].map(([value,label]) => <label key={value}><RadioGroupItem value={value} />{label}</label>)}</RadioGroup></fieldset>
                <fieldset><legend>¿Qué hizo después?</legend><RadioGroup value={exitTheory} onValueChange={value => setExitTheory(String(value))}>{[['side','Se marchó por la puerta lateral sin pedir ayuda.'],['stable','Ocultó las pruebas en los establos.'],['stay','Permaneció con el grupo hasta las 00:17.']].map(([value,label]) => <label key={value}><RadioGroupItem value={value} />{label}</label>)}</RadioGroup></fieldset>
                <Button className="primary-action" onClick={() => { if (!accused || !eventTheory || !exitTheory) setFeedback('Completa las tres partes de la acusación.'); else if (accused === 'ines' && eventTheory === 'fall' && exitTheory === 'side') { dispatch({ type: 'solve' }); setFeedback('Acusación correcta.'); } else setFeedback('La teoría no encaja con todo el expediente. Revisa quién discutió con Samuel, la naturaleza de la caída y el acceso lateral.'); }}>Confirmar acusación</Button><output>{feedback}</output>
              </article> : <article className="case-solved"><span>Caso 001 · Cerrado</span><h2>Acusación correcta</h2><p>Has distinguido las mentiras personales de los hechos relevantes y has explicado las siete pruebas sin atribuirles más de lo que demuestran.</p><Button onClick={() => navigate('cronologia')}>Revisar el expediente final</Button></article>}
            </>}
          </div>}
          {(view === 'acceso' || view === 'establos') && game.testimony && <div className="map-view">
            <Button variant="outline" className="quiet-action" onClick={openMap}><ArrowLeft /> Mapa de la finca</Button>
            <div className="eyebrow exterior-heading">Recorrido exterior · {view === 'acceso' ? '02' : '03'}</div>
            <h1>{view === 'acceso' ? 'La puerta lateral' : 'El suelo de los establos'}</h1>
            <p className="lead">{view === 'acceso' ? 'El acceso que reconociste en la fotografía está frente a ti. Examina el suelo junto a la puerta.' : 'El recorrido continúa por los establos. Examina la pieza metálica que hay en el suelo.'}</p>
            <div className="briefing-grid"><article className="brief-card"><span>Inspección del lugar</span><h2>{view === 'acceso' ? 'Junto al umbral' : 'Un objeto metálico'}</h2><p>{view === 'acceso' ? 'Una marca de humedad destaca junto a la puerta. Su presencia no permite fechar un paso por el acceso.' : 'Hay una pieza metálica en el suelo. Antes de atribuirle el ruido de medianoche, registra dónde se encuentra.'}</p><Button className="primary-action" disabled={game.found.includes(view === 'acceso' ? 6 : 7)} onClick={() => dispatch({ type: 'discover', id: view === 'acceso' ? 6 : 7 })}>{game.found.includes(view === 'acceso' ? 6 : 7) ? <><Check /> Prueba registrada</> : <><Eye /> Examinar y registrar</>}</Button></article>
              <aside className="brief-card"><span>Cuaderno de campo</span>{game.found.includes(view === 'acceso' ? 6 : 7) ? <><h2>{view === 'acceso' ? clues[5].title : clues[6].title}</h2><p>Prueba {view === 'acceso' ? '06' : '07'} incorporada al expediente. Relaciónala con la fotografía y el testimonio.</p><Button onClick={() => navigate(game.found.includes(view === 'acceso' ? 7 : 6) ? 'deducciones' : view === 'acceso' ? 'establos' : 'acceso')}>{game.found.includes(view === 'acceso' ? 7 : 6) ? 'Relacionar las pruebas' : view === 'acceso' ? 'Continuar a los establos' : 'Inspeccionar la puerta'} <ArrowRight /></Button></> : <><h2>Observación pendiente</h2><p>Examina el punto de interés para incorporar la prueba al expediente.</p></>}</aside></div>
          </div>}
          {view === 'hugo' && game.deduction && <div className="map-view">
            <div className="eyebrow">Testimonio 01 · El apagón</div><h1>Lo que escuchó Hugo</h1><p className="lead">Separa lo que oyó de lo que pudo ver. Una posibilidad todavía no es una prueba.</p>
            <div className="question-list">{questions.map(q => <article className="brief-card" key={q.id}><Button variant="outline" onClick={() => dispatch({ type: 'answer', id: q.id })}>{game.answers.includes(q.id) && <Check />}{q.question}</Button>{game.answers.includes(q.id) && <blockquote className="testimony">«{q.answer}»</blockquote>}</article>)}</div>
            {game.answers.length === questions.length && <article className="brief-card deduction-card"><h2>Un ruido, ninguna identificación</h2><p>Hugo sitúa el sonido metálico a las 00:00, durante el apagón. Su declaración no identifica a nadie ni demuestra que se abriera la puerta.</p><Button disabled={game.testimony} onClick={() => dispatch({ type: 'testimony' })}>{game.testimony ? 'Testimonio registrado' : 'Registrar testimonio'}</Button></article>}
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
