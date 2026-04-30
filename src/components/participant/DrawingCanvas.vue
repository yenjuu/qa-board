<template>
  <div class="drawing-wrapper">
    <div class="toolbar">
      <button
        class="tool-btn"
        :class="{ active: currentTool === 'brush' }"
        @click="currentTool = 'brush'"
      >
        ✏️ 畫筆
      </button>
      <button
        class="tool-btn"
        :class="{ active: currentTool === 'eraser' }"
        @click="currentTool = 'eraser'"
      >
        🩹 橡皮擦
      </button>
      <button class="tool-btn clear-btn" @click="clearCanvas">
        🗑️ 清除
      </button>
      <div class="brush-size-control">
        <span class="size-label">大小</span>
        <input type="range" min="2" max="40" v-model="brushSize" class="size-slider" />
        <span
          class="size-preview"
          :style="{ width: brushSize + 'px', height: brushSize + 'px' }"
        ></span>
      </div>
    </div>

    <!-- 用一層 relative 容器限制 canvas，canvas 再 absolute inset:0 -->
    <div ref="containerRef" class="canvas-container">
      <canvas
        ref="canvasRef"
        class="drawing-canvas"
        :class="{ 'eraser-mode': currentTool === 'eraser' }"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
        @touchstart.prevent="startDrawTouch"
        @touchmove.prevent="drawTouch"
        @touchend.prevent="stopDraw"
      ></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
const containerRef = ref(null)
const isDrawing = ref(false)
const currentTool = ref('brush')
const brushSize = ref(6)

let ctx = null
let ro = null

const initCanvas = (width, height) => {
  const canvas = canvasRef.value
  canvas.width = Math.floor(width)
  canvas.height = Math.floor(height)
  ctx = canvas.getContext('2d')
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
}

const getPos = (e) => {
  const rect = canvasRef.value.getBoundingClientRect()
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

const getPosTouch = (e) => {
  const rect = canvasRef.value.getBoundingClientRect()
  const t = e.touches[0]
  return { x: t.clientX - rect.left, y: t.clientY - rect.top }
}

const applyStyle = () => {
  if (currentTool.value === 'eraser') {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.strokeStyle = 'rgba(0,0,0,1)'
    ctx.lineWidth = parseInt(brushSize.value) * 3
  } else {
    ctx.globalCompositeOperation = 'source-over'
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = parseInt(brushSize.value)
  }
}

const startDraw = (e) => {
  isDrawing.value = true
  const { x, y } = getPos(e)
  applyStyle()
  ctx.beginPath()
  ctx.moveTo(x, y)
}

const draw = (e) => {
  if (!isDrawing.value) return
  const { x, y } = getPos(e)
  ctx.lineTo(x, y)
  ctx.stroke()
}

const startDrawTouch = (e) => {
  isDrawing.value = true
  const { x, y } = getPosTouch(e)
  applyStyle()
  ctx.beginPath()
  ctx.moveTo(x, y)
}

const drawTouch = (e) => {
  if (!isDrawing.value) return
  const { x, y } = getPosTouch(e)
  ctx.lineTo(x, y)
  ctx.stroke()
}

const stopDraw = () => {
  isDrawing.value = false
  ctx?.beginPath()
}

const clearCanvas = () => {
  const canvas = canvasRef.value
  ctx.globalCompositeOperation = 'source-over'
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const getDataUrl = () => {
  const canvas = canvasRef.value
  const MAX_W = 800
  const MAX_H = 600
  const scale = Math.min(MAX_W / canvas.width, MAX_H / canvas.height, 1)
  const off = document.createElement('canvas')
  off.width = Math.round(canvas.width * scale)
  off.height = Math.round(canvas.height * scale)
  const offCtx = off.getContext('2d')
  offCtx.fillStyle = 'white'
  offCtx.fillRect(0, 0, off.width, off.height)
  offCtx.drawImage(canvas, 0, 0, off.width, off.height)
  return off.toDataURL('image/jpeg', 0.7)
}

onMounted(() => {
  const container = containerRef.value
  // 初始化
  initCanvas(container.clientWidth, container.clientHeight)

  // ResizeObserver：container 實際大小改變時才觸發，比 window.resize 精準
  ro = new ResizeObserver((entries) => {
    const entry = entries[0]
    const { width, height } = entry.contentRect
    if (width === 0 || height === 0) return

    const canvas = canvasRef.value
    // 備份現有畫面
    const dataUrl = canvas.width > 0 && canvas.height > 0 ? canvas.toDataURL() : null

    initCanvas(width, height)

    if (dataUrl) {
      const img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      img.src = dataUrl
    }
  })
  ro.observe(container)
})

onUnmounted(() => {
  ro?.disconnect()
})

defineExpose({ getDataUrl, clearCanvas })
</script>

<style scoped>
.drawing-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  min-height: 0;
  /* 確保高度被父層 flex 決定而非內容撐開 */
  height: 0;
  border-radius: 20px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  background: white;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-shrink: 0;
  flex-wrap: wrap;
}

/* canvas 的容器：flex:1 + position:relative，讓 canvas absolute 填滿 */
.canvas-container {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.drawing-canvas {
  position: absolute;
  inset: 0;
  cursor: crosshair;
  touch-action: none;
  display: block;
}

.drawing-canvas.eraser-mode {
  cursor: cell;
}

/* Toolbar styles */
.tool-btn {
  padding: 0.4rem 0.9rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  background: white;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.15s;
  color: #64748b;
}
.tool-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
.tool-btn.active {
  background: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}
.clear-btn {
  border-color: #fca5a5;
  color: #ef4444;
}
.clear-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.brush-size-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
}
.size-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
}
.size-slider {
  width: 80px;
  accent-color: var(--primary-color);
  cursor: pointer;
}
.size-preview {
  border-radius: 50%;
  background: #1e293b;
  display: inline-block;
  min-width: 4px;
  min-height: 4px;
  max-width: 40px;
  max-height: 40px;
  transition: all 0.1s;
}
</style>
