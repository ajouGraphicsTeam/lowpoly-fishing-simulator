class PrefabObject extends HierarchyObject {
  animation; // TODO

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
