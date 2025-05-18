class RootManager {
  constructor() {
    if (RootManager.instance) {
      return RootManager.instance;
    }
    RootManager.instance = this;
  }

  init() {
    this.animationManager = new AnimationManager();
    this.canvasManager = new CanvasManager("gl-canvas");
    this.cameraManager = new CameraManager();
  }
}
