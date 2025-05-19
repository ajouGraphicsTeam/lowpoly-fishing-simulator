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
    this._eye = eye;
    this._at = at;
    this._up = up;

    this.updateMat();
  }

  get eye() {
    return this._eye;
  }
  set eye(newEye) {
    this._eye = newEye;
    this.updateMat();
  }
  get at() {
    return this._at;
  }
  set at(newAt) {
    this._at = newAt;
    this.updateMat();
  }
  get up() {
    return this._up;
  }
  set up(newUp) {
    this._up = newUp;
    this.updateMat();
  }

  updateMat() {
    this.viewMat = lookAt(this._eye, this._at, this._up);

    gl.uniformMatrix4fv(
      rootManager.canvasManager.viewMatLoc,
      false,
      flatten(this.viewMat)
    );
  }
}
