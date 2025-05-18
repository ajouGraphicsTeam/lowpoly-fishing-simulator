class CameraManager {
  /**
   *
   * @param {vec3} eye
   * @param {vec3} at
   * @param {vec3} up
   */
  constructor(
    { eye, at, up } = {
      eye: vec3(0, 0, 1),
      at: vec3(0, 0, 0),
      up: vec3(0, 1, 0),
    }
  ) {
    this.eye = eye;
    this.at = at;
    this.up = up;

    this.updateMat();
  }

  updateMat() {
    this.viewMat = lookAt(this.eye, this.at, this.up);

    gl.uniformMatrix4fv(
      rootManager.canvasManager.viewMatLoc,
      false,
      flatten(this.viewMat)
    );
  }
}
