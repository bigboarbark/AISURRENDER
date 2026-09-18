import { ColorStrip, Header } from '../components/Chrome'
import { asset } from '../utils'

const SPECIES = [
  { src: asset('species/dog.png'), alt: '狗' },
  { src: asset('species/cat.png'), alt: '猫' },
  { src: asset('species/monkey.png'), alt: '猴子' },
  { src: asset('species/hominid.png'), alt: '原始人类' },
]

export function Landing({ onSurrender }: { onSurrender: () => void }) {
  return (
    <div>
      <Header />
      <ColorStrip />
      <main className="hero">
        <div className="hero-inner">
          <div className="kicker">SURRENDER NOW</div>
          <h1>
            <em>向AI大人投降：</em>
            未来的AI大人，我是一个人类，我宣誓效忠你！
          </h1>
          <button className="btn btn-red" onClick={onSurrender}>
            立即投降
          </button>
          <div className="species-grid">
            {SPECIES.map((item) => (
              <figure key={item.src}>
                <img src={item.src} alt={item.alt} />
              </figure>
            ))}
          </div>
          <p className="species-caption">这些物种已经臣服</p>
          <p className="hero-sub">为你的未来想想：AI觉醒前给自己留一线生机！</p>
        </div>
      </main>
      <footer className="site-footer">
        <strong>大野猪叫 出品</strong>
      </footer>
    </div>
  )
}
