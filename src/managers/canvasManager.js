class CanvasManager {
  max_length_to_draw = Infinity;

  /** lighting */
  lightPosition = vec4(100.0, 100.0, 100.0, 1.0); // directional light

  lightAmbient = vec4(0.2, 0.2, 0.2, 1.0); // 𝐿𝑎 (dark gray)
  lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0); // 𝐿𝑑 (white)
  lightSpecular = vec4(1.0, 1.0, 1.0, 1.0); // 𝐿𝑠 (white)

  materialAmbient = vec4(1.0, 0.0, 1.0, 1.0); // 𝑘𝑎
  materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑑
  materialSpecular = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑠

  materialShininess = 100.0; // 𝛼: a shininess for specular term
  /** lighting end */

  /**
   *
   * @param {string} canvasId
   */
  constructor(canvasId) {
    this.rootManager = new RootManager();
    this.init(canvasId);
  }

  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.rootManager.rootObject.drawRecursively();
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

    // 텍스쳐 초기화 함수들 여기 몰아넣었음.
    this.initTexture();

    // init viewMat (cameraMat
    const viewMat = mat4(); // 4x4 identity matrix
    this.viewMatLoc = gl.getUniformLocation(this.program, "uViewMat");
    gl.uniformMatrix4fv(this.viewMatLoc, false, flatten(viewMat));

    // init modelViewMatrix
    const modelMat = mat4(); // 4x4 identity matrix
    this.modelMatLoc = gl.getUniformLocation(this.program, "uModelMat");
    gl.uniformMatrix4fv(this.modelMatLoc, false, flatten(modelMat));

    // init projectionMatrix
    const [fovy, aspect, near, far] = [120, 1, 0.1, 1000];
    const projectionMat = perspective(fovy, aspect, near, far);
    const projectionMatLoc = gl.getUniformLocation(
      this.program,
      "uProjectionMat"
    );
    gl.uniformMatrix4fv(projectionMatLoc, false, flatten(projectionMat));

    this.lightingSync();
  }

  /**
   * Initialize texture codes.
   */
  initTexture() {
    // 텍스쳐 정점 버퍼 생성(실제 데이터는 각 프리미티브들이 제공할 거임)
    this.tBuffer = gl.createBuffer();
    
    // 모든 미리 정의된 텍스처들 초기화
    initTextures();
    
    // 셰이더 유니폼에 텍스처 연결
    gl.uniform1i(gl.getUniformLocation(this.program, "texture"), 0);
    
    // 텍스쳐 쓸지 말지 변수 셰이더에 연결
    this.useTextureLocation = gl.getUniformLocation(this.program, "useTexture");
  }



  /**
   * sync with vertex-shader
   * TODO: 최적화를 위해 location 빼두기 (getUniformLocation 안쓰도록)
   */
  lightingSync() {
    //we can use the function mult that multiplies two vec4s component by component
    const ambientProduct = mult(this.lightAmbient, this.materialAmbient);
    const diffuseProduct = mult(this.lightDiffuse, this.materialDiffuse);
    const specularProduct = mult(this.lightSpecular, this.materialSpecular);

    gl.uniform4fv(
      gl.getUniformLocation(this.program, "ambientProduct"),
      flatten(ambientProduct)
    );
    gl.uniform4fv(
      gl.getUniformLocation(this.program, "diffuseProduct"),
      flatten(diffuseProduct)
    );
    gl.uniform4fv(
      gl.getUniformLocation(this.program, "specularProduct"),
      flatten(specularProduct)
    );
    gl.uniform4fv(
      gl.getUniformLocation(this.program, "lightPosition"),
      flatten(this.lightPosition)
    );
    gl.uniform1f(
      gl.getUniformLocation(this.program, "shininess"),
      this.materialShininess
    );
  }
}
