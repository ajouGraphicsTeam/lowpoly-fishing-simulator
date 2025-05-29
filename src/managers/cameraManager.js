class CameraManager {
  /**
   *
   * @param {vec3} eye
   * @param {vec3} at
   * @param {vec3} up
   */
  constructor(
    { eye, at, up } = {
      eye: vec3(-5.15, 3.15, 4.40),
      at: vec3(-6.5, -0.5, -0.5),
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

  /**
   *
   * @param {vec3} delta
   */
  moveCamera(delta) {
    const transformedDelta = mult(mat4(delta), this.viewMat);

    this._eye = vec3(
      this._eye.X + transformedDelta[0].X,
      this._eye.Y + transformedDelta[0].Y,
      this._eye.Z + transformedDelta[0].Z
    );
    this._at = vec3(
      this._at.X + transformedDelta[0].X,
      this._at.Y + transformedDelta[0].Y,
      this._at.Z + transformedDelta[0].Z
    );
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
