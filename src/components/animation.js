class Animator {
  tick = 0;
  isPlaying = false;

  loop = false;

  // 살짝 bvh 파일 형식의 느낌
  /**
   * @type {AnimationFrameData[]}
   */
  animationData = [];

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

  render() {
    // transform 적용시키고,
    // tick ++
    throw new Error("renderJob is not implemented");
  }
}
