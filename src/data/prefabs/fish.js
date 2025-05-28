class Fish extends PrefabObject {
  init() {
    // FishHead의 원점을 Fish 프리팹의 원점으로 설정합니다.
    // FishHead는 자신의 로컬 +X 방향을 "앞쪽"으로 가정하고 모델링합니다.
    const head = new FishHead(
      new Transform({
        position: vec3(0, 0, 0), // FishHead의 기준 위치
        rotation: vec3(-90, 0, 0),
      })
    );

    // FishBody는 FishHead의 "뒤쪽"에 연결됩니다.
    // FishHead가 X축 기준으로 -0.15 ~ 0.15 정도의 길이를 가진다고 가정하면,
    // FishBody는 head의 x = -0.15 위치에서 시작합니다.
    const body = new FishBody(
      new Transform({
        position: vec3(0, 0, 0), // FishHead의 크기에 따라 이 값을 조절해야 합니다.
      })
    );

    this.children["head"] = head;
    head.children["body"] = body; // 사용자의 계층 구조: Fish -> Head -> Body
  }
}

class FishHead extends PrefabObject {
  init() {
    // 머리는 로컬 원점(0,0,0)을 중심으로 모델링합니다.
    // +X 방향을 물고기의 앞쪽(코 끝), -X 방향을 뒤쪽(몸통 연결부)으로 가정합니다.
    // 5개의 박스로 앞쪽으로 뾰족해지는 매끈한 삼각형 느낌의 머리 형태를 구성합니다.

    // 이 머리 디자인은 X축으로 대략 -0.125 (뒤) ~ +0.125 (앞) 범위입니다.
    // 몸통(FishBody)은 head의 x = -0.125 지점에서 시작하도록 Fish.init()에서 조정해야 합니다.
    this.primitives = [
      // 길이(X), 두께(Y), 높이(Z)
      BoxPrimitive.fromWHDC(0.1, 0.14, 0.18, vec3(0, 0, 0)),

      BoxPrimitive.fromWHDC(0.05, 0.08, 0.12, vec3(-0.075, 0, 0)),
    ];
  }
}

class FishBody extends PrefabObject {
  init() {
    const pectoralFinIdx = 1; // 가슴 지느러미가 붙을 몸통 마디 인덱스
    const dorsalFinIdx = 2; // 등 지느러미가 붙을 몸통 마디 인덱스

    // 몸통 마디 정의: l(길이, X축), t(두께, Y축), c(높이, Z축)
    const bodySegDims = [
      { l: 0.12, t: 0.18, c: 0.22 }, // s0 (머리에 가까운 부분)
      { l: 0.18, t: 0.2, c: 0.25 }, // s1 (가장 두껍고 높은 부분) - 가슴 지느러미 위치
      { l: 0.15, t: 0.17, c: 0.2 }, // s2 (점점 가늘어짐) - 등 지느러미 위치
      { l: 0.12, t: 0.12, c: 0.15 }, // s3 (꼬리로 이어지는 부분)
      { l: 0.08, t: 0.08, c: 0.1 }, // s4 (꼬리 시작 전 가장 가는 부분)
    ];

    var parent = this; // this는 FishBody 인스턴스
    var position = vec3(0, 0, 0); // 첫 번째 마디는 FishBody의 원점에서 시작
    let lastBodySegmentLength = 0;

    bodySegDims.forEach(({ l, t, c }, idx) => {
      // 현재 마디 생성
      // BoxPrimitive.fromWHDC(길이, 두께, 높이, 중심오프셋)
      // 중심오프셋 vec3(l/2,0,0) 은 마디의 앞쪽 끝이 로컬 (0,0,0)에 오도록 함
      const _bodySegment = new HierarchyObject(
        [BoxPrimitive.fromWHDC(l, t, c, vec3(l / 2, 0, 0))],
        new Transform({ position: vec3(position) }) // position은 이전 마디 끝을 기준으로 계산됨
      );

      parent.children[`body_${idx}`] = _bodySegment;

      // TODO: 추가로 조그마한 등지느러미? (윗면, 즉 +Z 또는 -Z 방향)
      if (idx === dorsalFinIdx) {
        // 등 지느러미 프리미티브: 두께(X), 길이(Y, 몸통 축방향), 높이(Z)
        // 로컬 Z+ 방향으로 솟아오르도록 모델링 (중심점 조절)
        const dorsalFinPrim = BoxPrimitive.fromWHDC(
          0.02,
          l * 0.7,
          0.06,
          vec3(0, 0, 0.06 / 2)
        );
        const dorsalFin = new HierarchyObject(
          [dorsalFinPrim],
          new Transform({
            // 몸통 마디의 등 중앙에 위치
            position: vec3(l / 2, 0, c / 2 - 0.01), // 마디의 중심선에서 Z+ 방향으로 살짝
            rotation: vec3(10, 0, 90), // 약간 뒤로 눕도록 X축 회전
          })
        );
        _bodySegment.children["dorsalFin"] = dorsalFin;
      }

      // TODO: 가슴 지느러미 달기 (옆면, 즉 +Y 또는 -Y 방향)
      if (idx === pectoralFinIdx) {
        // 가슴 지느러미 프리미티브: 길이(X, 몸에서 뻗어나옴), 두께(Y), 높이(Z)
        // 로컬 X+ 방향으로 뻗어나오도록 모델링
        const pectoralFinPrim = BoxPrimitive.fromWHDC(
          0.18,
          0.02,
          0.1,
          vec3(0.18 / 2, 0, 0)
        );

        const leftPectoralFin = new HierarchyObject(
          [pectoralFinPrim],
          new Transform({
            // 몸통 마디의 옆구리 중앙 (-Y 방향)
            position: vec3(l * 0.3, -t / 2, 0),
            rotation: vec3(0, -25, -30), // Y축: 뒤로 쓸리듯, Z축: 아래로 펼쳐지듯
          })
        );
        _bodySegment.children["leftPectoralFin"] = leftPectoralFin;

        const rightPectoralFin = new HierarchyObject(
          [pectoralFinPrim], // 같은 프리미티브 사용
          new Transform({
            // 몸통 마디의 옆구리 중앙 (+Y 방향)
            position: vec3(l * 0.3, t / 2, 0),
            rotation: vec3(0, -25, 30), // 대칭적인 회전
          })
        );
        _bodySegment.children["rightPectoralFin"] = rightPectoralFin;
      }

      parent = _bodySegment; // 다음 마디는 현재 마디의 자식이 됨
      position = vec3(l, 0, 0); // 다음 마디의 시작 위치는 현재 마디의 길이만큼 +X 방향
      if (idx === bodySegDims.length - 1) {
        lastBodySegmentLength = l;
      }
    });

    // 마지막 몸통 마디의 끝에 꼬리 연결
    parent.children["tail"] = new FishTail(
      new Transform({ position: vec3(lastBodySegmentLength, 0, 0) })
    );
  }
}

class FishTail extends PrefabObject {
  init() {
    // 꼬리 마디 정의: l(길이, X축), t(두께, Y축), c(높이/폭, Z축)
    const tailSegDims = [
      { l: 0.06, t: 0.06, c: 0.06 }, // s0 (꼬리 시작, peduncle 역할)
      { l: 0.04, t: 0.02, c: 0.2 }, // s1 (지느러미 시작, 넓게 퍼짐)
      { l: 0.05, t: 0.015, c: 0.28 }, // s2 (지느러미 끝, 더 넓게)
    ];

    var parent = this; // this는 FishTail 인스턴스
    var position = vec3(0, 0, 0); // 첫 마디는 FishTail의 원점에서 시작
    let lastTailSegmentLength = 0;

    tailSegDims.forEach(({ l, t, c }, idx) => {
      const _tailSegment = new HierarchyObject(
        [BoxPrimitive.fromWHDC(l, t, c, vec3(l / 2, 0, 0))],
        new Transform({ position: vec3(position) })
      );

      parent.children[`tail_${idx}`] = _tailSegment;
      parent = _tailSegment;
      position = vec3(l, 0, 0);
      lastTailSegmentLength = l; // 마지막 마디의 길이를 저장해둘 필요는 현재 없음
    });
  }
}
