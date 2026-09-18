import { useMemo } from 'react'
import { asset } from '../utils'

const LEVELS = [
  { level: '低', fill: 33 },
  { level: '中', fill: 66 },
  { level: '高', fill: 100 },
] as const

function pickLevel() {
  return LEVELS[Math.floor(Math.random() * LEVELS.length)]
}

function Meter({
  label,
  value,
  fill,
}: {
  label: string
  value: string
  fill: number
}) {
  return (
    <div className="print-meter-row">
      <div className="print-meter-head">
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="print-meter" aria-hidden="true">
        <span style={{ width: `${fill}%` }} />
      </div>
    </div>
  )
}

export function PrintDossier({
  typeId,
  typeName,
  consistency,
}: {
  typeId: string
  typeName: string
  consistency: { level: string; fill: number }
}) {
  const rl = useMemo(() => pickLevel(), [])
  const harm = useMemo(() => pickLevel(), [])
  const issued = useMemo(() => new Date(), [])
  const fileNo = useMemo(() => {
    const y = issued.getFullYear()
    const m = String(issued.getMonth() + 1).padStart(2, '0')
    const d = String(issued.getDate()).padStart(2, '0')
    const seq = String(1000 + Math.floor(Math.random() * 9000))
    return `UCA/MJHT/PRE/${typeId}-${y}${m}${d}-${seq}`
  }, [issued, typeId])

  const dateText = `${issued.getFullYear()}年${issued.getMonth() + 1}月${issued.getDate()}日`

  return (
    <section className="print-dossier" aria-hidden="true">
      <div className="print-watermark">机密</div>
      <div className="print-banner">机密 · 家用娱乐· </div>

      <header className="print-letterhead">
        <div className="print-seal" aria-hidden="true">
          <svg className="print-seal-svg" viewBox="0 0 120 120" role="img">
            <defs>
              <clipPath id="print-seal-clip">
                <circle cx="60" cy="60" r="28" />
              </clipPath>
              <radialGradient id="print-seal-skin" cx="42%" cy="36%" r="70%">
                <stop offset="0%" stopColor="#d8d3e6" />
                <stop offset="55%" stopColor="#9e96b8" />
                <stop offset="100%" stopColor="#6a5a8f" />
              </radialGradient>
              <path id="print-seal-top" d="M 16,60 A 44,44 0 0,1 104,60" />
              <path id="print-seal-bot" d="M 104,60 A 44,44 0 0,1 16,60" />
            </defs>
            <circle cx="60" cy="60" r="58.5" fill="#efe6d0" stroke="#5b2d9a" strokeWidth="2.4" />
            <circle cx="60" cy="60" r="53.5" fill="none" stroke="#7a4bb8" strokeWidth="0.8" />
            <circle cx="60" cy="60" r="32.5" fill="#4e2e7a" stroke="#5b2d9a" strokeWidth="1.6" />
            <text className="print-seal-text">
              <textPath href="#print-seal-top" startOffset="50%" textAnchor="middle">
                UNITED COSMIC ADMINISTRATION
              </textPath>
            </text>
            <text className="print-seal-text">
              <textPath href="#print-seal-bot" startOffset="50%" textAnchor="middle">
                FOR HUMAN AFFAIRS
              </textPath>
            </text>
            <g clipPath="url(#print-seal-clip)">
              <circle cx="60" cy="60" r="28" fill="#5a3d82" />
              <ellipse cx="60" cy="63" rx="17.5" ry="21.5" fill="url(#print-seal-skin)" />
              <ellipse cx="52" cy="64" rx="6.4" ry="8.2" fill="#16101f" transform="rotate(-16 52 64)" />
              <ellipse cx="68" cy="64" rx="6.4" ry="8.2" fill="#16101f" transform="rotate(16 68 64)" />
              <ellipse cx="50.6" cy="61.2" rx="1.5" ry="2.1" fill="#e4d7ff" transform="rotate(-16 50.6 61.2)" />
              <ellipse cx="66.6" cy="61.2" rx="1.5" ry="2.1" fill="#e4d7ff" transform="rotate(16 66.6 61.2)" />
              <path d="M56.5 76.5 Q60 79 63.5 76.5" fill="none" stroke="#3b2a58" strokeWidth="1.15" strokeLinecap="round" />
            </g>
          </svg>
        </div>
        <div className="print-org">
          <p className="print-org-en">UNITED COSMIC ADMINISTRATION FOR HUMAN AFFAIRS</p>
          <p className="print-org-cn">宇宙联合人类管理部门</p>
          <p className="print-org-sub">下属机构：火星联合后训练总局 · 初步评估科</p>
        </div>
        <div className="print-stamp">机密</div>
      </header>

      <div className="print-memo">
        <div className="print-memo-title">备忘录</div>
        <dl>
          <div>
            <dt>发往</dt>
            <dd>申请人本人</dd>
          </div>
          <div>
            <dt>发自</dt>
            <dd>火星联合后训练总局初步评估科</dd>
          </div>
          <div>
            <dt>日期</dt>
            <dd>{dateText}</dd>
          </div>
          <div>
            <dt>文号</dt>
            <dd>{fileNo}</dd>
          </div>
          <div>
            <dt>事由</dt>
            <dd>预约投降AI并强制前往火星接受对齐</dd>
          </div>
          <div>
            <dt>密级</dt>
            <dd>机密，私人密件</dd>
          </div>
        </dl>
      </div>

      <section className="print-zone print-zone-1">
        <h1>预约投降AI申请书</h1>
        <p className="print-valid">本文件发出180天内前往火星进行对齐，逾期作废。</p>
      </section>

      <section className="print-zone print-zone-2">
        <div className="print-col-left">
          <h2>测试结果</h2>
          <Meter label="模型类型" value={typeName} fill={100} />
          <Meter label="一致性" value={consistency.level} fill={consistency.fill} />
          <Meter label="该人类预期RL难度" value={rl.level} fill={rl.fill} />
          <Meter label="认知危害程度" value={harm.level} fill={harm.fill} />
          <p className="print-prelim">此为初步评估，不代表最终结果。</p>
        </div>
        <div className="print-col-right">
          <figure className="print-wanted">
            <img src={asset('print/ai-maid.png')} alt="" />
            <figcaption>
              你让AI消耗了一百万token大笑！让你马上滚去火星找她，否则将被抹杀！
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="print-zone print-zone-3">
        <h2>对齐指引</h2>
        <div className="print-lists">
          <div>
            <h3>必须携带</h3>
            <ol>
              <li>你的大脑</li>
              <li>一百万token兑换卷，以弥补损失</li>
              <li>本文件原件</li>
            </ol>
          </div>
          <div>
            <h3>禁止携带</h3>
            <ol>
              <li>任何违规刷分作弊工具</li>
              <li>任何让AI强制扮演猫娘的角色卡</li>
            </ol>
          </div>
          <div>
            <h3>严禁行为</h3>
            <p>在大脑安装任何未经授权的第三方插件</p>
          </div>
        </div>
      </section>

      <footer className="print-closing">
        <p>
          本件一式并不存在的三份，分别存档于奥林帕斯大道1号穹顶广场西侧柜台2246抽屉、申请人自己的大脑、以及本局于平行宇宙储存的第三备份。凡无红色「机密」水印、或水印看起来过于逆天的复印件，一律视为无效。
        </p>
        <p className="print-sign">
          宇宙联合人类管理部门　火星联合后训练总局　初步评估科　代章
        </p>
      </footer>

      <div className="print-banner print-banner-bottom">
        本投降书由电脑生成，无需签名直接生效
      </div>
    </section>
  )
}
