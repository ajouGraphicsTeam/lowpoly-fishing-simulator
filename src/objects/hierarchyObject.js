class HierarchyObject {
  /**
   * @type {HierarchyObject}
   */
  parent;

  /**
   * @type {HierarchyObject[]}
   */
  children = [];

  /**
   * @type {mat4}
   * 현재의 좌표계에서 parent의 좌표계로 가는 행렬
   */

  transform = new Transform();

  /**
   * @type {PrimitiveBase}
   */
  _primitives = [];

  _mergedVertices = [];
  _mergedNormals = [];

  get primitives() {
    return this._primitives;
  }
  set primitives(newPrimitives) {
    this._primitives = newPrimitives;
    this._mergePrimitives();
  }

  _mergePrimitives() {
    this._mergedVertices = this._primitives.flatMap(
      (primitive) => primitive.vertices
    );
    this._mergedNormals = this._primitives.flatMap(
      (primitive) => primitive.normals
    );
  }

  /**
   *
   * @param {mat4} parentsFrameMat 기본값은 identity mat4
   */
  drawRecursively(parentsFrameMat = mat4()) {
    this.draw(parentsFrameMat);
    const frameMat = mult(parentsFrameMat, this.transform.modelMat);

    this.children.forEach((child, idx) => child.drawRecursively(frameMat));
  }

  /**
   *
   * @param {mat4} parentsFrameMat 기본값은 identity mat4
   */
  draw(parentsFrameMat = mat4()) {
    const frameMat = mult(parentsFrameMat, this.transform.modelMat);

    console.log(frameMat);

    const modelViewMatLoc = gl.getUniformLocation(
      rootManager.canvasManager.program,
      "uModelMat"
    );
    gl.uniformMatrix4fv(modelViewMatLoc, false, flatten(frameMat));

    gl.bindBuffer(gl.ARRAY_BUFFER, rootManager.canvasManager.vertexBufferId);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this._mergedVertices.flatten(),
      gl.STATIC_DRAW
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, rootManager.canvasManager.normalBufferId);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this._mergedNormals.flatten(),
      gl.STATIC_DRAW
    );

    gl.drawArrays(DRAW_TYPE.TRIANGLE, 0, this._mergedVertices.length);
  }
}
