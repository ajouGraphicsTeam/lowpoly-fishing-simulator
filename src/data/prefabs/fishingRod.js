class FishingRod extends PrefabObject {
  init() {
    // 낚시대
    const _rod = new HierarchyObject(
      [new PrismPrimitive(vec3(0, 0, 0), 0.05, 2.0, 16)], // startPoint, radius, height, segments
      new Transform({
        position: vec3(0, 0.4, 0),
        rotation: vec3(0, 0, 20),
        anchor: vec3(0, 0.3, 0),
      }),
      COLORS.BROWN,
      null
    );

    // 낚시줄
    const len = 2;
    const numOfLine = 10;
    let parent = _rod;
    for (i = 0; i < numOfLine; i++) {
      const _line = new HierarchyObject(
        [new PrismPrimitive(vec3(0, 0, 0), 0.01, len / numOfLine, 8)],
        new Transform({
          position: vec3(0, len / numOfLine, 0),
          rotation: vec3(0, 0, 5),
          anchor: vec3(0, len / numOfLine, 0),
        }),
        COLORS.GRAY,
        null
      );
      console.log(`line_${i}`, _line);
      parent.children[`line_${i}`] = _line;
      parent = _line;
    }
    _rod.children["line_0"].transform = new Transform({
      position: vec3(0, 2, 0),
      rotation: vec3(0, 0, 45),
      anchor: vec3(0, 2, 0),
    });

    // 미끼
    this.bait = new HierarchyObject(
      [new PrismPrimitive(vec3(0, 0, 0), 0.08, 0.15, 8)],
      new Transform({
        position: vec3(0, len / numOfLine, 0),
        rotation: vec3(0, 0, 0),
        anchor: vec3(0, 0, 0),
      }),
      COLORS.RED,
      null
    );
    parent.children["bait"] = this.bait;

    this.children["rod"] = _rod;
  }
}
