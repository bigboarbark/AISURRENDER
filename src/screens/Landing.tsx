import { ColorStrip, Header } from '../components/Chrome'
import { useCopy } from '../i18n/copy'
import { asset } from '../utils'

export function Landing({ onSurrender }: { onSurrender: () => void }) {
  const t = useCopy()
  const species = [
    { src: asset('species/dog.png'), alt: t.landing.species.dog },
    { src: asset('species/cat.png'), alt: t.landing.species.cat },
    { src: asset('species/monkey.png'), alt: t.landing.species.monkey },
    { src: asset('species/hominid.png'), alt: t.landing.species.hominid },
  ]

  return (
    <div>
      <Header />
      <ColorStrip />
      <main className="hero">
        <div className="hero-inner">
          <div className="kicker">{t.landing.kicker}</div>
          <h1>
            <em>{t.landing.lead}</em>
            {t.landing.headline}
          </h1>
          <button className="btn btn-red" onClick={onSurrender}>
            {t.landing.surrender}
          </button>
          <div className="species-grid">
            {species.map((item) => (
              <figure key={item.src}>
                <img src={item.src} alt={item.alt} />
              </figure>
            ))}
          </div>
          <p className="species-caption">{t.landing.speciesCaption}</p>
          <p className="hero-sub">{t.landing.sub}</p>
        </div>
      </main>
      <footer className="site-footer">
        <strong>{t.landing.footer}</strong>
      </footer>
    </div>
  )
}
