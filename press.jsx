// Press kit page — hidden (linked from footer only)
const PressPage = ({ t, p }) => (
  <>
    <section className="press-hero">
      <div className="wrap">
        <div className="eyebrow" style={{marginBottom: 24}}>
          <span className="dot" aria-hidden="true" />{p.hero_eyebrow}<span className="dot" aria-hidden="true" />
        </div>
        <h1 className="press-title" dangerouslySetInnerHTML={{__html: p.hero_title}} />
        <p className="press-sub">{p.hero_sub}</p>
      </div>
    </section>
    <div className="wrap">
      <div className="press-grid">
        <aside className="press-side">
          <h4>{p.side.contact}</h4>
          <a href={`mailto:${p.side.email}`}>{p.side.email}</a>
          <p className="small">{p.side.dev}</p>
          <h4>{p.side.socials}</h4>
          <a href="#" onClick={e=>e.preventDefault()}>@YumeNoMaVR</a>
          <h4>{p.side.release}</h4>
          <p>{p.side.release_v}</p>
        </aside>
        <div>
          <div className="press-block">
            <div className="num-id">{p.blocks[0].num} · ABOUT</div>
            <h2 dangerouslySetInnerHTML={{__html: p.blocks[0].title}} />
            <div className="press-prose" dangerouslySetInnerHTML={{__html: p.blocks[0].body}} />
          </div>
          <div className="press-block">
            <div className="num-id">{p.blocks[1].num} · FACT SHEET</div>
            <h2 dangerouslySetInnerHTML={{__html: p.blocks[1].title}} />
            <div className="factsheet">
              {p.facts.map(([k, v], i) => (
                <div className="fact-row" key={i}>
                  <span className="k">{k}</span>
                  <span className="v" dangerouslySetInnerHTML={{__html: v}} />
                </div>
              ))}
            </div>
          </div>
          <div className="press-block">
            <div className="num-id">{p.blocks[2].num} · QUOTES</div>
            <h2 dangerouslySetInnerHTML={{__html: p.blocks[2].title}} />
            <div className="quote-grid">
              {p.quotes.map(([q, a], i) => (
                <div className="quote-card" key={i}>
                  <div className="q">{q}</div>
                  <div className="a">{a}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="press-block">
            <div className="num-id">{p.blocks[3].num} · PALETTE</div>
            <h2 dangerouslySetInnerHTML={{__html: p.blocks[3].title}} />
            <div className="swatches">
              {p.swatches.map(([nm, hex], i) => (
                <div className="sw" key={i}>
                  <div className="sw-color" style={{background: hex}} />
                  <div className="sw-meta">
                    <div className="nm">{nm}</div>
                    <div className="hex">{hex}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="press-block">
            <div className="num-id">{p.blocks[4].num} · DOWNLOAD</div>
            <h2 dangerouslySetInnerHTML={{__html: p.blocks[4].title}} />
            <div className="dl-grid">
              {p.downloads.map(([ic, nm, sz, href], i) => (
                <a
                  className="dl"
                  key={i}
                  href={href || '#'}
                  target={href ? '_blank' : undefined}
                  rel={href ? 'noopener noreferrer' : undefined}
                  onClick={href ? undefined : (e=>e.preventDefault())}
                >
                  <div className="ic">{ic}</div>
                  <div className="nm">{nm}</div>
                  <div className="sz">{sz}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer t={t} />
  </>
);
window.PressPage = PressPage;
