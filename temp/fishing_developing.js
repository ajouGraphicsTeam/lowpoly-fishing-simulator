"use strict";

var gl;

const DRAW_TYPE = {
  POINT: 0, // gl.POINTS
  LINE: 1, // gl.LINES
  LINE_LOOP: 2, // gl.LINE_LOOP
  LINE_STRIP: 3, // gl.LINE_STRIP
  TRIANGLE: 4, // gl.TRIANGLES
  TRIANGLE_STRIP: 5, // gl.TRIANGLE_STRIP
  TRIANGLE_FAN: 6, // gl.TRIANGLE_FAN

  CUSTOM_HEXAHEDRON: 10, // custom
};

class CanvasManager {
  max_length_to_draw = Infinity;

  constructor() {
    this.init();

    this.lineManager = new LineManager(this);
    this.modelViewManager = new ModelViewManager(this);
  }

  init() {
    var canvas = document.getElementById("gl-canvas");

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

    // init modelViewMatrix
    const modelViewMat = mat4(); // 4x4 identity matrix
    const modelViewMatLoc = gl.getUniformLocation(
      this.program,
      "uModelViewMat"
    );
    gl.uniformMatrix4fv(modelViewMatLoc, false, flatten(modelViewMat));

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

class LineManager {
  vertexPairs = [];
  depth = 0.05;
  division = 50;
  thickness = 0.05;
  draw_type = DRAW_TYPE.LINE_LOOP;
  zigzag = true;

  result_length = 0;

  constructor(rootManager) {
    this.root = rootManager;
  }

  addVertexPair(start_position, end_position) {
    this.vertexPairs.push({ start_position, end_position });
  }

  getVertices = () => {
    return this.vertexPairs.map((value, index) =>
      create3dLinearVertices({
        ...value,
        division: this.division,
        thickness: this.thickness,
        depth: this.depth,
        zigzag: this.zigzag,
      })
    );
  };

  drawVertices = () => {
    this.vertexPairs.map((value, index) => {
      var draw_type = this.draw_type;
      var normals = [];
      var vertices = create3dLinearVertices({
        ...value,
        division: this.division,
        thickness: this.thickness,
        depth: this.depth,
        zigzag: this.zigzag,
      });

      if (draw_type == DRAW_TYPE.CUSTOM_HEXAHEDRON) {
        draw_type = DRAW_TYPE.TRIANGLE;

        const chunkSize = 8; // 육면체의 꼭짓점 개수
        const newVertices = [];
        for (let i = 0; i < vertices.length; i += chunkSize) {
          const chunk = vertices.slice(i, i + chunkSize);
          colorHexahedron(
            [
              // 위에서 vertices만들때 지그제그로 만들어져서 점들 위치 조정
              chunk[2],
              chunk[0],
              chunk[4],
              chunk[6],

              chunk[3],
              chunk[1],
              chunk[5],
              chunk[7],
            ],
            newVertices,
            normals
          );
        }
        vertices = newVertices;
      } else {
        normals = Array(vertices.length).fill(vec3(1, 1, 1));
      }

      console.log(index, vertices);
      this.result_length = vertices.length;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.root.vertexBufferId);
      gl.bufferData(gl.ARRAY_BUFFER, vertices.flatten(), gl.STATIC_DRAW);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.root.normalBufferId);
      gl.bufferData(gl.ARRAY_BUFFER, normals.flatten(), gl.STATIC_DRAW);

      gl.drawArrays(
        draw_type,
        0,
        Math.min(vertices.length, this.root.max_length_to_draw)
      );
    });
  };
}

class ModelViewManager {
  camera = {
    eye: vec3(0, 0, 1),
    at: vec3(0, 0, 0),
    up: vec3(0, 1, 0),
  };
  rotateDeg = vec3(30, -30, -10);
  translateVec3 = vec3(0.01, 0.01, 0.01);
  scaleVec3 = vec3(1, 1, 1);
  fixedPoint = vec3();

  constructor(rootManager) {
    this.root = rootManager;
    this.program = this.root.program;
    this.modelViewMatLoc = gl.getUniformLocation(this.program, "uModelViewMat");
  }

  /** vertex-shader에 업데이트 */
  updateModelView = () => {
    const modelViewMat = calcModelViewMat({
      camera: this.camera,
      rotateDeg: this.rotateDeg,
      translateVec3: this.translateVec3,
      scaleVec3: this.scaleVec3,
      fixedPoint: this.fixedPoint,
    });
    gl.uniformMatrix4fv(this.modelViewMatLoc, false, flatten(modelViewMat));
  };
}

/**
 * 시작점과 끝점, 두께(t)와 분할개수(d)를 받으면
 * 시작과 끝점을 잇는 두께가 t이고 사이에 d개의 점이 있는 정점들을 구함
 * + 3D가 되면서 depth가 추가됨.
 *
 * start_position: vec2,
 * end_position: vec2
 *
 * @returns {vec3[]}
 * */
function create3dLinearVertices({
  start_position,
  end_position,
  thickness = 0,
  division = 0,
  zigzag = true,
  depth = 0,
}) {
  if (depth == 0) {
    return createLinearVertices({
      start_position,
      end_position,
      thickness,
      division,
      zigzag,
    }).map((xy) => [...xy, 0]); // z값을 0으로
  }

  const dx = end_position.X - start_position.X;
  const dy = end_position.Y - start_position.Y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // 법선 벡터
  const nx = ((thickness / 2) * -dy) / length;
  const ny = ((thickness / 2) * dx) / length;

  const near = createLinearVertices({
    start_position,
    end_position,
    thickness,
    division,
    zigzag,
  }).map((xy) => [...xy, depth / 2]); // z값을 depth/2로
  const far = createLinearVertices({
    start_position,
    end_position,
    thickness,
    division,
    zigzag,
  }).map((xy) => [...xy, -depth / 2]); // z값을 -depth/2로

  if (zigzag) {
    return near.flatMap((value, index) => [value, far[index]]);
  }

  return [...near, ...far];
}

/**
 * 시작점과 끝점, 두께(t)와 분할개수(d)를 받으면
 * 시작과 끝점을 잇는 두께가 t이고 사이에 d개의 점이 있는 정점들을 구함
 *
 * start_position: vec2,
 * end_position: vec2
 *
 * @returns {vec2[]}
 * */
function createLinearVertices({
  start_position,
  end_position,
  thickness = 0,
  division = 0,
  zigzag = true,
}) {
  if (thickness == 0) {
    const numOfVertices = division + 2; // division + 시작점 + 끝점
    const vertices = Array.from({ length: numOfVertices }, (_, index) => {
      const ratio = index / (numOfVertices - 1); // `-1` 추가하여 비율이 0~1 범위가 되도록
      return vec2(
        start_position.X * (1 - ratio) + end_position.X * ratio,
        start_position.Y * (1 - ratio) + end_position.Y * ratio
      );
    });

    return vertices;
  }

  const dx = end_position.X - start_position.X;
  const dy = end_position.Y - start_position.Y;
  const length = Math.sqrt(dx * dx + dy * dy);

  // 법선 벡터
  const nx = ((thickness / 2) * -dy) / length;
  const ny = ((thickness / 2) * dx) / length;

  const upper = createLinearVertices({
    start_position: [start_position.X + nx, start_position.Y + ny],
    end_position: [end_position.X + nx, end_position.Y + ny],
    division,
  });
  const lower = createLinearVertices({
    start_position: [start_position.X - nx, start_position.Y - ny],
    end_position: [end_position.X - nx, end_position.Y - ny],
    division,
  });

  if (zigzag) {
    return upper.flatMap((value, index) => [value, lower[index]]);
  }

  return [...upper, ...lower];
}
