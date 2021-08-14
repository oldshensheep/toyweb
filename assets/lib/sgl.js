/**
 * use vertexShaderSource and fragmentShaderSource to init gl
 * @param gl {WebGL2RenderingContext}
 * @param vertexShaderSource {string}
 * @param fragmentShaderSource {string}
 * @returns {WebGLProgram}
 */
function initShader(gl, vertexShaderSource, fragmentShaderSource) {
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    let glProgram = gl.createProgram();

    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);

    gl.linkProgram(glProgram);

    gl.useProgram(glProgram);

    return glProgram;
}

/**
 *
 * @param gl {WebGL2RenderingContext}
 * @param glProgram {WebGLProgram}
 * @param bufferData {Float32Array}
 * @param attributeName {string}
 * @param size {number}
 * @param normalized {boolean}
 */
function setVertexAttribArray(gl, glProgram, bufferData, attributeName, size, normalized) {

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW)

    let attribute = gl.getAttribLocation(glProgram, attributeName);
    gl.enableVertexAttribArray(attribute)
    gl.vertexAttribPointer(attribute, size, gl.FLOAT, normalized, 0, 0)
}