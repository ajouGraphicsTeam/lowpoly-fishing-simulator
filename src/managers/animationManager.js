class AnimationManager {
  isPlaying = false;
  _currently_played_animations = [];

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
