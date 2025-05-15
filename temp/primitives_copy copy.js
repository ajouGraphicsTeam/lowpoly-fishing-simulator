/**
 * 기본적으로 모든 drawtype은 Triangle로
 *
 * vertices와 normals만 계산할 수 있으면 됨 나머지는 manager가 관리할 예정
 */
class PrimitiveBase {
  /**
   * gl.drawArrays에서 사용될 vertices
   * @type {vec3[]}
   */
  vertices = [];
  /**
   * Blinn–Phong reflection 에서 사용될 normal vectors
   * @type {vec3[]}
   */
  normals = [];

  /**
   *
   * @param {object} etc primitive 만들때 필요한 내용들 적당히
   *
   * this.vertices랑 this.normals를 만들어줘야함
   */
  constructor(etc) {
    if (this.constructor == PrimitiveBase) {
      throw new Error("Constructor must be implemented.");
    }
  }
}

class QuadPrimitive extends PrimitiveBase {
  /**
   *
   * @param {vec3} a
   * @param {vec3} b
   * @param {vec3} c
   * @param {vec3} d
   *
   * @summary 평면의 네 꼭짓점을 받아서 삼각형 2개로 만듦
   */
  constructor(a, b, c, d) {
    super();
    const t1 = subtract(b, a);
    const t2 = subtract(c, b);
    const normal = vec3(cross(t1, t2));

    // 평면의 절반 삼각형
    this.vertices.push(a);
    this.normals.push(normal);
    this.vertices.push(b);
    this.normals.push(normal);
    this.vertices.push(c);
    this.normals.push(normal);

    // 나머지 절반 삼각형
    this.vertices.push(a);
    this.normals.push(normal);
    this.vertices.push(c);
    this.normals.push(normal);
    this.vertices.push(d);
    this.normals.push(normal);
  }

  /**
   *
   * 가운데를 0,0으로 두고 평면을 만듦
   * z값은 depth로
   *
   * @param {float} width
   * @param {float} height
   * @param {float} depth
   *
   * @returns {QuadPrimitive}
   */
  static fromWidthAndHeight(width, height, depth = 0) {
    return QuadPrimitive(
      vec3(-width / 2, height / 2, depth), // a
      vec3(-width / 2, -height / 2, depth), // b
      vec3(width / 2, -height / 2, depth), // c
      vec3(width / 2, height / 2, depth) // d
    );
  }
}

class BoxPrimitive extends PrimitiveBase {
  /**
   *
   * @param {vec3[]} vert  6면체이기에 8개의 정점이 필요함
   *
   * @param {vec3[]} pointsArray 결과를 저장할 배열
   * @param {vec3[]} normalsArray 결과를 저장할 배열
   */
  constructor(vertices) {
    super();

    if (!Array.isArray(vertices) || vertices.length !== 8) {
      console.error("There should be 8 vertices for a hexahedron");
      return false;
    }

    const vert = vertices;
    const front = new QuadPrimitive(vert[1], vert[0], vert[3], vert[2]);
    const right = new QuadPrimitive(vert[2], vert[3], vert[7], vert[6]);
    const bottom = new QuadPrimitive(vert[3], vert[0], vert[4], vert[7]);
    const top = new QuadPrimitive(vert[6], vert[5], vert[1], vert[2]);
    const back = new QuadPrimitive(vert[4], vert[5], vert[6], vert[7]);
    const left = new QuadPrimitive(vert[5], vert[4], vert[0], vert[1]);

    this.vertices = this.vertices.concat(
      front.vertices,
      right.vertices,
      bottom.vertices,
      top.vertices,
      back.vertices,
      left.vertices
    );

    this.normals = this.normals.concat(
      front.normals,
      right.normals,
      bottom.normals,
      top.normals,
      back.normals,
      left.normals
    );
  }
}


// TODO: 
// make CylinderPrimitive <- **important for fishing rod**
// make SquarePyramidPrimitive <- maybe used for fish head and fish tail

// make SpherePrimitive <- maybe not needed? 
// make ConePrimitive <- maybe not needed? It can be used for fish head - can be substituted with Square pyramid(사각뿔).
// make CurvedLinePrimitive <- maybe used for fishing line but not necessarily now - can be substituted with Line or Cylinder.

class cylinderPrimitive extends PrimitiveBase {
  constructor(startPoint, radius, height, segments) {
    super();
    this.startPoint = startPoint;
    this.radius = radius;
    this.height = height;
    this.segments = segments; 
    /* 생각해보니, segment를 base, side로 나누면 안됨!
    base와 side segment 개수는 무조건 일치해야 하니까.
    여기 인자들 ||로 default 값 나중에 필요하면 줘도 될듯. */
    this.generateVertices();
  }

  generateVertices() {
    for (let i = 0; i < this.segments; i++) {

      // base(bottom)
      const theta1 = (i / this.segments) * 2 * Math.PI; // 360 degree
      const theta2 = ((i + 1) / this.segments) * 2 * Math.PI;
      
      const x1 = this.radius * Math.cos(theta1);
      const z1 = this.radius * Math.sin(theta1);
      const x2 = this.radius * Math.cos(theta2);
      const z2 = this.radius * Math.sin(theta2);

      this.vertices.push(vec3(this.startPoint[0], this.startPoint[1], this.startPoint[2])); // center
      this.vertices.push(vec3(this.startPoint[0] + x1, this.startPoint[1], this.startPoint[2] + z1));
      this.vertices.push(vec3(this.startPoint[0] + x2, this.startPoint[1], this.startPoint[2] + z2));
      
      const bottomNormal = vec3(0, -1, 0);
      this.normals.push(bottomNormal);
      this.normals.push(bottomNormal);
      this.normals.push(bottomNormal);

      // top - reused the base code
      this.vertices.push(vec3(this.startPoint[0], this.startPoint[1] + this.height, this.startPoint[2])); // center
      this.vertices.push(vec3(this.startPoint[0] + x1, this.startPoint[1] + this.height, this.startPoint[2] + z1));
      this.vertices.push(vec3(this.startPoint[0] + x2, this.startPoint[1] + this.height, this.startPoint[2] + z2));
      
      const topNormal = vec3(0, 1, 0);
      this.normals.push(topNormal);
      this.normals.push(topNormal);
      this.normals.push(topNormal);

      // side
      // 옆면 한 사각형의 네 꼭짓점 : 왼쪽 위, 오른쪽 위, 오른쪽 아래, 왼쪽 아래 순
      // 이거 순서 매우 중요함!!! 강의노트에 나온 순서대로 해야 Quad 함수랑 매칭됨.
      const p1 = vec3(this.startPoint[0] + x1, this.startPoint[1] + this.height, this.startPoint[2] + z1);
      const p2 = vec3(this.startPoint[0] + x2, this.startPoint[1] + this.height, this.startPoint[2] + z2);
      const p3 = vec3(this.startPoint[0] + x2, this.startPoint[1], this.startPoint[2] + z2);
      const p4 = vec3(this.startPoint[0] + x1, this.startPoint[1], this.startPoint[2] + z1);
      
      // Quad가 자동으로 vertices와 normals를 만들어 줘서 그대로 concat해 넣으면 됨.
      const side = new QuadPrimitive(p1, p2, p3, p4);
      this.vertices = this.vertices.concat(side.vertices);
      this.normals = this.normals.concat(side.normals);
    }
  }
}