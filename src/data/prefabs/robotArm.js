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

    // 가장 아래 팔(테스트 용으로 null 전달했음, 기본 색상인 어두운 노란색으로 설정됨.)
    const _arm = new HierarchyObject([_box], new Transform(), null);

    // 그 다음 팔(초록색)
    _arm.children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        }),
        COLORS.GREEN
      ),
    };

    // 마지막 말단 팔(파란색)
    _arm.children["innerArm"].children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        }),
        COLORS.BLUE
      ),
    };

    this.children = {
      arm: _arm,
    };
  }
}
