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
