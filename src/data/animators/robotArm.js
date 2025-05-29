class RobotArmAnimator extends Animator {
  animationData = generateRobotArmAnimationData();
}

class RobotArmCastingAnimator extends Animator {
  animationData = createCastingAnimationFrames(240);

  stop() {
    this.object.idleAnimator.start();
    super.stop();
  }
}

class RobotArmIdleFishingAnimator extends Animator {
  loop = true;
  animationData = createIdleFishingAnimationFrames(240);
}

class RobotArmReelingAnimator extends Animator {
  animationData = createReelingAnimationFrames(240);
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

/**
 * Linear interpolation function.
 * @param {number} start Start value.
 * @param {number} end End value.
 * @param {number} t Interpolation factor (0 to 1).
 * @returns {number} Interpolated value.
 */
function lerp(start, end, t) {
  return start * (1 - t) + end * t;
}

/**
 * Creates the full hierarchical pose for a single frame with new Transform instances.
 * This function is called for every frame to ensure fresh Transform objects.
 */
function createFreshPose() {
  // This structure must exactly match your RobotArm and FishingRod hierarchy definition
  return {
    transform: new Transform({
      position: vec3(0, 0, 0),
      rotation: vec3(0, 0, 0),
      scale: vec3(1, 1, 1),
      anchor: undefined,
    }),
    children: {
      arm: {
        transform: new Transform({
          position: vec3(0, 0, 0),
          rotation: vec3(0, 0, 0),
          scale: vec3(1, 1, 1),
          anchor: undefined,
        }),
        children: {
          innerArm: {
            // First innerArm (connected to base arm)
            transform: new Transform({
              position: vec3(0, 1, 0),
              rotation: vec3(0, 0, 30),
              scale: vec3(1, 1, 1),
              anchor: vec3(0, 0.5, 0),
            }),
            children: {
              innerArm: {
                // Second innerArm (end effector, holds fishingRod)
                transform: new Transform({
                  position: vec3(0, 1, 0),
                  rotation: vec3(0, 0, 30),
                  scale: vec3(1, 1, 1),
                  anchor: vec3(0, 0.5, 0),
                }),
                children: {
                  fishingRod: {
                    transform: new Transform({
                      position: vec3(0, 0, 0),
                      rotation: vec3(0, 0, 0),
                      scale: vec3(1, 1, 1),
                      anchor: undefined,
                    }),
                    children: {
                      rod: {
                        transform: new Transform({
                          position: vec3(0, 0.4, 0),
                          rotation: vec3(0, 0, 20),
                          scale: vec3(1, 1, 1),
                          anchor: vec3(0, 0.3, 0),
                        }),
                        children: {
                          line_0: {
                            transform: new Transform({
                              position: vec3(0, 2, 0),
                              rotation: vec3(0, 0, 45),
                              scale: vec3(1, 1, 1),
                              anchor: vec3(0, 2, 0),
                            }),
                            children: {
                              line_1: {
                                transform: new Transform({
                                  position: vec3(0, 0.2, 0),
                                  rotation: vec3(0, 0, 5),
                                  scale: vec3(1, 1, 1),
                                  anchor: vec3(0, 0.2, 0),
                                }),
                                children: {
                                  line_2: {
                                    transform: new Transform({
                                      position: vec3(0, 0.2, 0),
                                      rotation: vec3(0, 0, 5),
                                      scale: vec3(1, 1, 1),
                                      anchor: vec3(0, 0.2, 0),
                                    }),
                                    children: {
                                      line_3: {
                                        transform: new Transform({
                                          position: vec3(0, 0.2, 0),
                                          rotation: vec3(0, 0, 5),
                                          scale: vec3(1, 1, 1),
                                          anchor: vec3(0, 0.2, 0),
                                        }),
                                        children: {
                                          line_4: {
                                            transform: new Transform({
                                              position: vec3(0, 0.2, 0),
                                              rotation: vec3(0, 0, 5),
                                              scale: vec3(1, 1, 1),
                                              anchor: vec3(0, 0.2, 0),
                                            }),
                                            children: {
                                              line_5: {
                                                transform: new Transform({
                                                  position: vec3(0, 0.2, 0),
                                                  rotation: vec3(0, 0, 5),
                                                  scale: vec3(1, 1, 1),
                                                  anchor: vec3(0, 0.2, 0),
                                                }),
                                                children: {
                                                  line_6: {
                                                    transform: new Transform({
                                                      position: vec3(0, 0.2, 0),
                                                      rotation: vec3(0, 0, 5),
                                                      scale: vec3(1, 1, 1),
                                                      anchor: vec3(0, 0.2, 0),
                                                    }),
                                                    children: {
                                                      line_7: {
                                                        transform:
                                                          new Transform({
                                                            position: vec3(
                                                              0,
                                                              0.2,
                                                              0
                                                            ),
                                                            rotation: vec3(
                                                              0,
                                                              0,
                                                              5
                                                            ),
                                                            scale: vec3(
                                                              1,
                                                              1,
                                                              1
                                                            ),
                                                            anchor: vec3(
                                                              0,
                                                              0.2,
                                                              0
                                                            ),
                                                          }),
                                                        children: {
                                                          line_8: {
                                                            transform:
                                                              new Transform({
                                                                position: vec3(
                                                                  0,
                                                                  0.2,
                                                                  0
                                                                ),
                                                                rotation: vec3(
                                                                  0,
                                                                  0,
                                                                  5
                                                                ),
                                                                scale: vec3(
                                                                  1,
                                                                  1,
                                                                  1
                                                                ),
                                                                anchor: vec3(
                                                                  0,
                                                                  0.2,
                                                                  0
                                                                ),
                                                              }),
                                                            children: {
                                                              line_9: {
                                                                transform:
                                                                  new Transform(
                                                                    {
                                                                      position:
                                                                        vec3(
                                                                          0,
                                                                          0.2,
                                                                          0
                                                                        ),
                                                                      rotation:
                                                                        vec3(
                                                                          0,
                                                                          0,
                                                                          5
                                                                        ),
                                                                      scale:
                                                                        vec3(
                                                                          1,
                                                                          1,
                                                                          1
                                                                        ),
                                                                      anchor:
                                                                        vec3(
                                                                          0,
                                                                          0.2,
                                                                          0
                                                                        ),
                                                                    }
                                                                  ),
                                                                children: {
                                                                  bait: {
                                                                    transform:
                                                                      new Transform(
                                                                        {
                                                                          position:
                                                                            vec3(
                                                                              0,
                                                                              0.2,
                                                                              0
                                                                            ),
                                                                          rotation:
                                                                            vec3(
                                                                              0,
                                                                              0,
                                                                              0
                                                                            ),
                                                                          scale:
                                                                            vec3(
                                                                              1,
                                                                              1,
                                                                              1
                                                                            ),
                                                                          anchor:
                                                                            vec3(
                                                                              0,
                                                                              0,
                                                                              0
                                                                            ),
                                                                        }
                                                                      ),
                                                                  },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        },
                                                      },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };
}

/**
 * Generates frames for the "casting" animation.
 * Total duration: 4 seconds (240 frames at 60 FPS).
 * @returns {Array<Object>} An array of frame pose objects.
 */
function createCastingAnimationFrames() {
  const frames = [];
  const totalDurationSeconds = 4.0; // 8초로 변경
  const fps = 60;
  const numFrames = totalDurationSeconds * fps; // 240 프레임

  // Initial Z rotations from the default pose for reference
  const initialArm1RotZ = 30;
  const initialArm2RotZ = 30;
  const initialRodRotZ = 20;
  const initialLine0RotZ = 45;
  const initialLineXRotZ = 5; // For line_1 through line_9

  // Durations for each phase (총 4초에 맞게 비율 조정)
  const windUpDuration = 0.2 * numFrames; // 0.8초
  const forwardSwingDuration = 0.2 * numFrames; // 0.8초
  const lineFlyOutDuration = 0.2 * numFrames; // 0.8초
  const lineSettleDuration =
    numFrames - (windUpDuration + forwardSwingDuration + lineFlyOutDuration); // 나머지 1.6초

  for (let i = 0; i < numFrames; i++) {
    let currentFramePose = createFreshPose(); // Create a fresh pose for each frame

    // Get references to the transform objects we'll be animating
    let armTransform = currentFramePose.children.arm.transform; // Base arm
    let innerArm1Transform =
      currentFramePose.children.arm.children.innerArm.transform; // First innerArm
    let innerArm2Transform =
      currentFramePose.children.arm.children.innerArm.children.innerArm
        .transform; // Second innerArm
    let rodTransform =
      currentFramePose.children.arm.children.innerArm.children.innerArm.children
        .fishingRod.children.rod.transform;

    let lineTransforms = [];
    let currentLineParent =
      currentFramePose.children.arm.children.innerArm.children.innerArm.children
        .fishingRod.children.rod;
    for (let j = 0; j < 10; j++) {
      // line_0 to line_9
      const lineSegment = currentLineParent.children[`line_${j}`];
      lineTransforms.push(lineSegment.transform);
      currentLineParent = lineSegment;
    }
    let baitTransform = currentLineParent.children["bait"].transform;

    let armRotZ, arm1RotZ, arm2RotZ, rodRotZ, line0RotZ;
    let lineXRotZ = new Array(9).fill(0); // For line_1 to line_9
    let lineXScaleY = new Array(10).fill(1.0); // For line_0 to line_9

    if (i < windUpDuration) {
      // Phase 1: Wind-up
      const phaseT = i / (windUpDuration - 1);
      armRotZ = lerp(0, -30, phaseT); // Base arm also winds up slightly
      arm1RotZ = lerp(initialArm1RotZ, -15, phaseT);
      arm2RotZ = lerp(initialArm2RotZ, -25, phaseT);
      rodRotZ = lerp(initialRodRotZ, -60, phaseT); // Increased wind-back for rod
      line0RotZ = lerp(initialLine0RotZ, -60, phaseT);
      for (let k = 0; k < 9; k++)
        lineXRotZ[k] = lerp(initialLineXRotZ, -15, phaseT); // Lines curl back more
      for (let k = 0; k < 10; k++) lineXScaleY[k] = 1.0;
    } else if (i < windUpDuration + forwardSwingDuration) {
      // Phase 2: Forward Swing & Release
      const phaseT = (i - windUpDuration) / (forwardSwingDuration - 1);
      armRotZ = lerp(-30, 10, phaseT); // Base arm swings forward
      arm1RotZ = lerp(-15, 10, phaseT);
      arm2RotZ = lerp(-25, 10, phaseT);
      rodRotZ = lerp(-60, 20, phaseT); // Rod swings very fast and high
      line0RotZ = lerp(-60, 20, phaseT); // Line_0 projects forward sharply
      for (let k = 0; k < 9; k++) lineXRotZ[k] = lerp(-15, 2, phaseT); // Lines start to straighten rapidly
      for (let k = 0; k < 10; k++) lineXScaleY[k] = 1.0;
    } else if (i < windUpDuration + forwardSwingDuration + lineFlyOutDuration) {
      // Phase 3a: Line Flies Out, Extends, Straightens
      const phaseT =
        (i - (windUpDuration + forwardSwingDuration)) /
        (lineFlyOutDuration - 1);
      armRotZ = lerp(10, 15, phaseT); // Base arm begins to settle
      arm1RotZ = lerp(10, 15, phaseT); // Arm begins to settle
      arm2RotZ = lerp(10, 15, phaseT); // End effector begins to settle
      rodRotZ = lerp(20, 25, phaseT); // Rod settles to a casting angle
      line0RotZ = lerp(20, 35, phaseT); // Line_0 angle settles, still projecting
      for (let k = 0; k < 9; k++) lineXRotZ[k] = lerp(2, 1, phaseT); // Lines become very straight
      for (let k = 0; k < 10; k++) lineXScaleY[k] = lerp(1.0, 1.5, phaseT); // Lines extend to 1.5x length
      baitTransform.scale = vec3(1, 1 / lerp(1.0, 1.5, phaseT) ** 10, 1); // scale을 적용시켰더니 하위에도 적용 되어서 상쇄 시키기
    } else {
      // Phase 3b: Line Settles with Gravity
      const phaseT =
        (i - (windUpDuration + forwardSwingDuration + lineFlyOutDuration)) /
        (lineSettleDuration - 1);
      armRotZ = lerp(15, 10, phaseT); // Base arm fully settles
      arm1RotZ = lerp(15, 20, phaseT); // Arm fully settles
      arm2RotZ = lerp(15, 20, phaseT); // End effector fully settles
      rodRotZ = lerp(25, 30, phaseT); // Rod fully settles
      line0RotZ = lerp(35, 45, phaseT); // Line_0 shows some droop
      for (let k = 0; k < 9; k++) {
        // Segments further out (larger k) droop more
        lineXRotZ[k] = lerp(1, initialLineXRotZ + k * 1.8, phaseT);
      }
      for (let k = 0; k < 10; k++) lineXScaleY[k] = 2.5; // Lines remain extended
      baitTransform.scale = vec3(1, 1 / 1.5 ** 10, 1); // scale을 적용시켰더니 하위에도 적용 되어서 상쇄 시키기
    }

    armTransform.rotation = vec3(
      armTransform.rotation.X,
      armTransform.rotation.Y,
      armRotZ
    );
    innerArm1Transform.rotation = vec3(
      innerArm1Transform.rotation.X,
      innerArm1Transform.rotation.Y,
      arm1RotZ
    );
    innerArm2Transform.rotation = vec3(
      innerArm2Transform.rotation.X,
      innerArm2Transform.rotation.Y,
      arm2RotZ
    );
    rodTransform.rotation = vec3(
      rodTransform.rotation.X,
      rodTransform.rotation.Y,
      rodRotZ
    );

    lineTransforms[0].rotation = vec3(
      lineTransforms[0].rotation.X,
      lineTransforms[0].rotation.Y,
      line0RotZ
    );
    lineTransforms[0].scale = vec3(
      lineTransforms[0].scale.X,
      lineXScaleY[0],
      lineTransforms[0].scale.Z
    );

    for (let j = 1; j < 10; j++) {
      lineTransforms[j].rotation = vec3(
        lineTransforms[j].rotation.X,
        lineTransforms[j].rotation.Y,
        lineXRotZ[j - 1]
      );
      lineTransforms[j].scale = vec3(
        lineTransforms[j].scale.X,
        lineXScaleY[j],
        lineTransforms[j].scale.Z
      );
    }
    frames.push(currentFramePose);
  }
  return frames;
}

/**
 * Generates frames for the "idle fishing" animation (subtle sway).
 * Total duration: 4 seconds (240 frames at 60 FPS) for seamless looping.
 * @returns {Array<Object>} An array of frame pose objects.
 */
function createIdleFishingAnimationFrames() {
  const frames = [];
  const totalDurationSeconds = 4.0;
  const fps = 60;
  const numFrames = totalDurationSeconds * fps; // 240 frames

  // Starting state for idle fishing (from your casted state)
  const idleStartArmRotZ = 10;
  const idleStartInnerArm1RotZ = 20;
  const idleStartInnerArm2RotZ = 20;
  const idleStartRodRotZ = 30;
  const idleStartLine0RotZ = 45;
  const idleStartLineXRotZBase = 5; // InitialLineXRotZ for Line_1 to Line_9
  const idleStartLineScaleY = 2.5; // From casted state

  // Sway parameters
  const armSwayAmplitudeZ = 2; // Subtle sway for the base arm
  const innerArm1SwayAmplitudeZ = 3;
  const innerArm2SwayAmplitudeZ = 2;
  const rodSwayAmplitudeZ = 5; // Rod tip moves more
  const lineSwayAmplitudeZ = 8; // Line moves most significantly
  const baitSwayAmplitudeX = 0.05; // Bait moves left/right slightly
  const baitSwayAmplitudeY = 0.05; // Bait moves up/down slightly

  for (let i = 0; i < numFrames; i++) {
    let currentFramePose = createFreshPose();

    let armTransform = currentFramePose.children.arm.transform;
    let innerArm1Transform =
      currentFramePose.children.arm.children.innerArm.transform;
    let innerArm2Transform =
      currentFramePose.children.arm.children.innerArm.children.innerArm
        .transform;
    let rodTransform =
      currentFramePose.children.arm.children.innerArm.children.innerArm.children
        .fishingRod.children.rod.transform;

    let lineTransforms = [];
    let currentLineParent =
      currentFramePose.children.arm.children.innerArm.children.innerArm.children
        .fishingRod.children.rod;
    for (let j = 0; j < 10; j++) {
      const lineSegment = currentLineParent.children[`line_${j}`];
      lineTransforms.push(lineSegment.transform);
      currentLineParent = lineSegment; // Update currentLineParent for next iteration
    }
    let baitTransform = currentLineParent.children["bait"].transform;

    const timeFactor = (2 * Math.PI * i) / numFrames; // Ensures seamless loop (0 to 2PI)

    // Apply initial state values
    armTransform.rotation = vec3(
      armTransform.rotation.X,
      armTransform.rotation.Y,
      idleStartArmRotZ
    );
    innerArm1Transform.rotation = vec3(
      innerArm1Transform.rotation.X,
      innerArm1Transform.rotation.Y,
      idleStartInnerArm1RotZ
    );
    innerArm2Transform.rotation = vec3(
      innerArm2Transform.rotation.X,
      innerArm2Transform.rotation.Y,
      idleStartInnerArm2RotZ
    );
    rodTransform.rotation = vec3(
      rodTransform.rotation.X,
      rodTransform.rotation.Y,
      idleStartRodRotZ
    );

    lineTransforms[0].rotation = vec3(
      lineTransforms[0].rotation.X,
      lineTransforms[0].rotation.Y,
      idleStartLine0RotZ
    );
    lineTransforms[0].scale = vec3(
      lineTransforms[0].scale.X,
      idleStartLineScaleY,
      lineTransforms[0].scale.Z
    );

    for (let j = 1; j < 10; j++) {
      // Use the initial droop for starting, then add sway
      const initialDroop = idleStartLineXRotZBase + (j - 1) * 1.8; // k*1.8 from your casted state for line_XRotZ
      lineTransforms[j].rotation = vec3(
        lineTransforms[j].rotation.X,
        lineTransforms[j].rotation.Y,
        initialDroop
      );
      lineTransforms[j].scale = vec3(
        lineTransforms[j].scale.X,
        idleStartLineScaleY,
        lineTransforms[j].scale.Z
      );
    }
    baitTransform.scale = vec3(1, 1 / idleStartLineScaleY ** 10, 1); // Compensate scale

    // Add subtle swaying motion using sine waves
    armTransform.rotation = vec3(
      armTransform.rotation.X,
      armTransform.rotation.Y,
      idleStartArmRotZ + armSwayAmplitudeZ * Math.sin(timeFactor * 0.5)
    ); // Slower sway
    innerArm1Transform.rotation = vec3(
      innerArm1Transform.rotation.X,
      innerArm1Transform.rotation.Y,
      idleStartInnerArm1RotZ +
        innerArm1SwayAmplitudeZ * Math.sin(timeFactor * 0.7)
    );
    innerArm2Transform.rotation = vec3(
      innerArm2Transform.rotation.X,
      innerArm2Transform.rotation.Y,
      idleStartInnerArm2RotZ +
        innerArm2SwayAmplitudeZ * Math.sin(timeFactor * 0.9)
    );
    rodTransform.rotation = vec3(
      rodTransform.rotation.X,
      rodTransform.rotation.Y,
      idleStartRodRotZ + rodSwayAmplitudeZ * Math.sin(timeFactor * 1.0)
    ); // Main rod sway

    // Line and bait sway
    for (let j = 0; j < 10; j++) {
      // Line sway gets more pronounced further down
      const currentLineRotZ =
        lineTransforms[j].rotation.Z +
        lineSwayAmplitudeZ * (j / 9) * Math.sin(timeFactor * 1.2 + j * 0.1);
      lineTransforms[j].rotation = vec3(
        lineTransforms[j].rotation.X,
        lineTransforms[j].rotation.Y,
        currentLineRotZ
      );
    }

    // Bait specific motion
    const currentBaitPosX = baitSwayAmplitudeX * Math.sin(timeFactor * 1.5); // Left/right motion
    const currentBaitPosY = baitSwayAmplitudeY * Math.cos(timeFactor * 1.8); // Up/down motion (slight bobbing)
    baitTransform.position = vec3(
      baitTransform.position.X + currentBaitPosX,
      baitTransform.position.Y + currentBaitPosY,
      baitTransform.position.Z
    );

    frames.push(currentFramePose);
  }
  return frames;
}

/**
 * Generates frames for the "reeling in" animation.
 * Total duration: 4 seconds (240 frames at 60 FPS).
 * @returns {Array<Object>} An array of frame pose objects.
 */
function createReelingAnimationFrames() {
  const frames = [];
  const totalDurationSeconds = 4.0;
  const fps = 60;
  const numFrames = totalDurationSeconds * fps;

  // Start state for reeling (should match the end state of idle fishing or casting)
  const reelStartArmRotZ = 10;
  const reelStartInnerArm1RotZ = 20;
  const reelStartInnerArm2RotZ = 20;
  const reelStartRodRotZ = 30;
  const reelStartLine0RotZ = 45;
  const reelStartLineXRotZBase = 5; // For line_1 through line_9 (base droop)
  const reelStartLineScaleY = 2.5; // Extended line length

  // End state for reeling (closer to the initial 'ready' pose)
  const reelEndArmRotZ = 0;
  const reelEndInnerArm1RotZ = 30;
  const reelEndInnerArm2RotZ = 30;
  const reelEndRodRotZ = 20;
  const reelEndLine0RotZ = 45;
  const reelEndLineXRotZ = 5;
  const reelEndLineScaleY = 1.0; // Original line length

  // Animation phases
  const pullUpPhaseDuration = 0.7 * numFrames; // 낚시대를 들어 올리는 주 동작 (2.8초)
  const settlePhaseDuration = numFrames - pullUpPhaseDuration; // 자세 안정화 (1.2초)

  for (let i = 0; i < numFrames; i++) {
    let currentFramePose = createFreshPose();

    let armTransform = currentFramePose.children.arm.transform;
    let innerArm1Transform =
      currentFramePose.children.arm.children.innerArm.transform;
    let innerArm2Transform =
      currentFramePose.children.arm.children.innerArm.children.innerArm
        .transform;
    let rodTransform =
      currentFramePose.children.arm.children.innerArm.children.innerArm.children
        .fishingRod.children.rod.transform;

    let lineTransforms = [];
    let currentLineParent =
      currentFramePose.children.arm.children.innerArm.children.innerArm.children
        .fishingRod.children.rod;
    for (let j = 0; j < 10; j++) {
      const lineSegment = currentLineParent.children[`line_${j}`];
      lineTransforms.push(lineSegment.transform);
      currentLineParent = lineSegment;
    }
    let baitTransform = currentLineParent.children["bait"].transform;

    let armRotZ, innerArm1RotZ, innerArm2RotZ, rodRotZ, line0RotZ;
    let lineXRotZ = new Array(9).fill(0);
    let lineXScaleY = new Array(10).fill(0);

    if (i < pullUpPhaseDuration) {
      // Phase 1: Pulling up the rod and shortening the line
      const phaseT = i / (pullUpPhaseDuration - 1); // 0 to 1
      armRotZ = lerp(reelStartArmRotZ, reelEndArmRotZ, phaseT);
      innerArm1RotZ = lerp(
        reelStartInnerArm1RotZ,
        reelEndInnerArm1RotZ,
        phaseT
      );
      innerArm2RotZ = lerp(
        reelStartInnerArm2RotZ,
        reelEndInnerArm2RotZ,
        phaseT
      );
      rodRotZ = lerp(reelStartRodRotZ, reelEndRodRotZ, phaseT);

      // Line angles and scales change gradually
      line0RotZ = lerp(reelStartLine0RotZ, reelEndLine0RotZ, phaseT);
      for (let k = 0; k < 9; k++) {
        const initialDroop = reelStartLineXRotZBase + k * 1.8;
        lineXRotZ[k] = lerp(initialDroop, reelEndLineXRotZ, phaseT);
      }
      for (let k = 0; k < 10; k++) {
        lineXScaleY[k] = lerp(reelStartLineScaleY, reelEndLineScaleY, phaseT);
      }
      baitTransform.scale = vec3(1, 1 / lineXScaleY[9] ** 10, 1); // Compensate bait scale
    } else {
      // Phase 2: Settling into the final 'ready' pose
      const phaseT = (i - pullUpPhaseDuration) / (settlePhaseDuration - 1);
      armRotZ = lerp(reelEndArmRotZ, reelEndArmRotZ, phaseT); // Maintain final position
      innerArm1RotZ = lerp(reelEndInnerArm1RotZ, reelEndInnerArm1RotZ, phaseT);
      innerArm2RotZ = lerp(reelEndInnerArm2RotZ, reelEndInnerArm2RotZ, phaseT);
      rodRotZ = lerp(reelEndRodRotZ, reelEndRodRotZ, phaseT);

      line0RotZ = lerp(reelEndLine0RotZ, reelEndLine0RotZ, phaseT);
      for (let k = 0; k < 9; k++) {
        lineXRotZ[k] = lerp(reelEndLineXRotZ, reelEndLineXRotZ, phaseT);
      }
      for (let k = 0; k < 10; k++) {
        lineXScaleY[k] = lerp(reelEndLineScaleY, reelEndLineScaleY, phaseT);
      }
      baitTransform.scale = vec3(1, 1 / reelEndLineScaleY ** 10, 1); // Compensate bait scale
    }

    armTransform.rotation = vec3(
      armTransform.rotation.X,
      armTransform.rotation.Y,
      armRotZ
    );
    innerArm1Transform.rotation = vec3(
      innerArm1Transform.rotation.X,
      innerArm1Transform.rotation.Y,
      innerArm1RotZ
    );
    innerArm2Transform.rotation = vec3(
      innerArm2Transform.rotation.X,
      innerArm2Transform.rotation.Y,
      innerArm2RotZ
    );
    rodTransform.rotation = vec3(
      rodTransform.rotation.X,
      rodTransform.rotation.Y,
      rodRotZ
    );

    lineTransforms[0].rotation = vec3(
      lineTransforms[0].rotation.X,
      lineTransforms[0].rotation.Y,
      line0RotZ
    );
    lineTransforms[0].scale = vec3(
      lineTransforms[0].scale.X,
      lineXScaleY[0],
      lineTransforms[0].scale.Z
    );

    for (let j = 1; j < 10; j++) {
      lineTransforms[j].rotation = vec3(
        lineTransforms[j].rotation.X,
        lineTransforms[j].rotation.Y,
        lineXRotZ[j - 1]
      );
      lineTransforms[j].scale = vec3(
        lineTransforms[j].scale.X,
        lineXScaleY[j],
        lineTransforms[j].scale.Z
      );
    }
    frames.push(currentFramePose);
  }
  return frames;
}
