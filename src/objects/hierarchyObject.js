class HierarchyObject {
  /**
   * @type {HierarchyObject}
   */
  parent;

  /**
   * <name, HierarchyObject>
   *
   * @type {{string: HierarchyObject}}
   */
  children = {};

  /**
   * @type {Transform}
   * Transform Component
   */

  transform;

  /**
   * @type {PrimitiveBase}
   */
  _primitives = [];

  _mergedVertices = [];
  _mergedNormals = [];
  _mergedTexCoords = [];

  /**
   * @type {Object}
   * Color information for this object
   */
  color = null;

  /**
   * @type {WebGLTexture}
   * Texture for this object
   */
  texture = null;

  get primitives() {
    return this._primitives;
  }
  set primitives(newPrimitives) {
    this._primitives = newPrimitives;
    this._mergePrimitives();
  }

  /**
   *
   * @param {PrimitiveBase} primitives
   * @param {Transform} transform
   * @param {COLORS} color
   * @param {WebGLTexture} texture
   */
  constructor(
    primitives = [],
    transform = new Transform(),
    color = COLORS.DARK_YELLOW,
    texture = null
  ) {
    // default color: dark yellow, default texture: null
    this.primitives = primitives;
    this.transform = transform;
    this.color = color;
    this.texture = texture;
  }

  _mergePrimitives() {
    this._mergedVertices = this._primitives.flatMap(
      (primitive) => primitive.vertices
    );
    this._mergedNormals = this._primitives.flatMap(
      (primitive) => primitive.normals
    );
    this._mergedTexCoords = this._primitives.flatMap(
      (primitive) => primitive.texCoords
    );
  }

  /**
   *
   * @param {mat4} parentsFrameMat 기본값은 identity mat4
   */
  drawRecursively(parentsFrameMat = mat4()) {
    this.draw(parentsFrameMat);
    const frameMat = mult(parentsFrameMat, this.transform.modelMat);

    Object.values(this.children).forEach((child) =>
      child.drawRecursively(frameMat)
    );
  }

  /**
   *
   * @param {mat4} parentsFrameMat 기본값은 identity mat4
   */
  draw(parentsFrameMat = mat4()) {
    const frameMat = mult(parentsFrameMat, this.transform.modelMat);

    const modelViewMatLoc = gl.getUniformLocation(
      rootManager.canvasManager.program,
      "uModelMat"
    );
    gl.uniformMatrix4fv(modelViewMatLoc, false, flatten(frameMat));

    if (this.color) {
      // 여기서 색상 정해줌
      rootManager.canvasManager.materialAmbient = this.color.ambient;
      rootManager.canvasManager.materialDiffuse = this.color.diffuse;
      rootManager.canvasManager.materialSpecular = this.color.specular;
      rootManager.canvasManager.lightingSync();
    }

    // 여기서 텍스쳐 정해줌
    // 객체별 텍스처가 있으면 사용, null이면 텍스처링 비활성화
    if (this.texture) {
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      gl.uniform1i(rootManager.canvasManager.useTextureLocation, true);
    } else {
      gl.uniform1i(rootManager.canvasManager.useTextureLocation, false);
    }

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

    // 다른 버퍼들처럼 동일하게 hierarchyObject에서 텍스쳐 버퍼도 바인딩 해줬음.
    gl.bindBuffer(gl.ARRAY_BUFFER, rootManager.canvasManager.tBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      this._mergedTexCoords.flatten(),
      gl.STATIC_DRAW
    );

    var vTexCoord = gl.getAttribLocation(
      rootManager.canvasManager.program,
      "vTexCoord"
    );
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    gl.drawArrays(DRAW_TYPE.TRIANGLE, 0, this._mergedVertices.length);
  }

  getAnimationFrameFormat(root = true) {
    const result = {
      transform:
        `new Transform({` +
        ` position: vec3(${this.transform._position}),` +
        ` rotation: vec3(${this.transform._rotation}),` +
        ` scale: vec3(${this.transform._scale}),` +
        ` anchor: vec3(${this.transform._anchor}),` +
        `})`,
    };

    if (Object.keys(this.children).length) {
      result["children"] = {};
      for (const key in this.children) {
        result["children"][key] =
          this.children[key].getAnimationFrameFormat(false);
      }
    }

    if (!root) {
      return result;
    }

    return JSON.stringify(result, "", 2).replaceAll('"', "");
  }
}
