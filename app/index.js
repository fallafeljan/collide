import setupGL from './setupGL'

if (process.env.NODE_ENV !== 'production') {
  System.import('../index.html')
}

let canvas

function handleResize() {
  const {
    width,
    height,
    clientWidth: displayWidth,
    clientHeight: displayHeight
  } = canvas
 
  if (width !== displayWidth || height != displayHeight) {
    canvas.width  = displayWidth
    canvas.height = displayHeight
  }
}

window.addEventListener('load', () => {
  canvas = document.getElementById('canvas')
  
  handleResize()
  window.addEventListener('resize', () => handleResize())

  setupGL(canvas)
})
