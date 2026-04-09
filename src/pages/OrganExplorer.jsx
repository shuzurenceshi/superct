import { useState, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Html } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, RotateCcw, Eye, Heart, Brain, Stethoscope } from 'lucide-react'
import * as THREE from 'three'

const organs = [
  {
    id: 'brain', name: '大脑', icon: '🧠', color: '#f472b6',
    description: '大脑是人体的"指挥中心"，重约 1.4kg，包含约 860 亿个神经元。负责思考、记忆、语言、运动控制和感觉处理等功能。',
    facts: ['约 860 亿个神经元', '重约 1.4kg', '消耗全身 20% 的氧气', '脑表面面积展开约 2500cm²'],
    ctAppearance: 'CT 上呈中等密度，灰质密度略高于白质。脑脊液呈低密度（黑色）。',
    buildMesh: () => {
      const geo = new THREE.SphereGeometry(1, 32, 32)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
        const noise = 0.95 + Math.sin(x * 3) * 0.03 + Math.cos(y * 4) * 0.02 + Math.sin(z * 5 + x * 2) * 0.02
        pos.setXYZ(i, x * noise, y * noise, z * noise)
      }
      // 中间裂开
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        if (Math.abs(x) < 0.05) {
          pos.setY(i, pos.getY(i) * 0.85)
        }
      }
      geo.computeVertexNormals()
      return geo
    }
  },
  {
    id: 'heart', name: '心脏', icon: '❤️', color: '#ef4444',
    description: '心脏是一个强有力的肌肉泵，每天跳动约 10 万次，一生中泵送约 2 亿升血液。大小与拳头相当。',
    facts: ['每天跳动约 10 万次', '每天泵送约 7500 升血液', '一生跳动约 25-30 亿次', '重量约 250-350g'],
    ctAppearance: 'CT 上心脏呈中等密度，心腔内血液密度较高。增强 CT 可清晰显示心腔和心肌。',
    buildMesh: () => {
      const geo = new THREE.SphereGeometry(0.8, 32, 32)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
        // 扁平化
        y *= 0.8
        // 底部收窄
        const bottomFactor = y < 0 ? 1 + y * 0.3 : 1
        x *= bottomFactor
        z *= bottomFactor
        // 顶部凹陷
        if (y > 0.3) {
          const t = (y - 0.3) / 0.5
          x -= Math.sign(x) * t * 0.2
        }
        pos.setXYZ(i, x, y, z)
      }
      geo.computeVertexNormals()
      return geo
    }
  },
  {
    id: 'lungs', name: '肺', icon: '🫁', color: '#60a5fa',
    description: '肺是呼吸系统的主要器官，左肺两叶、右肺三叶。肺内约含有 3-5 亿个肺泡，展开面积约 70m²，相当于一个网球场。',
    facts: ['约 3-5 亿个肺泡', '展开面积约 70m²', '每天呼吸约 2 万次', '右肺 3 叶，左肺 2 叶'],
    ctAppearance: '正常肺实质在 CT 上呈低密度（黑色），因为充满空气。肺纹理（血管、支气管）呈线状/分支状中等密度。',
    buildMesh: () => {
      const geo = new THREE.SphereGeometry(0.7, 32, 32)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
        y *= 1.3
        // 底部圆顶形
        if (y < -0.3) {
          const t = (-y - 0.3) / 0.6
          x *= 1 - t * 0.5
          z *= 1 - t * 0.5
        }
        // 内侧扁平
        if (z > 0) z *= 0.7
        pos.setXYZ(i, x, y, z)
      }
      geo.computeVertexNormals()
      return geo
    }
  },
  {
    id: 'liver', name: '肝脏', icon: '🫘', color: '#8b5cf6',
    description: '肝脏是人体最大的内脏器官，重约 1.5kg。具有 500 多种功能，包括解毒、合成蛋白质、分泌胆汁、储存糖原等。',
    facts: ['重约 1.5kg', '具有 500+ 种功能', '每分钟血流量约 1.5L', '是唯一能再生的内脏器官'],
    ctAppearance: 'CT 上肝脏呈均匀的软组织密度，密度略高于脾脏。门静脉和肝静脉清晰可见。',
    buildMesh: () => {
      const geo = new THREE.SphereGeometry(1, 32, 32)
      const pos = geo.attributes.position
      for (let i = 0; i < pos.count; i++) {
        let x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i)
        y *= 0.5
        x *= 1.3
        // 右叶大，左叶小
        if (x < 0) x *= 0.5
        // 表面凹凸
        const n = Math.sin(x * 5) * 0.02 + Math.cos(z * 4 + y * 3) * 0.02
        x += n; z += n
        pos.setXYZ(i, x, y, z)
      }
      geo.computeVertexNormals()
      return geo
    }
  }
]

function OrganModel({ organ, isRotating, onHover }) {
  const meshRef = useRef()
  const wireRef = useRef()

  const geometry = useMemo(() => organ.buildMesh(), [organ])

  useFrame((_, delta) => {
    if (isRotating && meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group>
      <mesh ref={meshRef} geometry={geometry} onPointerOver={() => onHover(true)} onPointerOut={() => onHover(false)}>
        <meshStandardMaterial color={organ.color} transparent opacity={0.7} roughness={0.4} metalness={0.1} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={wireRef} geometry={geometry}>
        <meshBasicMaterial color={organ.color} wireframe transparent opacity={0.15} />
      </mesh>
    </group>
  )
}

export default function OrganExplorer() {
  const [activeOrgan, setActiveOrgan] = useState(0)
  const [isRotating, setIsRotating] = useState(true)
  const [showInfo, setShowInfo] = useState(true)
  const organ = organs[activeOrgan]

  return (
    <div className="pt-20 pb-12 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">器官 3D 探索</h1>
          <p className="text-slate-400">选择一个器官，通过 3D 模型了解它的形态和功能</p>
        </div>

        {/* Organ selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {organs.map((o, i) => (
            <button key={o.id} onClick={() => setActiveOrgan(i)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${activeOrgan === i ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30 glow-sm' : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>
              <span className="text-lg">{o.icon}</span>
              {o.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* 3D Canvas */}
          <div className="flex-1">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800" style={{ height: '500px' }}>
              <Canvas camera={{ position: [0, 0, 3], fov: 50 }}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.8} />
                <directionalLight position={[-3, -3, -3]} intensity={0.3} />
                <pointLight position={[0, 2, 3]} intensity={0.5} color="#60a5fa" />
                <AnimatePresence mode="wait">
                  <OrganModel key={organ.id} organ={organ} isRotating={isRotating} onHover={() => {}} />
                </AnimatePresence>
                <OrbitControls enablePan={false} minDistance={1.5} maxDistance={6} />
                <gridHelper args={[10, 20, '#1e293b', '#1e293b']} position={[0, -1.5, 0]} />
              </Canvas>

              {/* Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button onClick={() => setIsRotating(!isRotating)} className="p-2 rounded-lg bg-black/50 text-white hover:bg-black/70">
                  <RotateCcw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} style={isRotating ? { animationDuration: '3s' } : {}} />
                </button>
              </div>

              {/* Organ name overlay */}
              <div className="absolute bottom-4 left-4">
                <div className="px-4 py-2 rounded-xl bg-black/60 backdrop-blur-sm">
                  <span className="text-2xl mr-2">{organ.icon}</span>
                  <span className="text-white font-bold text-lg">{organ.name}</span>
                </div>
              </div>
            </div>

            <p className="text-slate-500 text-xs mt-3 text-center">🖱️ 拖拽旋转 · 滚轮缩放</p>
          </div>

          {/* Info Panel */}
          <AnimatePresence mode="wait">
            <motion.div key={organ.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="lg:w-96 flex-shrink-0">
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-3xl">{organ.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{organ.name}</h2>
                      <span className="text-xs text-slate-500">3D 解剖模型</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{organ.description}</p>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400 uppercase tracking-wide">趣味知识</span>
                  </div>
                  <ul className="space-y-2">
                    {organ.facts.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-blue-400 mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-medium text-cyan-400 uppercase tracking-wide">CT 影像表现</span>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{organ.ctAppearance}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
