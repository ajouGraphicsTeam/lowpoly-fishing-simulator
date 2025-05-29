class PrimitiveTestScene extends PrefabObject {
    init() {
        // === Primitive 테스트 모델들 ===

        // 1. QuadPrimitive 테스트 (왼쪽 위) - 텍스처 없이 순수 색상만
        const quadPrimitive = new QuadPrimitive(
        vec3(-0.3, 0.3, 0), vec3(-0.3, -0.3, 0), 
        vec3(0.3, -0.3, 0), vec3(0.3, 0.3, 0)
        );
        this.children["quadTest"] = new HierarchyObject(
        [quadPrimitive],
        new Transform({ position: vec3(-2, 3, 0) }),
        COLORS.RED,
        null // 텍스처를 null로 설정하여 순수 색상만 사용
        );

        // 2. TrianglePrimitive 테스트 (오른쪽 위)
        const trianglePrimitive = new TrianglePrimitive(
        vec3(0, 0.5, 0), vec3(-0.4, -0.3, 0), vec3(0.4, -0.3, 0)
        );
        this.children["triangleTest"] = new HierarchyObject(
        [trianglePrimitive],
        new Transform({ position: vec3(3, 3, 0) }), 
        COLORS.GREEN,
        TEXTURES.GRADIENT_RED_BLUE_H
        );

        // 3. BoxPrimitive 테스트 (왼쪽 아래) - 텍스처 없이 순수 색상만
        const boxPrimitive = new BoxPrimitive([
        [-0.2, 0.2, 0.2], [0.2, 0.2, 0.2],
        [0.2, -0.2, 0.2], [-0.2, -0.2, 0.2],
        [-0.2, 0.2, -0.2], [0.2, 0.2, -0.2],
        [0.2, -0.2, -0.2], [-0.2, -0.2, -0.2]
        ]);
        this.children["boxTest"] = new HierarchyObject(
        [boxPrimitive],
        new Transform({ position: vec3(-3, 3, 0) }), 
        COLORS.BLUE,
        null // 텍스처를 null로 설정하여 순수 색상만 사용
        );

        // 4. PrismPrimitive 테스트 (오른쪽 아래) - 6각기둥
        const prismPrimitive = new PrismPrimitive(
        vec3(0, -0.3, 0), 0.3, 0.6, 6
        );
        this.children["prismTest"] = new HierarchyObject(
        [prismPrimitive],
        new Transform({ position: vec3(2, 3, 0) }), 
        COLORS.MAGENTA,
        null
        );

        // 5. PyramidPrimitive 테스트 (뒤쪽 중앙) - 8각뿔
        const pyramidPrimitive = new PyramidPrimitive(
        vec3(0, -0.3, 0), 0.4, 0.8, 8
        );
        this.children["pyramidTest"] = new HierarchyObject(
        [pyramidPrimitive],
        new Transform({ position: vec3(0, 3, -2) }),
        COLORS.CYAN,
        null
        );

        // 6. 원기둥 근사 테스트 (앞쪽 왼쪽) - 16각기둥
        const cylinderPrimitive = new PrismPrimitive(
        vec3(0, -0.4, 0), 0.25, 0.8, 16
        );
        this.children["cylinderTest"] = new HierarchyObject(
        [cylinderPrimitive],
        new Transform({ position: vec3(-3, 3, 1.5) }),
        COLORS.YELLOW,
        TEXTURES.GRADIENT_GREEN_YELLOW_H
        );

        // 7. 원뿔 근사 테스트 (앞쪽 오른쪽) - 12각뿔
        const conePrimitive = new PyramidPrimitive(
        vec3(0, -0.4, 0), 0.3, 0.8, 12
        );
        this.children["coneTest"] = new HierarchyObject(
        [conePrimitive],
        new Transform({ position: vec3(1.5, 3, 1.5) }),
        COLORS.ORANGE,
        TEXTURES.CHECKERBOARD_RED_WHITE
        );
    }
} 