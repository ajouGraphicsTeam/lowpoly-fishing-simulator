class Cloud extends PrefabObject {
  /**
   *
   * @param {Transform} transform
   * @param {number?} type  0 ~ 4 범위로써 null이면 랜덤. CloudPrimitives 배열 참고
   */
  constructor(transform, type = null) {
    super(transform);

    this.init();
  }

  /**
   *
   * @param {number?} type  0 ~ 4 범위로써 null이면 랜덤. CloudPrimitives 배열 참고
   */
  init(type) {
    type = type ?? Math.floor(Math.random() * CloudPrimitives.length);
    this.children["cloud"] = new HierarchyObject(
      CloudPrimitives[type],
      new Transform({
        scale: vec3(4, 1, 3),
      })
    );
  }
}

/**
 * a ~ b 범위를 8자 모양으로 돌아다니는 구름
 * @param {vec3} a range start
 * @param {vec3} b range end
 * @param {number} frame  60 * sec를 추천
 * @param {'XZ'|'XY'|'YZ'} plane - 8자 운동을 할 평면 (기본값 'XZ')
 * @param {number?} cloudType
 *
 * @returns {Cloud}
 */
function createFigure8FlyCloud(
  a = vec3(-40, 10, -20),
  b = vec3(-41, 10, 20),
  frame = 60 * 50,
  plane = "XZ",
  cloudType = null
) {
  const cloud = new Cloud(new Transform(), cloudType);
  cloud.flyAnimator = new Figure8FlyAnimator(cloud, a, b, frame, plane);
  cloud.flyAnimator.loop = true;
  cloud.flyAnimator.start();

  return cloud;
}

const ClassicPuffyCloudPrimitive = [
  // Base and Core
  BoxPrimitive.fromWHDC(1.0, 0.3, 0.8, vec3(0, -0.3, 0)), // 넓은 하단부
  BoxPrimitive.fromWHDC(0.8, 0.5, 0.7, vec3(0, 0, 0)), // 중앙 몸통
  BoxPrimitive.fromWHDC(0.7, 0.6, 0.6, vec3(0, 0.2, 0.05)), // 중앙 상단

  // Side Puffs (Left)
  BoxPrimitive.fromWHDC(0.5, 0.4, 0.5, vec3(-0.45, -0.1, 0)),
  BoxPrimitive.fromWHDC(0.4, 0.3, 0.4, vec3(-0.65, -0.2, 0.1)),
  // Side Puffs (Right)
  BoxPrimitive.fromWHDC(0.5, 0.4, 0.5, vec3(0.45, -0.1, 0)),
  BoxPrimitive.fromWHDC(0.4, 0.3, 0.4, vec3(0.65, -0.2, -0.05)),

  // Top Puffs
  BoxPrimitive.fromWHDC(0.4, 0.45, 0.4, vec3(0.1, 0.5, 0)),
  BoxPrimitive.fromWHDC(0.35, 0.35, 0.3, vec3(-0.2, 0.45, 0.1)),
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.25, vec3(0, 0.65, 0.05)), // Highest small puff

  // Front/Back Puffs
  BoxPrimitive.fromWHDC(0.4, 0.35, 0.45, vec3(0.1, -0.1, 0.4)), // Front
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.3, vec3(-0.15, -0.15, 0.55)), // Front lower
  BoxPrimitive.fromWHDC(0.4, 0.35, 0.45, vec3(-0.05, -0.05, -0.4)), // Back
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.3, vec3(0.1, -0.1, -0.6)), // Back lower

  // Small details
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.2, vec3(0.3, 0.3, 0.3)),
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.2, vec3(-0.35, 0.25, -0.25)),
];

const TallPuffyCloudPrimitive = [
  // Base
  BoxPrimitive.fromWHDC(0.9, 0.25, 0.7, vec3(0, -0.5, 0)), // 넓고 낮은 베이스

  // Lower Tower
  BoxPrimitive.fromWHDC(0.7, 0.5, 0.6, vec3(0, -0.2, 0)),
  BoxPrimitive.fromWHDC(0.6, 0.4, 0.5, vec3(0.1, -0.15, 0.1)), // slight offset

  // Mid Tower
  BoxPrimitive.fromWHDC(0.6, 0.6, 0.5, vec3(0, 0.25, -0.05)),
  BoxPrimitive.fromWHDC(0.5, 0.5, 0.45, vec3(-0.1, 0.3, 0.05)),

  // Upper Tower
  BoxPrimitive.fromWHDC(0.45, 0.7, 0.4, vec3(0.05, 0.7, 0)),
  BoxPrimitive.fromWHDC(0.35, 0.4, 0.3, vec3(-0.05, 0.9, -0.05)), // Top puff

  // Side details for volume
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.3, vec3(0.4, 0, 0.2)),
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.3, vec3(-0.4, 0.1, -0.15)),
  BoxPrimitive.fromWHDC(0.25, 0.4, 0.25, vec3(0.25, 0.5, 0.15)),
  BoxPrimitive.fromWHDC(0.25, 0.4, 0.25, vec3(-0.3, -0.3, 0.1)),

  // Small connecting puffs
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.2, vec3(0.1, 1.1, 0)), // Very top
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.2, vec3(0.3, -0.4, -0.2)),
  BoxPrimitive.fromWHDC(0.15, 0.15, 0.15, vec3(-0.2, 0.6, 0.25)),
];

const WideFlatBottomedCloudPrimitive = [
  // Flat Base (slightly offset to create a continuous bottom)
  BoxPrimitive.fromWHDC(0.8, 0.2, 0.5, vec3(-0.3, -0.2, 0)),
  BoxPrimitive.fromWHDC(0.9, 0.2, 0.6, vec3(0.2, -0.22, 0.1)), // Main base part
  BoxPrimitive.fromWHDC(0.7, 0.2, 0.4, vec3(0.7, -0.2, -0.05)),

  // Main Puffy Layer on top of base
  BoxPrimitive.fromWHDC(0.6, 0.4, 0.5, vec3(-0.4, 0, 0.05)),
  BoxPrimitive.fromWHDC(0.7, 0.5, 0.6, vec3(0.1, 0.05, -0.1)),
  BoxPrimitive.fromWHDC(0.6, 0.45, 0.45, vec3(0.6, 0, 0.15)),
  BoxPrimitive.fromWHDC(0.5, 0.35, 0.4, vec3(-0.1, 0.1, 0.3)), // Front puff

  // Smaller Top Puffs (more irregular)
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.3, vec3(-0.5, 0.25, -0.1)),
  BoxPrimitive.fromWHDC(0.25, 0.25, 0.2, vec3(-0.2, 0.3, 0.15)),
  BoxPrimitive.fromWHDC(0.3, 0.35, 0.25, vec3(0.15, 0.35, 0)),
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.2, vec3(0.4, 0.3, -0.2)),
  BoxPrimitive.fromWHDC(0.25, 0.3, 0.25, vec3(0.7, 0.25, 0.05)),
  BoxPrimitive.fromWHDC(0.3, 0.25, 0.3, vec3(0.3, 0.2, 0.3)), // Front-mid puff

  // Detail/Filler Puffs
  BoxPrimitive.fromWHDC(0.15, 0.15, 0.15, vec3(0, -0.1, -0.3)), // Back detail
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.18, vec3(0.5, -0.1, -0.25)), // Back-right detail
  BoxPrimitive.fromWHDC(0.18, 0.18, 0.18, vec3(-0.6, -0.05, 0.1)), // Side detail
  BoxPrimitive.fromWHDC(0.22, 0.22, 0.2, vec3(0.9, -0.05, -0.1)), // Far right detail
  BoxPrimitive.fromWHDC(0.15, 0.2, 0.15, vec3(0, 0.45, 0.1)), // Top small detail
  BoxPrimitive.fromWHDC(0.1, 0.1, 0.1, vec3(-0.3, 0.35, 0.3)), // Small front top detail
];

const SmallScatteredPuffsPrimitive = [
  // Central Puff
  BoxPrimitive.fromWHDC(0.6, 0.5, 0.5, vec3(0, 0, 0)), // Main body
  BoxPrimitive.fromWHDC(0.4, 0.4, 0.35, vec3(0.1, 0.2, 0.05)), // Top part of main

  // Scattered Puff 1 (Upper Left)
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.25, vec3(-0.4, 0.3, -0.1)),
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.15, vec3(-0.5, 0.2, -0.2)),

  // Scattered Puff 2 (Lower Right)
  BoxPrimitive.fromWHDC(0.35, 0.3, 0.3, vec3(0.5, -0.25, 0.1)),
  BoxPrimitive.fromWHDC(0.25, 0.2, 0.2, vec3(0.6, -0.35, 0)),

  // Scattered Puff 3 (Front)
  BoxPrimitive.fromWHDC(0.25, 0.2, 0.3, vec3(0, -0.1, 0.4)),

  // Scattered Puff 4 (Back Top)
  BoxPrimitive.fromWHDC(0.3, 0.25, 0.2, vec3(-0.1, 0.35, -0.3)),

  // Small connecting/floating bits
  BoxPrimitive.fromWHDC(0.15, 0.15, 0.1, vec3(0.2, 0.1, -0.35)),
  BoxPrimitive.fromWHDC(0.1, 0.1, 0.1, vec3(-0.25, -0.2, 0.25)),
  BoxPrimitive.fromWHDC(0.12, 0.12, 0.12, vec3(0.3, 0.4, 0.1)),
];

const ElongatedStretchedCloudPrimitive = [
  // Elongated Core (stretched along Z axis)
  BoxPrimitive.fromWHDC(0.5, 0.4, 1.0, vec3(0, 0, 0)), // Central long part
  BoxPrimitive.fromWHDC(0.4, 0.3, 0.8, vec3(0.05, -0.1, 0.2)), // Lower part, slightly offset
  BoxPrimitive.fromWHDC(0.4, 0.35, 0.7, vec3(-0.05, 0.1, -0.15)), // Upper part, slightly offset

  // Puffs along the top length
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.3, vec3(0.1, 0.3, 0.4)),
  BoxPrimitive.fromWHDC(0.25, 0.25, 0.25, vec3(-0.1, 0.35, 0)),
  BoxPrimitive.fromWHDC(0.3, 0.3, 0.3, vec3(0.05, 0.3, -0.45)),

  // Puffs along the bottom length
  BoxPrimitive.fromWHDC(0.35, 0.2, 0.35, vec3(-0.05, -0.3, 0.5)),
  BoxPrimitive.fromWHDC(0.3, 0.2, 0.3, vec3(0.1, -0.35, -0.05)),
  BoxPrimitive.fromWHDC(0.35, 0.2, 0.35, vec3(-0.1, -0.3, -0.6)),

  // Side/End Puffs (to round out X-axis ends)
  BoxPrimitive.fromWHDC(0.4, 0.35, 0.3, vec3(0.3, 0, 0.1)), // Right side
  BoxPrimitive.fromWHDC(0.3, 0.25, 0.25, vec3(0.4, -0.05, -0.1)), // Right side detail
  BoxPrimitive.fromWHDC(0.4, 0.35, 0.3, vec3(-0.3, 0, -0.05)), // Left side
  BoxPrimitive.fromWHDC(0.3, 0.25, 0.25, vec3(-0.4, 0.05, 0.15)), // Left side detail

  // Smaller details for texture
  BoxPrimitive.fromWHDC(0.2, 0.2, 0.2, vec3(0.2, 0.2, 0.7)), // Front top
  BoxPrimitive.fromWHDC(0.15, 0.15, 0.15, vec3(-0.15, 0.15, -0.75)), // Back top
  BoxPrimitive.fromWHDC(0.18, 0.18, 0.18, vec3(0.25, -0.2, 0.3)),
  BoxPrimitive.fromWHDC(0.18, 0.18, 0.18, vec3(-0.2, -0.15, -0.4)),
];

const CloudPrimitives = [
  ClassicPuffyCloudPrimitive,
  TallPuffyCloudPrimitive,
  WideFlatBottomedCloudPrimitive,
  SmallScatteredPuffsPrimitive,
  ElongatedStretchedCloudPrimitive,
];
