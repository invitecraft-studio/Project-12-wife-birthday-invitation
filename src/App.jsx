import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import D from './data.json';

const P = import.meta.glob('./assets/*.jpg', { eager: true, import: 'default' });
const img = (n) => P[`./assets/${n}.jpg`];
const COL = ['#e98fa9', '#fde3ea', '#d9b45a', '#9bb88f'];
const pop = (o = {}) => confetti({ particleCount: 100, spread: 80, origin: { y: 0.7 }, colors: COL, ...o });
const rise = { initial: { opacity: 0, y: 60 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, margin: '-12%' }, transition: { duration: 0.9 } };

function Petals() {
  const c = useRef(null);
  useEffect(() => {
    const cv = c.current, x = cv.getContext('2d'); let w, h, raf;
    const size = () => { w = cv.width = innerWidth; h = cv.height = innerHeight; }; size(); addEventListener('resize', size);
    const ps = Array.from({ length: 28 }, () => ({ x: Math.random() * w, y: Math.random() * h, r: 5 + Math.random() * 8, v: 0.35 + Math.random() * 0.8, s: Math.random() * 6, a: Math.random() * 6, g: Math.random() < 0.2 }));
    const tick = () => { x.clearRect(0, 0, w, h);
      for (const p of ps) { p.y += p.v; p.s += 0.02; p.a += 0.014; p.x += Math.sin(p.s) * 0.7; if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
        x.save(); x.translate(p.x, p.y); x.rotate(p.a); x.fillStyle = p.g ? 'rgba(217,180,90,.6)' : 'rgba(233,143,169,.5)'; x.beginPath(); x.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, 7); x.fill(); x.restore(); }
      raf = requestAnimationFrame(tick); }; tick();
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); };
  }, []);
  return <canvas ref={c} className="petals" aria-hidden="true" />;
}

function Intro({ onOpen }) {
  const [open, setOpen] = useState(false);
  const go = () => { if (open) return; setOpen(true); pop({ origin: { x: 0.4, y: 0.75 }, particleCount: 160, spread: 120 }); setTimeout(onOpen, 2100); };
  return (
    <motion.div className="intro" onClick={go} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} role="button" tabIndex={0} aria-label="Tap the lotus to open" onKeyDown={(e) => e.key === 'Enter' && go()}>
      <div className="bd" style={{ backgroundImage: `url(${img('intro')})` }} />
      <motion.div className="frame" style={{ transformOrigin: '38% 80%' }} animate={open ? { scale: 4.2, opacity: 0 } : { scale: 1 }} transition={{ duration: 2, ease: [0.6, 0, 0.3, 1] }}>
        <img src={img('intro')} alt="Lotus flowers with a Happy Birthday ribbon" />
        <motion.div className="ic" animate={{ opacity: open ? 0 : 1 }}>
          <motion.small initial={{ opacity: 0, letterSpacing: '.6em' }} animate={{ opacity: 1, letterSpacing: '.2em' }} transition={{ delay: 0.5, duration: 1.6 }}>A SURPRISE FOR</motion.small>
          <motion.h1 initial={{ opacity: 0, filter: 'blur(14px)', scale: 0.9 }} animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }} transition={{ delay: 1, duration: 1.6 }}>{D.name}</motion.h1>
        </motion.div>
        <div className="rip" style={{ left: '38%', top: '80%' }}><i /><i /><i /></div>
      </motion.div>
      <motion.p className="hint" animate={{ opacity: open ? 0 : [0.4, 1, 0.4] }} transition={{ repeat: open ? 0 : Infinity, duration: 2.4 }}>Tap the lotus to let it bloom</motion.p>
      <motion.div className="flash" initial={{ opacity: 0 }} animate={{ opacity: open ? 1 : 0 }} transition={{ delay: 1.1, duration: 0.9 }} />
    </motion.div>
  );
}

function Hero() {
  const cv = useRef(null), [n, setN] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setN(Date.now()), 1000); return () => clearInterval(i); }, []);
  useEffect(() => {
    const c = cv.current, x = c.getContext('2d'), m = { x: 0, y: 0, on: false }; let ps = [], raf, w = 0, h = 0, d = 1, dead = false, t = 0;
    const build = () => {
      const r = c.getBoundingClientRect(); d = Math.min(devicePixelRatio || 1, 2); w = c.width = Math.round(r.width * d); h = c.height = Math.round(r.height * d);
      const o = document.createElement('canvas'); o.width = w; o.height = h; const q = o.getContext('2d'); q.fillStyle = '#fff'; q.textAlign = 'center'; q.textBaseline = 'middle';
      [['Happy Birthday', 0.37, 0.15], [D.name, 0.57, 0.26]].forEach(([tx, cy, mh]) => {
        q.font = '100px "Great Vibes", cursive'; const k = Math.min((100 * 0.9 * w) / q.measureText(tx).width, h * mh * 1.5);
        q.font = `${k}px "Great Vibes", cursive`; q.strokeStyle = '#fff'; q.lineWidth = k * 0.035; q.strokeText(tx, w / 2, h * cy); q.fillText(tx, w / 2, h * cy); });
      const id = q.getImageData(0, 0, w, h).data, st = Math.max(3, Math.round(w / 200)), np = [], cols = ['#ffe9a8', '#f8c3d2', '#fff6df', '#d9b45a', '#e98fa9'];
      for (let yy = 0; yy < h; yy += st) for (let xx = 0; xx < w; xx += st) if (id[(yy * w + xx) * 4 + 3] > 128) np.push([xx, yy]);
      ps = np.map(([tx, ty], i) => ({ tx, ty, x: Math.random() * w, y: h + Math.random() * h * 0.4, vx: 0, vy: 0, c: cols[i % 5], s: Math.random() * 6, r: (1 + Math.random() * 1.1) * d }));
    };
    const tick = () => {
      t += 0.016; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, w, h); x.globalCompositeOperation = 'lighter';
      const wx = m.on ? m.x : w * (0.5 + 0.38 * Math.sin(t * 0.9)), wy = m.on ? m.y : h * (0.5 + 0.12 * Math.sin(t * 1.7)), R = (m.on ? 110 : 70) * d;
      for (const p of ps) {
        const dx = p.x - wx, dy = p.y - wy, dd = Math.hypot(dx, dy) || 1;
        if (dd < R) { const f = ((R - dd) / R) * (m.on ? 5 : 0.7) * d; p.vx += (dx / dd) * f; p.vy += (dy / dd) * f; }
        p.s += 0.04; p.vx += (p.tx + Math.sin(p.s) * 1.2 * d - p.x) * 0.045; p.vy += (p.ty + Math.cos(p.s * 0.8) * 1.2 * d - p.y) * 0.045;
        p.vx *= 0.82; p.vy *= 0.82; p.x += p.vx; p.y += p.vy;
        x.globalAlpha = 0.55 + 0.45 * Math.sin(p.s * 1.7); x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    const mv = (e) => { const r = c.getBoundingClientRect(); m.x = (e.clientX - r.left) * d; m.y = (e.clientY - r.top) * d; m.on = true; }, off = () => (m.on = false);
    ['pointermove', 'pointerdown'].forEach((k) => c.addEventListener(k, mv)); ['pointerleave', 'pointerup', 'pointercancel'].forEach((k) => c.addEventListener(k, off));
    let rt; const rs = () => { clearTimeout(rt); rt = setTimeout(build, 250); }; addEventListener('resize', rs);
    (document.fonts ? document.fonts.load('100px "Great Vibes"').catch(() => 0) : Promise.resolve()).then(() => { if (!dead) { build(); tick(); } });
    return () => { dead = true; cancelAnimationFrame(raf); removeEventListener('resize', rs); };
  }, []);
  const b = new Date(D.birthday); let t0 = b.getTime(); while (t0 + 864e5 < n) { b.setFullYear(b.getFullYear() + 1); t0 = b.getTime(); }
  const today = n >= t0 && n < t0 + 864e5, s = Math.max(0, Math.floor((t0 - n) / 1000));
  const box = [['days', Math.floor(s / 86400)], ['hours', Math.floor((s % 86400) / 3600)], ['mins', Math.floor((s % 3600) / 60)], ['secs', s % 60]];
  return (
    <header className="hero2">
      <motion.div className="moon" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.2, duration: 2 }}><img src={img(5)} alt="Two silhouettes blooming with flowers" /></motion.div>
      <canvas ref={cv} className="fire" aria-label={'Happy Birthday ' + D.name} />
      <motion.div className="cd2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 }}>
        {today ? <b className="td">It is today! 🎉</b> : box.map(([l, v]) => <div key={l}><b>{String(v).padStart(2, '0')}</b><small>{l}</small></div>)}
      </motion.div>
      <motion.span className="scrl" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>touch the fireflies, then scroll ↓</motion.span>
    </header>
  );
}

function Story() {
  const r = useRef(null), N = D.story.length, [k, setK] = useState(0);
  const { scrollYProgress: p } = useScroll({ target: r }), bar = useSpring(p, { stiffness: 90, damping: 24 });
  useEffect(() => p.on('change', (v) => setK(Math.min(N - 1, Math.floor(v * N)))), [p, N]);
  const s = D.story[k];
  return (
    <section className="story" ref={r} style={{ height: N * 90 + 'svh' }}>
      <div className="stick">
        <h3 className="h">Our story, one petal at a time</h3>
        <div className="sc">
          <AnimatePresence mode="wait">
            <motion.div className="sf" key={k} initial={{ clipPath: 'inset(100% 0 0 0)', rotate: k % 2 ? 3 : -3 }} animate={{ clipPath: 'inset(0% 0 0 0)', rotate: k % 2 ? 1.5 : -1.5 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ duration: 0.8, ease: [0.7, 0, 0.2, 1] }}>
              <img src={img(s.img)} alt={s.t} />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div className="stx" key={k} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.6 }}>
              <small>Chapter {k + 1} of {N}</small><h4>{s.t}</h4><p>{s.x}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="bar"><motion.i style={{ scaleX: bar }} /></div>
      </div>
    </section>
  );
}

function Dream() {
  const [w, setW] = useState(false);
  return (
    <section className="dream">
      <motion.div className="dimg" {...rise}>
        <motion.img src={img(4)} alt="Dream fading into watercolour" animate={{ opacity: w ? 0 : 1, scale: w ? 1.12 : 1, filter: w ? 'blur(12px)' : 'blur(0px)' }} transition={{ duration: 1.4 }} />
        <motion.img src={img(2)} alt="Couple with flower garlands" animate={{ opacity: w ? 1 : 0, scale: w ? 1 : 0.92 }} transition={{ duration: 1.4 }} />
      </motion.div>
      <motion.div className="dtx" {...rise}>
        <AnimatePresence mode="wait">
          <motion.div key={w} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            {w ? <><h3 className="h">Reality was better.</h3><p>I stopped asking whether this was a dream. Waking up next to you is the best part of every day.</p></>
              : <><h3 className="h">Dream or reality?</h3><p>I used to wonder if a love like this was only a dream, something that would fade the moment I woke up.</p></>}
          </motion.div>
        </AnimatePresence>
        {!w && <motion.button className="btn" whileTap={{ scale: 0.95 }} onClick={() => { setW(true); pop({ particleCount: 70, origin: { y: 0.5 } }); }}>Wake me up ☀️</motion.button>}
      </motion.div>
    </section>
  );
}

function Lotus() {
  const [s, setS] = useState(null), [seen, setSeen] = useState({}), n = D.reasons.length, all = Object.keys(seen).length === n;
  const tap = (i) => { setS(i); setSeen((v) => ({ ...v, [i]: 1 })); pop({ particleCount: 25, spread: 50, origin: { y: 0.55 }, scalar: 0.7 }); if (Object.keys(seen).length === n - 1) setTimeout(() => pop({ particleCount: 180, spread: 140, origin: { y: 0.5 } }), 400); };
  return (
    <section className="rs">
      <h3 className="h">Eight petals, eight reasons</h3><p className="sub">Tap every petal of the lotus</p>
      <motion.div className="lotus" {...rise}>
        {D.reasons.map((r, i) => (
          <div className="pw" key={i} style={{ '--a': (i * 360) / n + 'deg' }}>
            <motion.button className={'pt' + (seen[i] ? ' on' : '') + (s === i ? ' cur' : '')} onClick={() => tap(i)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} aria-label={'Reason ' + (i + 1)}>
              <span style={{ transform: `rotate(calc(-1 * var(--a)))` }}>{i + 1}</span>
            </motion.button>
          </div>))}
        <div className="core"><AnimatePresence mode="wait"><motion.p key={s} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>{s === null ? '♥' : D.reasons[s]}</motion.p></AnimatePresence></div>
      </motion.div>
      {all && <motion.p className="bonus" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>And a thousand more that do not fit on a flower. ✨</motion.p>}
    </section>
  );
}

function Sorry() {
  const [no, setNo] = useState({ x: 0, y: 0, n: 0 }), [yes, setYes] = useState(false);
  const labels = ['No', 'Are you sure?', 'Think again', 'Really?', 'Okay, fine...'];
  const dodge = () => setNo((v) => ({ x: (Math.random() - 0.5) * Math.min(260, innerWidth * 0.6), y: (Math.random() - 0.5) * 140, n: Math.min(v.n + 1, 4) }));
  return (
    <section className="sorry">
      <motion.div className="simg" {...rise}><img src={img(11)} alt="Ram saying sorry with folded hands" /></motion.div>
      <motion.div className="stx2" {...rise}>
        <h3 className="h">A small confession</h3>
        {yes ? <motion.p initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="big">I knew it. You are the kindest. I love you. ♥</motion.p>
          : <><p>Ram has been a little annoying sometimes. Will you forgive him for every single time?</p>
            <div className="yn">
              <motion.button className="btn" whileTap={{ scale: 0.94 }} animate={{ scale: 1 + no.n * 0.12 }} onClick={() => { setYes(true); pop({ particleCount: 160, spread: 110 }); }}>Yes, forgiven ♥</motion.button>
              <motion.button className="btn ghost" animate={{ x: no.x, y: no.y }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} onPointerEnter={dodge} onClick={dodge}>{labels[no.n]}</motion.button>
            </div></>}
      </motion.div>
    </section>
  );
}

function Wish() {
  const [t, setT] = useState(''), [go, setGo] = useState(false), [fin, setFin] = useState(false);
  const sail = () => { if (go) return; setGo(true); setTimeout(() => { setFin(true); pop({ particleCount: 150, spread: 110, origin: { y: 0.6 } }); }, 5200); };
  return (
    <section className="wish2"><h3 className="h lt">Make a wish</h3>
      <p className="sub">Write it here. I will fold it into a paper boat and send it across the water.</p>
      {!go && <motion.div className="wi" {...rise}><input value={t} maxLength={70} onChange={(e) => setT(e.target.value)} placeholder="Type your wish..." aria-label="Your wish" onKeyDown={(e) => e.key === 'Enter' && sail()} /><button className="btn" onClick={sail}>Fold it into a boat ⛵</button></motion.div>}
      <motion.div className="pond" {...rise}>
        {[0, 1, 2].map((i) => <i className="wv" key={i} style={{ animationDelay: i * 1.2 + 's' }} />)}
        {go && <motion.div className="boat" initial={{ left: '3%', opacity: 1, scale: 1 }} animate={{ left: '60%', opacity: fin ? 0 : 1, scale: fin ? 0.4 : 1 }} transition={{ left: { duration: 5, ease: 'easeInOut' }, opacity: { duration: 1 }, scale: { duration: 1 } }}>
          <motion.div animate={{ y: [0, -6, 0], rotate: [-3, 3, -3] }} transition={{ repeat: Infinity, duration: 2.2 }}>
            <span className="wt">{t || 'a wish too big for words'}</span>
            <svg viewBox="0 0 90 60"><path d="M45 4 L45 38 L12 38Z" fill="#fff" stroke="#c9d6c4" /><path d="M45 12 L45 38 L74 38Z" fill="#fde3ea" stroke="#e98fa9" /><path d="M6 40 H84 L70 56 H20Z" fill="#fffdf8" stroke="#c9d6c4" /></svg>
          </motion.div></motion.div>}
        {fin && <motion.svg className="bl" viewBox="0 0 120 90" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1 }}>
          <path d="M8 84 Q60 70 112 84" stroke="#4f7a52" strokeWidth="6" fill="none" strokeLinecap="round" />
          {[-62, 62, -32, 32, 0].map((a, i) => <motion.ellipse key={a} cx="60" cy="48" rx="13" ry="34" fill={i < 2 ? '#f8c3d2' : i < 4 ? '#fde3ea' : '#fff'} stroke="#e98fa9" style={{ rotate: a, transformOrigin: '60px 82px' }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4 + i * 0.25, type: 'spring', stiffness: 60, damping: 9 }} />)}
        </motion.svg>}
      </motion.div>
      {fin && <motion.p className="big wsh" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }}>{D.wish}</motion.p>}
    </section>
  );
}

function Typed({ text, onDone }) {
  const [n, setN] = useState(0);
  useEffect(() => { let i = 0; const t = setInterval(() => { i++; setN(i); if (i >= text.length) { clearInterval(t); onDone && onDone(); } }, 17); return () => clearInterval(t); }, []);
  return <>{text.slice(0, n)}</>;
}
function Letter() {
  const [st, setSt] = useState(0), [hold, setHold] = useState(false), [cur, setCur] = useState(0), tm = useRef(null), L = D.letter;
  const down = () => { setHold(true); tm.current = setTimeout(() => { setSt(1); pop({ particleCount: 60 }); setTimeout(() => setSt(2), 1300); }, 1000); };
  const up = () => { if (st === 0) { setHold(false); clearTimeout(tm.current); } };
  return (
    <section className="letter"><h3 className="h lt">A letter for you</h3>
      <AnimatePresence mode="wait">{st < 2
        ? <motion.div key="e" className="envw" {...rise} exit={{ opacity: 0, y: 80, scale: 0.9 }}>
          <div className="env"><motion.div className="flap" animate={{ rotateX: st ? 180 : 0 }} transition={{ duration: 0.8 }} />
            <motion.button className="seal" onPointerDown={down} onPointerUp={up} onPointerLeave={up} animate={{ opacity: st ? 0 : 1, scale: st ? 0.2 : hold ? 0.92 : 1 }} aria-label="Press and hold to open the letter">
              <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="27" fill="none" stroke="#fff6" strokeWidth="3" /><motion.circle cx="30" cy="30" r="27" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" style={{ rotate: -90, transformOrigin: 'center' }} animate={{ pathLength: hold ? 1 : 0 }} transition={{ duration: hold ? 1 : 0.3, ease: 'linear' }} /></svg>♥
            </motion.button></div>
          <small className="tap">Press and hold the seal</small></motion.div>
        : <motion.div key="p" className="sheet" initial={{ opacity: 0, y: 90, rotateX: 40 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1 }}>
          {L.map((t, i) => cur >= i && <p key={i} className={cur === i ? 'cur' : ''}><Typed text={t} onDone={() => setCur((c) => Math.max(c, i + 1))} /></p>)}
          {cur >= L.length && <><motion.p className="sig" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>Forever yours, {D.from}</motion.p><motion.p className="ps" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}>P.S. {D.ps}</motion.p></>}
        </motion.div>}</AnimatePresence>
    </section>
  );
}

function Scratch() {
  const cv = useRef(null), [done, setDone] = useState(false), [red, setRed] = useState({}), drawing = useRef(false), moves = useRef(0);
  useEffect(() => {
    const c = cv.current, x = c.getContext('2d'), w = (c.width = c.offsetWidth), h = (c.height = c.offsetHeight);
    const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#e6c36a'); g.addColorStop(0.5, '#fff0b8'); g.addColorStop(1, '#d1a63f'); x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.fillStyle = '#7a5a12'; x.font = '700 26px Cormorant Garamond, serif'; x.textAlign = 'center'; x.fillText('Scratch to reveal', w / 2, h / 2 - 6); x.font = '30px serif'; x.fillText('✨ 🎁 ✨', w / 2, h / 2 + 34);
  }, []);
  const scratch = (e) => {
    if (!drawing.current || done) return; const c = cv.current, r = c.getBoundingClientRect(), x = c.getContext('2d');
    x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(e.clientX - r.left, e.clientY - r.top, 26, 0, 7); x.fill();
    if (++moves.current % 12 === 0) { const d = x.getImageData(0, 0, c.width, c.height).data; let k = 0; for (let i = 3; i < d.length; i += 160) if (!d[i]) k++; if (k / (d.length / 160) > 0.5) { setDone(true); pop({ particleCount: 180, spread: 120 }); } }
  };
  return (
    <section className="gift"><h3 className="h gt">One last surprise</h3>
      <motion.div className="sk" {...rise}>
        <img src={img(12)} alt="Sunflowers held behind his back" />
        <div className="gm"><p>{D.gift}</p></div>
        <canvas ref={cv} style={{ touchAction: 'none', opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'auto', transition: 'opacity 1s' }}
          onPointerDown={(e) => { drawing.current = true; e.currentTarget.setPointerCapture(e.pointerId); scratch(e); }} onPointerMove={scratch} onPointerUp={() => (drawing.current = false)} />
      </motion.div>
      {done && <div className="cps">{D.coupons.map((c, i) => (
        <motion.button key={i} className="tk" initial={{ y: 80, opacity: 0, rotate: -6 }} animate={{ y: 0, opacity: 1, rotate: i % 2 ? 1.5 : -1.5 }} transition={{ delay: 0.6 + i * 0.3, type: 'spring' }} whileTap={{ scale: 0.96 }} onClick={() => { setRed((v) => ({ ...v, [i]: 1 })); pop({ particleCount: 50 }); }}>
          <b>{c.t}</b><span>{c.d}</span><em>{red[i] ? 'Redeemed ♥' : 'Tap to redeem'}</em></motion.button>))}</div>}
    </section>
  );
}

function Finale() {
  const boom = () => { for (let i = 0; i < 6; i++) setTimeout(() => pop({ particleCount: 90, spread: 360, startVelocity: 28, origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.4 } }), i * 280); };
  return (
    <footer className="end">
      <motion.img src={img(13)} alt="Two hands held together" {...rise} />
      <motion.div {...rise}><h3>Happy Birthday, {D.name}</h3><p>With all my love, {D.from}</p>
        <div className="fb"><button className="btn" onClick={boom}>Fireworks 🎆</button><button className="btn ghost" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })}>Watch again</button></div></motion.div>
    </footer>
  );
}

export default function App() {
  const [intro, setIntro] = useState(true), { scrollYProgress } = useScroll(), sx = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  useEffect(() => { document.body.style.overflow = intro ? 'hidden' : ''; }, [intro]);
  useEffect(() => { const f = (e) => confetti({ particleCount: 6, spread: 60, startVelocity: 12, scalar: 0.6, gravity: 0.8, ticks: 80, origin: { x: e.clientX / innerWidth, y: e.clientY / innerHeight }, colors: COL }); addEventListener('pointerdown', f); return () => removeEventListener('pointerdown', f); }, []);
  return (
    <MotionConfig reducedMotion="user">
      <Petals />{!intro && <motion.div className="prog" style={{ scaleX: sx }} />}
      <AnimatePresence>{intro && <Intro key="i" onOpen={() => setIntro(false)} />}</AnimatePresence>
      <main><Hero /><Story /><Dream /><Lotus /><Sorry /><Wish /><Letter /><Scratch /><Finale /></main>
    </MotionConfig>
  );
}
