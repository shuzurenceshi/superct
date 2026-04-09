import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, RotateCcw, Info, ZoomIn, Layers, Grid3X3 } from 'lucide-react'

function generateSlices(count = 50, type) {
  return Array.from({ length: count }, (_, i) => ({ id: i, t: i / (count - 1), type }))
}

const bodyParts = [
  { key: 'head', label: '头颅', icon: '🧠', slices: generateSlices(50, 'head'), range: '从颅顶到颅底' },
  { key: 'chest', label: '胸部', icon: '🫁', slices: generateSlices(50, 'chest'), range: '从肺尖到膈肌' },
  { key: 'abdomen', label: '腹部', icon: '🫀', slices: generateSlices(50, 'abdomen'), range: '从膈肌到盆腔' }
]

function drawCTSlice(canvas, type, t, zoom = 1) {
  const ctx = canvas.getContext('2d')
  const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2
  const s = Math.min(w, h) * 0.4 * zoom
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, w, h)
  if (type === 'head') drawHead(ctx, cx, cy, s, t)
  else if (type === 'chest') drawChest(ctx, cx, cy, s, t)
  else drawAbdomen(ctx, cx, cy, s, t)
  drawOverlay(ctx, w, h, type, t)
}

function drawHead(ctx, cx, cy, s, t) {
  ctx.save()
  ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.85, s * 0.9, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a2e'; ctx.fill()
  ctx.lineWidth = s * 0.06; ctx.strokeStyle = '#e8e8e0'; ctx.stroke()
  ctx.restore()
  if (t < 0.2) return
  drawBrain(ctx, cx, cy, s)
  if (t > 0.4 && t < 0.85) drawVentricles(ctx, cx, cy, s)
  if (t > 0.6 && t < 0.8) {
    ctx.fillStyle = '#888'
    ctx.beginPath(); ctx.ellipse(cx - s * 0.2, cy - s * 0.05, s * 0.1, s * 0.12, -0.2, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.ellipse(cx + s * 0.2, cy - s * 0.05, s * 0.1, s * 0.12, 0.2, 0, Math.PI * 2); ctx.fill()
  }
  if (t > 0.8) {
    ctx.fillStyle = '#666'
    for (let i = -3; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(cx + i * s * 0.08, cy + s * 0.3, s * 0.06, s * 0.15, 0, 0, Math.PI * 2); ctx.fill() }
    ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.15, s * 0.08, s * 0.15, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#777'; ctx.fill()
  }
}

function drawBrain(ctx, cx, cy, s) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 0.65)
  g.addColorStop(0, '#444'); g.addColorStop(0.5, '#333'); g.addColorStop(0.85, '#555'); g.addColorStop(1, '#1a1a2e')
  ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.65, s * 0.7, 0, 0, Math.PI * 2)
  ctx.fillStyle = g; ctx.fill()
  ctx.strokeStyle = '#222'; ctx.lineWidth = 1
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, r1 = s * 0.3, r2 = s * (0.5 + Math.random() * 0.15)
    ctx.beginPath()
    ctx.moveTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1)
    ctx.quadraticCurveTo(cx + Math.cos(a + 0.3) * (r1 + r2) / 2, cy + Math.sin(a + 0.3) * (r1 + r2) / 2, cx + Math.cos(a + 0.5) * r2, cy + Math.sin(a + 0.5) * r2)
    ctx.stroke()
  }
  ctx.strokeStyle = '#1a1a2e'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.6); ctx.lineTo(cx, cy + s * 0.5); ctx.stroke()
}

function drawVentricles(ctx, cx, cy, s) {
  ctx.fillStyle = '#111'
  ctx.beginPath(); ctx.ellipse(cx - s * 0.15, cy, s * 0.08, s * 0.15, -0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx + s * 0.15, cy, s * 0.08, s * 0.15, 0.3, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx, cy - s * 0.02, s * 0.02, s * 0.06, 0, 0, Math.PI * 2); ctx.fill()
}

function drawChest(ctx, cx, cy, s, t) {
  ctx.save()
  ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.95, s * 0.75, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a2e'; ctx.fill()
  ctx.lineWidth = s * 0.05; ctx.strokeStyle = '#e8e8e0'; ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.6, s * 0.06, s * 0.08, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(cx, cy + s * 0.6, s * 0.025, 0, Math.PI * 2); ctx.fill()
  drawLungs(ctx, cx, cy, s, t < 0.3 ? 0.7 : t < 0.7 ? 1.0 : 0.85)
  if (t > 0.3 && t < 0.7) {
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx - s * 0.1, cy - s * 0.15, s * 0.06, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#ccc'; ctx.beginPath(); ctx.arc(cx - s * 0.1, cy - s * 0.15, s * 0.04, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#666'; ctx.beginPath(); ctx.arc(cx + s * 0.05, cy + s * 0.05, s * 0.02, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#111'; ctx.beginPath(); ctx.ellipse(cx, cy - s * 0.35, s * 0.04, s * 0.06, 0, 0, Math.PI * 2); ctx.fill()
  }
  if (t >= 0.7) {
    const hg = ctx.createRadialGradient(cx + s * 0.05, cy, 0, cx + s * 0.05, cy, s * 0.25)
    hg.addColorStop(0, '#888'); hg.addColorStop(0.7, '#666'); hg.addColorStop(1, '#444')
    ctx.beginPath(); ctx.ellipse(cx + s * 0.05, cy, s * 0.22, s * 0.2, 0.2, 0, Math.PI * 2)
    ctx.fillStyle = hg; ctx.fill()
    ctx.fillStyle = '#333'
    ctx.beginPath(); ctx.arc(cx + s * 0.02, cy - s * 0.05, s * 0.06, 0, Math.PI * 2); ctx.fill()
    ctx.beginPath(); ctx.arc(cx + s * 0.1, cy - s * 0.03, s * 0.05, 0, Math.PI * 2); ctx.fill()
  }
}

function drawLungs(ctx, cx, cy, s, opacity) {
  const a = Math.floor(opacity * 40).toString(16).padStart(2, '0')
  ctx.fillStyle = `#0a0a1a${a}`
  ctx.beginPath(); ctx.ellipse(cx - s * 0.35, cy - s * 0.05, s * 0.3, s * 0.45, -0.1, 0, Math.PI * 2); ctx.fill()
  ctx.beginPath(); ctx.ellipse(cx + s * 0.35, cy - s * 0.05, s * 0.32, s * 0.45, 0.1, 0, Math.PI * 2); ctx.fill()
  ctx.strokeStyle = '#ffffff08'; ctx.lineWidth = 0.5
  for (let i = 0; i < 6; i++) {
    const y = cy - s * 0.3 + i * s * 0.12
    ctx.beginPath(); ctx.moveTo(cx - s * 0.5, y); ctx.quadraticCurveTo(cx - s * 0.35, y - s * 0.05, cx - s * 0.15, y + s * 0.02); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(cx + s * 0.5, y); ctx.quadraticCurveTo(cx + s * 0.35, y - s * 0.05, cx + s * 0.15, y + s * 0.02); ctx.stroke()
  }
}

function drawAbdomen(ctx, cx, cy, s, t) {
  ctx.save()
  ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.9, s * 0.7, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#1a1a2e'; ctx.fill()
  ctx.lineWidth = s * 0.04; ctx.strokeStyle = '#d4d0c8'; ctx.stroke()
  ctx.restore()
  ctx.fillStyle = '#ddd'; ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.55, s * 0.06, s * 0.07, 0, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#333'; ctx.beginPath(); ctx.arc(cx, cy + s * 0.55, s * 0.025, 0, Math.PI * 2); ctx.fill()
  if (t < 0.5) {
    const lg = ctx.createRadialGradient(cx + s * 0.2, cy - s * 0.15, 0, cx + s * 0.2, cy - s * 0.15, s * 0.35)
    lg.addColorStop(0, '#7c5e3c'); lg.addColorStop(1, '#5a4030')
    ctx.fillStyle = lg
    ctx.beginPath(); ctx.ellipse(cx + s * 0.2, cy - s * 0.15, s * 0.35, s * 0.25, -0.2, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(cx - s * 0.15, cy + s * 0.05, s * 0.15, s * 0.12, 0.3, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#6b4423'; ctx.beginPath(); ctx.ellipse(cx - s * 0.45, cy - s * 0.1, s * 0.1, s * 0.12, -0.3, 0, Math.PI * 2); ctx.fill()
  }
  if (t >= 0.5 && t < 0.8) {
    const drawK = (x) => { const g = ctx.createRadialGradient(x, cy, 0, x, cy, s * 0.12); g.addColorStop(0, '#7a5230'); g.addColorStop(1, '#4a3220'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(x, cy, s * 0.12, s * 0.06, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#333'; ctx.beginPath(); ctx.ellipse(x, cy, s * 0.03, s * 0.03, 0, 0, Math.PI * 2); ctx.fill() }
    drawK(cx - s * 0.4); drawK(cx + s * 0.4)
    ctx.strokeStyle = '#555'; ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) { const sx = cx + (Math.random() - 0.5) * s * 0.8, sy = cy - s * 0.1 + Math.random() * s * 0.3; ctx.beginPath(); ctx.arc(sx, sy, s * 0.03 + Math.random() * s * 0.04, 0, Math.PI * 2); ctx.stroke() }
  }
  if (t >= 0.8) {
    ctx.strokeStyle = '#ddd'; ctx.lineWidth = s * 0.04
    ctx.beginPath(); ctx.ellipse(cx, cy, s * 0.6, s * 0.4, 0, Math.PI, Math.PI * 2); ctx.stroke()
    ctx.fillStyle = '#444'; ctx.beginPath(); ctx.ellipse(cx, cy - s * 0.05, s * 0.12, s * 0.1, 0, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = '#666'; ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.2, s * 0.05, s * 0.06, 0, 0, Math.PI * 2); ctx.fill()
  }
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(cx - s * 0.05, cy + s * 0.15, s * 0.04, 0, Math.PI * 2); ctx.fill()
  ctx.fillStyle = '#bbb'; ctx.beginPath(); ctx.arc(cx - s * 0.05, cy + s * 0.15, s * 0.025, 0, Math.PI * 2); ctx.fill()
}

function drawOverlay(ctx, w, h, type, t) {
  ctx.fillStyle = 'rgba(0,20,40,0.7)'; ctx.fillRect(0, 0, w, 32)
  ctx.fillStyle = '#4ade80'; ctx.font = '12px monospace'; ctx.fillText('W:400 L:40', 10, 20)
  ctx.fillStyle = '#60a5fa'; ctx.fillText(type === 'head' ? '头颅 CT' : type === 'chest' ? '胸部 CT' : '腹部 CT', w - 100, 20)
  ctx.fillStyle = 'rgba(0,20,40,0.7)'; ctx.fillRect(0, h - 32, w, 32)
  ctx.fillStyle = '#94a3b8'; ctx.font = '11px monospace'; ctx.fillText(`Slice ${Math.round(t * 100)}%  |  5.0mm  |  120kV  |  250mAs`, 10, h - 12)
  ctx.strokeStyle = '#475569'; ctx.lineWidth = 1; const rx = w - 25
  ctx.beginPath(); ctx.moveTo(rx, 50); ctx.lineTo(rx, h - 50); ctx.stroke()
  for (let i = 0; i <= 4; i++) { const y = 50 + i * (h - 100) / 4; ctx.beginPath(); ctx.moveTo(rx - 5, y); ctx.lineTo(rx + 5, y); ctx.stroke() }
}

function getSliceDesc(type, t) {
  const descs = {
    head: [
      { t: 0.15, title: '颅顶层面', desc: '显示颅骨穹窿，可见薄层脑皮质和少量脑脊液', s: ['颅骨', '脑皮质', '脑脊液'] },
      { t: 0.3, title: '半卵圆中心', desc: '大脑白质密集区，连接左右半球的神经纤维束', s: ['白质', '灰质', '纵裂'] },
      { t: 0.5, title: '侧脑室体部', desc: '经典层面！可见脑室系统，脑脊液在此循环', s: ['侧脑室', '尾状核', '丘脑'] },
      { t: 0.7, title: '基底节层面', desc: '包含重要的运动控制中枢，中风好发部位', s: ['基底节', '内囊', '丘脑', '侧脑室'] },
      { t: 0.85, title: '中脑层面', desc: '可见脑干和中脑，控制呼吸、心跳等生命功能', s: ['中脑', '颞叶', '脑干'] },
      { t: 1.0, title: '后颅窝层面', desc: '小脑和脑干区域，负责平衡和协调运动', s: ['小脑', '脑干', '第四脑室'] }
    ],
    chest: [
      { t: 0.25, title: '肺尖层面', desc: '肺的最上方，可见锁骨和肺尖', s: ['肺尖', '锁骨', '气管'] },
      { t: 0.5, title: '主动脉弓层面', desc: '重要血管结构，主动脉弓分出三大分支', s: ['主动脉弓', '气管', '食管'] },
      { t: 0.75, title: '肺门层面', desc: '肺的"大门"，支气管和血管进出肺的地方', s: ['肺门', '支气管', '肺动脉'] },
      { t: 1.0, title: '心脏层面', desc: '四腔心层面，可评估心脏大小和形态', s: ['心脏', '心房', '心室', '主动脉'] }
    ],
    abdomen: [
      { t: 0.25, title: '肝脏上部', desc: '肝脏是人体最大的内脏器官，重约 1.5kg', s: ['肝脏', '胃底', '脾脏'] },
      { t: 0.5, title: '肝脏下部', desc: '可见胆囊和门静脉系统', s: ['肝脏', '胆囊', '门静脉'] },
      { t: 0.75, title: '肾脏层面', desc: '左右各一，形似蚕豆，过滤血液产生尿液', s: ['左肾', '右肾', '主动脉', '下腔静脉'] },
      { t: 1.0, title: '盆腔层面', desc: '包含膀胱、直肠和盆腔骨骼结构', s: ['膀胱', '直肠', '骶骨', '髂骨'] }
    ]
  }
  const list = descs[type] || descs.head
  const item = list.find(d => t <= d.t) || list[list.length - 1]
  return { title: item.title, desc: item.desc, structures: item.s }
}

export default function CTViewer() {
  const [activePart, setActivePart] = useState(0)
  const [sliceIndex, setSliceIndex] = useState(25)
  const [zoom, setZoom] = useState(1)
  const [showInfo, setShowInfo] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const part = bodyParts[activePart]
  const slice = part.slices[sliceIndex]
  const desc = getSliceDesc(part.key, slice.t)

  const draw = useCallback(() => {
    if (canvasRef.current) drawCTSlice(canvasRef.current, part.key, slice.t, zoom)
  }, [part.key, slice.t, zoom])

  useEffect(() => { draw() }, [draw])

  const handleWheel = (e) => { e.preventDefault(); setSliceIndex(p => Math.max(0, Math.min(part.slices.length - 1, p + (e.deltaY > 0 ? 1 : -1)))) }
  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)
  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    setSliceIndex(Math.max(0, Math.min(part.slices.length - 1, Math.round(((e.clientX - r.left) / r.width) * (part.slices.length - 1)))))
  }
  const handleTouchMove = (e) => {
    if (!containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    setSliceIndex(Math.max(0, Math.min(part.slices.length - 1, Math.round(((e.touches[0].clientX - r.left) / r.width) * (part.slices.length - 1)))))
  }

  return (
    <div className="pt-20 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">CT 影像查看器</h1>
          <p className="text-slate-400">滚动鼠标或左右拖拽来浏览不同层面的 CT 切片</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex gap-2 mb-4">
              {bodyParts.map((p, i) => (
                <button key={p.key} onClick={() => { setActivePart(i); setSliceIndex(25) }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activePart === i ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800 hover:text-slate-300'}`}>
                  <span>{p.icon}</span>{p.label}
                </button>
              ))}
            </div>
            <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 cursor-ns-resize select-none"
              onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
              <canvas ref={canvasRef} width={600} height={600} className="w-full aspect-square" />
              <div className="absolute left-0 right-0 h-0.5 bg-blue-400/50 pointer-events-none" style={{ top: `${slice.t * 100}%` }} />
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button onClick={() => setShowInfo(!showInfo)} className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"><Info className="w-4 h-4" /></button>
                <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"><ZoomIn className="w-4 h-4" /></button>
                <button onClick={() => setZoom(1)} className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70"><RotateCcw className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <button onClick={() => setSliceIndex(Math.max(0, sliceIndex - 1))} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"><ChevronLeft className="w-5 h-5" /></button>
              <input type="range" min={0} max={part.slices.length - 1} value={sliceIndex} onChange={e => setSliceIndex(+e.target.value)}
                className="flex-1 h-2 rounded-full appearance-none bg-slate-800 cursor-pointer accent-blue-500" />
              <button onClick={() => setSliceIndex(Math.min(part.slices.length - 1, sliceIndex + 1))} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"><ChevronRight className="w-5 h-5" /></button>
              <span className="text-sm text-slate-400 w-20 text-right">{sliceIndex + 1} / {part.slices.length}</span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={desc.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lg:w-80 flex-shrink-0">
              {showInfo && (
                <div className="sticky top-24 space-y-4">
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center gap-2 mb-3"><Layers className="w-4 h-4 text-blue-400" /><span className="text-xs font-medium text-blue-400 uppercase tracking-wide">当前层面</span></div>
                    <h2 className="text-xl font-bold text-white mb-2">{desc.title}</h2>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc.desc}</p>
                    <div className="flex items-center gap-2 mb-3"><Grid3X3 className="w-4 h-4 text-cyan-400" /><span className="text-xs font-medium text-cyan-400 uppercase tracking-wide">可见结构</span></div>
                    <div className="flex flex-wrap gap-2">
                      {desc.structures.map(s => <span key={s} className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium">{s}</span>)}
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                    <h3 className="text-sm font-bold text-white mb-2">{part.icon} {part.label}</h3>
                    <p className="text-slate-400 text-xs mb-3">{part.range}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">切片数</span><span className="text-slate-300">{part.slices.length} 层</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">层厚</span><span className="text-slate-300">5.0 mm</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">扫描范围</span><span className="text-slate-300">{(part.slices.length * 5 / 10).toFixed(0)} cm</span></div>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-xs text-blue-300 leading-relaxed">💡 <strong>提示：</strong>在影像上滚动鼠标滚轮或左右拖拽可快速切换层面，右侧面板会自动显示当前层面的解剖信息。</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
