import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX } from 'lucide-react'

const animations = [
  {
    id: 'ct-principle',
    title: 'CT 扫描原理',
    subtitle: '了解 CT 是如何工作的',
    icon: '🔄',
    duration: 12,
    steps: [
      { time: 0, title: '第 1 步：病人躺在检查床上', desc: '病人平躺在可移动的检查床上，保持不动。CT 机架（gantry）是一个巨大的环形结构。', draw: drawStep1 },
      { time: 3, title: '第 2 步：X 射线管旋转发射', desc: 'CT 机架内的 X 射线管开始旋转，从不同角度向人体发射扇形 X 射线束。', draw: drawStep2 },
      { time: 6, title: '第 3 步：探测器接收信号', desc: '对面的探测器接收穿过人体的 X 射线。骨骼吸收多→信号弱，空气吸收少→信号强。', draw: drawStep3 },
      { time: 9, title: '第 4 步：计算机重建图像', desc: '计算机利用数千个角度的投影数据，通过数学算法重建出人体的横断面图像。', draw: drawStep4 }
    ]
  },
  {
    id: 'window-level',
    title: '窗宽窗位',
    subtitle: '为什么同一种 CT 能看到不同组织',
    icon: '🎚️',
    duration: 10,
    steps: [
      { time: 0, title: '什么是 CT 值（HU）？', desc: 'CT 值（Hounsfield Unit）衡量组织对 X 射线的吸收程度。水 = 0 HU，空气 = -1000 HU，骨骼 = +1000 HU。', draw: drawWL1 },
      { time: 3, title: '窗宽（Window Width）', desc: '窗宽决定了显示的 CT 值范围。窄窗宽→对比度强，适合看软组织；宽窗宽→对比度弱，适合看骨骼。', draw: drawWL2 },
      { time: 6, title: '窗位（Window Level）', desc: '窗位是显示范围的中心值。不同窗位可以看到不同组织：脑窗(WL40)、骨窗(WL400)、肺窗(WL-600)。', draw: drawWL3 }
    ]
  },
  {
    id: 'contrast',
    title: '增强扫描',
    subtitle: '造影剂如何帮助诊断',
    icon: '💉',
    duration: 8,
    steps: [
      { time: 0, title: '什么是造影剂？', desc: '造影剂是一种含碘的溶液，通过静脉注射进入血液循环。它在 CT 上表现为高密度（亮白色）。', draw: drawContrast1 },
      { time: 4, title: '造影剂的临床意义', desc: '增强扫描可以让肿瘤、血管、炎症区域更加清晰。正常组织与病变组织的血供不同，造影后差异更明显。', draw: drawContrast2 }
    ]
  }
]

function drawStep1(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  // CT 机架（外环）
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 30
  ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.stroke()
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.arc(cx, cy, 195, 0, Math.PI * 2); ctx.stroke()
  ctx.beginPath(); ctx.arc(cx, cy, 165, 0, Math.PI * 2); ctx.stroke()
  // 检查床
  ctx.fillStyle = '#334155'
  ctx.fillRect(cx - 250, cy + 60, 500, 12)
  ctx.fillRect(cx - 250, cy + 72, 500, 4)
  // 病人（简单矩形）
  const bedX = -100 + progress * 100
  ctx.fillStyle = '#60a5fa'
  ctx.fillRect(cx + bedX, cy + 30, 80, 30)
  ctx.fillStyle = '#93c5fd'
  ctx.beginPath(); ctx.arc(cx + bedX + 40, cy + 22, 16, 0, Math.PI * 2); ctx.fill()
  // 标签
  ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('CT 机架', cx, cy - 220)
  ctx.fillText('检查床', cx, cy + 100)
  ctx.fillStyle = '#60a5fa'; ctx.fillText('病人 →', cx + bedX + 40, cy + 16)
}

function drawStep2(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  // CT 机架
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 30
  ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.stroke()
  // 病人
  ctx.fillStyle = '#60a5fa'
  ctx.fillRect(cx - 10, cy + 30, 80, 30)
  ctx.fillStyle = '#93c5fd'
  ctx.beginPath(); ctx.arc(cx + 30, cy + 22, 16, 0, Math.PI * 2); ctx.fill()
  // 旋转的 X 射线管
  const angle = progress * Math.PI * 2
  const tubeX = cx + Math.cos(angle) * 155
  const tubeY = cy + Math.sin(angle) * 155
  // 射线束（扇形）
  const detAngle = angle + Math.PI
  const detX = cx + Math.cos(detAngle) * 155
  const detY = cy + Math.sin(detAngle) * 155
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.3)'; ctx.lineWidth = 1
  for (let i = -5; i <= 5; i++) {
    const a = detAngle + i * 0.05
    ctx.beginPath()
    ctx.moveTo(tubeX, tubeY)
    ctx.lineTo(cx + Math.cos(a) * 155, cy + Math.sin(a) * 155)
    ctx.stroke()
  }
  // X 射线管
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath(); ctx.arc(tubeX, tubeY, 12, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#fef3c7'
  ctx.beginPath(); ctx.arc(tubeX, tubeY, 6, 0, Math.PI * 2); ctx.fill()
  // 探测器
  ctx.fillStyle = '#34d399'
  ctx.beginPath(); ctx.arc(detX, detY, 12, 0, Math.PI * 2); ctx.fill()
  // 标签
  ctx.fillStyle = '#fbbf24'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('X 射线管', tubeX, tubeY - 20)
  ctx.fillStyle = '#34d399'
  ctx.fillText('探测器', detX, detY - 20)
  ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif'
  ctx.fillText('旋转扫描中...', cx, cy - 220)
}

function drawStep3(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  // CT 机架（淡）
  ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 30
  ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI * 2); ctx.stroke()
  // 病人体内结构
  ctx.fillStyle = '#60a5fa'; ctx.fillRect(cx - 10, cy + 30, 80, 30)
  // 射线穿过不同组织
  const angle = progress * Math.PI * 2
  const tubeX = cx + Math.cos(angle) * 155
  const tubeY = cy + Math.sin(angle) * 155
  // 不同吸收率
  ctx.globalAlpha = 0.3 + progress * 0.5
  ctx.fillStyle = '#fbbf24'
  ctx.beginPath(); ctx.arc(tubeX, tubeY, 8, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  // 数据收集示意
  const bars = Math.floor(progress * 8)
  for (let i = 0; i < bars; i++) {
    const bh = 10 + Math.random() * 40
    ctx.fillStyle = '#34d399'
    ctx.fillRect(50 + i * 20, 400 - bh, 14, bh)
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('探测器信号强度', 150, 420)
  ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif'
  ctx.fillText('数据采集中...', cx, cy - 220)
}

function drawStep4(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  // 左侧：原始数据
  ctx.strokeStyle = '#334155'; ctx.lineWidth = 1
  for (let i = 0; i < 10; i++) {
    ctx.beginPath()
    ctx.moveTo(60, 80 + i * 35)
    ctx.lineTo(60 + Math.random() * 100, 80 + i * 35)
    ctx.stroke()
  }
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('原始投影数据', 110, 60)
  // 箭头
  ctx.fillStyle = '#3b82f6'
  ctx.beginPath(); ctx.moveTo(180, cy); ctx.lineTo(220, cy); ctx.lineTo(210, cy - 10); ctx.fill()
  ctx.beginPath(); ctx.moveTo(180, cy); ctx.lineTo(220, cy); ctx.lineTo(210, cy + 10); ctx.fill()
  // 中间：重建中的图像
  const reveal = Math.min(1, progress * 2)
  ctx.globalAlpha = reveal
  // 模拟 CT 图像
  ctx.fillStyle = '#000'
  ctx.fillRect(260, 120, 120, 120)
  ctx.strokeStyle = '#e8e8e0'; ctx.lineWidth = 3
  ctx.beginPath(); ctx.ellipse(320, 180, 50, 55, 0, 0, Math.PI * 2); ctx.stroke()
  ctx.fillStyle = '#444'
  ctx.beginPath(); ctx.ellipse(320, 180, 40, 45, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#888'
  ctx.beginPath(); ctx.arc(310, 175, 8, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(330, 175, 8, 0, Math.PI * 2); ctx.fill()
  ctx.globalAlpha = 1
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'
  ctx.fillText('图像重建', 320, 60)
  // 右侧：最终图像
  if (progress > 0.5) {
    const finalAlpha = (progress - 0.5) * 2
    ctx.globalAlpha = finalAlpha
    ctx.fillStyle = '#000'; ctx.fillRect(440, 120, 120, 120)
    ctx.strokeStyle = '#e8e8e0'; ctx.lineWidth = 3
    ctx.beginPath(); ctx.ellipse(500, 180, 50, 55, 0, 0, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = '#555'
    ctx.beginPath(); ctx.ellipse(500, 180, 40, 45, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#888'
    ctx.beginPath(); ctx.arc(490, 175, 8, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(510, 175, 8, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#111'
    ctx.beginPath(); ctx.arc(490, 175, 4, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(510, 175, 4, 0, Math.PI * 2); ctx.fill()
    ctx.globalAlpha = 1
    ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'
    ctx.fillText('✅ 完成！', 500, 60)
  }
}

function drawWL1(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2
  // CT 值标尺
  const barY = 200, barH = 40
  const grad = ctx.createLinearGradient(80, 0, w - 80, 0)
  grad.addColorStop(0, '#000')
  grad.addColorStop(0.5, '#808080')
  grad.addColorStop(1, '#fff')
  ctx.fillStyle = grad
  ctx.fillRect(80, barY, w - 160, barH)
  // 标签
  ctx.fillStyle = '#94a3b8'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('-1000 HU', 80, barY + barH + 25)
  ctx.fillText('0 HU', cx, barY + barH + 25)
  ctx.fillText('+1000 HU', w - 80, barY + barH + 25)
  ctx.fillText('空气', 80, barY - 10)
  ctx.fillText('水', cx, barY - 10)
  ctx.fillText('骨骼', w - 80, barY - 10)
  // 组织标记
  const tissues = [
    { name: '空气', hu: -1000, color: '#000' },
    { name: '脂肪', hu: -100, color: '#333' },
    { name: '水', hu: 0, color: '#666' },
    { name: '软组织', hu: 40, color: '#888' },
    { name: '血液', hu: 55, color: '#999' },
    { name: '骨骼', hu: 1000, color: '#fff' }
  ]
  tissues.forEach((t, i) => {
    const x = 80 + ((t.hu + 1000) / 2000) * (w - 160)
    if (i < Math.floor(progress * tissues.length)) {
      ctx.fillStyle = '#60a5fa'
      ctx.beginPath(); ctx.arc(x, barY - 30, 4, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#e2e8f0'; ctx.font = '11px sans-serif'
      ctx.fillText(t.name, x, barY - 40)
    }
  })
  ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif'
  ctx.fillText('CT 值（Hounsfield Unit）标尺', cx, 80)
}

function drawWL2(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  // 窗宽示意
  const ww = 100 + progress * 300
  const wl = 40
  ctx.fillStyle = '#1e293b'; ctx.fillRect(50, 150, w - 100, 30)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
  ctx.fillRect(cx - ww / 2, 150, ww, 30)
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2
  ctx.strokeRect(cx - ww / 2, 150, ww, 30)
  ctx.fillStyle = '#3b82f6'; ctx.font = '12px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText(`窗宽: ${Math.round(ww)} HU`, cx, 200)
  // 对比效果
  ctx.fillStyle = '#000'; ctx.fillRect(100, 250, 150, 150)
  ctx.fillStyle = '#555'; ctx.beginPath(); ctx.ellipse(175, 325, 55, 60, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#666'; ctx.beginPath(); ctx.arc(160, 320, 10, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(190, 320, 10, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#94a3b8'; ctx.fillText('窄窗宽（高对比）', 175, 420)
  ctx.fillStyle = '#000'; ctx.fillRect(350, 250, 150, 150)
  ctx.fillStyle = '#444'; ctx.beginPath(); ctx.ellipse(425, 325, 55, 60, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#555'; ctx.beginPath(); ctx.arc(410, 320, 10, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(440, 320, 10, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#94a3b8'; ctx.fillText('宽窗宽（低对比）', 425, 420)
}

function drawWL3(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const presets = [
    { name: '脑窗', wl: 40, ww: 80, color: '#f472b6' },
    { name: '骨窗', wl: 400, ww: 1500, color: '#f5f5f4' },
    { name: '肺窗', wl: -600, ww: 1500, color: '#60a5fa' }
  ]
  const activeIdx = Math.floor(progress * 3)
  const preset = presets[Math.min(activeIdx, 2)]
  ctx.fillStyle = '#94a3b8'; ctx.font = '16px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText(`当前: ${preset.name}`, w / 2, 60)
  ctx.fillStyle = preset.color; ctx.font = '14px sans-serif'
  ctx.fillText(`窗位 ${preset.wl} / 窗宽 ${preset.ww}`, w / 2, 85)
  // 模拟不同窗效果
  const size = 160
  const startX = (w - 3 * size - 2 * 30) / 2
  presets.forEach((p, i) => {
    const x = startX + i * (size + 30)
    const isActive = i <= activeIdx
    ctx.globalAlpha = isActive ? 1 : 0.3
    ctx.fillStyle = '#000'; ctx.fillRect(x, 130, size, size)
    // 模拟 CT 图像
    ctx.strokeStyle = '#888'; ctx.lineWidth = 2
    ctx.beginPath(); ctx.ellipse(x + size / 2, 130 + size / 2, size * 0.38, size * 0.42, 0, 0, Math.PI * 2); ctx.stroke()
    // 根据窗类型调整显示
    if (p.name === '脑窗') {
      ctx.fillStyle = '#555'
      ctx.beginPath(); ctx.ellipse(x + size / 2, 130 + size / 2, size * 0.3, size * 0.35, 0, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#666'; ctx.beginPath(); ctx.arc(x + size / 2 - 12, 130 + size / 2 - 5, 8, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + size / 2 + 12, 130 + size / 2 - 5, 8, 0, Math.PI * 2); ctx.fill()
    } else if (p.name === '骨窗') {
      ctx.strokeStyle = '#ddd'; ctx.lineWidth = 4
      ctx.beginPath(); ctx.ellipse(x + size / 2, 130 + size / 2, size * 0.38, size * 0.42, 0, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = '#222'
      ctx.beginPath(); ctx.ellipse(x + size / 2, 130 + size / 2, size * 0.3, size * 0.35, 0, 0, Math.PI * 2); ctx.fill()
    } else {
      ctx.fillStyle = '#111'
      ctx.beginPath(); ctx.ellipse(x + size / 2, 130 + size / 2, size * 0.3, size * 0.35, 0, 0, Math.PI * 2); ctx.fill()
    }
    ctx.globalAlpha = 1
    ctx.fillStyle = p.color; ctx.font = '13px sans-serif'
    ctx.fillText(p.name, x + size / 2, 310)
    ctx.fillStyle = '#64748b'; ctx.font = '11px sans-serif'
    ctx.fillText(`WL:${p.wl} WW:${p.ww}`, x + size / 2, 328)
  })
}

function drawContrast1(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  // 血管网络
  ctx.strokeStyle = '#dc2626'; ctx.lineWidth = 3
  const points = [
    [cx, cy - 100], [cx - 50, cy - 40], [cx + 50, cy - 40],
    [cx - 80, cy + 20], [cx + 80, cy + 20], [cx, cy + 80],
    [cx - 40, cy + 80], [cx + 40, cy + 80]
  ]
  ctx.beginPath(); ctx.moveTo(cx, cy - 100)
  points.forEach(([x, y]) => ctx.lineTo(x, y))
  ctx.stroke()
  // 造影剂流动
  const flowIdx = Math.floor(progress * points.length)
  for (let i = 0; i <= flowIdx && i < points.length; i++) {
    const alpha = i === flowIdx ? 0.5 : 1
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath(); ctx.arc(points[i][0], points[i][1], 6, 0, Math.PI * 2); ctx.fill()
  }
  ctx.globalAlpha = 1
  // 标签
  ctx.fillStyle = '#dc2626'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('血管网络', cx, cy - 130)
  ctx.fillStyle = '#fbbf24'; ctx.font = '12px sans-serif'
  ctx.fillText('造影剂流动 →', cx + 120, cy - 80)
}

function drawContrast2(ctx, w, h, progress) {
  ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, w, h)
  const cx = w / 2, cy = h / 2
  // 平扫
  ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'
  ctx.fillText('平扫（无造影剂）', 160, 100)
  ctx.fillStyle = '#000'; ctx.fillRect(80, 130, 160, 160)
  ctx.fillStyle = '#444'
  ctx.beginPath(); ctx.ellipse(160, 210, 60, 65, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#555'
  ctx.beginPath(); ctx.arc(140, 200, 12, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(180, 200, 12, 0, Math.PI * 2); ctx.fill()
  // 增强
  ctx.fillStyle = '#94a3b8'; ctx.font = '14px sans-serif'
  ctx.fillText('增强扫描（有造影剂）', 440, 100)
  ctx.fillStyle = '#000'; ctx.fillRect(360, 130, 160, 160)
  ctx.fillStyle = '#555'
  ctx.beginPath(); ctx.ellipse(440, 210, 60, 65, 0, 0, Math.PI * 2); ctx.fill()
  // 高亮的血管
  ctx.fillStyle = '#fff'
  ctx.beginPath(); ctx.arc(420, 200, 12, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.arc(460, 200, 12, 0, Math.PI * 2); ctx.fill()
  // 病变（如果 progress 够大）
  if (progress > 0.5) {
    ctx.globalAlpha = (progress - 0.5) * 2
    ctx.fillStyle = '#ef4444'
    ctx.beginPath(); ctx.arc(450, 225, 10, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#ef4444'; ctx.font = '11px sans-serif'
    ctx.fillText('← 异常强化区域', 440, 310)
    ctx.globalAlpha = 1
  }
}

function AnimationCanvas({ animation, stepIndex, progress }) {
  const canvasRef = useRef(null)
  const step = animation.steps[stepIndex]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = 600; canvas.height = 450
    const ctx = canvas.getContext('2d')
    if (step.draw) step.draw(ctx, 600, 450, progress)
  }, [step, progress])

  return <canvas ref={canvasRef} className="w-full rounded-xl" style={{ maxWidth: '600px' }} />
}

export default function AnimationShowcase() {
  const [activeAnim, setActiveAnim] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef(null)

  const anim = animations[activeAnim]
  const step = anim.steps[stepIndex]
  const nextStep = anim.steps[stepIndex + 1]
  const stepDuration = nextStep ? nextStep.time - step.time : anim.duration - step.time

  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = setInterval(() => {
      setProgress(p => {
        const np = p + 0.02
        if (np >= 1) {
          if (stepIndex < anim.steps.length - 1) {
            setStepIndex(si => si + 1)
            return 0
          } else {
            setIsPlaying(false)
            return 1
          }
        }
        return np
      })
    }, 50)
    return () => clearInterval(timerRef.current)
  }, [isPlaying, stepIndex, anim.steps.length])

  const reset = () => { setIsPlaying(false); setStepIndex(0); setProgress(0) }
  const skipNext = () => {
    if (stepIndex < anim.steps.length - 1) { setStepIndex(stepIndex + 1); setProgress(0) }
  }
  const skipPrev = () => {
    if (stepIndex > 0) { setStepIndex(stepIndex - 1); setProgress(0) }
  }

  return (
    <div className="pt-20 pb-12 px-4 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">动画演示</h1>
          <p className="text-slate-400">通过动画了解 CT 扫描的核心原理</p>
        </div>

        {/* Animation selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {animations.map((a, i) => (
            <button key={a.id} onClick={() => { setActiveAnim(i); reset() }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeAnim === i ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 glow-sm' : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>
              <span className="text-lg">{a.icon}</span>
              {a.title}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Animation Canvas */}
          <div className="flex-1">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">{anim.icon} {anim.title}</h2>
                <span className="text-xs text-slate-500">{stepIndex + 1} / {anim.steps.length}</span>
              </div>

              <AnimationCanvas animation={anim} stepIndex={stepIndex} progress={progress} />

              {/* Progress bar */}
              <div className="mt-4 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-100"
                  style={{ width: `${((stepIndex + progress) / anim.steps.length) * 100}%` }} />
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button onClick={skipPrev} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"><SkipBack className="w-4 h-4" /></button>
                <button onClick={() => setIsPlaying(!isPlaying)}
                  className="p-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={skipNext} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"><SkipForward className="w-4 h-4" /></button>
                <button onClick={reset} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"><RotateCcw className="w-4 h-4" /></button>
              </div>

              {/* Step dots */}
              <div className="flex items-center justify-center gap-2 mt-3">
                {anim.steps.map((_, i) => (
                  <button key={i} onClick={() => { setStepIndex(i); setProgress(0) }}
                    className={`w-2 h-2 rounded-full transition-all ${i === stepIndex ? 'bg-blue-400 w-6' : i < stepIndex ? 'bg-blue-400/50' : 'bg-slate-700'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="lg:w-80 flex-shrink-0">
            <AnimatePresence mode="wait">
              <motion.div key={step.title} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 sticky top-24">
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
