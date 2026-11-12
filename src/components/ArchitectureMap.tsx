import { useState } from 'react';
import '../styles/architecture-map.css';

const products = [
  { name: 'Legajo Digital', channel: 'Web', detail: 'Identidad y datos laborales centralizados.', x: 20, y: 22 },
  { name: 'App Suplencias', channel: 'Android', detail: 'Suplencias y vistas por jefatura con permisos específicos.', x: 80, y: 22 },
  { name: 'Gestión RRHH', channel: 'Windows', detail: 'Horas, francos, imprevistos, médicos, licencias, fichas e informes.', x: 20, y: 76 },
  { name: 'Consulta Horas', channel: 'Portal', detail: 'Consulta individual de solo lectura mediante RPC.', x: 80, y: 76 },
];

export default function ArchitectureMap() {
  const [selected, setSelected] = useState(0);
  return <div className="architecture-map" aria-label="Arquitectura del ecosistema RRHH">
    <div className="architecture-canvas">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {products.map((product, index) => <path key={product.name} className={selected === index ? 'active' : ''} d={`M ${product.x} ${product.y} V 49 H 50`} />)}
      </svg>
      <div className="architecture-core"><strong>Supabase</strong><small>Auth · roles · RLS · RPC</small></div>
      {products.map((product, index) => <button key={product.name} type="button" style={{ left: `${product.x}%`, top: `${product.y}%` }} aria-pressed={selected === index} aria-controls="architecture-detail" onClick={() => setSelected(index)}>
        <small>{product.channel}</small><strong>{product.name}</strong>
      </button>)}
    </div>
    <div className="architecture-detail" id="architecture-detail" role="status" aria-live="polite"><strong>{products[selected].name}</strong><p>{products[selected].detail}</p></div>
  </div>;
}
