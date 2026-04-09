import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, ChevronDown, ChevronRight, Search, Tag } from 'lucide-react'

const articles = [
  {
    id: 'ct-basics',
    category: '基础入门',
    title: 'CT 扫描到底是什么？',
    summary: '从零开始了解 CT 扫描的原理、过程和常见用途',
    icon: '🔍',
    readTime: '5 分钟',
    content: `
## 什么是 CT 扫描？

CT（Computed Tomography，计算机断层扫描）是一种利用 X 射线从多个角度扫描人体，然后通过计算机重建出横断面图像的医学检查技术。

### 简单类比

想象你有一块面包，想知道里面有没有果仁：
- **普通 X 光**：就像从侧面看整块面包，只能看到模糊的影子
- **CT 扫描**：就像把面包切成一片片薄片，每一片都能看清楚

### CT vs 普通 X 光

| 特点 | 普通 X 光 | CT 扫描 |
|------|----------|---------|
| 图像维度 | 2D 重叠影像 | 3D 断层影像 |
| 分辨率 | 较低 | 很高 |
| 辐射剂量 | 低 | 中等 |
| 适用场景 | 骨折、胸透 | 复杂病变、肿瘤 |

### CT 能检查什么？

- **头部**：脑出血、脑梗死、肿瘤、骨折
- **胸部**：肺炎、肺结节、肺癌、主动脉夹层
- **腹部**：肝胆脾肾病变、阑尾炎、肿瘤
- **骨骼**：复杂骨折、骨肿瘤
- **血管**：CT 血管造影（CTA）

### 安全性

CT 检查使用 X 射线，有一定辐射，但单次检查的辐射剂量通常在安全范围内。医生会权衡利弊后决定是否需要做 CT。
    `
  },
  {
    id: 'ct-reading',
    category: '影像判读',
    title: '如何看懂一张 CT 片？',
    summary: '学会基本的 CT 影像判读方法，了解黑、白、灰代表什么',
    icon: '👁️',
    readTime: '8 分钟',
    content: `
## CT 片上的黑白灰

看 CT 片的第一步：理解颜色含义。

### 密度与 CT 值

CT 图像上，**越白 = 密度越高，越黑 = 密度越低**：

- ⬜ **白色**：骨骼、金属、造影剂（高密度）
- 🔲 **灰色**：软组织、器官、血液（中等密度）
- ⬛ **黑色**：空气、脂肪、脑脊液（低密度）

### 常见组织的 CT 值

| 组织 | CT 值（HU） | 影像表现 |
|------|-----------|---------|
| 空气 | -1000 | 纯黑 |
| 脂肪 | -100 ~ -50 | 深灰偏黑 |
| 水 | 0 | 深灰 |
| 脑脊液 | ~15 | 黑色 |
| 肝脏 | 40~60 | 灰色 |
| 血液 | 30~45 | 灰色 |
| 凝血 | 60~80 | 浅灰 |
| 骨皮质 | 1000+ | 白色 |

### 看片的四个步骤

1. **确认信息**：患者姓名、检查部位、扫描日期
2. **浏览整体**：先大致扫一遍，看有没有明显异常
3. **系统观察**：按照一定顺序（从外到内、从头到脚）逐层查看
4. **对比分析**：左右对称结构对比，发现不对称的地方

### 窗宽窗位

同一张 CT 片，用不同的"窗"可以看到不同的信息：
- **脑窗**（WL:40, WW:80）：看脑组织细节
- **骨窗**（WL:400, WW:1500）：看骨骼结构
- **肺窗**（WL:-600, WW:1500）：看肺部细节
    `
  },
  {
    id: 'common-findings',
    category: '常见病变',
    title: 'CT 上的常见病变长什么样？',
    summary: '图文并茂地介绍 CT 影像中常见的病变表现',
    icon: '🏥',
    readTime: '10 分钟',
    content: `
## 常见 CT 表现

### 1. 脑出血

**表现**：脑实质内的高密度（白色）团块
- 急性期（<1周）：白色，CT 值 50~80 HU
- 周围可见低密度水肿带
- 可能伴有占位效应（脑室受压变形）

### 2. 脑梗死

**表现**：早期可能正常！6~24 小时后才逐渐出现低密度
- 超早期（<6h）：CT 可能正常，需要 MRI
- 亚急性期：出现楔形低密度区
- 伴有脑沟变浅、脑室受压

### 3. 肺结节

**表现**：肺内圆形或类圆形密度增高影
- <3mm：微小结节
- 3~8mm：小结节
- >8mm：大结节
- 需关注：大小、形态、边缘（有无毛刺）、密度（实性/磨玻璃）

### 4. 骨折

**表现**：骨皮质的连续性中断
- 可见骨折线（黑色线状影）
- 可伴骨碎片移位
- CT 对隐匿性骨折（X 光看不到的）特别有价值

### 5. 肝囊肿

**表现**：肝脏内圆形低密度灶
- CT 值接近水（0~20 HU）
- 边界清晰、光滑
- 无强化（注射造影剂后不变白）

> ⚠️ 以上仅供科普，实际诊断需要专业医生结合临床信息综合判断。
    `
  },
  {
    id: 'ct-safety',
    category: '基础知识',
    title: 'CT 检查安全吗？辐射大吗？',
    summary: '了解 CT 检查的辐射剂量和安全注意事项',
    icon: '☢️',
    readTime: '4 分钟',
    content: `
## CT 辐射知多少

### 辐射剂量对比

| 检查项目 | 辐射剂量（mSv） | 相当于自然辐射 |
|---------|----------------|---------------|
| 胸部 X 光 | 0.02 | 2.4 天 |
| 头颅 CT | 2 | 8 个月 |
| 胸部 CT | 7 | 2.4 年 |
| 腹部 CT | 8 | 2.7 年 |
| 自然辐射（年均）| 2.4 | 1 年 |

### 要不要担心？

- **偶尔做一次 CT**：风险极低，不用担心
- **频繁做 CT**：确实会增加辐射暴露，应与医生讨论必要性
- **儿童和孕妇**：需要特别谨慎，医生会评估利弊

### 降低风险的方法

1. 避免不必要的 CT 检查
2. 选择低剂量 CT（如低剂量胸部 CT 筛查肺癌）
3. 告知医生近期的辐射检查史
4. 检查时做好非检查部位的防护

### 造影剂风险

部分 CT 需要注射含碘造影剂：
- 过敏反应：极少数人可能过敏
- 肾功能影响：对肾功能不全者需注意
- 检查后多喝水有助于排出造影剂
    `
  }
]

const categories = ['全部', ...new Set(articles.map(a => a.category))]

export default function LearnCenter() {
  const [activeCategory, setActiveCategory] = useState('全部')
  const [expandedArticle, setExpandedArticle] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === '全部' || a.category === activeCategory
    const matchSearch = !searchQuery || a.title.includes(searchQuery) || a.summary.includes(searchQuery)
    return matchCat && matchSearch
  })

  return (
    <div className="pt-20 pb-12 px-4 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">科普学习</h1>
          <p className="text-slate-400">通俗易懂的 CT 影像科普文章</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索文章..."
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:bg-slate-800'}`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Articles */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filtered.map(article => (
              <motion.div
                key={article.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
                  className="w-full p-6 text-left flex items-start gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-2xl mt-1">{article.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 text-xs font-medium">{article.category}</span>
                      <span className="text-xs text-slate-500">{article.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{article.title}</h3>
                    <p className="text-sm text-slate-400">{article.summary}</p>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-slate-500 mt-1 transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {expandedArticle === article.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 border-t border-slate-800 pt-4">
                        <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: article.content
                              .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold text-white mt-6 mb-3">$1</h2>')
                              .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold text-white mt-5 mb-2">$1</h3>')
                              .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-blue-500 pl-4 my-4 text-blue-300 italic">$1</blockquote>')
                              .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                              .replace(/\|(.+)\|/g, (match) => {
                                return match
                              })
                              .replace(/\n/g, '<br/>')
                          }}
                        />
                        {/* Render tables manually */}
                        {renderArticleContent(article.content)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">没有找到相关文章</p>
          </div>
        )}
      </div>
    </div>
  )
}

function renderArticleContent(content) {
  const lines = content.split('\n')
  const elements = []
  let inTable = false
  let tableRows = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()

    if (line.startsWith('|') && line.endsWith('|')) {
      if (!inTable) { inTable = true; tableRows = [] }
      const cells = line.split('|').filter(c => c.trim()).map(c => c.trim())
      if (cells.some(c => c.match(/^[-:]+$/))) continue // separator
      tableRows.push(cells)
    } else {
      if (inTable) {
        elements.push(
          <div key={`table-${i}`} className="overflow-x-auto my-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  {tableRows[0]?.map((cell, ci) => (
                    <th key={ci} className="py-2 px-3 text-left text-white font-medium">{cell}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-slate-800">
                    {row.map((cell, ci) => (
                      <td key={ci} className="py-2 px-3 text-slate-400">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        inTable = false
        tableRows = []
      }
    }
  }
  if (inTable && tableRows.length > 0) {
    elements.push(
      <div key="table-last" className="overflow-x-auto my-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {tableRows[0]?.map((cell, ci) => (
                <th key={ci} className="py-2 px-3 text-left text-white font-medium">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(1).map((row, ri) => (
              <tr key={ri} className="border-b border-slate-800">
                {row.map((cell, ci) => (
                  <td key={ci} className="py-2 px-3 text-slate-400">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  return elements
}
