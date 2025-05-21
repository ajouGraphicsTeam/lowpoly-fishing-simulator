class AnimationManager {
  isPlaying = false;
  _currently_played_animations = [];

  playAnimation(animation) {
    animation.tick = 0;
    _currently_played_animations.push(animation);

    if (!this.isPlaying) {
      this.isPlaying = true;
      this.render();
    }
  }

  pauseAnimation(animation) {
    this._currently_played_animations =
      this._currently_played_animations.filter((ani) => ani !== animation);

    if (this.this._currently_played_animations.empty()) {
      this.isPlaying = false;
    }
  }

  render() {
    if (this.isPlaying == false) {
      return;
    }

    this._currently_played_animations.forEach((animation, idx) => {
      animation.render();
    });

    window.requestAnimationFrame(this.render.bind(this));
  }
}
