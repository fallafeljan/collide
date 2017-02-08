// sample code taken from
// <https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/Einf%C3%BChrung_in_WebGL>
import {initShaders} from './shaders'

let gl

function initWebGL(canvas) {
  gl = null
  
  try {
    gl = canvas.getContext("webgl")
      || canvas.getContext("experimental-webgl")
  }
  catch (err) {
  }
  
  // Wenn wir keinen WebGl Kontext haben
  
  if (!gl) {
    console.error('Could not initialize WebGL')

    gl = null
  }
}

export default function setupGL(canvas) {
  initWebGL(canvas)
  
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

    initShaders(gl)

    canvas.classList.add('canvas--visible')
  }
}
