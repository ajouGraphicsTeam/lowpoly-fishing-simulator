class SeagullAnimator extends Animator {
  animationData = generateSeagullFlappingAnimation();
}

// --- 애니메이션 데이터 생성 함수 ---

/**
 * 갈매기 날갯짓 애니메이션 데이터를 생성합니다.
 * 매 프레임마다 Transform 객체를 새로 생성합니다.
 * @returns {Array<Object[]>} 각 프레임은 [{seagullData}] 형태의 배열입니다.
 */
function generateSeagullFlappingAnimation() {
  // 초기 JSON 구조에 따른 기본 Transform 값들 저장 (수치 데이터로)
  const baseTransforms = {
    seagull: {
      position: [0, -0.8, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: [0, -0.8, 0],
    },
    torso: {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: [0, 0, 0],
    },
    head: {
      position: [0, 0.15, 0.35],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: [0, 0.15, 0.35],
    },
    leftWingBase: {
      position: [-0.15, 0.05, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: [-0.15, 0.05, 0],
    },
    rightWingBase: {
      position: [0.15, 0.05, 0],
      rotation: [0, 0, 0],
      scale: [-1, 1, 1],
      anchor: [0.15, 0.05, 0],
    },
    wingSegments: [
      // wing_0 부터 wing_4 순서
      {
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        anchor: [0, 0, 0],
      },
      {
        position: [0.4, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        anchor: [0.4, 0, 0],
      },
      {
        position: [0.5, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        anchor: [0.5, 0, 0],
      },
      {
        position: [0.45, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        anchor: [0.45, 0, 0],
      },
      {
        position: [0.35, 0, 0],
        rotation: [0, 0, 0],
        scale: [1, 1, 1],
        anchor: [0.35, 0, 0],
      },
    ],
  };

  const animationFrames = [];
  const durationSeconds = 3.5;
  const fps = 60;
  const numFrames = Math.floor(durationSeconds * fps);

  const flapsPerSecond = 1.8;
  const flapPeriodFrames = fps / flapsPerSecond;

  const wingSegRotationAmplitudesZ = [17, 23, 25, 22, 15];
  const wingSegPhaseDelayFactors = [0.0, 0.05, 0.1, 0.15, 0.2];

  const bodyBobAmplitude = 0.025;
  const bodyBobPeriodFrames = flapPeriodFrames / 2;

  for (let i = 0; i < numFrames; i++) {
    // 1. 현재 프레임의 동적 값 계산
    const bodyBobOffset =
      bodyBobAmplitude * Math.sin((2 * Math.PI * i) / bodyBobPeriodFrames);

    const animatedWingSegmentRotationsZ = [];
    for (let segIdx = 0; segIdx < 5; segIdx++) {
      const amplitude = wingSegRotationAmplitudesZ[segIdx];
      const phaseDelayFactor = wingSegPhaseDelayFactors[segIdx];
      const baseCycleTime = (2 * Math.PI * i) / flapPeriodFrames;
      const phaseOffsetRadians = 2 * Math.PI * phaseDelayFactor;
      const deltaRotationZ =
        amplitude *
        (Math.sin(baseCycleTime + phaseOffsetRadians) -
          Math.sin(phaseOffsetRadians));
      animatedWingSegmentRotationsZ.push(
        baseTransforms.wingSegments[segIdx].rotation[2] + deltaRotationZ
      );
    }

    // 2. 프레임 구조를 매번 새로 생성 (NEW Transform 객체 사용)

    // 날개 부분 계층 구조 생성 함수
    function buildAnimatedWingHierarchy(baseSegmentTransforms, animatedZs) {
      let previousSegmentData = null; // 마지막 마디(wing_4)부터 만들어 올라감
      for (let segIdx = 4; segIdx >= 0; segIdx--) {
        const baseSeg = baseSegmentTransforms[segIdx];
        const currentAnimatedZ = animatedZs[segIdx];
        const segmentNodeData = {
          transform: new Transform({
            position: vec3(baseSeg.position),
            rotation: vec3(
              baseSeg.rotation[0],
              baseSeg.rotation[1],
              currentAnimatedZ
            ),
            scale: vec3(baseSeg.scale),
            anchor: vec3(baseSeg.anchor),
          }),
        };
        if (previousSegmentData) {
          // 현재 마디가 날개 끝(wing_4)이 아니라면
          segmentNodeData.children = {
            [`wing_${segIdx + 1}`]: previousSegmentData,
          };
        }
        previousSegmentData = segmentNodeData;
      }
      return { wing_0: previousSegmentData }; // 최종적으로 { wing_0: { ... 중첩된 구조 ... } } 반환
    }

    const currentSeagullTransformProps = {
      position: vec3(
        baseTransforms.seagull.position[0],
        baseTransforms.seagull.position[1] + bodyBobOffset,
        baseTransforms.seagull.position[2]
      ),
      rotation: vec3(baseTransforms.seagull.rotation),
      scale: vec3(baseTransforms.seagull.scale),
      // anchor는 body bobbing과 관계없이 초기 고정값 사용 (또는 필요에 따라 동적 계산)
      anchor: vec3(baseTransforms.seagull.anchor),
    };
    if (
      baseTransforms.seagull.anchor[0] === baseTransforms.seagull.position[0] &&
      baseTransforms.seagull.anchor[1] === baseTransforms.seagull.position[1] &&
      baseTransforms.seagull.anchor[2] === baseTransforms.seagull.position[2]
    ) {
      // 만약 초기 anchor가 초기 position과 같다면, bobbing된 position을 anchor로 사용
      currentSeagullTransformProps.anchor = vec3(
        currentSeagullTransformProps.position
      );
    }

    const frameData = {
      transform: new Transform(currentSeagullTransformProps),
      children: {
        torso: {
          transform: new Transform({
            // Torso의 Transform은 base 값 그대로 사용
            position: vec3(baseTransforms.torso.position),
            rotation: vec3(baseTransforms.torso.rotation),
            scale: vec3(baseTransforms.torso.scale),
            anchor: vec3(baseTransforms.torso.anchor),
          }),
          children: {
            head: {
              transform: new Transform({
                // Head의 Transform도 base 값 그대로 사용
                position: vec3(baseTransforms.head.position),
                rotation: vec3(baseTransforms.head.rotation),
                scale: vec3(baseTransforms.head.scale),
                anchor: vec3(baseTransforms.head.anchor),
              }),
            },
            leftWing: {
              transform: new Transform({
                // LeftWing 베이스 Transform도 base 값 그대로 사용
                position: vec3(baseTransforms.leftWingBase.position),
                rotation: vec3(baseTransforms.leftWingBase.rotation),
                scale: vec3(baseTransforms.leftWingBase.scale),
                anchor: vec3(baseTransforms.leftWingBase.anchor),
              }),
              children: buildAnimatedWingHierarchy(
                baseTransforms.wingSegments,
                animatedWingSegmentRotationsZ
              ),
            },
            rightWing: {
              transform: new Transform({
                // RightWing 베이스 Transform도 base 값 그대로 사용
                position: vec3(baseTransforms.rightWingBase.position),
                rotation: vec3(baseTransforms.rightWingBase.rotation),
                scale: vec3(baseTransforms.rightWingBase.scale), // scale에 -1 포함
                anchor: vec3(baseTransforms.rightWingBase.anchor),
              }),
              children: buildAnimatedWingHierarchy(
                baseTransforms.wingSegments,
                animatedWingSegmentRotationsZ
              ),
            },
          },
        },
      },
    };
    animationFrames.push(frameData);
  }
  return animationFrames;
}

// --- 사용 예시 ---
// const seagullAnimation = generateSeagullFlappingAnimation();
// console.log(`(새로 생성 방식) 생성된 총 프레임 수: ${seagullAnimation.length}`);
// if (seagullAnimation.length > 0) {
//     function getWingSegRotZ(frameArray, frameIdx, side, segIdx) {
//         try {
//             return frameArray[frameIdx][0].children.torso.children[side].children[`wing_${segIdx}`].transform.rotation[2].toFixed(4);
//         } catch (e) { return "N/A"; }
//     }
//     function getSeagullPosY(frameArray, frameIdx) {
//         try {
//             return frameArray[frameIdx][0].transform.position[1].toFixed(4);
//         } catch (e) { return "N/A"; }
//     }

//     console.log("0번 프레임 데이터 (일부):");
//     console.log("  Seagull pos y:", getSeagullPosY(seagullAnimation, 0));
//     console.log("  Left Wing_0 rot z:", getWingSegRotZ(seagullAnimation, 0, 'leftWing', 0));
//     console.log("  Left Wing_4 rot z:", getWingSegRotZ(seagullAnimation, 0, 'leftWing', 4));

//     const midFrameIdx = Math.floor(seagullAnimation.length / 4);
//     console.log(`\n${midFrameIdx}번 프레임 데이터 (일부):`);
//     console.log("  Seagull pos y:", getSeagullPosY(seagullAnimation, midFrameIdx));
//     console.log("  Left Wing_0 rot z:", getWingSegRotZ(seagullAnimation, midFrameIdx, 'leftWing', 0));
//     console.log("  Left Wing_4 rot z:", getWingSegRotZ(seagullAnimation, midFrameIdx, 'leftWing', 4));

//     console.log(`\n마지막 프레임 (${seagullAnimation.length-1}) 데이터 (일부):`);
//     console.log("  Seagull pos y:", getSeagullPosY(seagullAnimation, seagullAnimation.length-1));
//     console.log("  Left Wing_0 rot z:", getWingSegRotZ(seagullAnimation, seagullAnimation.length-1, 'leftWing', 0));
// }
