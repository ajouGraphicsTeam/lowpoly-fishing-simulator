class Transform {
  _position = vec3(0, 0, 0);
  _rotation = vec3(0, 0, 0);
  _scale = vec3(1, 1, 1);
  /**
   * @type {vec3 | null}
   *
   * 회전시 사용되는 중심점, null일경우 무시
   */
  _anchor;

  /**
   * @type {mat4}
   * model -> world 매트릭스
   * setter를 통해 값이 바뀌면 알아서 sync됨
   */
  modelMat = mat4();

  get position() {
    return this._position;
  }
  set position(newPosition) {
    this._position = newPosition;
    this._syncMatrix();
  }

  get rotation() {
    return this._rotation;
  }
  set rotation(newRotation) {
    this._rotation = newRotation;
    this._syncMatrix();
  }

  get scale() {
    return this._scale;
  }
  set scale(newScale) {
    this._scale = newScale;
    this._syncMatrix();
  }

  get anchor() {
    return this._anchor;
  }
  set anchor(newAnchor) {
    this._anchor = newAnchor;
    this._syncMatrix();
  }

  _syncMatrix() {
    var newModelMat = mat4();

    const rotatedMat = rotateMat(this._rotation, this._anchor);
    newModelMat = mult(newModelMat, rotatedMat);

    const translatedMat = translate(this._position);
    newModelMat = mult(newModelMat, translatedMat);

    const scaledMat = scalem(this._scale);
    newModelMat = mult(newModelMat, scaledMat);

    this.modelMat = newModelMat;
  }
}

/**
 *
 * @param {vec3} rotateDeg
 * @param {vec3} fixedPoint
 * @returns mat4
 */

function rotateMat(rotateDeg, fixedPoint = null) {
  const [degX, degY, degZ] = rotateDeg;

  if (fixedPoint) {
    var fixedPointRotateMat = translate(fixedPoint);

    // rotateX param이 theta인데 왜 radian이 아니라 degree를 받는겨.... 한참 헤맸네
    fixedPointRotateMat = mult(fixedPointRotateMat, rotateX(degX));
    fixedPointRotateMat = mult(fixedPointRotateMat, rotateY(degY));
    fixedPointRotateMat = mult(fixedPointRotateMat, rotateZ(degZ));

    fixedPointRotateMat = mult(
      fixedPointRotateMat,
      translate(negate(fixedPoint))
    );
    return fixedPointRotateMat;
  }

  var rotateMat = rotateX(degX);
  rotateMat = mult(rotateMat, rotateY(degY));
  rotateMat = mult(rotateMat, rotateZ(degZ));

  return rotateMat;
}
