import {useId} from 'react';
import {escudoDe} from '../content/dinastias/escudos.js';

// Original drawings from each blazon: the arms are public heraldic designs,
// the artwork here is the Atlas's own and stays deliberately simple.
const TINCTURES = {oro: '#E1B338', plata: '#F2EEE3', gules: '#B8282E', azur: '#2A5BA8',
  sable: '#26221F', sinople: '#2F7D4A', purpura: '#7A3E8E'};
const SHIELD = 'M3 3H97V62C97 91 76 109 50 117C24 109 3 91 3 62Z';
const INK = '#2A1D14';
const FRAME = 'M0 0H100V120H0Z';

const CHARGES = {
  lis: {box: [100, 100], d: 'M50 4C57 13 61 24 59 36C58 44 55 50 51 56L50 57 49 56C45 50 42 44 41 36C39 24 43 13 50 4ZM45 58C38 47 30 37 19 36C9 35 4 43 7 51C9 57 16 59 20 55C17 55 14 52 15 48C16 43 23 43 29 48C34 52 37 57 39 61ZM55 58C62 47 70 37 81 36C91 35 96 43 93 51C91 57 84 59 80 55C83 55 86 52 85 48C84 43 77 43 71 48C66 52 63 57 61 61ZM30 59H70Q72 63 70 67H30Q28 63 30 59ZM44 67C43 77 38 85 31 90C38 92 45 88 50 81C55 88 62 92 69 90C62 85 57 77 56 67Z'},
  leon: {box: [100, 100], d: 'M14 16L20 8C24 4 32 3 36 6L40 2 42 8C46 6 50 8 52 12L58 10 56 16 62 16 58 22 64 24 58 28C62 34 64 42 63 50C62 56 64 60 68 64C74 62 78 56 78 48C78 40 74 34 78 26C80 20 86 18 90 20L94 14 94 22 98 24 92 28C88 26 84 26 83 30C80 38 86 46 84 54C82 62 78 68 72 72C74 80 72 86 66 90L74 94 72 98H54L56 92C60 86 60 80 56 76C52 78 46 80 40 80L34 86 28 84 30 80 24 80 26 76 32 74C38 72 44 68 46 64C44 58 44 52 46 46C40 48 32 50 26 50L20 54 18 50 14 52 16 46 12 44 20 42C26 42 34 42 40 38C36 34 30 30 24 30L18 34 18 28 12 28 16 24 12 20 22 22C28 22 32 24 36 26C34 22 30 22 26 24L22 20 18 22 14 20Z'},
  leopardo: {box: [100, 56], d: 'M8 10L12 3 16 8 20 2 24 8 29 5 29 12C34 14 40 15 46 15C56 13 68 13 76 15C78 10 76 5 70 4L66 0 67 5 62 4 66 8 62 10H68C74 10 80 10 82 16C88 20 88 28 84 32L86 48 90 52H79V48L77 34C74 34 72 34 70 34V48L73 52H62L64 48V34C55 36 46 36 38 34L37 48 40 52H29L31 48 29 32C25 30 22 28 20 28L13 30 8 34 4 32 6 28 2 26 8 24H16C11 24 7 20 7 16C6 13 7 11 8 10Z'},
  aguila: {box: [100, 100], d: 'M47 22C43 20 41 15 43 11C45 6 52 4 56 7C60 10 59 16 55 19C60 23 62 32 60 42C64 52 63 64 58 72L66 86 56 82 50 96 44 82 34 86 42 72C37 64 36 52 40 42C38 32 41 25 47 22ZM43.5 10.5 35 14 43.5 16.5ZM42 38C32 26 18 18 2 14L8 22 0 26 10 30 2 36 14 38 6 46 20 46 14 54 28 52 24 60 38 54C40 50 42 46 42 42ZM58 38C68 26 82 18 98 14L92 22 100 26 90 30 98 36 86 38 94 46 80 46 86 54 72 52 76 60 62 54C60 50 58 46 58 42ZM42 70 32 78 26 76 30 84 36 82 46 74ZM58 70 68 78 74 76 70 84 64 82 54 74Z'},
  castillo: {box: [100, 100], d: 'M14 50H86V94H14ZM12 42H24V50H12ZM30 42H42V50H30ZM58 42H70V50H58ZM76 42H88V50H76ZM18 28H32V42H18ZM68 28H82V42H68ZM16 22H21V28H16ZM23 22H27V28H23ZM29 22H34V28H29ZM66 22H71V28H66ZM73 22H77V28H73ZM79 22H84V28H79ZM38 18H62V42H38ZM36 10H42V18H36ZM47 10H53V18H47ZM58 10H64V18H58Z', holes: 'M44 94V74Q50 64 56 74V94ZM47 26H53V36H47ZM23 34H27V40H23ZM73 34H77V40H73Z'},
  corazon: {box: [100, 100], d: 'M50 90C20 65 10 45 22 30C32 20 44 26 50 36C56 26 68 20 78 30C90 45 80 65 50 90Z'},
  billete: {box: [100, 100], d: 'M32 10H68V90H32Z'},
  roel: {box: [100, 100], d: 'M50 6A44 44 0 1 1 49.9 6Z'},
};
const LAYOUTS = {
  una: [[50, 56, 0.7]],
  tres: [[29, 34, 0.33], [71, 34, 0.33], [50, 78, 0.33]],
  'tres-palo': [[50, 22, 0.56], [50, 54, 0.56], [50, 86, 0.48]],
  'dos-palo': [[50, 34, 0.62], [50, 76, 0.62]],
};

function charge(name, fill, cx, cy, scale, key) {
  const art = CHARGES[name];
  const [w, h] = art.box;
  return <g key={key} transform={`translate(${cx - (w * scale) / 2} ${cy - (h * scale) / 2}) scale(${scale})`}>
    <path d={art.d} fill={fill} stroke={INK} strokeWidth={1.4} strokeLinejoin="round"/>
    {art.holes && <path d={art.holes} fill={TINCTURES.azur} stroke={INK} strokeWidth={1}/>}
  </g>;
}
const stripes = (a, b, n, vertical) => Array.from({length: n}, (_, i) => vertical
  ? <rect key={i} x={i * 100 / n} y={0} width={100 / n + .2} height={120} fill={i % 2 ? b : a}/>
  : <rect key={i} x={0} y={i * 120 / n} width={100} height={120 / n + .2} fill={i % 2 ? b : a}/>);
function semee(name, fill, scale, step, key) {
  const out = [];
  for (let row = 0, y = 8; y < 124; row += 1, y += step) for (let x = row % 2 ? step / 2 : 0; x < 106; x += step)
    out.push(charge(name, fill, x, y, scale, `${key}-${row}-${x}`));
  return out;
}

function layer(capa, index, clip, quarter = false) {
  const [kind, ...args] = capa;
  const t = name => TINCTURES[name] || name;
  const key = `${kind}-${index}`;
  switch (kind) {
    case 'campo': return <rect key={key} width={100} height={120} fill={t(args[0])}/>;
    case 'fajado': return <g key={key}>{stripes(t(args[0]), t(args[1]), args[2])}</g>;
    case 'palado': return <g key={key}>{stripes(t(args[0]), t(args[1]), args[2], true)}</g>;
    case 'bandado': return <g key={key} transform="rotate(45 50 60)">{Array.from({length: 14}, (_, i) =>
      <rect key={i} x={-60} y={-40 + i * (200 / 14)} width={220} height={200 / 14 + .2} fill={t(i % 2 ? args[1] : args[0])}/>)}</g>;
    case 'cuartelado-liso': return <g key={key}><rect width={100} height={120} fill={t(args[0])}/>
      <rect x={50} width={50} height={60} fill={t(args[1])}/><rect y={60} width={50} height={60} fill={t(args[1])}/></g>;
    case 'jaquelado': return <g key={key}>{Array.from({length: 42}, (_, i) =>
      <rect key={i} x={(i % 6) * 100 / 6} y={Math.floor(i / 6) * 120 / 7} width={100 / 6 + .2} height={120 / 7 + .2}
        fill={t((i % 6 + Math.floor(i / 6)) % 2 ? args[1] : args[0])}/>)}</g>;
    case 'fusado': return <g key={key}><rect width={100} height={120} fill={t(args[0])}/>
      <g transform="rotate(-28 50 60)">{Array.from({length: 120}, (_, i) => {
        const col = i % 12, row = Math.floor(i / 12), x = -40 + col * 18 + (row % 2 ? 9 : 0), y = -30 + row * 18;
        return <path key={i} d={`M${x} ${y - 9}L${x + 9} ${y}L${x} ${y + 9}L${x - 9} ${y}Z`} fill={t(args[1])}/>;
      })}</g></g>;
    case 'faja': return <rect key={key} x={0} y={40} width={100} height={26} fill={t(args[0])}/>;
    case 'faja-jaquelada': return <g key={key}>{Array.from({length: 24}, (_, i) =>
      <rect key={i} x={(i % 12) * 100 / 12} y={40 + Math.floor(i / 12) * 13} width={100 / 12 + .2} height={13.2}
        fill={t((i % 12 + Math.floor(i / 12)) % 2 ? args[1] : args[0])}/>)}</g>;
    case 'cruz': return <g key={key} fill={t(args[0])}><rect x={38} width={24} height={120}/><rect y={38} width={100} height={24}/></g>;
    case 'banda': return <path key={key} d="M-10 8L8 -10 110 92 92 110Z" fill={t(args[0])} transform="scale(1 1.2)"/>;
    case 'cotiza': return <path key={key} d="M-6 2L2 -6 106 98 98 106Z" fill={t(args[0])} transform="scale(1 1.2)"/>;
    case 'bordura': return <path key={key} d={quarter ? FRAME : SHIELD} fill="none" stroke={t(args[0])} strokeWidth={20} clipPath={quarter ? undefined : `url(#${clip})`}/>;
    case 'bordura-componada': return <g key={key} clipPath={quarter ? undefined : `url(#${clip})`}>
      <path d={quarter ? FRAME : SHIELD} fill="none" stroke={t(args[0])} strokeWidth={20}/>
      <path d={quarter ? FRAME : SHIELD} fill="none" stroke={t(args[1])} strokeWidth={20} strokeDasharray="10 10"/></g>;
    case 'lambel': return <g key={key} fill={t(args[0])}><rect x={16} y={11} width={68} height={6}/>
      {[24, 47, 70].map(x => <path key={x} d={`M${x} 16H${x + 7}L${x + 9} 30H${x - 2}Z`}/>)}</g>;
    case 'trechor': return <g key={key} fill="none" stroke={t(args[0])} strokeWidth={2.4}>
      <path d={SHIELD} transform="translate(10 10) scale(.8)"/><path d={SHIELD} transform="translate(15 15) scale(.7)"/></g>;
    case 'crancelin': return <g key={key} transform="rotate(32 50 60)" fill={t(args[0])}>
      <rect x={-20} y={54} width={140} height={8}/>
      {Array.from({length: 7}, (_, i) => <path key={i} d={`M${-4 + i * 18} 54l5-9 5 9z`}/>)}</g>;
    case 'figura': return <g key={key}>{LAYOUTS[args[2] || 'una'].map(([x, y, s], i) => charge(args[0], t(args[1]), x, y, s, `${key}-${i}`))}</g>;
    case 'sembrado': return <g key={key}>{semee(args[0], t(args[1]), args[2] || .17, args[3] || 21, key)}</g>;
    case 'escusones-portugal': return <g key={key}>{[[50, 34], [30, 58], [50, 58], [70, 58], [50, 82]].map(([x, y], i) => <g key={i}>
      <path d={`M${x - 8} ${y - 10}H${x + 8}V${y + 2}C${x + 8} ${y + 8} ${x + 4} ${y + 11} ${x} ${y + 13}C${x - 4} ${y + 11} ${x - 8} ${y + 8} ${x - 8} ${y + 2}Z`} fill={TINCTURES.azur} stroke={INK} strokeWidth={.8}/>
      {[[0, -5], [-4, -1], [4, -1], [0, 3], [0, 8]].map(([dx, dy], j) => <circle key={j} cx={x + dx} cy={y + dy} r={1.6} fill={TINCTURES.plata}/>)}</g>)}</g>;
    case 'castillos-bordura': return <g key={key}>{[[50, 10], [15, 22], [85, 22], [11, 52], [89, 52], [22, 88], [78, 88]].map(([x, y], i) => charge('castillo', TINCTURES.oro, x, y, .13, `${key}-${i}`))}</g>;
    case 'medici': return <g key={key}>
      {[[27, 46], [73, 46], [32, 74], [68, 74], [50, 98]].map(([x, y], i) => charge('roel', TINCTURES.gules, x, y, .24, `${key}-${i}`))}
      {charge('roel', TINCTURES.azur, 50, 22, .3, `${key}-top`)}
      {[[44, 20], [56, 20], [50, 28]].map(([x, y], i) => charge('lis', TINCTURES.oro, x, y, .09, `${key}-lis-${i}`))}</g>;
    case 'cuartelado': return <g key={key}>{args[0].map((quarter, i) => {
      const [x, y] = [(i % 2) * 50, Math.floor(i / 2) * 60];
      return <g key={i} clipPath={`url(#${clip}-q${i})`}><g transform={`translate(${x} ${y}) scale(.5)`}>{quarter.map((c, j) => layer(c, `${i}-${j}`, clip, true))}</g></g>;
    })}</g>;
    default: return null;
  }
}

// A reviewed Wikimedia Commons image takes precedence over the drawing; the
// drawing remains for houses without one and where `drawn` asks for it.
export default function DynastyArms({dinastia, size = 56, className = '', drawn = false}) {
  const id = useId().replace(/:/g, '');
  const escudo = escudoDe(dinastia);
  if (!escudo) return null;
  // The credit travels with the image as a tooltip; pages show it in full at
  // their foot or on the licences page.
  if (escudo.imagen && !drawn) return <img className={`dynasty-arms dynasty-arms-image ${className}`.trim()} src={escudo.imagen.archivo}
    width={size} height={Math.round(size * 1.2)} alt={`Armas: ${escudo.blason}`} title={`Escudo: ${escudo.imagen.autor} · ${escudo.imagen.licencia} · ${escudo.imagen.procedencia||'Wikimedia Commons'}`}
    loading="lazy" decoding="async"/>;
  const clip = `arms-${id}`;
  return <svg className={`dynasty-arms ${className}`.trim()} viewBox="0 0 100 120" width={size} height={size * 1.2}
    role="img" aria-label={`Armas: ${escudo.blason}`}>
    <title>{escudo.blason}</title>
    <defs>
      <clipPath id={clip}><path d={SHIELD}/></clipPath>
      {[0, 1, 2, 3].map(i => <clipPath key={i} id={`${clip}-q${i}`}><rect x={(i % 2) * 50} y={Math.floor(i / 2) * 60} width={50} height={60}/></clipPath>)}
    </defs>
    <g clipPath={`url(#${clip})`}>{escudo.capas.map((capa, i) => layer(capa, i, clip))}</g>
    <path d={SHIELD} fill="none" stroke={INK} strokeWidth={2.4}/>
  </svg>;
}

// Author, licence and file page of a Commons image, shown under the shield.
export function ArmsCredit({dinastia, className = ''}) {
  const imagen = escudoDe(dinastia)?.imagen;
  if (!imagen) return null;
  return <small className={`dynasty-arms-credit ${className}`.trim()}>
    Escudo: <a href={imagen.fuente} target="_blank" rel="noreferrer">{imagen.autor}</a>
    {' · '}{imagen.licenciaUrl ? <a href={imagen.licenciaUrl} target="_blank" rel="noreferrer license">{imagen.licencia}</a> : imagen.licencia}
    {' · '}{imagen.procedencia||'Wikimedia Commons'}
    {imagen.modificaciones && <span> · {imagen.modificaciones}</span>}
    {imagen.fuentesAdicionales?.map(f=><span key={f.fuente}> · <a href={f.fuente} target="_blank" rel="noreferrer">{f.titulo} · {f.autor}</a>{' · '}<a href={f.licenciaUrl} target="_blank" rel="noreferrer license">{f.licencia}</a></span>)}
  </small>;
}
