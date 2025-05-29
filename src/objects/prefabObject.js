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

  /**
   * 미리 정의된 색상들 중에서 랜덤하게 하나를 반환하는 함수
   * @returns {Object} COLORS 객체 중 하나
   */
  getRandomColor() {
    const predefinedColors = [
      COLORS.RED,
      COLORS.GREEN,
      COLORS.BLUE,
      COLORS.SKY_BLUE,
      COLORS.YELLOW,
      COLORS.CYAN,
      COLORS.MAGENTA,
      COLORS.ORANGE,
      COLORS.LIGHT_BLUE,
      COLORS.DARK_GREEN,
      COLORS.DARK_YELLOW
    ];
    
    const randomIndex = Math.floor(Math.random() * predefinedColors.length);
    return predefinedColors[randomIndex];
  }
}
