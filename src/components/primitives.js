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
