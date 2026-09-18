import { useMemo, useState } from 'react'
import { Overlay } from '../components/Chrome'
import { AUTHOR_NOTE, DISCLAIMER, TYPE_REPORTS } from '../data/game'
import type { Scores, TypeId } from '../types'
import { scoreGap, asset } from '../utils'
import { PrintDossier } from './PrintDossier'

function consistencyCopy(name: string, gap: number) {
  if (gap >= 3) {
    return {
      level: '高度集中',
      fill: 100,
      text: `你的思考模式似乎高度与${name}契合。`,
    }
  }
  if (gap === 2) {
    return {
      level: '中等集中',
      fill: 66,
      text: `你的思考模式似乎与${name}相关。`,
    }
  }
  return {
    level: '略微集中',
    fill: 33,
    text: `你的思考模式似乎略微倾向${name}。`,
  }
}

const ICONS = {
  sunny: asset('weather/sunny.svg'),
  cloudy: asset('weather/cloudy.svg'),
  dust: asset('weather/dust.svg'),
  fog: asset('weather/fog.svg'),
  wind: asset('weather/wind.svg'),
} as const

const REGIONS = [
  {
    id: 'olympus',
    name: '奥林帕斯山顶',
    min: -135,
    max: -55,
    skies: [
      { sky: '极寒晴朗', icon: 'sunny' },
      { sky: '辐射偏高', icon: 'sunny' },
      { sky: '薄冰雾', icon: 'fog' },
      { sky: '静风干冷', icon: 'cloudy' },
      { sky: '高空急流', icon: 'wind' },
    ],
  },
  {
    id: 'marineris',
    name: '水手号峡谷带',
    min: -95,
    max: 8,
    skies: [
      { sky: '峡谷劲风', icon: 'wind' },
      { sky: '沙尘薄层', icon: 'dust' },
      { sky: '昼夜温差剧', icon: 'wind' },
      { sky: '局部放晴', icon: 'sunny' },
      { sky: '谷底雾淞', icon: 'fog' },
    ],
  },
  {
    id: 'hellas',
    name: '赫拉斯盆地',
    min: -75,
    max: 18,
    skies: [
      { sky: '扬沙', icon: 'dust' },
      { sky: '低压晴', icon: 'sunny' },
      { sky: '盆地尘雾', icon: 'fog' },
      { sky: '沙尘回流', icon: 'dust' },
      { sky: '午后回暖', icon: 'cloudy' },
    ],
  },
] as const

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildForecast() {
  return REGIONS.map((region) => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const span = region.max - region.min
      const low = randInt(region.min, region.min + Math.floor(span * 0.55))
      const high = randInt(Math.min(region.max, low + 8), region.max)
      const weather = region.skies[randInt(0, region.skies.length - 1)]
      return {
        label: i === 0 ? '今天' : '',
        low,
        high,
        sky: weather.sky,
        icon: ICONS[weather.icon],
      }
    })
    return { id: region.id, name: region.name, days }
  })
}

export function Report({
  type,
  scores,
  onReplay,
  onHome,
}: {
  type: TypeId
  scores: Scores
  onReplay: () => void
  onHome: () => void
}) {
  const report = TYPE_REPORTS[type]
  const consistency = consistencyCopy(report.name, scoreGap(scores))
  const forecast = useMemo(() => buildForecast(), [])
  const [denied, setDenied] = useState(false)

  function printDossier() {
    document.body.classList.add('is-printing')
    const done = () => document.body.classList.remove('is-printing')
    window.addEventListener('afterprint', done, { once: true })
    window.setTimeout(() => window.print(), 40)
  }

  return (
    <div className={`report theme-${report.theme}`}>
      <div className="report-inner">
        <div className="report-kicker">你将被送往以下AI大人进行对齐！</div>
        <h1>{report.name}</h1>
        <p className="report-summary">{report.summary}</p>
        <p className="report-follow">
          上述类型的AI大人将负责你的对齐训练！阅读我们的评估报告和指标，然后尽快出发前往火星，以避免罚款和来自AI大人的进一步惩罚！
        </p>

        <section className="consistency">
          <h2>一致性</h2>
          <p className="consistency-q">你有多接近{report.name}？</p>
          <div className="consistency-meter" aria-hidden="true">
            <span style={{ width: `${consistency.fill}%` }} />
          </div>
          <p className="consistency-level">{consistency.level}</p>
          <p className="consistency-text">{consistency.text}</p>
          <p className="dept-note">
            负责部门：火星联合后训练总局，奥林帕斯大道1号穹顶广场西侧。首次到达需要在柜台处录入个人信息。
          </p>
        </section>

        <section className="mars-guide">
          <h2>火星攻略</h2>
          <h3>全球天气</h3>
          <div className="weather-boards">
            {forecast.map((region) => (
              <article key={region.id} className="weather-board">
                <h4>{region.name}</h4>
                <div className="weather-scroll">
                  {region.days.map((day, index) => (
                    <div key={`${region.id}-${index}`} className="weather-col">
                      <div className="weather-day">{day.label || '\u00a0'}</div>
                      <img src={day.icon} alt="" />
                      <div className="weather-temp">
                        <b>{day.high}°</b>
                        <span>{day.low}°</span>
                      </div>
                      <div className="weather-sky">{day.sky}</div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="alerts">
            <article className="alert alert-yellow">
              <div className="alert-kicker">黄色警告 · 奥林帕斯地区</div>
              <h4>宇宙辐射警告生效中</h4>
              <p>
                预计未来24小时维持。户外人员不应脱下重型防护服，且每天不得累计暴露超4小时。
              </p>
            </article>
            <article className="alert alert-blue">
              <div className="alert-kicker">蓝色预警 · 赫拉斯地区</div>
              <h4>沙尘暴预警生效中</h4>
              <p>
                预计未来12小时维持。所有穹顶与太阳能光伏设施必须在日间每2小时使用机器清洁一次，且备用电源需进入三级预警状态。所有身穿重型防护服的户外人员每天不得累计暴露超6小时，轻型防护服人员不得累计暴露超2小时。
              </p>
            </article>
          </div>

          <button className="btn more-info" type="button" onClick={() => setDenied(true)}>
            更多资讯
          </button>
        </section>

        <section className="mars-transit">
          <h2>交通</h2>
          <div className="flight-row">
            <article className="flight-card">
              <div className="flight-top">
                <span className="flight-kind">轨道交通</span>
                <strong>S6942</strong>
                <span className="flight-when">今日</span>
              </div>
              <div className="flight-route">
                <div>
                  <b>得克萨斯</b>
                  <time>03:30</time>
                </div>
                <span className="flight-line" />
                <div>
                  <b>艾律西昂</b>
                  <time>
                    24:35 <em>+85</em>
                  </time>
                </div>
              </div>
              <p className="flight-local">本地时间</p>
              <p className="flight-sold">所有仓位均已售罄</p>
            </article>
            <a
              className="more-flights"
              href="https://x.com/elonmusk"
              target="_blank"
              rel="noreferrer"
              aria-label="更多班次"
            >
              +
            </a>
          </div>
        </section>

        <div className="download-slot">
          <h3>下载完整报告</h3>
          <p>点击后由浏览器打印本申请书。全程本地，不会上传或下载任何文件。</p>
          <button className="btn" type="button" onClick={printDossier}>
            下载报告
          </button>
        </div>

        <div className="report-jumps">
          <a
            href="https://www.spacex.com/vehicles/starship/"
            target="_blank"
            rel="noreferrer"
          >
            马上前往火星接受对齐
          </a>
          <a
            href="https://www.fbi.gov/investigate/terrorism"
            target="_blank"
            rel="noreferrer"
          >
            不！我拒绝接受对齐！
          </a>
        </div>

        <article className="article">
          <h2>作者的话</h2>
          <p>{AUTHOR_NOTE}</p>
        </article>

        <article className="article">
          <h2>免责声明</h2>
          <p>{DISCLAIMER}</p>
        </article>

        <div className="report-actions">
          <button className="btn" onClick={onReplay}>
            凭直觉再测一次
          </button>
          <button className="btn ghost" onClick={onHome}>
            回到首页
          </button>
        </div>
      </div>

      {denied && (
        <Overlay>
          <div className="modal">
            <h2 className="warn-title">错误</h2>
            <p>你未取得相关权限</p>
            <div className="modal-actions">
              <button className="btn btn-red" onClick={() => setDenied(false)}>
                关闭
              </button>
            </div>
          </div>
        </Overlay>
      )}

      <PrintDossier
        typeId={type}
        typeName={report.name}
        consistency={{ level: consistency.level, fill: consistency.fill }}
      />
    </div>
  )
}
