class RobotArm extends PrefabObject {
  init() {
    this.animator = new RobotArmAnimator(this);
    this.castingAnimator = new RobotArmCastingAnimator(this);
    this.idleAnimator = new RobotArmIdleFishingAnimator(this);
    this.reelingAnimator = new RobotArmReelingAnimator(this);

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

    // 가장 아래 팔
    const _arm = new HierarchyObject(
      [_box],
      new Transform(),
      COLORS.GRAY,
      TEXTURES.ROBOT_TEXTURE
    );

    // 그 다음 팔
    _arm.children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        }),
        COLORS.GRAY,
        TEXTURES.ROBOT_TEXTURE
      ),
    };

    // 마지막 말단 팔
    _arm.children["innerArm"].children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        }),
        COLORS.GRAY,
        TEXTURES.ROBOT_TEXTURE
      ),
    };

    // 낚시대
    _arm.children["innerArm"].children["innerArm"].children = {
      fishingRod: new FishingRod(),
    };

    this.children = {
      arm: _arm,
    };
  }
}
