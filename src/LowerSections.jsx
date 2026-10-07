import { useId, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Plus, Minus, MessageCircle, Instagram, MapPin } from 'lucide-react';
import './lower-sections.css';
import { gsap, useGSAP, prefersReducedMotion } from './gsap.js';
import { SheetEdge, TrussDrawing } from './Steel.jsx';
import PergolaPlanner from './PergolaPlanner.jsx';

const whatsappUrl = 'https://wa.me/5511952869701';
const instagramUrl = 'https://www.instagram.com/saoroqueserralheria/';
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Rua Belém do Pará, 65, Recreio Estoril, Atibaia, SP')}`;

const steps = [
  {
    name: 'Conversa',
    description: 'Tudo começa com você. Entendemos sua rotina, suas referências e o que o seu espaço precisa.',
  },
  {
    name: 'Projeto',
    description: 'Ideias ganham forma. Medidas, materiais e acabamentos são pensados em conjunto, detalhe por detalhe.',
  },
  {
    name: 'Fabricação',
    description: 'Corte, dobra e solda transformam o desenho em estrutura, com precisão em cada junta e cada acabamento.',
  },
  {
    name: 'Instalação',
    description: 'A estrutura é fixada e alinhada no local. Os ajustes finais completam a transformação do espaço.',
  },
];

const questions = [
  {
    question: 'Qual a diferença entre a estrutura embutida e a tradicional?',
    answer: 'Na estrutura metálica embutida, as telhas e parte da calha ficam ocultas. Na estrutura tradicional, as telhas e a calha ficam aparentes, com um acabamento moderno na calha. A escolha muda a aparência da cobertura e deve considerar o seu projeto.',
  },
  {
    question: 'Há opção de cobertura com acabamento amadeirado?',
    answer: 'Sim. A telha de duas faces, conhecida como telha sanduíche, tem opção de forro com acabamento amadeirado. São duas opções de tonalidade, a definir no orçamento.',
  },
  {
    question: 'As opções de cobertura têm o mesmo valor?',
    answer: 'Os valores variam conforme a opção de cobertura e as características do projeto. Medidas, materiais, acabamentos e condições de instalação entram na avaliação. Fale com a São Roque para comparar as opções e solicitar um orçamento para o seu espaço.',
  },
  {
    question: 'Por onde começo meu projeto?',
    answer: 'Conte pelo WhatsApp o que você imagina e como pretende usar o espaço. Fotos, medidas aproximadas e referências ajudam a iniciar a conversa. Os detalhes, a viabilidade e o prazo precisam ser avaliados para cada projeto.',
  },
  {
    question: 'Onde fica a Serralheria São Roque?',
    answer: 'Estamos na Rua Belém do Pará, 65, no bairro Recreio Estoril, em Atibaia/SP. Para saber sobre atendimento na sua região, envie a localização do projeto pelo WhatsApp.',
  },
];

export default function LowerSections({ onContact, onUseMeasures }) {
  const [openQuestion, setOpenQuestion] = useState(0);
  const accordionId = useId();
  const stepsRef = useRef(null);

  // The four steps are steel plates with interlocking tabs: they arrive loose, lock together, and the seams flash like a weld.
  useGSAP(() => {
    if (prefersReducedMotion()) return;
    const boards = gsap.utils.toArray('.ls-step', stepsRef.current);
    const twoColumns = window.matchMedia('(max-width: 700px)').matches;
    const spread = twoColumns ? [-14, 14, -14, 14] : [-66, -22, 22, 66];
    const tilt = [-2.4, 1.6, -1.4, 2.2];
    const lift = [14, -10, 12, -8];
    gsap.set(stepsRef.current, { backgroundColor: 'transparent' });
    gsap.timeline({ scrollTrigger: { trigger: stepsRef.current, start: 'top 78%', once: true } })
      .fromTo(boards,
        { autoAlpha: 0, x: (i) => spread[i] * 1.8, y: (i) => lift[i] + 36, rotate: (i) => tilt[i] * 1.6 },
        { autoAlpha: 1, x: (i) => spread[i], y: (i) => lift[i], rotate: (i) => tilt[i], duration: 0.8, ease: 'power2.out', stagger: 0.07 })
      .to(boards, { x: 0, y: 0, rotate: 0, duration: 0.7, ease: 'power4.in', stagger: { each: 0.05, from: 'center' } }, '+=0.2')
      .to(stepsRef.current, { scale: 1.012, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.out' })
      .to(stepsRef.current, { backgroundColor: '#ffb45a', duration: 0.06 }, '<')
      .to(stepsRef.current, { backgroundColor: '#3d4146', duration: 1.6, ease: 'power2.out' });
  }, { scope: stepsRef });

  return (
    <>
      <section className="ls-process" id="processo" aria-labelledby="ls-process-heading">
        <div className="ls-container">
          <div className="ls-process-header reveal">
            <div>
              <p className="ls-eyebrow"><span /> DO PRIMEIRO TRAÇO AO ÚLTIMO DETALHE</p>
              <h2 id="ls-process-heading">Feito com tempo.<br />Pensado com você.</h2>
            </div>
            <p className="ls-section-intro">Um bom resultado começa com uma boa conversa. Acompanhamos cada etapa para que o projeto faça sentido na sua vida.</p>
          </div>
          <div className="ls-steps" ref={stepsRef}>
            {steps.map((step, index) => (
              <article className="ls-step" key={step.name}>
                <div className="ls-step-top"><span className="ls-step-number">0{index + 1}</span><ArrowUpRight aria-hidden="true" size={23} strokeWidth={1.25} /></div>
                <h3>{step.name}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
          <div className="ls-process-foot"><span>SEU ESPAÇO. SEU JEITO. CADA DETALHE.</span><ArrowDown size={18} strokeWidth={1.25} aria-hidden="true" /></div>
        </div>
      </section>

      <PergolaPlanner onUseMeasures={onUseMeasures} />

      <section className="ls-faq" id="duvidas" aria-labelledby="ls-faq-heading">
        <div className="ls-container ls-faq-grid">
          <div className="ls-faq-heading reveal">
            <p className="ls-eyebrow"><span /> VAMOS CONVERSAR</p>
            <h2 id="ls-faq-heading">Antes de<br />dar forma.</h2>
            <p>Algumas respostas para tirar<br className="ls-desktop-break" /> suas ideias do papel.</p>
          </div>
          <div className="ls-accordion reveal">
            {questions.map((item, index) => {
              const isOpen = openQuestion === index;
              const buttonId = `${accordionId}-button-${index}`;
              const panelId = `${accordionId}-panel-${index}`;
              return (
                <div className={`ls-faq-item${isOpen ? ' ls-faq-item-open' : ''}`} key={item.question}>
                  <h3>
                    <button type="button" className="ls-faq-trigger" id={buttonId} aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenQuestion(isOpen ? null : index)}>
                      <span>{item.question}</span>
                      <span className="ls-faq-icon">{isOpen ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}</span>
                    </button>
                  </h3>
                  <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!isOpen} className="ls-faq-answer"><p>{item.answer}</p></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="ls-contact" id="contato" aria-labelledby="ls-contact-heading">
        <SheetEdge fill="#f6f6f5" />
        <TrussDrawing className="ls-contact-grain" start="top 80%" end="bottom 85%" />
        <div className="ls-container ls-contact-content reveal">
          <p className="ls-eyebrow"><span /> UM ESPAÇO COM A SUA ESSÊNCIA</p>
          <h2 id="ls-contact-heading">Sua ideia merece<br />ganhar <em>forma.</em></h2>
          <p>Conte o que você imagina.<br />Vamos pensar juntos no que vem depois.</p>
          <button className="ls-contact-button" type="button" onClick={onContact}>Solicitar orçamento <span><ArrowUpRight size={21} aria-hidden="true" /></span></button>
          <div className="ls-contact-details">
            <a href={whatsappUrl} target="_blank" rel="noreferrer">
              <MessageCircle size={20} strokeWidth={1.5} aria-hidden="true" />
              <span><small>WHATSAPP</small><strong>(11) 95286-9701</strong></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a href={instagramUrl} target="_blank" rel="noreferrer">
              <Instagram size={20} strokeWidth={1.5} aria-hidden="true" />
              <span><small>INSTAGRAM</small><strong>@saoroqueserralheria</strong></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={20} strokeWidth={1.5} aria-hidden="true" />
              <span><small>ATIBAIA / SP</small><strong>Rua Belém do Pará, 65</strong><span>Recreio Estoril · Ver no mapa</span></span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="ls-contact-note ls-container"><span>DO AÇO, POSSIBILIDADES.</span><span>SERRALHERIA SÃO ROQUE.</span></div>
      </section>

      <footer className="ls-footer">
        <div className="ls-container">
          <div className="ls-footer-main">
            <a className="ls-brand" href="#" aria-label="Serralheria São Roque, voltar ao início"><span>São Roque<span className="ls-brand-dot">.</span></span><small>SERRALHERIA</small></a>
            <p>Estruturas metálicas<br />para o seu espaço.</p>
            <nav className="ls-footer-nav" aria-label="Navegação do rodapé"><a href="#sobre">Sobre</a><a href="#processo">Nosso processo</a><a href="#duvidas">Dúvidas frequentes</a><a href="#contato">Vamos conversar <ArrowUpRight size={14} aria-hidden="true" /></a></nav>
          </div>
          <p className="ls-footer-area">Atibaia/SP · <a href={whatsappUrl} target="_blank" rel="noreferrer">Consulte o atendimento na sua região.</a></p>
          <div className="ls-footer-bottom"><span>© {new Date().getFullYear()} Serralheria São Roque</span><a href="#">Voltar ao topo <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        </div>
      </footer>
    </>
  );
}
