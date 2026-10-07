import { ShieldCheck, DoorClosed, CloudRain, Frame } from 'lucide-react';
import './security-section.css';
import { SheetEdge } from './Steel.jsx';

const POINTS = [
  { icon: ShieldCheck, title: 'Guarda-corpos', text: 'Soluções para sacadas e escadas, com medidas, desenho e fixação avaliados conforme o projeto.' },
  { icon: DoorClosed, title: 'Portões', text: 'Modelos pensados para o acesso e a composição da fachada, com medidas e acabamento a definir.' },
  { icon: CloudRain, title: 'Coberturas & telhados', text: 'Opções de estrutura embutida ou tradicional, com telhas e acabamento escolhidos para cada espaço.' },
  { icon: Frame, title: 'Molduras & fachadas', text: 'Elementos metálicos que compõem a fachada, com desenho e detalhes definidos para o imóvel.' },
];

export default function SecuritySection() {
  return (
    <section className="sec-section" id="sobre" aria-labelledby="sec-heading">
      <SheetEdge fill="#edeceb" />
      <div className="sec-layout">
        <div className="sec-top">
          <div className="sec-intro reveal">
            <p className="eyebrow"><span className="tiny-line" /> SOBRE A SÃO ROQUE</p>
            <h2 id="sec-heading">Mais que acabamento.<br />Uma estrutura em que<br /><span className="muted">você confia.</span></h2>
            <p className="sec-description">Em Atibaia, SP, a Serralheria São Roque trabalha com estruturas metálicas para diferentes espaços. Medidas, vãos e fixações são avaliados conforme o projeto, com proteção e acabamento definidos na proposta.</p>
          </div>
          <figure className="sec-brand reveal">
            <img src="/images/sao-roque-logo.jpeg" alt="Serralheria São Roque — logo SR em prata e azul" width="1479" height="1064" loading="lazy" />
          </figure>
        </div>

        <div className="sec-grid">
          {POINTS.map(({ icon: Icon, title, text }) => (
            <article className="sec-card reveal" key={title}>
              <Icon size={26} strokeWidth={1.4} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
      <SheetEdge fill="#edeceb" side="bottom" />
    </section>
  );
}
