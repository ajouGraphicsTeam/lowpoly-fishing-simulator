class PrefabObject extends HierarchyObject {
  /**
   * @type {Animator}
   */
  animator;

  /**
   *
   * @param {Transform} transform
   */
  constructor(transform) {
    super([], transform);

    this.init();
  }

  init() {}
}
