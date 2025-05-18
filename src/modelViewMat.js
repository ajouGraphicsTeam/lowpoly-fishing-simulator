/**
 *
 * @param {object} param
 * @param {object | undefined} param.camera  for camera
 * @param {vec3} param.camera.eye
 * @param {vec3} param.camera.at
 * @param {vec3} param.camera.up
 * @param {vec3 | undefined} param.rotateDeg
 * @param {vec3 | undefined} param.translateVec3
 * @param {vec3 | undefined} param.scaleVec3
 * @param {vec3 | undefined} param.fixedPoint  a center for rotate
 *
 * @returns {mat4}
 *
 * 회전은 local 좌표를 기준으로 동작한다.
 */
function calcModelViewMat({
  camera = null,
  rotateDeg = null,
  translateVec3 = null,
  scaleVec3 = null,
  fixedPoint = null,
}) {
  var modelViewMat = mat4();

  if (camera) {
    const { eye, at, up } = camera;
    const lookAtMat = lookAt(eye, at, up);
    modelViewMat = mult(modelViewMat, lookAtMat);
    console.log("look at");
    console.log(lookAtMat);
  }

  if (rotateDeg) {
    const rotatedMat = rotateMat(rotateDeg, fixedPoint);
    modelViewMat = mult(modelViewMat, rotatedMat);

    console.log("rotated");
    console.log(rotatedMat);
  }

  if (translateVec3) {
    const translatedMat = translate(translateVec3);
    modelViewMat = mult(modelViewMat, translatedMat);

    console.log("translated");
    console.log(translatedMat);
  }

  if (scaleVec3) {
    const scaledMat = scalem(scaleVec3);
    modelViewMat = mult(modelViewMat, scaledMat);
    console.log("scaled");
    console.log(scaledMat);
  }

  console.log("result");
  console.log(modelViewMat);
  return modelViewMat;
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
