import { useState, useEffect, useRef, useId } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, Plus, X, Menu, ChevronLeft, ChevronRight, Check, Copy, MessageCircle } from 'lucide-react';
import LowerSections from './LowerSections.jsx';
import SecuritySection from './SecuritySection.jsx';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from './gsap.js';
import { TrussDrawing, TapeMeasure } from './Steel.jsx';
import FinishSimulator from './FinishSimulator.jsx';

const photo = (n, thumb = false) => `/images/image-${String(n).padStart(2, '0')}${thumb ? '-thumb' : ''}.webp`;

const WOOD_FINISHES = [
  { n: 23, name: 'Amadeirado · opção 1', detail: 'Tom mais escuro', roof: 'Telha duas faces com forro amadeirado — opção 1 (tom mais escuro)' },
  { n: 2, name: 'Amadeirado · opção 2', detail: 'Tom mais claro', roof: 'Telha duas faces com forro amadeirado — opção 2 (tom mais claro)' },
];

// Correspondem às quatro fotos referenciadas pelo cliente na conversa de WhatsApp.
const COVERAGE_PHOTOS = [
  { n: 10, name: 'Embutida', detail: 'Estrutura metálica embutida, com telhas e parte da calha ocultas', position: 'center 70%', service: 0 },
  ...WOOD_FINISHES.map((finish, tone) => ({ ...finish, detail: `Telha duas faces com forro amadeirado — ${finish.detail.toLowerCase()}`, position: 'center 25%', service: 1, tone })),
  { n: 5, name: 'Tradicional', detail: 'Estrutura metálica tradicional, com telhas e calha aparentes', position: 'center 25%', service: 2 },
];

function Brand({ footer = false }) {
  return <a className={`brand ${footer ? 'brand-footer' : ''}`} href="#inicio" aria-label="Serralheria São Roque, início">
    <span><strong>São Roque<span className="brand-dot">.</span></strong><small>SERRALHERIA</small></span>
  </a>;
}

function useModalFocus(ref, onClose) {
  useEffect(() => {
    const oldFocus = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => ref.current?.querySelector('button, input, select, textarea, [tabindex="0"]')?.focus(), 30);
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const nodes = [...ref.current.querySelectorAll('button:not(:disabled), a[href], input, select, textarea, [tabindex="0"]')];
        const first = nodes[0], last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => { clearTimeout(timer); document.body.style.overflow = oldOverflow; window.removeEventListener('keydown', handleKey); oldFocus?.focus(); };
  }, [ref, onClose]);
}

const CATEGORY_TITLES = { Pergolados: 'Sombra sob medida', Escadas: 'Degraus em aço', 'Guarda-corpos': 'Segurança com desenho', Fachadas: 'Presença na fachada', Coberturas: 'Coberturas sob medida' };

const projects = [
  { n: 4, title: 'Um espaço para reunir', category: 'Pergolados', detail: 'Pergolado sobre área gourmet', position: 'center 48%' },
  { n: 22, title: 'Leveza que sobe', category: 'Escadas', detail: 'Escada caracol em aço', position: 'center 40%' },
  { n: 8, title: 'Proteção com desenho', category: 'Guarda-corpos', detail: 'Guarda-corpo de varanda', position: 'center 50%' },
  { n: 26, title: 'Chegada com presença', category: 'Fachadas', detail: 'Cobertura de garagem e porta pivotante', position: 'center 45%' },
  { n: 14, title: 'Feito para compartilhar', category: 'Pergolados', detail: 'Pergolado com trilhos de luz', position: 'center 60%' },
  { n: 16, title: 'Linhas que conduzem', category: 'Escadas', detail: 'Escada reta em perfil metálico', position: 'center' },
  ...[
    [1, 'Pergolados', 'Pergolado sobre terraço'],
    [3, 'Fachadas', 'Marquise em balanço'],
    [6, 'Guarda-corpos', 'Guarda-corpo branco no terraço'],
    [7, 'Fachadas', 'Marquise de entrada'],
    [9, 'Guarda-corpos', 'Guarda-corpo na cobertura'],
    [11, 'Fachadas', 'Fachada com estrutura metálica'],
    [12, 'Fachadas', 'Portões pivotantes'],
    [13, 'Guarda-corpos', 'Sacada com guarda-corpo'],
    [15, 'Guarda-corpos', 'Pilar e guarda-corpo'],
    [17, 'Fachadas', 'Cobertura sobre churrasqueira'],
    [18, 'Escadas', 'Escada em perfil aberto'],
    [19, 'Pergolados', 'Grelha metálica do pergolado'],
    [20, 'Guarda-corpos', 'Guarda-corpo em terraço'],
    [21, 'Fachadas', 'Fachada com sacadas'],
    [24, 'Guarda-corpos', 'Sacada com vista'],
    [25, 'Fachadas', 'Fachada e marquise'],
    [27, 'Guarda-corpos', 'Guarda-corpo com jardim'],
  ].map(([n, category, detail]) => ({ n, title: CATEGORY_TITLES[category], category, detail, position: 'center' })),
  ...COVERAGE_PHOTOS.map(({ n, name, detail, position }) => ({ n, title: name, category: 'Coberturas', detail, position })),
];

const SPARKS = Array.from({ length: 9 }, (_, i) => <i key={i} />);

function Lightbox({ index, onClose }) {
  const [current, setCurrent] = useState(index);
  const [direction, setDirection] = useState(0);
  const ref = useRef(null);
  const swipeStart = useRef(null);
  useModalFocus(ref, onClose);
  const advance = (delta) => { setDirection(delta); setCurrent((value) => (value + delta + projects.length) % projects.length); };
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      setDirection(delta);
      setCurrent((v) => (v + delta + projects.length) % projects.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);
  const onSwipeEnd = (e) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > 50) advance(dx < 0 ? 1 : -1);
  };
  const item = projects[current];
  return <div className="modal-backdrop lightbox" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="lightbox-dialog" ref={ref} role="dialog" aria-modal="true" aria-label="Galeria de projetos">
      <div className="lightbox-top"><span>SÃO ROQUE / ACERVO DE PROJETOS</span><button className="icon-button" onClick={onClose} aria-label="Fechar galeria"><X /></button></div>
      <div className="lightbox-image" onPointerDown={(e) => { swipeStart.current = e.clientX; }} onPointerUp={onSwipeEnd} onPointerCancel={() => { swipeStart.current = null; }}><button className="icon-button gallery-prev" onClick={() => advance(-1)} aria-label="Foto anterior"><ChevronLeft /></button><img key={current} className={direction > 0 ? 'lb-from-right' : direction < 0 ? 'lb-from-left' : ''} src={photo(item.n)} alt={`${item.detail} — fotografia ${item.n} do acervo`} draggable="false" /><button className="icon-button gallery-next" onClick={() => advance(1)} aria-label="Próxima foto"><ChevronRight /></button></div>
      <div className="lightbox-bottom"><div><h3>{item.title}</h3><p>{item.detail}</p></div><span>{String(current + 1).padStart(2, '0')} <i>/ {projects.length}</i></span></div>
    </div>
  </div>;
}

function ContactModal({ onClose, prefill }) {
  const ref = useRef(null), id = useId();
  useModalFocus(ref, onClose);
  const [summary, setSummary] = useState('');
  const [copied, setCopied] = useState(false);
  const [projectType, setProjectType] = useState(prefill?.type ?? '');
  const summaryRef = useRef(null);
  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const options = [
      data.get('structure') && `Estrutura: ${data.get('structure')}.`,
      data.get('roof') && `Telha e acabamento: ${data.get('roof')}.`,
    ].filter(Boolean);
    setSummary(`Olá, Serralheria São Roque! Meu nome é ${data.get('name').trim()}.\nGostaria de solicitar um orçamento de ${data.get('room').toLowerCase()}.\n${options.length ? `\n${options.join('\n')}\n` : ''}\nMinha ideia: ${data.get('idea').trim()}`);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); }
    catch { summaryRef.current?.focus(); summaryRef.current?.select(); }
  };
  return <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby={`${id}-title`} ref={ref}>
      <button className="icon-button modal-close" aria-label="Fechar formulário" onClick={onClose}><X /></button>
      <span className="eyebrow">VAMOS TIRAR DO PAPEL</span><h2 id={`${id}-title`}>Todo projeto começa<br />com uma boa conversa.</h2>
      {summary ? <div className="contact-result"><div className="result-check"><Check size={22} /></div><h3>Seu pedido está pronto.</h3><p>Confira o resumo e envie para a São Roque pelo WhatsApp. O valor será definido após a avaliação do projeto.</p><textarea ref={summaryRef} readOnly aria-label="Resumo do projeto" value={summary} /><a className="button button-forest" href={`https://wa.me/5511952869701?text=${encodeURIComponent(summary)}`} target="_blank" rel="noopener noreferrer">Enviar pelo WhatsApp <MessageCircle size={18} /></a><button className="button button-outline" onClick={copy}>{copied ? 'Resumo copiado' : 'Copiar meu resumo'} {copied ? <Check size={18} /> : <Copy size={18} />}</button><button className="text-button" onClick={() => { setSummary(''); setCopied(false); setProjectType(prefill?.type ?? ''); }}>Criar outro resumo</button><span role="status" className="sr-only">{copied ? 'Resumo copiado para a área de transferência.' : ''}</span></div> : <form onSubmit={submit}>
        <label htmlFor={`${id}-name`}>Como podemos chamar você?</label><input id={`${id}-name`} name="name" required minLength={2} maxLength={80} placeholder="Seu nome" autoComplete="given-name" />
        <label htmlFor={`${id}-room`}>Que estrutura você imagina?</label><select id={`${id}-room`} name="room" required value={projectType} onChange={(e) => setProjectType(e.target.value)}><option value="" disabled>Escolha um tipo de projeto</option><option>Cobertura metálica</option><option>Pergolado</option><option>Escada</option><option>Guarda-corpo</option><option>Portão ou fachada</option><option>Outra estrutura</option></select>
        {['Cobertura metálica', 'Pergolado'].includes(projectType) && <>
          <label htmlFor={`${id}-structure`}>Qual tipo de estrutura?</label>
          <select id={`${id}-structure`} name="structure" defaultValue={prefill?.structure ?? 'A definir com a equipe'}><option>A definir com a equipe</option><option>Embutida</option><option>Tradicional</option></select>
          <label htmlFor={`${id}-roof`}>Telha e acabamento</label>
          <select id={`${id}-roof`} name="roof" defaultValue={prefill?.roof ?? 'A definir com a equipe'}><option>A definir com a equipe</option><option>Telha duas faces com forro amadeirado (tom a definir)</option>{WOOD_FINISHES.map((finish) => <option key={finish.n}>{finish.roof}</option>)}</select>
        </>}
        <label htmlFor={`${id}-idea`}>Conte um pouco da sua ideia</label><textarea id={`${id}-idea`} name="idea" required minLength={10} maxLength={1500} rows={3} placeholder="Conte sobre o espaço, as medidas aproximadas e o que você precisa." defaultValue={prefill?.idea ?? ''} />
        <button type="submit" className="button button-forest">Preparar meu orçamento <ArrowUpRight size={18} /></button>
      </form>}
    </div>
  </div>;
}

const services = [
  { name: 'Embutida', label: 'Estrutura metálica embutida', title: 'Linhas limpas.\nDetalhes discretos.', text: 'A telha e parte da calha ficam ocultas no acabamento da estrutura. Uma opção para quem prefere uma cobertura com visual mais discreto.', tags: ['Telhas ocultas no acabamento', 'Parte da calha não aparente', 'Medidas e detalhes definidos no projeto'], structure: 'Embutida', icon: '01' },
  { name: 'Amadeirado', label: 'Telha duas faces · sanduíche', title: 'O toque da madeira,\nno forro da cobertura.', text: 'A telha de duas faces, conhecida como sanduíche, pode receber forro com acabamento amadeirado. São duas opções de tonalidade para combinar com o seu espaço.', tags: ['Acabamento amadeirado na face interna', 'Duas opções de tonalidade', 'Escolha do tom durante o orçamento'], roof: 'Telha duas faces com forro amadeirado (tom a definir)', icon: '02' },
  { name: 'Tradicional', label: 'Estrutura metálica tradicional', title: 'A estrutura aparece.\nO cuidado também.', text: 'Nesta opção, as telhas e a calha ficam aparentes. O acabamento da calha recebe atenção para compor um conjunto com aparência moderna.', tags: ['Telhas e calha aparentes', 'Acabamento moderno na calha', 'Configuração conforme o seu espaço'], structure: 'Tradicional', icon: '03' },
];

function ServiceExplorer({ onContact, onOpenPhoto }) {
  const [active, setActive] = useState(0);
  const [tone, setTone] = useState(0);
  const sectionRef = useRef(null);
  const selected = services[active];
  const selectedPhoto = COVERAGE_PHOTOS.find((item) => item.service === active && (active !== 1 || item.tone === tone));
  const selectedRoof = active === 1 ? WOOD_FINISHES[tone].roof : selected.roof;
  const choose = (i) => setActive(i);
  return <section className="services section-pad" id="servicos" ref={sectionRef}>
    <div className="section-heading reveal"><div><span className="eyebrow"><span className="tiny-line" /> COBERTURAS & ACABAMENTOS</span><h2>Sua cobertura.<br /><span className="muted">Do seu jeito.</span></h2></div><p>Conheça as opções de estrutura e de forro. A combinação dos materiais, as medidas e o acabamento fazem parte do orçamento.</p></div>
    <div className="service-grid">
      <div className="service-visual reveal">
        <div className="service-photo">
          <img key={selectedPhoto.n} src={photo(selectedPhoto.n)} alt={selectedPhoto.detail} style={{ objectPosition: selectedPhoto.position }} loading="lazy" width="1350" height="1800" />
          <div className="photo-shade" /><span className="image-index">SERRALHERIA SÃO ROQUE</span>
          <span className="image-instruction" aria-live="polite">{selectedPhoto.name}</span>
          <button className="service-photo-open icon-button" aria-label={`Ampliar foto: ${selectedPhoto.name}`} onClick={() => onOpenPhoto(selectedPhoto.n)}><ArrowUpRight size={21} /></button>
        </div>
        <div className="coverage-photos" role="group" aria-label="Fotos das opções de cobertura">
          {COVERAGE_PHOTOS.map((item) => <button key={item.n} className={`coverage-photo-option${item.n === selectedPhoto.n ? ' selected' : ''}`} aria-pressed={item.n === selectedPhoto.n} onClick={() => { setActive(item.service); if (item.tone !== undefined) setTone(item.tone); }}>
            <img src={photo(item.n, true)} alt="" width="525" height="700" loading="lazy" style={{ objectPosition: item.position }} />
            <span>{item.name}</span>
          </button>)}
        </div>
      </div>
      <div className="service-panel reveal"><div className="service-tabs" role="tablist" aria-label="Opções de cobertura e acabamento">{services.map((s, i) => <button key={s.name} role="tab" id={`service-tab-${i}`} aria-controls="service-panel" aria-selected={active === i} tabIndex={active === i ? 0 : -1} onClick={() => choose(i)} onKeyDown={(e) => { if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) { e.preventDefault(); const target = e.key === 'Home' ? 0 : e.key === 'End' ? services.length - 1 : (active + (e.key === 'ArrowRight' ? 1 : -1) + services.length) % services.length; choose(target); document.getElementById(`service-tab-${target}`)?.focus(); } }} className={active === i ? 'selected' : ''}>{s.name}</button>)}</div>
        <div id="service-panel" role="tabpanel" aria-labelledby={`service-tab-${active}`} tabIndex={0}><div className="service-detail" key={active}><span className="detail-counter">{selected.icon} <span>/ {selected.label}</span></span><h3>{selected.title.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}</h3><p>{selected.text}</p>{active === 1 && <div className="wood-tone-picker"><label htmlFor="wood-tone">Escolha o tom da foto</label><select id="wood-tone" value={tone} onChange={(event) => setTone(Number(event.target.value))}>{WOOD_FINISHES.map((finish, index) => <option key={finish.n} value={index}>{finish.name} — {finish.detail.toLowerCase()}</option>)}</select><p>Compare as duas fotos e confirme a amostra no orçamento.</p></div>}<ul>{selected.tags.map(t => <li key={t}><Check size={14} />{t}</li>)}</ul><button className="text-link" onClick={() => onContact({ type: 'Cobertura metálica', structure: selected.structure, roof: selectedRoof, idea: 'Gostaria de conhecer as opções para o meu espaço e solicitar um orçamento.' })}>Orçar esta opção <ArrowUpRight size={19} /></button></div></div>
        <div className="service-footnote"><span className="material-circle" /><p>O valor varia conforme a estrutura, a telha e o acabamento.<br />A equipe ajuda você a escolher a combinação.</p></div>
      </div>
    </div>
  </section>;
}

function ProjectGallery({ onOpen }) {
  const [filter, setFilter] = useState('Todos');
  const [expanded, setExpanded] = useState(false);
  const filtered = projects.filter(p => filter === 'Todos' || p.category === filter);
  const shown = expanded ? filtered : filtered.slice(0, 3);
  const galleryRef = useRef(null);

  // Each photo is uncovered by a steel plate being cut away: a glowing cut line rises and sparks fall from it.
  useGSAP((context, contextSafe) => {
    if (prefersReducedMotion()) return undefined;
    const section = galleryRef.current;
    section.classList.add('plate-on');
    const cut = contextSafe((cards) => cards.forEach((card, i) => {
      const img = card.querySelector('.project-image img');
      gsap.timeline({ delay: i * 0.14 })
        .set(img, { transition: 'none' })
        .call(() => card.classList.add('cutting'))
        .to(card.querySelector('.cover-plate'), { yPercent: -106, duration: 1.2, ease: 'power2.inOut' }, 0)
        .from(img, { scale: 1.14, duration: 1.5, ease: 'power2.out' }, 0.1)
        .call(() => card.classList.remove('cutting'), null, 1.2)
        .set(img, { clearProps: 'transition,transform,scale' });
    }));
    ScrollTrigger.batch(section.querySelectorAll('.project-card'), { start: 'top 88%', once: true, onEnter: cut });
    return () => {
      section.classList.remove('plate-on');
      section.querySelectorAll('.cutting').forEach((card) => card.classList.remove('cutting'));
    };
  }, { scope: galleryRef, dependencies: [filter, expanded], revertOnUpdate: true });

  return <section className="projects section-pad" id="projetos" ref={galleryRef}>
    <div className="section-heading reveal"><div><span className="eyebrow"><span className="tiny-line" /> PROJETOS ENTREGUES</span><h2>O detalhe faz<br /><span className="muted">toda a diferença.</span></h2></div><div className="gallery-heading-right"><p>Coberturas, pergolados, escadas, guarda-corpos e fachadas. Conheça os detalhes de cada projeto.</p><div className="filter-row" aria-label="Filtrar galeria">{['Todos', 'Coberturas', 'Pergolados', 'Escadas', 'Guarda-corpos', 'Fachadas'].map(f => <button key={f} aria-pressed={filter === f} className={filter === f ? 'active' : ''} onClick={() => {setFilter(f); setExpanded(false);}}>{f}</button>)}</div></div></div>
    <div className="project-grid">{shown.map((p, index) => <button className={`project-card ${index % 3 === 1 ? 'project-card-offset' : ''}`} key={p.n} onClick={() => onOpen(projects.indexOf(p))} aria-label={`Ampliar: ${p.title}, ${p.detail}`}><div className="project-image"><img src={photo(p.n, true)} alt={p.detail} style={{objectPosition:p.position}} width="525" height="700" loading="lazy" /><span className="project-open"><ArrowUpRight size={21} /></span><span className="project-category">{p.category}</span><span className="cover-plate" aria-hidden="true"><span className="cut-line" /><span className="sparks">{SPARKS}</span></span></div><div className="project-caption"><div><h3>{p.title}</h3><p>{p.detail}</p></div><span>{String(projects.indexOf(p) + 1).padStart(2, '0')}</span></div></button>)}</div>
    <div className="gallery-bottom"><span>{String(filtered.length).padStart(2, '0')} projetos para inspirar o seu espaço</span>{filtered.length > 3 && <button className="button button-outline" onClick={() => setExpanded(!expanded)}>{expanded ? 'Recolher galeria' : 'Ver toda a galeria'} {expanded ? <X size={16} /> : <Plus size={16} />}</button>}</div>
  </section>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [nearClosing, setNearClosing] = useState(false);
  const [contactPrefill, setContactPrefill] = useState(null);
  const contactClose = useRef(() => setContactOpen(false)).current;
  const galleryClose = useRef(() => setGalleryIndex(null)).current;
  const closingTopRef = useRef(Infinity);
  const openContact = () => { setMenuOpen(false); setContactPrefill(null); setContactOpen(true); };
  const openContactWith = (details) => { setContactPrefill(typeof details === 'string' ? { type: 'Pergolado', idea: details } : details); setContactOpen(true); };
  useEffect(() => {
    // Hides the floating CTA from the process section onward (process, planner, FAQ,
    // contact, footer): the fixed button was overlapping the last process step's text,
    // the planner's plan caption, and opened FAQ answers on mobile; those later sections
    // already have their own CTA, so nothing is lost by hiding it there.
    const updateClosingTop = () => { closingTopRef.current = document.getElementById('processo')?.offsetTop ?? Infinity; };
    const handler = () => {
      setScrolled(window.scrollY > 25);
      setPastHero(window.scrollY > window.innerHeight * 0.6);
      setNearClosing(window.scrollY + window.innerHeight * 0.5 > closingTopRef.current);
    };
    updateClosingTop();
    handler();
    window.addEventListener('scroll', handler, {passive:true});
    window.addEventListener('resize', updateClosingTop);
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), {threshold:0.12});
    elements.forEach(element => {element.classList.add('reveal-ready'); observer.observe(element);});
    return () => { window.removeEventListener('scroll', handler); window.removeEventListener('resize', updateClosingTop); observer.disconnect(); };
  }, []);
  useEffect(() => { const close = (e) => {if(e.key === 'Escape') setMenuOpen(false);}; window.addEventListener('keydown', close); return () => window.removeEventListener('keydown', close); }, []);
  return <>
    <a href="#conteudo" className="skip-link">Ir para o conteúdo</a>
    <TapeMeasure />
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}><div className="header-inner"><Brand /><nav className={menuOpen ? 'nav open' : 'nav'} id="main-nav" aria-label="Navegação principal"><a href="#projetos" onClick={() => setMenuOpen(false)}>Projetos</a><a href="#servicos" onClick={() => setMenuOpen(false)}>O que fazemos</a><a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre</a><a href="#processo" onClick={() => setMenuOpen(false)}>Nosso processo</a><a href="#duvidas" onClick={() => setMenuOpen(false)}>Dúvidas</a><button className="nav-mobile-contact" onClick={openContact}>Vamos conversar <ArrowUpRight size={16} /></button></nav><button className="header-cta" onClick={openContact}>Vamos conversar <ArrowUpRight size={16} /></button><button className="menu-button" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} aria-expanded={menuOpen} aria-controls="main-nav" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button></div></header>
    <main id="conteudo">
      <section className={`hero ${pastHero ? 'hero-offscreen' : ''}`} id="inicio"><div className="hero-grain" /><div className="slat-ceiling" aria-hidden="true">{Array.from({length:40},(_,i)=><i key={i} style={{'--i':i}} />)}</div><div className="hero-inner"><div className="hero-copy"><span className="eyebrow hero-eyebrow"><span className="status-dot" /> SERRALHERIA EM ATIBAIA · SP</span><h1>Seu espaço,<br />feito em<br /><span>aço.</span></h1><p>Coberturas, pergolados, escadas e estruturas sob medida.<br className="desktop-break" /> Na São Roque, o seu projeto ganha forma, do desenho ao acabamento.</p><div className="hero-actions"><a className="button button-accent" href="#projetos">Veja os projetos <ArrowUpRight size={19} /></a><button className="hero-text-link" onClick={openContact}>Solicite um orçamento <ArrowRight size={17} /></button></div></div><div className="hero-art"><div className="hero-photo-wrap"><img className="hero-photo" src={photo(4)} width="1350" height="1800" alt="Pergolado em aço preto sobre uma área gourmet" fetchPriority="high" /><div className="hero-photo-overlay" /><span className="hero-photo-label">ESPAÇOS PARA VIVER BEM</span><button className="hero-photo-button" aria-label="Ampliar foto do pergolado" onClick={() => setGalleryIndex(0)}><ArrowUpRight size={25} /></button><div className="hero-photo-caption"><span>Forma. Função.</span><strong>E um pouco de você.</strong></div></div><div className="wood-sample"><img src={photo(22,true)} width="525" height="700" alt="Detalhe de escada caracol em aço" /><span>Detalhes que<br />sustentam.</span><svg viewBox="0 0 38 38" fill="none" aria-hidden="true"><path d="M7 30V8h24v22H16V17h6v13" stroke="currentColor" strokeWidth="1" /></svg></div><div className="hero-side-label">DESENHO ATEMPORAL · AÇO SOB MEDIDA</div></div><div className="hero-bottom"><a href="#servicos"><span className="scroll-circle"><ArrowDown size={15} /></span>Conheça a São Roque</a><span>Feito para o seu espaço.<br /><strong>Pensado em cada detalhe.</strong></span><span className="hero-bottom-index">01 <i>/</i> A ESSÊNCIA</span></div></div></section>
      <div className="values-strip" aria-label="Feito sob medida, precisão no detalhe, aço que dura e acabamento que permanece"><span><span className="strip-star">✳</span> Feito sob medida</span><span><span className="strip-star">✳</span> Precisão no detalhe</span><span><span className="strip-star">✳</span> Aço que dura</span><span className="strip-last"><span className="strip-star">✳</span> Acabamento que permanece</span></div>
      <ServiceExplorer onContact={openContactWith} onOpenPhoto={(n) => setGalleryIndex(projects.findIndex((item) => item.n === n))} />
      <SecuritySection />
      <FinishSimulator />
      <ProjectGallery onOpen={setGalleryIndex} />
      <section className="manifesto section-pad"><TrussDrawing className="manifesto-truss" /><span className="eyebrow">O QUE NOS MOVE</span><p className="reveal">Uma casa é feita de histórias.<br />A nossa parte é dar a elas<br /><span>um lugar especial.</span></p><div className="manifesto-bottom"><span className="manifesto-mark">SR.</span><span>MATÉRIA, CUIDADO E INTENÇÃO.<br />ESSE É O CUIDADO DA SÃO ROQUE.</span></div></section>
      <LowerSections onContact={openContact} onUseMeasures={openContactWith} />
    </main>
    <button className={`floating-contact ${pastHero && !nearClosing ? 'floating-contact-visible' : ''}`} onClick={openContact} aria-label="Conversar sobre um projeto"><span>Seu projeto começa aqui</span><ArrowUpRight size={23} /></button>
    {galleryIndex !== null && <Lightbox index={galleryIndex} onClose={galleryClose} />}
    {contactOpen && <ContactModal onClose={contactClose} prefill={contactPrefill} />}
  </>;
}
