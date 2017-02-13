import {
  makePerspective,
  Matrix,
  Vector
} from 'sylvester-es6'

const horizAspect = 480.0/640.0

let rotatingBuffer, translatingBuffer
let perspectiveMatrix
let mvMatrix
let lastSquareUpdateTime
let squareRotation = 0.0

const mvMatrixStack = new Array

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(translation, times = 1) {
  multMatrix(Matrix.Translation(new Vector([
    times * translation[0],
    times * translation[1],
    times * translation[2]
  ])).ensure4x4());
}

function setMatrixUniforms(gl, shaderProgram) {
  var pUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function mvPushMatrix(m) {
  if (m) {
    mvMatrixStack.push(m.dup())
    mvMatrix = m.dup()
  } else {
    mvMatrixStack.push(mvMatrix.dup())
  }
}

function mvPopMatrix() {
  if (!mvMatrixStack.length) {
    throw('Can\'t pop from an empty matrix stack.')
  }
  
  mvMatrix = mvMatrixStack.pop()
  return mvMatrix
}

function mvRotate(angle, v) {
  var inRadians = angle * Math.PI / 180.0
  
  var m = Matrix.Rotation(inRadians, new Vector([v[0], v[1], v[2]])).ensure4x4()
  multMatrix(m)
}

export function drawScene(gl, shaderProgram, vertexPositionAttribute) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
  perspectiveMatrix = makePerspective(45, 1/horizAspect, 0.1, 100.0)
  
  loadIdentity()
  mvTranslate([-0.0, 0.0, -6.0])

  mvPushMatrix()
  mvRotate(squareRotation, [1, 0, 1])

  gl.bindBuffer(gl.ARRAY_BUFFER, rotatingBuffer)
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

  setMatrixUniforms(gl, shaderProgram)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  mvPopMatrix()

  mvPushMatrix()
  mvTranslate([0, 0, -2])

  const translationStep = (new Date).getTime() / 100 % 100 / 100
  mvTranslate([1, 0, 0], translationStep < 50 ?
    -1 * translationStep : translationStep)

  gl.bindBuffer(gl.ARRAY_BUFFER, translatingBuffer)
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

  setMatrixUniforms(gl, shaderProgram)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

  mvPopMatrix()

  const currentTime = (new Date).getTime()
  if (lastSquareUpdateTime) {
    const delta = currentTime - lastSquareUpdateTime
    squareRotation += (30 * delta) / 1000.0
  }

  lastSquareUpdateTime = currentTime
}

export function initBuffers(gl) {
  const vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ]
  
  rotatingBuffer = gl.createBuffer()
  translatingBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, rotatingBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, translatingBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}
