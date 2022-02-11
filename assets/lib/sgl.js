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
 * @param bufferData {TypedArray}
 * @param type {GLenum}
 * @param attributeName {string}
 * @param size {number}
 * @param normalized {boolean}
 * @param drawType {GLenum}
 */
function setVertexAttribArray(gl, glProgram, bufferData, type, attributeName, size, normalized, drawType = gl.STATIC_DRAW) {

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, bufferData, drawType)

    let attribute = gl.getAttribLocation(glProgram, attributeName);
    gl.enableVertexAttribArray(attribute)
    gl.vertexAttribPointer(attribute, size, type, normalized, 0, 0)
}


/**
 *
 * @param gl {WebGL2RenderingContext}
 * @param glProgram {WebGLProgram}
 * @param image {ArrayBufferView}
 * @param attributeName {string}
 */
function setSampler2D(gl, glProgram, image, attributeName) {
    gl.bindTexture(gl.TEXTURE_2D, gl.createTexture())
    gl.activeTexture(gl.TEXTURE0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    let u_image = gl.getUniformLocation(glProgram, attributeName);
    gl.uniform1i(u_image, 0)
}
