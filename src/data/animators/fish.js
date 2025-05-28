class FishAnimator extends Animator {
  animationData = generateFishSwimmingAnimation();
}

// --- 필요한 유틸리티 및 클래스 (실제 환경에서는 이미 정의되어 있어야 함) ---
// vec3 및 Transform 클래스는 이전 답변과 동일하게 사용 가능하다고 가정합니다.
// (이 코드 블록 하단에 테스트용 모의(Mock) 클래스를 다시 포함했습니다.)

// --- 애니메이션 데이터 생성 함수 ---

/**
 * 물고기 파닥이는 애니메이션 데이터를 생성합니다.
 * @returns {Array<Object[]>} 각 프레임은 [{fishData}] 형태의 배열입니다.
 */
function generateFishSwimmingAnimation() {
  // 사용자가 제공한 JSON 구조와 값을 기반으로 한 초기 포즈 데이터 (수치 배열 사용)
  const fishBasePose = {
    transform: {
      position: [0, 5, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
      anchor: [0, 5, 0],
    },
    children: {
      head: {
        transform: {
          position: [0, 0, 0],
          rotation: [-90, -180, 0],
          scale: [1, 1, 1],
          anchor: [0, 0, 0],
        },
        children: {
          body: {
            transform: {
              position: [0, 0, 0],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
              anchor: [0, 0, 0],
            },
            children: {
              body_0: {
                transform: {
                  position: [0, 0, 0],
                  rotation: [0, 0, 0],
                  scale: [1, 1, 1],
                  anchor: [0, 0, 0],
                },
                children: {
                  body_1: {
                    transform: {
                      position: [0.12, 0, 0],
                      rotation: [0, 0, 0],
                      scale: [1, 1, 1],
                      anchor: [0.12, 0, 0],
                    },
                    children: {
                      leftPectoralFin: {
                        transform: {
                          position: [0.054, -0.1, 0],
                          rotation: [0, -25, -30],
                          scale: [1, 1, 1],
                          anchor: [0.054, -0.1, 0],
                        },
                      },
                      rightPectoralFin: {
                        transform: {
                          position: [0.054, 0.1, 0],
                          rotation: [0, -25, 30],
                          scale: [1, 1, 1],
                          anchor: [0.054, 0.1, 0],
                        },
                      },
                      body_2: {
                        transform: {
                          position: [0.18, 0, 0],
                          rotation: [0, 0, 0],
                          scale: [1, 1, 1],
                          anchor: [0.18, 0, 0],
                        },
                        children: {
                          dorsalFin: {
                            transform: {
                              position: [0.075, 0, 0.09],
                              rotation: [10, 0, 90],
                              scale: [1, 1, 1],
                              anchor: [0.075, 0, 0.09],
                            },
                          },
                          body_3: {
                            transform: {
                              position: [0.15, 0, 0],
                              rotation: [0, 0, 0],
                              scale: [1, 1, 1],
                              anchor: [0.15, 0, 0],
                            },
                            children: {
                              body_4: {
                                transform: {
                                  position: [0.12, 0, 0],
                                  rotation: [0, 0, 0],
                                  scale: [1, 1, 1],
                                  anchor: [0.12, 0, 0],
                                },
                                children: {
                                  tail: {
                                    transform: {
                                      position: [0.08, 0, 0],
                                      rotation: [0, 0, 0],
                                      scale: [1, 1, 1],
                                      anchor: [0.08, 0, 0],
                                    },
                                    children: {
                                      tail_0: {
                                        transform: {
                                          position: [0, 0, 0],
                                          rotation: [0, 0, 0],
                                          scale: [1, 1, 1],
                                          anchor: [0, 0, 0],
                                        },
                                        children: {
                                          tail_1: {
                                            transform: {
                                              position: [0.06, 0, 0],
                                              rotation: [0, 0, 0],
                                              scale: [1, 1, 1],
                                              anchor: [0.06, 0, 0],
                                            },
                                            children: {
                                              tail_2: {
                                                transform: {
                                                  position: [0.04, 0, 0],
                                                  rotation: [0, 0, 0],
                                                  scale: [1, 1, 1],
                                                  anchor: [0.04, 0, 0],
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

  const animationFrames = [];
  const durationSeconds = 4;
  const fps = 60;
  const numFrames = durationSeconds * fps;

  // 애니메이션 파라미터
  const bodyWavePeriodFrames = fps * 1.25; // 몸통 전체가 한 번 휘는데 1.25초
  const bodySegMaxRotY = [8, 12, 16, 20, 24]; // body_0 ~ body_4 Y축 회전 진폭 (degrees)
  const tailSegMaxRotY = [28, 32, 36]; // tail_0 ~ tail_2 Y축 회전 진폭 (degrees)
  const segmentPhaseDelayFactor = 0.08; // 각 마디의 위상 지연 (전체 주기의 비율)

  const pectoralFinFlapPeriodFrames = fps * 0.6; // 가슴 지느러미 파닥임 주기 0.6초
  const pectoralFinMaxDeltaRotZ = 25; // 가슴 지느러미 Z축 회전 변화량 (degrees)

  const dorsalFinSwayPeriodFrames = bodyWavePeriodFrames * 0.8;
  const dorsalFinMaxDeltaRotY = 6; // 등 지느러미 Y축 회전 변화량 (degrees)  Y축이긴한데 물고기 자체가 90도 회전된 상태라 z축에 사용됨

  const rootBobPeriodFrames = fps * 1.5; // 물고기 전체 상하 움직임 주기 1.5초
  const rootBobAmplitude = 0.03; // 상하 움직임 진폭

  for (let frameIdx = 0; frameIdx < numFrames; frameIdx++) {
    // --- 현재 프레임의 모든 Transform 객체를 새로 생성하며 구조 구성 ---

    // 1. Fish 루트 애니메이션 (상하 움직임)
    const rootBaseTransform = fishBasePose.transform;
    const rootBobOffset =
      rootBobAmplitude *
      (Math.sin((2 * Math.PI * frameIdx) / rootBobPeriodFrames) - Math.sin(0)); // 프레임 0에서 0
    const currentRootTransform = new Transform({
      position: vec3(
        rootBaseTransform.position[0],
        rootBaseTransform.position[1] + rootBobOffset,
        rootBaseTransform.position[2]
      ),
      rotation: vec3(rootBaseTransform.rotation), // 루트 회전은 고정
      scale: vec3(rootBaseTransform.scale),
      anchor: vec3(rootBaseTransform.anchor), // 앵커도 고정 또는 위치 따라 변경 가능
    });
    // 만약 앵커가 항상 포지션과 같다면: currentRootTransform.anchor = vec3(currentRootTransform.position);

    // 2. Head 애니메이션 (기본값 유지)
    const headBaseTransform = fishBasePose.children.head.transform;
    const currentHeadTransform = new Transform({ ...headBaseTransform }); // 기본값으로 새로 생성

    // 3. Body (인스턴스) 애니메이션 (기본값 유지)
    const bodyBaseTransform =
      fishBasePose.children.head.children.body.transform;
    const currentBodyTransform = new Transform({ ...bodyBaseTransform });

    // 프레임 데이터 구조 생성 시작
    const currentFrameData = {
      transform: currentRootTransform,
      children: {
        head: {
          transform: currentHeadTransform,
          children: {
            body: {
              transform: currentBodyTransform,
              children: {}, // 몸통 마디들을 여기에 채워나갈 예정
            },
          },
        },
      },
    };

    // 4. 몸통 마디 (body_0 ~ body_4) 애니메이션 (Y축 회전 파동)
    let parentNodeInFrame = currentFrameData.children.head.children.body; // body_0의 부모
    let cumulativePhaseDelay = 0;

    for (let segIdx = 0; segIdx < 5; segIdx++) {
      const segName = `body_${segIdx}`;
      // 초기값 경로: fishBasePose.children.head.children.body.children.body_0.children.body_1... (구조가 복잡)
      // 초기값 접근을 위한 간단한 경로 생성 로직 (실제로는 더 견고해야 함)
      let baseSegNode = fishBasePose.children.head.children.body;
      for (let k = 0; k <= segIdx; k++) {
        baseSegNode = baseSegNode.children[`body_${k}`];
      }
      const segBaseTransform = baseSegNode.transform;

      cumulativePhaseDelay = 2 * Math.PI * segmentPhaseDelayFactor * segIdx;
      const mainCycleTime = (2 * Math.PI * frameIdx) / bodyWavePeriodFrames;
      const deltaRotY =
        bodySegMaxRotY[segIdx] *
          (Math.sin(mainCycleTime + cumulativePhaseDelay) -
            Math.sin(cumulativePhaseDelay)) +
        bodySegMaxRotY[segIdx] / 2;

      const currentSegRotation = vec3(segBaseTransform.rotation);
      currentSegRotation[2] = segBaseTransform.rotation[2] + deltaRotY; // Y축 회전에만 애니메이션 적용

      const currentSegNode = {
        transform: new Transform({
          position: vec3(segBaseTransform.position),
          rotation: currentSegRotation,
          scale: vec3(segBaseTransform.scale),
          anchor: vec3(segBaseTransform.anchor),
        }),
        children: {}, // 다음 마디 또는 지느러미를 위한 공간
      };
      parentNodeInFrame.children[segName] = currentSegNode;

      // 특정 마디에 지느러미 추가
      if (segIdx === 1) {
        // body_1 (pectoralFinIdx)
        const pecLBase =
          fishBasePose.children.head.children.body.children.body_0.children
            .body_1.children.leftPectoralFin.transform;
        const pecRBase =
          fishBasePose.children.head.children.body.children.body_0.children
            .body_1.children.rightPectoralFin.transform;
        const deltaPecRotZ =
          pectoralFinMaxDeltaRotZ *
          Math.sin((2 * Math.PI * frameIdx) / pectoralFinFlapPeriodFrames);

        const currentLFinRot = vec3(pecLBase.rotation);
        currentLFinRot[2] = pecLBase.rotation[2] + deltaPecRotZ;
        currentSegNode.children.leftPectoralFin = {
          transform: new Transform({ ...pecLBase, rotation: currentLFinRot }),
        };

        const currentRFinRot = vec3(pecRBase.rotation);
        currentRFinRot[2] = pecRBase.rotation[2] - deltaPecRotZ; // 반대 방향으로 파닥임 (대칭)
        currentSegNode.children.rightPectoralFin = {
          transform: new Transform({ ...pecRBase, rotation: currentRFinRot }),
        };
      }
      if (segIdx === 2) {
        // body_2 (dorsalFinIdx)
        const dorsalBase =
          fishBasePose.children.head.children.body.children.body_0.children
            .body_1.children.body_2.children.dorsalFin.transform;
        const deltaDorsalRotY =
          dorsalFinMaxDeltaRotY *
            Math.sin((2 * Math.PI * frameIdx) / dorsalFinSwayPeriodFrames) -
          dorsalFinMaxDeltaRotY / 2;

        const currentDorsalRot = vec3(dorsalBase.rotation);
        currentDorsalRot[2] = dorsalBase.rotation[2] + deltaDorsalRotY; // Y축(Yaw)으로 살랑거림
        currentSegNode.children.dorsalFin = {
          transform: new Transform({
            ...dorsalBase,
            rotation: currentDorsalRot,
          }),
        };
      }
      parentNodeInFrame = currentSegNode; // 다음 마디의 부모는 현재 마디가 됨
    }

    // 5. 꼬리 (FishTail 인스턴스) 애니메이션 (몸통 마지막 마디의 자식)
    const tailInstanceBaseTransform =
      fishBasePose.children.head.children.body.children.body_0.children.body_1
        .children.body_2.children.body_3.children.body_4.children.tail
        .transform;
    const currentTailInstanceNode = {
      transform: new Transform({ ...tailInstanceBaseTransform }), // 꼬리 자체의 transform은 기본값 유지
      children: {},
    };
    parentNodeInFrame.children["tail"] = currentTailInstanceNode; // parentNodeInFrame은 body_4를 가리킴

    let parentTailSegNode = currentTailInstanceNode; // tail_0의 부모는 tail 인스턴스
    for (let segIdx = 0; segIdx < 3; segIdx++) {
      // tail_0 ~ tail_2
      const segName = `tail_${segIdx}`;
      let baseTailSegNode =
        fishBasePose.children.head.children.body.children.body_0.children.body_1
          .children.body_2.children.body_3.children.body_4.children.tail;
      for (let k = 0; k <= segIdx; k++) {
        baseTailSegNode = baseTailSegNode.children[`tail_${k}`];
      }
      const segBaseTransform = baseTailSegNode.transform;

      // 몸통의 마지막 마디(body_4)의 위상 지연을 이어받음 + 추가 지연
      cumulativePhaseDelay =
        2 * Math.PI * segmentPhaseDelayFactor * (4 + 1 + segIdx); // 4는 body_4의 인덱스
      const mainCycleTime = (2 * Math.PI * frameIdx) / bodyWavePeriodFrames; // 몸통과 같은 주기로 파동
      const deltaRotY =
        tailSegMaxRotY[segIdx] *
          (Math.sin(mainCycleTime + cumulativePhaseDelay) -
            Math.sin(cumulativePhaseDelay)) +
        tailSegMaxRotY[segIdx] / 2;

      const currentSegRotation = vec3(segBaseTransform.rotation);
      currentSegRotation[2] = segBaseTransform.rotation[2] + deltaRotY;

      const currentTailSegData = {
        transform: new Transform({
          position: vec3(segBaseTransform.position),
          rotation: currentSegRotation,
          scale: vec3(segBaseTransform.scale),
          anchor: vec3(segBaseTransform.anchor),
        }),
        // 마지막 꼬리 마디(tail_2)는 children 속성이 없음 (JSON 구조에 따라)
        // children: (segIdx < 2) ? {} : undefined -> 이 부분은 buildAnimatedWingHierarchy처럼 처리 필요
      };
      if (segIdx < 2) {
        // tail_0, tail_1은 children 객체를 가짐
        currentTailSegData.children = {};
      }

      parentTailSegNode.children[segName] = currentTailSegData;
      parentTailSegNode = currentTailSegData;
    }

    animationFrames.push(currentFrameData); // 최종 프레임 데이터를 배열에 추가
  }
  return animationFrames;
}
