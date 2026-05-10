// Characters page — six children, with ages
const CharactersPage = ({ t, onPress }) => (
  <>
    <section className="char-hero">
      <div className="wrap">
        <div className="kanji-big">六</div>
        <h1 className="title" dangerouslySetInnerHTML={{__html: t.char.hero_title}} />
        <p className="lede">{t.char.hero_lede}</p>
      </div>
    </section>
    <section style={{padding: 0}}>
      <div className="wrap">
        <div className="char-grid">
          {t.char.list.map((c, i) => (
            <div key={i} className="char-card">
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
window.CharactersPage = CharactersPage;
