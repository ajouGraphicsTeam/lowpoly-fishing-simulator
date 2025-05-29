class AnimationManager {
  isPlaying = false;
  _currently_played_animations = [];
  _paused_animations = []; // 일시정지된 애니메이션들을 저장

  playAnimation(animation) {
    animation.tick = 0;
    this._currently_played_animations.push(animation);

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.render();
    }
  }

  pauseAnimation(animation) {
    this._currently_played_animations =
      this._currently_played_animations.filter((ani) => ani !== animation);

    if (this._currently_played_animations.length == 0) {
      this.isPlaying = false;
    }
  }

  /**
   * 모든 애니메이션을 일시정지
   */
  stopAllAnimations() {
    if (this.isPlaying) {
      // 현재 재생 중인 애니메이션들을 paused 배열로 이동
      this._paused_animations = [...this._currently_played_animations];
      this._currently_played_animations = [];
      this.isPlaying = false;
    }
  }

  /**
   * 일시정지된 모든 애니메이션을 재개
   */
  resumeAllAnimations() {
    if (!this.isPlaying && this._paused_animations.length > 0) {
      // paused 배열의 애니메이션들을 다시 재생 목록으로 이동
      this._currently_played_animations = [...this._paused_animations];
      this._paused_animations = [];
      this.isPlaying = true;
      this.render();
    }
  }

  /**
   * 현재 애니메이션이 재생 중인지 확인
   */
  get hasAnimations() {
    return this._currently_played_animations.length > 0 || this._paused_animations.length > 0;
  }

  render() {
    if (this.isPlaying == false) {
      return;
    }

    this._currently_played_animations.forEach((animation, idx) => {
      animation.applyAnimationData();
    });

    rootManager.canvasManager.render();
    window.requestAnimationFrame(this.render.bind(this));
  }
}
