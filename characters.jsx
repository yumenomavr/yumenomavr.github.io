// Characters page — six children, with ages
const CharactersPage = ({ t, onPress }) => {
  const [openIdx, setOpenIdx] = React.useState(null);
  const [isTouch, setIsTouch] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(hover: none)');
    setIsTouch(mq.matches);
    const onChange = (e) => setIsTouch(e.matches);
    if (mq.addEventListener) mq.addEventListener('change', onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', onChange);
      else mq.removeListener(onChange);
    };
  }, []);
  const onCardActivate = (i) => {
    if (!isTouch) return;
    setOpenIdx(openIdx === i ? null : i);
  };
  return (
    <>
      <section className="char-hero">
        <div className="wrap">
          <div className="kanji-big" aria-hidden="true">六</div>
          <h1 className="title" dangerouslySetInnerHTML={{__html: t.char.hero_title}} />
          <p className="lede">{t.char.hero_lede}</p>
        </div>
      </section>
      <section style={{padding: 0}}>
        <div className="wrap">
          <div className="char-grid">
            {t.char.list.map((c, i) => (
              <div
                key={i}
                className={`char-card ${openIdx === i ? 'open' : ''}`}
                onClick={isTouch ? () => onCardActivate(i) : undefined}
                role={isTouch ? 'button' : undefined}
                tabIndex={isTouch ? 0 : undefined}
                aria-expanded={isTouch ? openIdx === i : undefined}
                onKeyDown={isTouch ? (e) => {
                  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onCardActivate(i); }
                } : undefined}
              >
                <div className="char-portrait" style={{ backgroundImage: `url('${c.img}')`, backgroundPosition: c.pos || 'center top' }} />
                <div className="char-overlay" />
                <div className="char-meta">
                  <div className="char-num">№ {c.num}<span className="char-age"> · {t.char.age_label} {c.age}</span></div>
                  <div className="char-name">{c.name}</div>
                  <div className="char-name-roman">{c.roman}</div>
                  <div className="char-trait">{c.trait}</div>
                  <div className="char-quote">{c.quote}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer t={t} onPress={onPress} />
    </>
  );
};
window.CharactersPage = CharactersPage;
