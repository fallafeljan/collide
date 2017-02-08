import setupGL from './setupGL'

if (process.env.NODE_ENV !== 'production') {
  System.import('../index.html')
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas')
  setupGL(canvas)
})
