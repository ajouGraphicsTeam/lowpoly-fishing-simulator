/**
 *
 * @param {vec3[]} vert  6면체이기에 8개의 정점이 필요함
 *
 * @param {vec3[]} pointsArray 결과를 저장할 배열
 * @param {vec3[]} normalsArray 결과를 저장할 배열
 */
function colorHexahedron(vertices, pointsArray, normalsArray) {
  if (!Array.isArray(vertices) || vertices.length !== 8) {
    console.error("There should be 8 vertices for a hexahedron");
    return false;
  }

  console.log("vertices", vertices);

  const vert = vertices;
  quad(vert[1], vert[0], vert[3], vert[2], pointsArray, normalsArray); // front
  quad(vert[2], vert[3], vert[7], vert[6], pointsArray, normalsArray); // right
  quad(vert[3], vert[0], vert[4], vert[7], pointsArray, normalsArray); // bottom
  quad(vert[6], vert[5], vert[1], vert[2], pointsArray, normalsArray); // top
  quad(vert[4], vert[5], vert[6], vert[7], pointsArray, normalsArray); // back
  quad(vert[5], vert[4], vert[0], vert[1], pointsArray, normalsArray); // left
}

/**
 *
 * @param {vec3} a
 * @param {vec3} b
 * @param {vec3} c
 * @param {vec3} d
 *
 * @param {vec3[]} pointsArray 결과를 저장할 배열
 * @param {vec3[]} normalsArray 결과를 저장할 배열
 *
 * @summary 평면의 네 꼭짓점을 받아서 삼각형 2개로 만듦
 */
function quad(a, b, c, d, pointsArray, normalsArray) {
  const t1 = subtract(b, a);
  const t2 = subtract(c, b);
  const normal = vec3(cross(t1, t2));

  // 평면의 절반 삼각형
  pointsArray.push(a);
  normalsArray.push(normal);
  pointsArray.push(b);
  normalsArray.push(normal);
  pointsArray.push(c);
  normalsArray.push(normal);

  // 나머지 절반 삼각형
  pointsArray.push(a);
  normalsArray.push(normal);
  pointsArray.push(c);
  normalsArray.push(normal);
  pointsArray.push(d);
  normalsArray.push(normal);
}

function lightingInit(program) {
  const lightPosition = vec4(0.0, 0.0, 1.0, 0.0); // directional light
  //   vec4( 1.0, 0.80, 0.0, 1.0 )

  const lightAmbient = vec4(0.2, 0.2, 0.2, 1.0); // 𝐿𝑎 (dark gray)
  const lightDiffuse = vec4(1.0, 1.0, 0.0, 1.0); // 𝐿𝑑 (yellow)
  const lightSpecular = vec4(1.0, 1.0, 1.0, 1.0); // 𝐿𝑠 (white)

  const materialAmbient = vec4(1.0, 0.0, 1.0, 1.0); // 𝑘𝑎
  const materialDiffuse = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑑
  const materialSpecular = vec4(1.0, 0.8, 0.0, 1.0); // 𝑘𝑠

  const materialShininess = 100.0; // 𝛼: a shininess for specular term

  //we can use the function mult that multiplies two vec4s component by component
  const ambientProduct = mult(lightAmbient, materialAmbient);
  const diffuseProduct = mult(lightDiffuse, materialDiffuse);
  const specularProduct = mult(lightSpecular, materialSpecular);

  gl.uniform4fv(
    gl.getUniformLocation(program, "ambientProduct"),
    flatten(ambientProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "diffuseProduct"),
    flatten(diffuseProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "specularProduct"),
    flatten(specularProduct)
  );
  gl.uniform4fv(
    gl.getUniformLocation(program, "lightPosition"),
    flatten(lightPosition)
  );
  gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);
}
