class RobotArmAnimator extends Animator {
  animationData = generateRobotArmAnimationData();
}

/**
 * 로봇팔 애니메이션 데이터를 생성합니다.
 * @returns {Array<Object[]>} 각 프레임은 {armData} 형태입니다.
 */
function generateRobotArmAnimationData() {
  const animationFrames = [];
  const totalSeconds = 6;
  const fps = 60;
  const numFrames = totalSeconds * fps;

  const rootTransform = new Transform();

  // 사용자 JSON 예제에서 제공된 초기 상태 값
  // _arm (로봇팔의 베이스가 되는 부분)
  const baseArmInitialPos = vec3(0, 1, 0);
  const baseArmInitialRot = vec3(0, 0, 30); // Y축 값(0)을 중심으로 좌우 흔들림 추가 예정
  const baseArmInitialAnchor = vec3(0, 0.5, 0);

  // innerArm1 (첫 번째 내부 팔)
  const innerArm1InitialPos = vec3(0, 1, 0);
  const innerArm1InitialRot = vec3(0, 0, 30); // Z축 값(30)을 중심으로 흔들림 추가 예정
  const innerArm1InitialAnchor = vec3(0, 0.5, 0);

  // innerArm2 (두 번째 내부 팔)
  const innerArm2InitialPos = vec3(0, 1, 0);
  const innerArm2InitialRot = vec3(0, 0, 30); // Z축 값(30)을 중심으로 흔들림 추가 예정
  const innerArm2InitialAnchor = vec3(0, 0.5, 0);

  // 애니메이션 파라미터
  const armSwayAmplitudeY = 25; // _arm의 Y축 회전 최대 각도 (degrees)
  const armSwayPeriodFrames = 2 * fps; // _arm이 한 사이클(좌->우->좌)을 도는 데 걸리는 프레임 (2초)

  const innerArm1SwayAmplitudeZ = 20; // innerArm1의 Z축 회전 최대 추가 각도 (degrees)
  const innerArm1SwayPeriodFrames = 1.5 * fps; // innerArm1의 흔들림 주기 (1.5초)

  const innerArm2SwayAmplitudeZ = 15; // innerArm2의 Z축 회전 최대 추가 각도 (degrees)
  const innerArm2SwayPeriodFrames = 1 * fps; // innerArm2의 흔들림 주기 (1초)

  for (let i = 0; i < numFrames; i++) {
    // _arm (베이스) 애니메이션: Y축 중심 좌우 흔들림
    const armSwayDeltaY =
      armSwayAmplitudeY * Math.sin((2 * Math.PI * i) / armSwayPeriodFrames);
    const currentArmRotY = baseArmInitialRot[1] + armSwayDeltaY;

    const armTransform = new Transform({
      position: baseArmInitialPos,
      rotation: vec3(
        baseArmInitialRot[0],
        currentArmRotY,
        baseArmInitialRot[2]
      ),
      anchor: baseArmInitialAnchor,
    });

    // innerArm1 애니메이션: Z축 중심 흔들림
    const innerArm1SwayDeltaZ =
      innerArm1SwayAmplitudeZ *
      Math.sin((2 * Math.PI * i) / innerArm1SwayPeriodFrames);
    const currentInnerArm1RotZ = innerArm1InitialRot[2] + innerArm1SwayDeltaZ;

    const innerArm1Transform = new Transform({
      position: innerArm1InitialPos,
      rotation: vec3(
        innerArm1InitialRot[0],
        innerArm1InitialRot[1],
        currentInnerArm1RotZ
      ),
      anchor: innerArm1InitialAnchor,
    });

    // innerArm2 애니메이션: Z축 중심 흔들림
    // 조금 다른 주파수나 위상으로 더 자연스럽게 만들 수 있습니다. 여기서는 주기를 다르게 설정합니다.
    const innerArm2SwayDeltaZ =
      innerArm2SwayAmplitudeZ *
      Math.sin((2 * Math.PI * i) / innerArm2SwayPeriodFrames);
    const currentInnerArm2RotZ = innerArm2InitialRot[2] + innerArm2SwayDeltaZ;

    const innerArm2Transform = new Transform({
      position: innerArm2InitialPos,
      rotation: vec3(
        innerArm2InitialRot[0],
        innerArm2InitialRot[1],
        currentInnerArm2RotZ
      ),
      anchor: innerArm2InitialAnchor,
    });

    // 프레임 데이터 구성 (사용자 JSON 형식에 맞춤)
    const frameDataForArm = {
      transform: rootTransform,
      children: {
        arm: {
          transform: armTransform,
          children: {
            innerArm: {
              // 첫 번째 innerArm
              transform: innerArm1Transform,
              children: {
                innerArm: {
                  // 두 번째 innerArm
                  transform: innerArm2Transform,
                  children: {}, // 이 예제에서 두 번째 innerArm은 더 이상 자식이 없음
                },
              },
            },
          },
        },
      },
    };

    // 각 프레임은 사용자가 제시한 것처럼 [{...}] 형태의 배열입니다.
    animationFrames.push(frameDataForArm);
  }

  return animationFrames;
}
