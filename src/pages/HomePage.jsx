import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, Heart, Brain, BookOpen, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: 'CT 影像查看器',
    desc: '交互式 CT 切片浏览，拖拽滑动查看每一层扫描',
    link: '/viewer',
    color: 'from-blue-500 to-cyan-400',
    shadow: 'shadow-blue-500/20'
  },
  {
    icon: Heart,
    title: '器官 3D 探索',
    desc: '3D 动画展示人体器官，直观了解解剖结构',
    link: '/organs',
    color: 'from-pink-500 to-rose-400',
    shadow: 'shadow-pink-500/20'
  },
  {
    icon: Brain,
    title: '动画演示',
    desc: '动画讲解 CT 扫描原理、常见病变与诊断知识',
    link: '/animations',
    color: 'from-violet-500 to-purple-400',
    shadow: 'shadow-violet-500/20'
  },
  {
    icon: BookOpen,
    title: '科普学习',
    desc: '通俗易懂的 CT 科普文章，从零开始看懂影像',
    link: '/learn',
    color: 'from-amber-500 to-orange-400',
    shadow: 'shadow-amber-500/20'
  }
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6, ease: 'easeOut' } })
}

export default function HomePage() {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/3 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div initial="hidden" animate="visible" variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
          }}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-8">
              <Sparkles className="w-4 h-4" />
              <span>让 CT 影像不再难懂</span>
            </div>

            <h1 className="text-5xl sm:text-7xl font-extrabold leading-tight mb-6">
              <span className="text-white">轻松看懂</span>
              <br />
              <span className="gradient-text">CT 影像</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              通过交互式 3D 动画、直观的切片浏览和通俗易懂的科普讲解，
              <br className="hidden sm:block" />
              帮你从零开始理解 CT 扫描影像
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/viewer"
                className="group flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all"
              >
                开始体验
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/learn"
                className="flex items-center gap-2 px-8 py-3.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800/50 transition-all"
              >
                了解更多
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 mt-16"
            initial="hidden"
            animate="visible"
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 0.5, duration: 0.8 } } }}
          >
            {[
              { icon: Eye, label: '交互式查看', value: 'CT 切片' },
              { icon: Brain, label: '3D 动画', value: '器官展示' },
              { icon: Shield, label: '通俗易懂', value: '科普讲解' }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 text-slate-500">
                <Icon className="w-5 h-5" />
                <span className="text-sm"><span className="text-slate-300 font-medium">{value}</span> · {label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={0}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">四大核心功能</h2>
            <p className="text-slate-400 text-lg">从多个维度帮你理解 CT 影像</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc, link, color, shadow }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={i + 1}
              >
                <Link to={link} className="block">
                  <div className="group relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 card-hover">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg ${shadow}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">{title}</h3>
                    <p className="text-slate-400 leading-relaxed mb-4">{desc}</p>
                    <span className="inline-flex items-center gap-1 text-sm text-blue-400 font-medium">
                      立即体验 <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How CT Works Section */}
      <section className="py-24 px-4 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp} custom={0}>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">CT 扫描是什么？</h2>
            <p className="text-slate-400 text-lg">用最简单的方式理解 CT 扫描原理</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'X 射线环绕扫描', desc: 'CT 机围绕人体旋转，从不同角度发射 X 射线束，就像在给身体"拍一圈照片"。', emoji: '🔄' },
              { step: '02', title: '探测器收集数据', desc: '射线穿过身体后被对面的探测器接收，不同组织对射线的吸收不同，形成数据差异。', emoji: '📡' },
              { step: '03', title: '计算机重建图像', desc: '计算机利用收集到的数据，通过数学算法重建出人体的横截面图像，即"切片"。', emoji: '🖥️' }
            ].map(({ step, title, desc, emoji }, i) => (
              <motion.div
                key={step}
                className="relative p-8 rounded-2xl bg-slate-900/80 border border-slate-800"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                custom={i + 1}
              >
                <div className="text-4xl mb-4">{emoji}</div>
                <div className="text-sm font-bold text-blue-400 mb-2">步骤 {step}</div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-slate-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <motion.div
          className="max-w-3xl mx-auto text-center gradient-border p-12 rounded-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          custom={0}
        >
          <Zap className="w-10 h-10 text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">准备好开始探索了吗？</h2>
          <p className="text-slate-400 mb-8">选择一个功能模块，开始你的 CT 影像学习之旅</p>
          <Link
            to="/viewer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl text-white font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all"
          >
            进入 CT 查看器
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>SuperCT — 让 CT 影像不再难懂 · 仅供科普学习，不构成医疗建议</p>
        </div>
      </footer>
    </div>
  )
}
