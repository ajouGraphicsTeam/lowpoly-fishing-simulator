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

    const _arm = new HierarchyObject([_box], new Transform());
    _arm.children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        })
      ),
    };
    _arm.children["innerArm"].children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        })
      ),
    };

    this.children = {
      arm: _arm,
    };
  }
}
