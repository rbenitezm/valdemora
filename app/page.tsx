'use client';

import { useState } from 'react';
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

type View = 'intro' | 'finca' | 'bosque';

const locations = [
  { name: 'Bosque norte', detail: 'Primer recorrido disponible', active: true },
  { name: 'Casa principal', detail: 'Pendiente de inspección', active: false },
  { name: 'Acceso lateral', detail: 'Pendiente de inspección', active: false },
  { name: 'Establos', detail: 'Pendiente de inspección', active: false },
];

export default function Home() {
  const [view, setView] = useState<View>('intro');
  const [observationFound, setObservationFound] = useState(false);

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
          <button className={view !== 'intro' ? 'active' : ''} onClick={openMap}>
            <Map aria-hidden="true" />
            La finca
          </button>
          <button disabled>
            <Clock3 aria-hidden="true" />
            Cronología
            <span>bloqueada</span>
          </button>
          <button disabled>
            <Search aria-hidden="true" />
            Deducciones
            <span>bloqueadas</span>
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
                    Comenzar investigación <ArrowRight aria-hidden="true" />
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
                    onClick={() => setObservationFound(true)}
                    aria-label="Examinar el acceso lateral visible desde el bosque"
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
                      <span className="finding-number">Observación 01</span>
                      <h2>Línea de visión</h2>
                      <p>Desde el sendero se distingue una puerta secundaria de la casa. Alguien conocía una salida que el resto del grupo apenas menciona.</p>
                      <div className="finding-rule" />
                      <small>Esto es una observación. Todavía no demuestra quién utilizó la puerta.</small>
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
        </section>
      </div>
    </main>
  );
}
