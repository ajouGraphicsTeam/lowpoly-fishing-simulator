class CanvasManager {
  max_length_to_draw = Infinity;

  /**
   *
   * @param {string} canvasId
   */
  constructor(canvasId) {
    this.init(canvasId);
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

    // init viewMat (cameraMat
    const viewMat = mat4(); // 4x4 identity matrix
    this.viewMatLoc = gl.getUniformLocation(this.program, "uViewMat");
    gl.uniformMatrix4fv(this.viewMatLoc, false, flatten(viewMat));

    // init modelViewMatrix
    const modelMat = mat4(); // 4x4 identity matrix
    this.modelMatLoc = gl.getUniformLocation(this.program, "uModelMat");
    gl.uniformMatrix4fv(this.modelMatLoc, false, flatten(modelMat));

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
    // TODO: rootHierarchy를 두고 drawRecursively()
  }
}

function lightingInit(program) {
  const lightPosition = vec4(0.0, 0.0, 1.0, 0.0); // directional light
  //   vec4( 1.0, 0.80, 0.0, 1.0 )

  const lightAmbient = vec4(0.2, 0.2, 0.2, 1.0); // 𝐿𝑎 (dark gray)
  const lightDiffuse = vec4(1.0, 1.0, 0.0, 1.0); // 𝐿𝑑 (yellow)
  const lightSpecular = vec4(1.0, 1.0, 1.0, 1.0); // 𝐿𝑠 (white)

  const materialAmbient = vec4(1.0, 0.0, 1.0, 1.0); // 𝑘𝑎
  const materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑑
  const materialSpecular = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑠

  const materialShininess = 100.0; // 𝛼: a shininess for specular term

  //we can use the function mult that multiplies two vec4s component by component
  const ambientProduct = mult(lightAmbient, materialAmbient);
  const diffuseProduct = mult(lightDiffuse, materialDiffuse);
  const specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}
