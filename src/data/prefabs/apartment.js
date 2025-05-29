// 아파트 Prefab
class Apartment extends PrefabObject {
  init() {
    this.primitives = [
      // Main Body
      BoxPrimitive.fromWHDC(1.2, 2.5, 0.8, vec3(0, 0.2, 0)), // Tall main building

      // Roof (flat for apartment)
      BoxPrimitive.fromWHDC(1.3, 0.1, 0.9, vec3(0, 1.5, 0)), // Flat roof

      // Entrance Door
      BoxPrimitive.fromWHDC(0.25, 0.5, 0.05, vec3(0, -0.75, 0.4)), // Main entrance

      // Windows (Multiple floors)
      // Floor 1
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(-0.35, -0.2, 0.41)),
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(0.35, -0.2, 0.41)),
      // Floor 2
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(-0.35, 0.4, 0.41)),
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(0.35, 0.4, 0.41)),
      // Floor 3
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(-0.35, 1.0, 0.41)),
      BoxPrimitive.fromWHDC(0.2, 0.3, 0.05, vec3(0.35, 1.0, 0.41)),
      // Side Windows (optional, just for detail)
      BoxPrimitive.fromWHDC(0.05, 0.3, 0.3, vec3(0.55, 0.4, -0.2)),
      BoxPrimitive.fromWHDC(0.05, 0.3, 0.3, vec3(-0.55, 0.4, -0.2)),
    ];
  }
}
