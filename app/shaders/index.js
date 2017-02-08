import fragmentShaderSource from './fragmentShader.fs'
import vertexShaderSource from './vertexShader.vs'

let gl

function createShaders() {
  return new Array(
    compileShader(fragmentShaderSource, 'fs'),
    compileShader(vertexShaderSource, 'vs')
  )
}

function compileShader(source, type) {
  let shader

  if (type === 'fs') {
    shader = gl.createShader(gl.FRAGMENT_SHADER)
  } else if (type == 'vs') {
    shader = gl.createShader(gl.VERTEX_SHADER)
  } else {
    return null
  }

  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // eslint-disable-next-line no-console
    console.error(
      'An error occured during shader compilation:',
      gl.getShaderInfoLog(shader)
    )

    return null
  }
  
  return shader
}

export function initShaders(glInstance) {
  gl = glInstance
  const shaderProgram = gl.createProgram()

  const shaders = createShaders()
  shaders.forEach(shader =>
    gl.attachShader(shaderProgram, shader))

  gl.linkProgram(shaderProgram)
  
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    // eslint-disable-next-line no-console
    console.error('Can\'t initialize shader program')
  }
  
  gl.useProgram(shaderProgram)
  
  const vertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    'aVertexPosition'
  )

  gl.enableVertexAttribArray(vertexPositionAttribute)
}
