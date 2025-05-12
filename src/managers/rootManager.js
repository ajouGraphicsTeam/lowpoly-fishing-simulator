const rootManager = {
  animationManager: new AnimationManager(),
  canvasManager: new CanvasManager("gl-canvas"),
};

Object.freeze(rootManager); // 변경 불가능하게 만들어 안정성 확보
