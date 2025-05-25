class RobotArm extends PrefabObject {
  init() {
    this.animator = new RobotArmAnimator(this);

    const _box = new BoxPrimitive([
      [-0.1, 0.5, 0.025],
      [0.1, 0.5, 0.025],
      [0.1, -0.5, 0.025],
      [-0.1, -0.5, 0.025],
      [-0.1, 0.5, -0.025],
      [0.1, 0.5, -0.025],
      [0.1, -0.5, -0.025],
      [-0.1, -0.5, -0.025],
    ]);

    // 가장 아래 팔(기본 색상 바탕에 빨강 하양 텍스처)
    // const _arm = new HierarchyObject([_box], new Transform(), null, TEXTURES.CHECKERBOARD_RED_WHITE);
    const _arm = new HierarchyObject([_box], new Transform(), COLORS.GRAY, TEXTURES.ROBOT_TEXTURE);

    // 그 다음 팔(세로 방향 그라데이션 텍스처)
    _arm.children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        }),
        COLORS.GRAY,
        //TEXTURES.GRADIENT_GREEN_YELLOW_H
        TEXTURES.ROBOT_TEXTURE
      ),
    };

    // 마지막 말단 팔(수직 줄무늬 텍스처)
    _arm.children["innerArm"].children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        }),
        COLORS.GRAY,
        //TEXTURES.STRIPES_RED_BLUE_V
        TEXTURES.ROBOT_TEXTURE
      ),
    };

    // 낚시대
    _arm.children["innerArm"].children["innerArm"].children = {
      fishingRod: new HierarchyObject(
        [new PrismPrimitive(vec3(0, 0, 0), 0.05, 2.0, 16)], // startPoint, radius, height, segments
        new Transform({
          position: vec3(0, 0.4, 0),
          rotation: vec3(0, 0, 20),
          anchor: vec3(0, 0.3, 0),
        }),
        COLORS.BROWN,
        null
      ),
    };

    // 낚시줄
    _arm.children["innerArm"].children["innerArm"].children["fishingRod"].children = {
      fishingLine: new HierarchyObject(
        [new PrismPrimitive(vec3(0, 0, 0), 0.01, 2.0, 8)],
        new Transform({
          position: vec3(1.4, 1.3, 0),
          rotation: vec3(0, 0, 45),
          anchor: vec3(0, 0, 0),
        }),
        COLORS.GRAY,
        null
      ),
    };

    // 미끼
    _arm.children["innerArm"].children["innerArm"].children["fishingRod"].children["fishingLine"].children = {
      bait: new HierarchyObject(
        [new PrismPrimitive(vec3(0, 0, 0), 0.08, 0.15, 8)],
        new Transform({
          position: vec3(0, 2, 0),
          rotation: vec3(0, 0, 0),
          anchor: vec3(0, 0, 0),
        }),
        COLORS.RED,
        null
      ),
    };

    this.children = {
      arm: _arm,
    };
  }
}
