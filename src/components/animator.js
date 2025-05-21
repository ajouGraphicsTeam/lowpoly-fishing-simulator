class Animator {
  tick = 0;
  isPlaying = false;

  loop = false;

  // 살짝 bvh 파일 형식의 느낌
  /**
   * @type {{transform: Transform, children: {childName: animationData}}}
   */
  animationData;

  /**
   *
   * @param {HierarchyObject} object
   */
  constructor(object) {
    this.animationManager = new RootManager().animationManager;
    this.object = object;
  }

  start() {
    this.tick = 0;
    this.isPlaying = true;

    this.animationManager.playAnimation(this);
  }

  stop() {
    this.tick = 0;
    this.isPlaying = false;
    this.animationManager.pauseAnimation(this);
  }

  applyAnimationData() {
    this.applyTransform(this.animationData[this.tick], this.object);

    this.tick++;
    if (this.tick >= this.animationData.length) {
      if (this.loop) {
        this.tick = 0;
      } else {
        this.stop();
      }
    }
  }

  /**
   *
   * @param {{transform: Transform, children: {name: animationData}}} animationData
   * @param {HierarchyObject} object
   */
  applyTransform(animationData, object) {
    object.transform = animationData.transform;

    if (animationData.children) {
      Object.entries(animationData.children).forEach(
        ([childName, child], idx) => {
          this.applyTransform(child, object.children[childName]);
        }
      );
    }
  }
}
