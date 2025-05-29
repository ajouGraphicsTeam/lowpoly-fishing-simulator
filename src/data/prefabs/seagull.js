class Seagull extends PrefabObject {
  init() {
    this.animator = new SeagullAnimator(this);
    this.animator.loop = true;

    const torso = new HierarchyObject(
      [BoxPrimitive.fromWHDC(0.3, 0.25, 0.7)],
      new Transform({ position: vec3(0, 0, 0) })
    );

    const head = new HierarchyObject(
      [BoxPrimitive.fromWHDC(0.18, 0.18, 0.22)],
      new Transform({
        position: vec3(0, 0.15, 0.35), // Forward, slightly up from torso center
      })
    );

    this.children["torso"] = torso;
    torso.children = {
      head,
      leftWing: new Wing(
        new Transform({
          position: vec3(-0.15, 0.05, 0), // Body left side // Slightly above body center // Mid-point of torso length-wise for Z
        })
      ),
      rightWing: new Wing(
        new Transform({
          position: vec3(0.15, 0.05, 0), // Body left side // Slightly above body center // Mid-point of torso length-wise for Z
          scale: vec3(-1, 1, 1),
        })
      ),
    };
  }
}

/**
 * 기본적으로 왼쪽 윙이라 오른쪽에 사용할때는 `scale: vec3(-1, 1, 1)`
 */
class Wing extends PrefabObject {
  init() {
    const wingSegDims = [
      // Dimensions: length (along span), thickness (height), chord (depth)
      { l: 0.4, t: 0.06, c: 0.25 }, // s1 (shoulder)
      { l: 0.5, t: 0.05, c: 0.22 }, // s2
      { l: 0.45, t: 0.04, c: 0.19 }, // s3
      { l: 0.35, t: 0.03, c: 0.15 }, // s4 (towards tip)
      { l: 0.25, t: 0.02, c: 0.12 }, // s5 (tip)
    ];

    var parent = this;
    var position = vec3(0, 0, 0);
    wingSegDims.forEach(({ l, t, c }, idx) => {
      const _wing = new HierarchyObject(
        [BoxPrimitive.fromWHDC(l, t, c, vec3(l / 2, 0, 0))],
        new Transform({ position })
      );

      parent.children[`wing_${idx}`] = _wing;

      parent = _wing;
      position = vec3(l, 0, 0);
    });
  }
}

/**
 * a ~ b 범위를 원형으로 돌아다니는 갈매기
 * @param {vec3} a range start
 * @param {vec3} b range end
 * @param {number} frame  60 * sec를 추천
 * @param {'XZ'|'XY'|'YZ'} plane - 원형 운동을 할 평면 (기본값 'XZ')
 *
 * @returns {Seagull}
 */
function createCircularFlySeagull(
  a = vec3(-40, 10, -20),
  b = vec3(0, 10, 20),
  frame = 60 * 10,
  plane = "XZ"
) {
  const seagull = new Seagull();
  seagull.flyAnimator = new CircularFlyAnimator(seagull, a, b, frame, plane);
  seagull.flyAnimator.loop = true;
  seagull.animator.start();
  seagull.flyAnimator.start(); // 나중에 시작된게(현재 Animator) 앞에거(SeagullAnimator)를 덮어쓴다

  return seagull;
}

/**
 * a ~ b 범위를 8자 모양으로 돌아다니는 갈매기
 * @param {vec3} a range start
 * @param {vec3} b range end
 * @param {number} frame  60 * sec를 추천
 * @param {'XZ'|'XY'|'YZ'} plane - 8자 운동을 할 평면 (기본값 'XZ')
 *
 * @returns {Seagull}
 */
function createFigure8FlySeagull(
  a = vec3(-40, 10, -20),
  b = vec3(0, 10, 20),
  frame = 60 * 10,
  plane = "XZ"
) {
  const seagull = new Seagull();
  seagull.flyAnimator = new Figure8FlyAnimator(seagull, a, b, frame, plane);
  seagull.flyAnimator.loop = true;
  seagull.animator.start();
  seagull.flyAnimator.start(); // 나중에 시작된게(현재 Animator) 앞에거(SeagullAnimator)를 덮어쓴다

  return seagull;
}

/**
 * a ~ b 범위를 무작위로 돌아다니는 갈매기
 * @param {vec3} a range start
 * @param {vec3} b range end
 * @param {number} frame  60 * sec를 추천
 * @param {number} numWaypoints - 생성할 경유지점 수 (0이면 자동 계산)
 *
 * @returns {Seagull}
 */
function createRandomFlySeagull(
  a = vec3(-40, 10, -20),
  b = vec3(0, 10, 20),
  frame = 60 * 10,
  numWaypoints = 0
) {
  const seagull = new Seagull();
  seagull.flyAnimator = new RandomFlyAnimator(
    seagull,
    a,
    b,
    frame,
    numWaypoints
  );
  seagull.flyAnimator.loop = true;
  seagull.animator.start();
  seagull.flyAnimator.start(); // 나중에 시작된게(현재 Animator) 앞에거(SeagullAnimator)를 덮어쓴다

  return seagull;
}
