class RootManager {
  constructor() {
    if (RootManager.instance) {
      return RootManager.instance;
    }

    this.animationManager = new AnimationManager();
    this.canvasManager = new CanvasManager("gl-canvas");

    RootManager.instance = this;
  }
}
