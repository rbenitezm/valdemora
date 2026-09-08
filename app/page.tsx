'use client';

import { useEffect, useState } from 'react';
import { advance, initialState, restore, clues, timeline, questions, type Action } from '@/lib/case';
import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogFooter } from '@/components/ui/alert-dialog';
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
} from 'lucide-react';

import { Button } from '@/components/ui/button';

type View = 'intro' | 'finca' | 'bosque' | 'deducciones' | 'hugo' | 'cronologia';

const locations = [
  { name: 'Bosque norte', detail: 'Primer recorrido disponible', active: true },
  { name: 'Casa principal', detail: 'Pendiente de inspección', active: false },
  { name: 'Acceso lateral', detail: 'Pendiente de inspección', active: false },
  { name: 'Establos', detail: 'Pendiente de inspección', active: false },
];

export default function Home() {
  const [view, setView] = useState<View>('intro');
  const [game, setGame] = useState(initialState);
  const [ready, setReady] = useState(false);
  const [saveStatus, setSaveStatus] = useState('Cargando partida…');
  const [resetOpen, setResetOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const observationFound = game.found.includes(4);
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
          Investigación abierta
          <b>{observationFound ? '1' : '0'} / 7 pruebas</b>
        </div>
      </header>

      <div className="workspace">
        <nav className="case-nav" aria-label="Secciones del caso">
          <p>Expediente</p>
          <button className={view === 'intro' ? 'active' : ''} onClick={() => setView('intro')}>
            <FileText aria-hidden="true" />
            El caso
          </button>
          <button aria-label="La finca" className={['finca', 'bosque'].includes(view) ? 'active' : ''} onClick={openMap}>
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

          <div className="case-progress">
            <div>
              <span>Progreso del caso</span>
              <strong>{observationFound ? '14' : '0'}%</strong>
            </div>
            <div className="progress-track">
              <i style={{ width: observationFound ? '14%' : '0%' }} />
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
                  <p>Selecciona una zona para inspeccionarla. El bosque norte es el primer recorrido disponible.</p>
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
                      onClick={() => setView('bosque')}
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
          {view === 'hugo' && game.deduction && <div className="map-view">
            <div className="eyebrow">Testimonio 01 · El apagón</div><h1>Lo que escuchó Hugo</h1><p className="lead">Separa lo que oyó de lo que pudo ver. Una posibilidad todavía no es una prueba.</p>
            <div className="question-list">{questions.map(q => <article className="brief-card" key={q.id}><Button variant="outline" onClick={() => dispatch({ type: 'answer', id: q.id })}>{game.answers.includes(q.id) && <Check />}{q.question}</Button>{game.answers.includes(q.id) && <blockquote className="testimony">«{q.answer}»</blockquote>}</article>)}</div>
            {game.answers.length === questions.length && <article className="brief-card deduction-card"><h2>Un ruido, ninguna identificación</h2><p>Hugo sitúa el sonido metálico a las 00:00, durante el apagón. Su declaración no identifica a nadie ni demuestra que se abriera la puerta.</p><Button disabled={game.testimony} onClick={() => dispatch({ type: 'testimony' })}>{game.testimony ? 'Testimonio registrado' : 'Registrar testimonio'}</Button></article>}
            {game.testimony && <article className="brief-card completion"><span>Primer recorrido completado</span><h2>La siguiente pregunta está en la puerta</h2><p>Has encontrado una prueba, formulado una deducción y contrastado un testimonio. El acceso lateral será el siguiente lugar que inspeccionar. Esta primera parte termina aquí.</p><Button onClick={() => navigate('cronologia')}>Revisar la cronología</Button></article>}
          </div>}
          {view === 'cronologia' && <div className="map-view"><div className="eyebrow">Registro de la noche</div><h1>Los minutos del apagón</h1><p className="lead">Horarios recogidos en el expediente inicial. Los testimonios ayudarán a interpretarlos.</p><ol className="timeline-list">{timeline.map(([time, event]) => <li key={time}><time>{time}</time><div>{event}{time === '00:00' && game.testimony && <small>Declaración de Hugo registrada · no identifica al responsable.</small>}</div></li>)}</ol></div>}
          </>}
        </section>
      </div>
      <AlertDialog open={resetOpen} onOpenChange={setResetOpen}><AlertDialogContent><AlertDialogTitle>¿Reiniciar la investigación?</AlertDialogTitle><AlertDialogDescription>Se borrarán las pruebas, deducciones y respuestas de esta partida en este dispositivo.</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel>Conservar partida</AlertDialogCancel><AlertDialogAction onClick={() => { setGame(initialState); navigate('intro'); setResetOpen(false); }}>Reiniciar</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
    </main>
  );
}
