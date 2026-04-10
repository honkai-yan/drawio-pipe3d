// constants
const gaode_map_api_url = 'https://restapi.amap.com/v3/staticmap'
const max_api_w_h = 1024
const api_key = '01a8dff349c6db563e3d4338af8f8e40'
const default_location = '116.397428,39.90923'
const default_zoom = 4

// vars
/** @type {HTMLImageElement} */
let img = null
let mx_canvas = null
let mx_canvas_container = null
let initial_canvas_size = {
  w: 0,
  h: 0
}
let wh_aspect = 0

// funcs

// 初始化画布元素对象
async function init() {
  let try_times = 0
  return new Promise((res, rej) => {
    const timer = setInterval(() => {
      if (try_times > 50) {
        rej()
      }

      try_times++
      mx_canvas = document.querySelector('.geBackgroundPage')
      mx_canvas_container = document.querySelector('.geDiagramContainer')

      if (mx_canvas != null && mx_canvas_container != null) {
        clearInterval(timer)
        console.log('map_background初始化完成')
        initial_canvas_size = {
          w: mx_canvas.scrollWidth,
          h: mx_canvas.scrollHeight
        }
        res()
      }
    }, 200);
  })
}

// 构造静态地图的url地址
// api支持的最大宽高为1024，如果给定的宽高大于1024，自动进行缩放
function buildImgUrl(width, height) {
  let w = width
  let h = height

  if (w > max_api_w_h) {
    w = max_api_w_h
    h = h * (w / width)
  } 
  
  if (h > max_api_w_h) {
    h = max_api_w_h
    w = w * (h / height)
  }

  w = Math.ceil(w)
  h = Math.ceil(h)
  wh_aspect = w / h
  console.log(`请求图片尺寸：w:${w}, h:${h}，宽高比: ${wh_aspect}`)

  return gaode_map_api_url +
    '?location=' + default_location +
    '&zoom=' + default_zoom +
    '&size=' + w + '*' + h +
    '&key=' + api_key
}

// 创建静态地图元素对象
function createMapBackground() {
  img = document.createElement('img')
  img.id = 'mx-map-bg'
  img.style.width = mx_canvas.scrollWidth + 'px'
  img.style.height = mx_canvas.scrollHeight + 'px'
  img.style.objectFit = 'cover'
  img.style.objectPosition = 'center'
  img.style.zIndex = 0
  img.style.transformOrigin = '0 0'
	img.style.pointerEvents = 'none'
	img.style.userSelect = 'none'
	img.draggable = false;
  img.src = buildImgUrl(parseInt(mx_canvas.scrollWidth), parseInt(mx_canvas.scrollHeight))
  img.style.backgroundColor = 'rgba(0, 0, 255, 0.2)'

  img.onerror = (e) => {
    console.log('静态地图获取失败:', e)
  }

  if (mx_canvas_container.firstChild) {
    mx_canvas_container.insertBefore(img, mx_canvas_container.firstChild)
  } else {
    mx_canvas_container.appendChild(img)
  }

  console.log('创建地图对象完成')
}

function floatSame(f1, f2) {
  return Math.abs(f1 - f2) < 1e-9
}

// 更新地图位置与大小，与画布同步
function updateMapPosition() {
  const canvas_rect = mx_canvas.getBoundingClientRect()
  const container_rec = mx_canvas_container.querySelector('svg').getBoundingClientRect() // 画布位置实际上相对于容器中的一个svg元素
  let transformStr = null
  
  // 计算画布到容器边框的距离差值
  const x_diff = canvas_rect.left - container_rec.left
  const y_diff = canvas_rect.top - container_rec.top
  // 将距离差值应用到地图元素上
  transformStr = `translate(${x_diff}px, ${y_diff}px) `

  // 计算当前画布尺寸相对于初始尺寸的比例
  const x_scale = canvas_rect.width / initial_canvas_size.w
  const y_scale = canvas_rect.height / initial_canvas_size.h
  transformStr += `scaleX(${x_scale}) scaleY(${y_scale})`

  // 应用transform
  img.style.transform = transformStr

  // 每帧更新一次地图位置与尺寸
  requestAnimationFrame(updateMapPosition)
}

try {
  await init()
  createMapBackground()
  updateMapPosition()
} catch {
  console.error('高德地图加载失败')
  alert('高德地图加载失败')
}
