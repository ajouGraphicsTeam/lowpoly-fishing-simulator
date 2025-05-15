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

class TrianglePrimitive extends PrimitiveBase {
  /**
   * 
   * @param {vec3} a 첫 번째 점
   * @param {vec3} b 두 번째 점
   * @param {vec3} c 세 번째 점
   * 
   * @summary 세 점을 받아서 삼각형을 만듦. 
   * @description 외적 계산이므로 점의 순서가 중요함!! 삼각형의 네 꼭짓점 순서: 가운데 위, 왼쪽 아래, 오른쪽 아래 순
   */
  constructor(a, b, c) {
    super();
    const t1 = subtract(b, a);
    const t2 = subtract(c, b);
    const normal = vec3(cross(t1, t2));

    this.vertices.push(a);
    this.normals.push(normal);
    this.vertices.push(b);
    this.normals.push(normal);
    this.vertices.push(c);
    this.normals.push(normal);
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
   * @description 외적 계산이므로 점의 순서가 중요함!! 사각형의 네 꼭짓점 순서: 왼쪽 위, 오른쪽 위, 오른쪽 아래, 왼쪽 아래 순
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
   * @summary 8개의 정점을 받아서 각 정점을 꼭짓점으로 가지는 6면체를 만듦.
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
// make PrismPrimitive <- **important for fishing rod**
// make PyramidPrimitive <- maybe used for fish head and fish tail

// make SpherePrimitive <- maybe not needed? 
// make ConePrimitive <- maybe not needed? It can be used for fish head - can be substituted with Square pyramid(사각뿔).
// make CurvedLinePrimitive <- maybe used for fishing line but not necessarily now - can be substituted with Line or Cylinder.




class PrismPrimitive extends PrimitiveBase {
  /**
   * 
   * @param {vec3} startPoint 밑면의 중심점
   * @param {float} radius 반지름(=밑면의 중심점에서 밑면의 한 꼭짓점까지의 거리)
   * @param {float} height 높이
   * @param {int} segments 세그먼트 개수(=각의 개수)
   * 
   * @summary 밑면이 정다각형이며, 밑면의 중심점으로부터 y축으로 뻗는 n각기둥을 만듦.
   * @description segments를 충분히 크게 하면 원기둥에 근사함.
   */
  constructor(startPoint, radius, height, segments) {
    super();
    /* 생각해보니, segment를 base, side로 나누면 안됨!
    base와 side segment 개수는 무조건 일치해야 하니까. */
    
    for (let i = 0; i < segments; i++) {

      // 기본적인 각도 및 offset 변수들 미리 계산
      const theta1 = (i / segments) * 2 * Math.PI;
      const theta2 = ((i + 1) / segments) * 2 * Math.PI;

      const x1 = radius * Math.cos(theta1);
      const z1 = radius * Math.sin(theta1);
      const x2 = radius * Math.cos(theta2);
      const z2 = radius * Math.sin(theta2);

      // 밑면
      const bottom = new TrianglePrimitive(
        vec3(startPoint[0], startPoint[1], startPoint[2]),
        vec3(startPoint[0] + x1, startPoint[1], startPoint[2] + z1),
        vec3(startPoint[0] + x2, startPoint[1], startPoint[2] + z2)
      );
      this.vertices = this.vertices.concat(bottom.vertices);
      this.normals = this.normals.concat(bottom.normals);

      // 윗면
      const top = new TrianglePrimitive(
        vec3(startPoint[0] + x2, startPoint[1] + height, startPoint[2] + z2),
        vec3(startPoint[0] + x1, startPoint[1] + height, startPoint[2] + z1),
        vec3(startPoint[0], startPoint[1] + height, startPoint[2])
      );
      this.vertices = this.vertices.concat(top.vertices);
      this.normals = this.normals.concat(top.normals);

      // 옆면
      const side = new QuadPrimitive(
        vec3(startPoint[0] + x1, startPoint[1] + height, startPoint[2] + z1),
        vec3(startPoint[0] + x2, startPoint[1] + height, startPoint[2] + z2),
        vec3(startPoint[0] + x2, startPoint[1], startPoint[2] + z2),
        vec3(startPoint[0] + x1, startPoint[1], startPoint[2] + z1)
      );
      this.vertices = this.vertices.concat(side.vertices);
      this.normals = this.normals.concat(side.normals);
      // 참고) spread 연산자를 쓸 수도 있긴 하나, array size가 크면 concat이 더 속도 및 메모리 효율적이라고 함.
    }
  }
}

class PyramidPrimitive extends PrimitiveBase {
  /**
   * 
   * @param {vec3} startPoint 밑면의 중심점
   * @param {float} radius 반지름(=밑면의 중심점에서 밑면의 한 꼭짓점까지의 거리)
   * @param {float} height 높이
   * @param {int} segments 세그먼트 개수(=각의 개수)
   * 
   * @summary 밑면이 정다각형이며, 밑면의 중심점으로부터 y축으로 뻗는 n각뿔을 만듦.
   * @description segments를 충분히 크게 하면 원뿔에 근사함.
   */
  constructor(startPoint, radius, height, segments) {
    super();

    for (let i = 0; i < segments; i++) {

      // 기본적인 각도 및 offset 변수들 미리 계산
      const theta1 = (i / segments) * 2 * Math.PI;
      const theta2 = ((i + 1) / segments) * 2 * Math.PI;
      
      const x1 = radius * Math.cos(theta1);
      const z1 = radius * Math.sin(theta1);
      const x2 = radius * Math.cos(theta2);
      const z2 = radius * Math.sin(theta2);

      // 밑면
      const bottom = new TrianglePrimitive(
        vec3(startPoint[0], startPoint[1], startPoint[2]),
        vec3(startPoint[0] + x1, startPoint[1], startPoint[2] + z1),
        vec3(startPoint[0] + x2, startPoint[1], startPoint[2] + z2)
      );
      this.vertices = this.vertices.concat(bottom.vertices);
      this.normals = this.normals.concat(bottom.normals);

      // 옆면
      // 이 때, 옆면 관점에서 보면 삼각형의 밑변의 두 점 순서가 밑면과 반대임을 주의!!
      const side = new TrianglePrimitive(
        vec3(startPoint[0], startPoint[1] + height, startPoint[2]), // 꼭짓점(apex)
        vec3(startPoint[0] + x2, startPoint[1], startPoint[2] + z2),
        vec3(startPoint[0] + x1, startPoint[1], startPoint[2] + z1)
      );
      this.vertices = this.vertices.concat(side.vertices);
      this.normals = this.normals.concat(side.normals);
    }
  }
}