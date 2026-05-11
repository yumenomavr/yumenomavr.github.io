// Home page sections — Hero / Concept / Loop / Trailer / CTA / Footer

const fmtTime = (s) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const ss = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${ss}`;
};

const AudioPlayer = ({ src, kanji, roman, sub }) => {
  const audioRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [t, setT] = React.useState(0);
  const [dur, setDur] = React.useState(0);
  const [blobSrc, setBlobSrc] = React.useState(null);

  // Fetch the audio as a Blob so seeking works regardless of server Range support.
  React.useEffect(() => {
    let url = null;
    let cancelled = false;
    fetch(src)
      .then(r => r.blob())
      .then(b => {
        if (cancelled) return;
        url = URL.createObjectURL(b);
        setBlobSrc(url);
      })
      .catch(() => { if (!cancelled) setBlobSrc(src); });
    return () => { cancelled = true; if (url) URL.revokeObjectURL(url); };
  }, [src]);

  React.useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setT(a.currentTime);
    const onDur = () => setDur(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('loadedmetadata', onDur);
    a.addEventListener('durationchange', onDur);
    a.addEventListener('ended', onEnd);
    return () => {
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('loadedmetadata', onDur);
      a.removeEventListener('durationchange', onDur);
      a.removeEventListener('ended', onEnd);
    };
  }, [blobSrc]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  const trackRef = React.useRef(null);
  const seekFromX = (clientX) => {
    const a = audioRef.current;
    const track = trackRef.current;
    if (!a || !track) return;
    const d = a.duration;
    if (!isFinite(d) || d <= 0) return;
    const r = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
    const nt = ratio * d;
    a.currentTime = nt;
    setT(nt);
  };
  const onTrackDown = (e) => {
    e.preventDefault();
    seekFromX(e.clientX);
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    const move = (ev) => seekFromX(ev.clientX);
    const up = (ev) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const pct = dur ? (t / dur) * 100 : 0;

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={blobSrc || undefined} preload="auto" />
      <button className={`audio-btn ${playing ? 'playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pause' : 'Play'}>
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="3.5" height="10" fill="currentColor"/><rect x="8.5" y="2" width="3.5" height="10" fill="currentColor"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14"><polygon points="3,2 12,7 3,12" fill="currentColor"/></svg>
        )}
      </button>
      <div className="audio-meta">
        <div className="audio-title">
          <span className="audio-kanji">{kanji}</span>
          <span className="audio-sep">—</span>
          <span className="audio-roman">{roman}</span>
        </div>
        {sub ? <div className="audio-sub">{sub}</div> : null}
      </div>
      <div
        className="audio-track"
        ref={trackRef}
        onPointerDown={onTrackDown}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={Math.round(dur) || 0}
        aria-valuenow={Math.round(t)}
        aria-valuetext={`${fmtTime(t)} of ${fmtTime(dur)}`}
        tabIndex={0}
      >
        <div className="audio-fill" style={{width: `${pct}%`}} aria-hidden="true" />
        <div className="audio-head" style={{left: `${pct}%`}} aria-hidden="true" />
      </div>
      <div className="audio-time">{fmtTime(t)} <span>/</span> {fmtTime(dur)}</div>
    </div>
  );
};

const Hero = ({ t }) => (
  <section className="hero">
    <div className="hero-bg" aria-hidden="true" />
    <div className="eyebrow hero-eyebrow-top">
      <span className="dot" aria-hidden="true" />{t.hero.eyebrow}<span className="dot" aria-hidden="true" />
    </div>
    <img
      className="hero-art"
      src="assets/group.jpg"
      alt="夢の間 — A dream before the last one."
      decoding="async"
      fetchpriority="high"
    />
    <div className="hero-meta">
      <span>{t.hero.meta_left}</span>
      <span className="scroll-cue">{t.hero.meta_right}</span>
    </div>
  </section>
);

const Concept = ({ t }) => (
  <section className="concept">
    <div className="wrap">
      <div className="section-label">
        <span className="num">壱</span>
        <span className="lbl">{t.concept.label}</span>
      </div>
      <h2 className="section-title" dangerouslySetInnerHTML={{__html: t.concept.title}} />
      <div className="concept-grid" style={{marginTop: 60}}>
        <div className="concept-prose">
          <p className="lead">{t.concept.lead}</p>
          <p dangerouslySetInnerHTML={{__html: t.concept.p1}} />
          <p dangerouslySetInnerHTML={{__html: t.concept.p2}} />
        </div>
        <div className="concept-aside">
          {t.concept.facts.map(([k, v], i) => (
            <div key={i} className="concept-fact">
              <span className="key">{k}</span>
              <span className="val" dangerouslySetInnerHTML={{__html: v}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PhaseIcon = ({ kind }) => {
  if (kind === 0) return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="28" stroke="var(--terra)" strokeWidth="0.8" />
      <circle cx="40" cy="40" r="3" fill="var(--terra)" />
      <line x1="40" y1="12" x2="40" y2="22" stroke="var(--terra)" strokeWidth="0.8" />
      <line x1="40" y1="58" x2="40" y2="68" stroke="var(--terra)" strokeWidth="0.8" />
      <text x="40" y="46" textAnchor="middle" fill="var(--terra)" fontFamily="Noto Serif JP" fontSize="16" opacity="0.45">夕</text>
    </svg>
  );
  if (kind === 1) return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <path d="M28 20 A 24 24 0 1 0 60 52 A 18 18 0 1 1 28 20 Z" stroke="var(--terra)" strokeWidth="0.8" fill="none"/>
      <circle cx="58" cy="22" r="1.5" fill="var(--terra)" />
      <circle cx="64" cy="34" r="1" fill="var(--terra)" />
    </svg>
  );
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
      <line x1="20" y1="60" x2="60" y2="20" stroke="var(--terra)" strokeWidth="1.2" />
      <line x1="56" y1="16" x2="64" y2="24" stroke="var(--terra)" strokeWidth="1.2" />
      <rect x="14" y="58" width="14" height="6" stroke="var(--terra)" strokeWidth="0.8" fill="none" />
      <text x="40" y="74" textAnchor="middle" fill="var(--terra)" fontFamily="Noto Serif JP" fontSize="11" opacity="0.45">夢</text>
    </svg>
  );
};

const Loop = ({ t }) => {
  const phaseRefs = React.useRef([]);
  React.useEffect(() => {
    const els = phaseRefs.current.filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') {
      els.forEach(el => el.classList.add('in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return (
    <section className="loop">
      <div className="wrap">
        <div className="section-label">
          <span className="num">弐</span>
          <span className="lbl">{t.loop.label}</span>
        </div>
        <h2 className="section-title" dangerouslySetInnerHTML={{__html: t.loop.title}} />
        <div className="loop-phases">
          {t.loop.phases.map((p, i) => (
            <div
              key={i}
              ref={el => phaseRefs.current[i] = el}
              className="phase"
              style={{transitionDelay: `${i * 120}ms`}}
            >
              <div className="phase-num">{p.num}</div>
              <div className="phase-icon" aria-hidden="true"><PhaseIcon kind={i} /></div>
              <h3 className="phase-title" dangerouslySetInnerHTML={{__html: p.title}} />
              <div className="phase-title-jp">{p.jp}</div>
              <p className="phase-body" dangerouslySetInnerHTML={{__html: p.body}} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Trailer = ({ t }) => (
  <section className="trailer">
    <div className="wrap">
      <div className="section-label">
        <span className="num">参</span>
        <span className="lbl">{t.trailer.label}</span>
      </div>
      <h2 className="section-title" dangerouslySetInnerHTML={{__html: t.trailer.title}} />
      <div className="trailer-frame">
        <div className="trailer-corners" aria-hidden="true">
          <span className="tl" /><span className="tr" /><span className="bl" /><span className="br" />
        </div>
        <div className="trailer-stamp">{t.trailer.stamp}</div>
        <div className="trailer-stamp-r">{t.trailer.stamp_r}</div>
        <div className="trailer-inner">
          <div className="trailer-kanji">{t.trailer.kanji}</div>
          <div className="trailer-play">
            <span className="triangle" />
            {t.trailer.play}
          </div>
          <div className="trailer-meta">{t.trailer.meta}</div>
        </div>
      </div>
      <AudioPlayer
        src="assets/kaze_no_naka.mp3"
        kanji="風のなか"
        roman={t.trailer.audio_roman}
        sub={t.trailer.audio_sub}
      />
    </div>
  </section>
);

const CTA = ({ t }) => (
  <section className="cta">
    <div className="wrap-narrow">
      <div className="eyebrow cta-eyebrow">
        <span className="dot" aria-hidden="true" />{t.cta.eyebrow}<span className="dot" aria-hidden="true" />
      </div>
      <h2 className="cta-title" dangerouslySetInnerHTML={{__html: t.cta.title}} />
      <div className="cta-sub">{t.cta.sub}</div>
      <button type="button" className="btn-steam" aria-disabled="true" title="Coming soon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1" fill="none"/><circle cx="8" cy="8" r="3" fill="currentColor"/></svg>
        {t.cta.btn}
      </button>
      <button type="button" className="btn-secondary" aria-disabled="true" title="Coming soon">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="1.75" y="3.5" width="12.5" height="9" stroke="currentColor" strokeWidth="1" fill="none"/>
          <path d="M2 4.25 L8 9 L14 4.25" stroke="currentColor" strokeWidth="1" fill="none" strokeLinejoin="round"/>
        </svg>
        {t.cta.btn2}
      </button>
    </div>
  </section>
);

const Footer = ({ t, onPress }) => (
  <footer className="foot">
    <div className="wrap">
      <div className="foot-grid">
        <div className="foot-mark">
          <div className="yume">夢の間</div>
          <div className="tag">{t.foot.tag}</div>
          <div className="whisper" title="夢主">{t.foot.whisper}</div>
        </div>
        <div>
          <h4>Build</h4>
          <ul>{t.foot.build.map((x, i) => {
            const [label, href] = Array.isArray(x) ? x : [x, null];
            return <li key={i}>{href ? <a href={href}>{label}</a> : label}</li>;
          })}</ul>
        </div>
        <div>
          <h4>Follow</h4>
          <ul>{t.foot.follow.map((x, i) => <li key={i}>{x}</li>)}</ul>
        </div>
      </div>
      <div className="foot-bottom">
        <span>{t.foot.copyright}</span>
        <span className="foot-bottom-right">
          <button className="press-link" onClick={(e) => { e.preventDefault(); onPress && onPress(); }}>{t.foot.press}</button>
          <span className="sep">·</span>
          <span>夢 · YUME · DREAM</span>
        </span>
      </div>
    </div>
  </footer>
);

const HomePage = ({ t, onPress }) => (
  <>
    <Hero t={t} />
    <Concept t={t} />
    <Loop t={t} />
    <Trailer t={t} />
    <CTA t={t} />
    <Footer t={t} onPress={onPress} />
  </>
);

window.HomePage = HomePage;
window.Footer = Footer;
