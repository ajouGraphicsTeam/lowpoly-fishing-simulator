// --- 특정 애니메이션 생성 함수들을 위한 Animator 확장 ---
class CircularFlyAnimator extends Animator {
  constructor(target, a, b, numFrames, plane = "XZ") {
    super(target);
    this.animationData = generateCircularMotionAnimation(
      a,
      b,
      numFrames,
      plane
    );
  }
}

class Figure8FlyAnimator extends Animator {
  constructor(target, a, b, numFrames, plane = "XZ") {
    super(target);
    this.animationData = generateFigure8MotionAnimation(a, b, numFrames, plane);
  }
}

class RandomFlyAnimator extends Animator {
  constructor(target, a, b, numFrames, numWaypoints = 0) {
    super(target);
    this.animationData = generateRandomMotionAnimation(
      a,
      b,
      numFrames,
      numWaypoints
    );
  }
}

// --- 애니메이션 생성 함수들 ---

/**
 * a와 b 사이의 공간을 원형으로 움직이는 Transform 배열을 생성합니다.
 * @param {object} a - 시작점 vec3 ({x,y,z})
 * @param {object} b - 끝점 vec3 ({x,y,z})
 * @param {number} numFrames - 생성할 총 프레임 수
 * @param {'XZ'|'XY'|'YZ'} plane - 원형 운동을 할 평면 (기본값 'XZ')
 * @returns {Array<{transform: Transform}>} 프레임 배열
 */
function generateCircularMotionAnimation(a, b, numFrames, plane = "XZ") {
  const frames = [];
  const center = vec3((a.X + b.X) / 2, (a.Y + b.Y) / 2, (a.Z + b.Z) / 2);
  const halfSizes = vec3(
    Math.abs(b.X - a.X) / 2,
    Math.abs(b.Y - a.Y) / 2,
    Math.abs(b.Z - a.Z) / 2
  );

  let r; // 원의 반지름
  let pIdx1, pIdx2, pIdxConst; // 위치 벡터의 인덱스 또는 키
  let calcYaw, calcPitch;

  // 평면에 따른 반지름 및 축 설정 (Y축을 Up으로 가정)
  if (plane === "XZ") {
    r = Math.min(halfSizes.X, halfSizes.Z);
    calcYaw = (dx, dy, dz) => Math.atan2(dz, dx); // Yaw around Y
    calcPitch = (dx, dy, dz, groundSpeed) => -Math.atan2(dy, groundSpeed); // Pitch around X
  } else if (plane === "XY") {
    r = Math.min(halfSizes.X, halfSizes.Y);
    // XY 평면에서 움직일 때, Z축을 바라보도록 Yaw 설정 (만약 Z가 앞 방향이라면)
    // 또는 움직임 방향을 따르도록 설정 (여기선 후자)
    calcYaw = (dx, dy, dz) => Math.atan2(dy, dx); // "Yaw" in XY plane, actually roll if Y is up.
    // Let's keep standard yaw/pitch for simplicity.
    calcPitch = (dx, dy, dz, groundSpeed) => 0; // XY 평면이므로 피치는 0으로 가정
    // 혹은 Z축 주변 회전(롤)을 추가할 수 있음
    // 우선 간단하게 yaw(Y축 회전)와 pitch(X축 회전)만 사용
    calcYaw = (dx, dy, dz) => Math.atan2(0, dx); // X방향만 고려한 Yaw (단순화)
    calcPitch = (dx, dy, dz, groundSpeed) => -Math.atan2(dy, dx); // Y,X 이동을 Pitch로 표현 (단순화)
  } else {
    // YZ plane
    r = Math.min(halfSizes.Y, halfSizes.Z);
    calcYaw = (dx, dy, dz) => Math.atan2(dz, 0); // Z방향만 고려한 Yaw (단순화)
    calcPitch = (dx, dy, dz, groundSpeed) => -Math.atan2(dy, dz); // Y,Z 이동을 Pitch로 표현 (단순화)
  }
  // 일반적인 Yaw/Pitch 계산 (Y-up 기준)
  calcYaw = (dx, dy, dz) => Math.atan2(dz, dx);
  calcPitch = (dx, dy, dz, groundSpeed) => -Math.atan2(dy, groundSpeed);

  let prevPos = null;

  for (let i = 0; i < numFrames; i++) {
    const angle = (i / numFrames) * 2 * Math.PI;
    const currentPos = vec3();

    if (plane === "XZ") {
      currentPos.X = center.X + r * Math.cos(angle);
      currentPos.Y = center.Y; // Y는 고정 또는 다른 방식으로 애니메이션
      currentPos.Z = center.Z + r * Math.sin(angle);
    } else if (plane === "XY") {
      currentPos.X = center.X + r * Math.cos(angle);
      currentPos.Y = center.Y + r * Math.sin(angle);
      currentPos.Z = center.Z;
    } else {
      // YZ
      currentPos.X = center.X;
      currentPos.Y = center.Y + r * Math.cos(angle); // Y가 첫번째 회전축
      currentPos.Z = center.Z + r * Math.sin(angle); // Z가 두번째 회전축
    }

    let rotationX = 0,
      rotationY = 0;

    if (i === 0) {
      // 첫 프레임: 다음 프레임으로 방향 예측
      const nextAngle = ((i + 1) / numFrames) * 2 * Math.PI;
      const nextPos = vec3();
      if (plane === "XZ") {
        nextPos.X = center.X + r * Math.cos(nextAngle);
        nextPos.Y = center.Y;
        nextPos.Z = center.Z + r * Math.sin(nextAngle);
      } else if (plane === "XY") {
        nextPos.X = center.X + r * Math.cos(nextAngle);
        nextPos.Y = center.Y + r * Math.sin(nextAngle);
        nextPos.Z = center.Z;
      } else {
        nextPos.X = center.X;
        nextPos.Y = center.Y + r * Math.cos(nextAngle);
        nextPos.Z = center.Z + r * Math.sin(nextAngle);
      }

      prevPos = vec3(currentPos); // 현재 위치를 이전 위치로 설정하고 다음 위치로 방향 계산
      currentPos.X = nextPos.X;
      currentPos.Y = nextPos.Y;
      currentPos.Z = nextPos.Z; // 일시적으로 다음 위치 사용
    }

    const dirX = currentPos.X - prevPos.X;
    const dirY = currentPos.Y - prevPos.Y;
    const dirZ = currentPos.Z - prevPos.Z;

    if (Math.abs(dirX) > 1e-6 || Math.abs(dirZ) > 1e-6) {
      rotationY = calcYaw(dirX, dirY, dirZ) * (180 / Math.PI);
    } else if (frames.length > 0) {
      rotationY = frames[frames.length - 1].transform.rotation.Y;
    }

    const groundSpeed = Math.sqrt(dirX * dirX + dirZ * dirZ);
    if (groundSpeed > 1e-6 || Math.abs(dirY) > 1e-6) {
      rotationX = calcPitch(dirX, dirY, dirZ, groundSpeed) * (180 / Math.PI);
    } else if (frames.length > 0) {
      rotationX = frames[frames.length - 1].transform.rotation.X;
    }

    if (i === 0) {
      // 첫 프레임 방향 계산 후, 현재 위치를 원래대로 복원
      if (plane === "XZ") {
        currentPos.X = center.X + r * Math.cos(angle);
        currentPos.Y = center.Y;
        currentPos.Z = center.Z + r * Math.sin(angle);
      } else if (plane === "XY") {
        currentPos.X = center.X + r * Math.cos(angle);
        currentPos.Y = center.Y + r * Math.sin(angle);
        currentPos.Z = center.Z;
      } else {
        currentPos.X = center.X;
        currentPos.Y = center.Y + r * Math.cos(angle);
        currentPos.Z = center.Z + r * Math.sin(angle);
      }
    }
    prevPos = vec3(currentPos);

    frames.push({
      transform: new Transform({
        position: vec3(currentPos),
        rotation: vec3(rotationX, -rotationY, 0), // 롤(Z축 회전)은 0으로 가정
      }),
    });
  }
  return frames;
}

/**
 * a와 b 사이의 공간을 8자 모양으로 움직이는 Transform 배열을 생성합니다.
 * @param {object} a - 시작점 vec3 ({x,y,z})
 * @param {object} b - 끝점 vec3 ({x,y,z})
 * @param {number} numFrames - 생성할 총 프레임 수
 * @param {'XZ'|'XY'|'YZ'} plane - 8자 운동을 할 평면 (기본값 'XZ')
 * @returns {Array<{transform: Transform}>} 프레임 배열
 */
function generateFigure8MotionAnimation(a, b, numFrames, plane = "XZ") {
  const frames = [];
  const center = vec3((a.X + b.X) / 2, (a.Y + b.Y) / 2, (a.Z + b.Z) / 2);
  const halfSizes = vec3(
    Math.abs(b.X - a.X) / 2,
    Math.abs(b.Y - a.Y) / 2,
    Math.abs(b.Z - a.Z) / 2
  );

  let r1, r2; // 8자 모양의 두 축 반지름
  let calcYaw = (dx, dy, dz) => Math.atan2(dz, dx); // 기본 Y-up Yaw
  let calcPitch = (dx, dy, dz, groundSpeed) => -Math.atan2(dy, groundSpeed); // 기본 Y-up Pitch

  let prevPos = null;

  for (let i = 0; i < numFrames; i++) {
    const t = (i / numFrames) * 2 * Math.PI; // 0에서 2PI까지 진행하여 한 사이클 완료
    const currentPos = vec3();

    if (plane === "XZ") {
      r1 = halfSizes.X;
      r2 = halfSizes.Z;
      currentPos.X = center.X + r1 * Math.sin(t);
      currentPos.Y = center.Y + halfSizes.Y * Math.sin(t * 2) * 0.5; // Y축으로도 약간의 움직임 추가
      currentPos.Z = center.Z + r2 * Math.sin(t) * Math.cos(t); // r2 * sin(2t)/2
    } else if (plane === "XY") {
      r1 = halfSizes.X;
      r2 = halfSizes.Y;
      currentPos.X = center.X + r1 * Math.sin(t);
      currentPos.Y = center.Y + r2 * Math.sin(t) * Math.cos(t);
      currentPos.Z = center.Z + halfSizes.Z * Math.sin(t * 2) * 0.5; // Z축 움직임
    } else {
      // YZ
      r1 = halfSizes.Y;
      r2 = halfSizes.Z;
      currentPos.X = center.X + halfSizes.X * Math.sin(t * 2) * 0.5; // X축 움직임
      currentPos.Y = center.Y + r1 * Math.sin(t);
      currentPos.Z = center.Z + r2 * Math.sin(t) * Math.cos(t);
    }

    let rotationX = 0,
      rotationY = 0;

    if (i === 0) {
      const t_next = ((i + 1) / numFrames) * 2 * Math.PI;
      const nextPos = vec3();
      if (plane === "XZ") {
        nextPos.X = center.X + r1 * Math.sin(t_next);
        nextPos.Y = center.Y + halfSizes.Y * Math.sin(t_next * 2) * 0.5;
        nextPos.Z = center.Z + r2 * Math.sin(t_next) * Math.cos(t_next);
      } else if (plane === "XY") {
        nextPos.X = center.X + r1 * Math.sin(t_next);
        nextPos.Y = center.Y + r2 * Math.sin(t_next) * Math.cos(t_next);
        nextPos.Z = center.Z + halfSizes.Z * Math.sin(t_next * 2) * 0.5;
      } else {
        nextPos.X = center.X + halfSizes.X * Math.sin(t_next * 2) * 0.5;
        nextPos.Y = center.Y + r1 * Math.sin(t_next);
        nextPos.Z = center.Z + r2 * Math.sin(t_next) * Math.cos(t_next);
      }
      prevPos = vec3(currentPos);
      currentPos.X = nextPos.X;
      currentPos.Y = nextPos.Y;
      currentPos.Z = nextPos.Z;
    }

    const dirX = currentPos.X - prevPos.X;
    const dirY = currentPos.Y - prevPos.Y;
    const dirZ = currentPos.Z - prevPos.Z;

    if (Math.abs(dirX) > 1e-6 || Math.abs(dirZ) > 1e-6) {
      rotationY = calcYaw(dirX, dirY, dirZ) * (180 / Math.PI);
    } else if (frames.length > 0) {
      rotationY = frames[frames.length - 1].transform.rotation.Y;
    }

    const groundSpeed = Math.sqrt(dirX * dirX + dirZ * dirZ);
    if (groundSpeed > 1e-6 || Math.abs(dirY) > 1e-6) {
      rotationX = calcPitch(dirX, dirY, dirZ, groundSpeed) * (180 / Math.PI);
    } else if (frames.length > 0) {
      rotationX = frames[frames.length - 1].transform.rotation.X;
    }

    if (i === 0) {
      // 첫 프레임 방향 계산 후, 현재 위치를 원래대로 복원
      if (plane === "XZ") {
        currentPos.X = center.X + r1 * Math.sin(t);
        currentPos.Y = center.Y + halfSizes.Y * Math.sin(t * 2) * 0.5;
        currentPos.Z = center.Z + r2 * Math.sin(t) * Math.cos(t);
      } else if (plane === "XY") {
        currentPos.X = center.X + r1 * Math.sin(t);
        currentPos.Y = center.Y + r2 * Math.sin(t) * Math.cos(t);
        currentPos.Z = center.Z + halfSizes.Z * Math.sin(t * 2) * 0.5;
      } else {
        currentPos.X = center.X + halfSizes.X * Math.sin(t * 2) * 0.5;
        currentPos.Y = center.Y + r1 * Math.sin(t);
        currentPos.Z = center.Z + r2 * Math.sin(t) * Math.cos(t);
      }
    }
    prevPos = vec3(currentPos);

    frames.push({
      transform: new Transform({
        position: vec3(currentPos),
        rotation: vec3(rotationX, rotationY, 0),
      }),
    });
  }
  return frames;
}

/**
 * a와 b 사이의 공간을 무작위로 움직이는 Transform 배열을 생성합니다.
 * @param {object} a - 시작점 vec3 ({x,y,z})
 * @param {object} b - 끝점 vec3 ({x,y,z})
 * @param {number} numFrames - 생성할 총 프레임 수
 * @param {number} numWaypoints - 생성할 경유지점 수 (0이면 자동 계산)
 * @returns {Array<{transform: Transform}>} 프레임 배열
 */
function generateRandomMotionAnimation(a, b, numFrames, numWaypoints = 0) {
  const frames = [];
  const minBounds = vec3(
    Math.min(a.X, b.X),
    Math.min(a.Y, b.Y),
    Math.min(a.Z, b.Z)
  );
  const maxBounds = vec3(
    Math.max(a.X, b.X),
    Math.max(a.Y, b.Y),
    Math.max(a.Z, b.Z)
  );

  if (numWaypoints === 0) {
    const durationSeconds = numFrames / 60.0; // 60fps 가정
    numWaypoints = Math.max(2, Math.floor(durationSeconds / 2.0) + 1); // 약 2초마다 새 경유지
  }
  if (numWaypoints < 2) numWaypoints = 2;

  const waypoints = [];
  for (let i = 0; i < numWaypoints; i++) {
    waypoints.push(
      vec3(
        minBounds.X + Math.random() * (maxBounds.X - minBounds.X),
        minBounds.Y + Math.random() * (maxBounds.Y - minBounds.Y),
        minBounds.Z + Math.random() * (maxBounds.Z - minBounds.Z)
      )
    );
  }

  let prevPos = null;
  let currentWaypointIndex = 0;
  let p0 = vec3(waypoints[0]); // 현재 경유지
  let p1 = vec3(waypoints[1]); // 다음 경유지

  // 마지막 세그먼트가 나머지 프레임을 모두 사용하도록 총 프레임 수 기반으로 계산
  let totalFramesProcessedInSegments = 0;
  const baseFramesPerSegment = Math.floor(numFrames / (numWaypoints - 1));

  for (let seg = 0; seg < numWaypoints - 1; seg++) {
    p0 = vec3(waypoints[seg]);
    p1 = vec3(waypoints[seg + 1]);

    let framesForThisSegment = baseFramesPerSegment;
    if (seg === numWaypoints - 2) {
      // 마지막 세그먼트
      framesForThisSegment = numFrames - totalFramesProcessedInSegments;
    }
    if (framesForThisSegment <= 0 && numFrames > frames.length) {
      // 분배 오류 방지
      framesForThisSegment = numFrames - frames.length;
    }

    for (
      let frameInSegment = 0;
      frameInSegment < framesForThisSegment;
      frameInSegment++
    ) {
      if (frames.length >= numFrames) break; // 총 프레임 수 초과 방지

      const t_segment =
        framesForThisSegment === 1
          ? 1.0
          : frameInSegment / (framesForThisSegment - 1); // 0 to 1

      const currentPos = vec3(
        p0.X + (p1.X - p0.X) * t_segment,
        p0.Y + (p1.Y - p0.Y) * t_segment,
        p0.Z + (p1.Z - p0.Z) * t_segment
      );

      let rotationX = 0,
        rotationY = 0;

      if (!prevPos && frames.length === 0) {
        // 첫 프레임의 첫 세그먼트
        const dirX = p1.X - p0.X;
        const dirY = p1.Y - p0.Y;
        const dirZ = p1.Z - p0.Z;
        if (Math.abs(dirX) > 1e-6 || Math.abs(dirZ) > 1e-6) {
          rotationY = Math.atan2(dirZ, dirX) * (180 / Math.PI);
        }
        const groundSpeed = Math.sqrt(dirX * dirX + dirZ * dirZ);
        if (groundSpeed > 1e-6 || Math.abs(dirY) > 1e-6) {
          rotationX = -Math.atan2(dirY, groundSpeed) * (180 / Math.PI);
        }
      } else if (prevPos) {
        const dirX = currentPos.X - prevPos.X;
        const dirY = currentPos.Y - prevPos.Y;
        const dirZ = currentPos.Z - prevPos.Z;

        if (Math.abs(dirX) > 1e-6 || Math.abs(dirZ) > 1e-6) {
          rotationY = Math.atan2(dirZ, dirX) * (180 / Math.PI);
        } else if (frames.length > 0) {
          rotationY = frames[frames.length - 1].transform.rotation.Y;
        }

        const groundSpeed = Math.sqrt(dirX * dirX + dirZ * dirZ);
        if (groundSpeed > 1e-6 || Math.abs(dirY) > 1e-6) {
          rotationX = -Math.atan2(dirY, groundSpeed) * (180 / Math.PI);
        } else if (frames.length > 0) {
          rotationX = frames[frames.length - 1].transform.rotation.X;
        }
      }
      prevPos = vec3(currentPos);

      frames.push({
        transform: new Transform({
          position: vec3(currentPos),
          rotation: vec3(rotationX, rotationY, 0),
        }),
      });
    }
    totalFramesProcessedInSegments += framesForThisSegment;
  }
  // 만약 루프 후 프레임이 모자라면 마지막 상태로 채움 (보통은 정확히 맞음)
  while (frames.length < numFrames && frames.length > 0) {
    frames.push({
      transform: new Transform({
        position: vec3(frames[frames.length - 1].transform.position),
        rotation: vec3(frames[frames.length - 1].transform.rotation),
      }),
    });
  }

  return frames;
}

// --- 사용 예시 ---
// const pointA = vec3(-5, 0, -5);
// const pointB = vec3(5, 2, 5);
// const totalFrames = 300; // 5초 (60fps 기준)

// console.log("--- 원형 운동 (XZ 평면) ---");
// const circularAnimXZ = generateCircularMotionAnimation(pointA, pointB, totalFrames, 'XZ');
// console.log(`생성된 프레임 수: ${circularAnimXZ.length}`);
// if (circularAnimXZ.length > 0) {
//   console.log("첫 프레임:", circularAnimXZ[0].transform.position, "회전Y:", circularAnimXZ[0].transform.rotation.Y.toFixed(2));
//   console.log("중간 프레임:", circularAnimXZ[Math.floor(totalFrames/2)].transform.position, "회전Y:", circularAnimXZ[Math.floor(totalFrames/2)].transform.rotation.Y.toFixed(2));
// }

// console.log("\n--- 8자 운동 (XZ 평면, Y축 변화 포함) ---");
// const figure8Anim = generateFigure8MotionAnimation(pointA, pointB, totalFrames, 'XZ');
// console.log(`생성된 프레임 수: ${figure8Anim.length}`);
// if (figure8Anim.length > 0) {
//   console.log("첫 프레임:", figure8Anim[0].transform.position, "회전Y:", figure8Anim[0].transform.rotation.Y.toFixed(2));
//   console.log("중간 프레임:", figure8Anim[Math.floor(totalFrames/2)].transform.position, "회전Y:", figure8Anim[Math.floor(totalFrames/2)].transform.rotation.Y.toFixed(2));
// }

// console.log("\n--- 무작위 운동 ---");
// const randomAnim = generateRandomMotionAnimation(pointA, pointB, totalFrames, 5); // 5개의 경유지
// console.log(`생성된 프레임 수: ${randomAnim.length}`);
// if (randomAnim.length > 0) {
//   console.log("첫 프레임:", randomAnim[0].transform.position, "회전Y:", randomAnim[0].transform.rotation.Y.toFixed(2));
//   console.log("중간 프레임:", randomAnim[Math.floor(totalFrames/2)].transform.position, "회전Y:", randomAnim[Math.floor(totalFrames/2)].transform.rotation.Y.toFixed(2));
//   console.log("마지막 프레임:", randomAnim[totalFrames-1].transform.position, "회전Y:", randomAnim[totalFrames-1].transform.rotation.Y.toFixed(2));
// }

// Animator와 연결 예시
// const myObject = { transform: new Transform() }; // 애니메이션 대상 객체
// const animator = new CircularFlyAnimator(myObject, pointA, pointB, totalFrames);
// animator.play();
// function gameLoop() {
//   animator.update();
//   // ... render myObject ...
//   requestAnimationFrame(gameLoop);
// }
// gameLoop();
