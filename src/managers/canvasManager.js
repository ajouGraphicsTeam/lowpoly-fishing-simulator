class CanvasManager {
  max_length_to_draw = Infinity;

  /**
   *
   * @param {string} canvasId
   */
  constructor(canvasId) {
    this.init(canvasId);

    this.lineManager = new LineManager(this);
    this.modelViewManager = new ModelViewManager(this);
  }

  /**
   *
   * @param {string} canvasId
   */
  init(canvasId) {
    var canvas = document.getElementById(canvasId);

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
      alert("WebGL isn't available");
    }

    //
    //  Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0.0, 0.5);
    gl.enable(gl.DEPTH_TEST); // Enable depth testing

    //  Load shaders and initialize attribute buffers
    this.program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(this.program);

    // normal buffer set
    this.normalBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBufferId);

    // Associate out shader variables with our data buffer
    var vNormal = gl.getAttribLocation(this.program, "aVertexNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    // vertex buffer set
    this.vertexBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBufferId);

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(this.program, "aVertexPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // init modelViewMatrix  // TODO: change to camera mat
    const modelViewMat = mat4(); // 4x4 identity matrix
    const modelViewMatLoc = gl.getUniformLocation(this.program, "uModelMat");
    gl.uniformMatrix4fv(modelViewMatLoc, false, flatten(modelViewMat));

    // init modelViewMatrix
    const modelMat = mat4(); // 4x4 identity matrix
    const modelMatLoc = gl.getUniformLocation(this.program, "uModelViewMat");
    gl.uniformMatrix4fv(modelMatLoc, false, flatten(modelMat));

    // init projectionMatrix
    const [fovy, aspect, near, far] = [120, 1, 0.1, 10];
    const projectionMat = perspective(fovy, aspect, near, far);
    const projectionMatLoc = gl.getUniformLocation(
      this.program,
      "uProjectionMat"
    );
    gl.uniformMatrix4fv(projectionMatLoc, false, flatten(projectionMat));

    lightingInit(this.program);
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log(
      `zigzag: ${this.zigzag}\n` +
        `thickness: ${this.thickness}\n` +
        `division: ${this.division}\n` +
        `draw_type: ${this.draw_type}\n` +
        `max_length_to_draw: ${this.max_length_to_draw}\n`
    );

    console.log(" - lines");
    this.lineManager.drawVertices();
  }
}
