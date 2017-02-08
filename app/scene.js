import {
  makePerspective,
  Matrix,
  Vector
} from 'sylvester-es6'

const horizAspect = 480.0/640.0
let squareVerticesBuffer, perspectiveMatrix, mvMatrix

function loadIdentity() {
  mvMatrix = Matrix.I(4);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation(new Vector([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms(gl, shaderProgram) {
  var pUniform = gl.getUniformLocation(shaderProgram, 'uPMatrix');
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, 'uMVMatrix');
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

export function drawScene(gl, shaderProgram, vertexPositionAttribute) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  
  perspectiveMatrix = makePerspective(45, 1/horizAspect, 0.1, 100.0)
  
  loadIdentity()
  mvTranslate([-0.0, 0.0, -6.0])
  
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)

  setMatrixUniforms(gl, shaderProgram)

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

export function initBuffers(gl) {
  squareVerticesBuffer = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)
  
  const vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ]
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}
