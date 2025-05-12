class PrimitiveManager {
  /**
   * 관리할 primitive들
   * @type {PrimitiveBase[]}
   */
  primitives = [];

  constructor(root) {
    this.root = root;
  }

  /**
   *
   * @param {PrimitiveBase} newPrimitive
   */
  addPrimitive(newPrimitive) {
    if (newPrimitive instanceof PrimitiveBase === false) {
      throw new Error("newPrimitive must be instanceof PrimitiveBase");
    }
    this.primitives.push(newPrimitive);
  }

  render() {
    this.primitives.map((primitive, index) => {
      gl.bufferData(
        gl.ARRAY_BUFFER,
        primitive.vertices.flatten(),
        gl.STATIC_DRAW
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, this.root.normalBufferId);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        primitive.normals.flatten(),
        gl.STATIC_DRAW
      );

      gl.drawArrays(DRAW_TYPE.TRIANGLE, 0, primitive.vertices.length);
    });
  }
}
