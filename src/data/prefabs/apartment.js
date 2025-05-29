// 아파트 Prefab
class Apartment extends PrefabObject {
  /**
   * @param {Transform} transform 
   * @param {Object} wallColor 
   * @param {WebGLTexture} wallTexture 
   */
  constructor(transform) {
    super(transform);
  }

  init() {
    // 건물 본체(벽면)
    const mainBodyPrimitives = [
      BoxPrimitive.fromWHDC(1.2, 2.5, 0.8, vec3(0, 0.2, 0)), // Tall main building
    ];
    this.children["mainBody"] = new HierarchyObject(
      mainBodyPrimitives,
      new Transform(),
      COLORS.GRAY,
      TEXTURES.BUILDING_SIDE_TEXTURE
    );

    // 지붕
    const roofPrimitives = [
      BoxPrimitive.fromWHDC(1.3, 0.1, 0.9, vec3(0, 1.5, 0)), // Flat roof
    ];
    this.children["roof"] = new HierarchyObject(
      roofPrimitives,
      new Transform(),
      COLORS.GRAY,
      null
    );

    // 입구 문
    const doorPrimitives = [
      BoxPrimitive.fromWHDC(0.25, 0.5, 0.05, vec3(0, -0.75, 0.4)), // Main entrance
    ];
    this.children["door"] = new HierarchyObject(
      doorPrimitives,
      new Transform(),
      COLORS.BROWN, // 문은 갈색
      null
    );

    // 창문들
    const windowPrimitives = [
      // Floor 1
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(-0.35, -0.2, 0.41)),
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(0.35, -0.2, 0.41)),
      // Floor 2
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(-0.35, 0.4, 0.41)),
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(0.35, 0.4, 0.41)),
      // Floor 3
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(-0.35, 1.0, 0.41)),
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(0.35, 1.0, 0.41)),
      // Side Windows
      BoxPrimitive.fromWHDC(0.05, 0.3, 0.3, vec3(0.55, 0.4, -0.2)),
      BoxPrimitive.fromWHDC(0.05, 0.3, 0.3, vec3(-0.55, 0.4, -0.2)),
    ];
    this.children["windows"] = new HierarchyObject(
      windowPrimitives,
      new Transform(),
      COLORS.SKY_BLUE, // 창문은 하늘색(유리 느낌?)
      null
    );
  }
}
