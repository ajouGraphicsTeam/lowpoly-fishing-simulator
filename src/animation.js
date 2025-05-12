class Animator {
  count = 0;
  isPlaying = false;

  run() {
    this.count = 0;
    this.isPlaying = true;
    this.render();
  }

  stop() {
    this.isPlaying = false;
  }

  render() {
    if (this.isPlaying == false) {
      return;
    }

    this.count++;
    this.renderJob();

    window.requestAnimationFrame(this.render.bind(this));
  }

  renderJob() {
    throw new Error("renderJob is not implemented");
  }
}

class SequentialAnimator extends Animator {
  constructor(canvasManager) {
    super();
    this.canvasManager = canvasManager;
  }

  renderJob() {
    this.canvasManager.max_length_to_draw =
      // + 30은 30프레임(0.5초) 정도는 정지해 있는게 이쁠 것 같아서 넣어둔 값
      // max_length_to_draw > vertices.length인 경우엔 정지하고 있는 것 처럼 보인다.
      // render함수에서 min 함수를 사용하기 때문에 max_length_to_draw가 커도 동작엔 문제가 없다.
      this.count % (this.canvasManager.lineManager.result_length + 30);

    this.canvasManager.render();
  }

  stop() {
    super.stop();
    this.canvasManager.max_length_to_draw = Infinity;
  }
}
