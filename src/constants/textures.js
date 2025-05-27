/**
 * 텍스쳐 상수들, 아래 함수의 반환값으로 텍스쳐 그 자체를 의미.
 * 사실 굳이 이걸 안 쓰고, robotArm.js에서 인자에 함수를 집어넣어도 되나,
 * 이렇게 하는 방식이 가독성도 좋고 실수도 더 적을 듯함.
 */
const TEXTURES = {
    // 체커보드 텍스처들
    CHECKERBOARD_DEFAULT: null, // 기본 흑백 체커보드
    CHECKERBOARD_RED_WHITE: null, // 빨강-흰색 체커보드
    CHECKERBOARD_BLUE_WHITE: null, // 파랑-흰색 체커보드
    
    // 그라데이션 텍스처들
    GRADIENT_RED_BLUE_H: null, // 빨강에서 파랑으로 수평 그라데이션
    GRADIENT_GREEN_YELLOW_V: null, // 초록에서 노랑으로 수직 그라데이션

    // 줄무늬 텍스처들
    STRIPES_BLACK_WHITE_H: null, // 흑백 수평 줄무늬
    STRIPES_RED_BLUE_V: null, // 빨강-파랑 수직 줄무늬

    // 낚시터/바다용 텍스처들
    CHECKERBOARD_GREEN_YELLOW: null, // 초록-노랑 체커보드 (풀밭 느낌)
    GRADIENT_BLUE_CYAN_H: null, // 파랑에서 시안으로 수평 그라데이션 (바다 느낌)

    // 이미지 파일에서 로드하는 텍스처들
    GRASS_TEXTURE: null, // grass.jpg
    OCEAN_TEXTURE: null, // water.jpg
    ROBOT_TEXTURE: null, // robot.jpg
    SKY_TEXTURE: null, // sky.jpg
};

/**
 * 텍스처 생성 함수들 (WebGL 텍스처 객체 반환)
 * canvasManager에서 중간에 호출됨.
 */
function initTextures() {
    // 체커보드 텍스처들
    TEXTURES.CHECKERBOARD_DEFAULT = createWebGLTexture(
        // 기본 흑백 체커보드 텍스쳐
        gl, createCheckerboardTexture(64, 0x8), 64, 64
    );

    TEXTURES.CHECKERBOARD_RED_WHITE = createWebGLTexture(
        // 빨강-흰색 체커보드 텍스쳐
        gl, createColoredCheckerboardTexture(64, [1, 0, 0], [1, 1, 1]), 64, 64
    );

    TEXTURES.CHECKERBOARD_BLUE_WHITE = createWebGLTexture(
        // 파랑-흰색 체커보드 텍스쳐
        gl, createColoredCheckerboardTexture(64, [0, 0, 1], [1, 1, 1]), 64, 64
    );

    // 그라데이션 텍스처들
    TEXTURES.GRADIENT_GREEN_YELLOW_H = createWebGLTexture(
        // 초록에서 노랑으로 수평 그라데이션 텍스쳐
        gl, createGradientTexture(64, [0, 1, 0], [1, 1, 0], 'horizontal'), 64, 64
    );

    TEXTURES.GRADIENT_GREEN_YELLOW_V = createWebGLTexture(
        // 초록에서 노랑으로 수직 그라데이션 텍스쳐
        gl, createGradientTexture(64, [0, 1, 0], [1, 1, 0], 'vertical'), 64, 64
    );

    // 줄무늬 텍스처들
    TEXTURES.STRIPES_BLACK_WHITE_H = createWebGLTexture(
        // 흑백 수평 줄무늬 텍스쳐
        gl, createStripedTexture(64, [0, 0, 0], [1, 1, 1], 4, 'horizontal'), 64, 64
    );

    TEXTURES.STRIPES_RED_BLUE_V = createWebGLTexture(
        // 빨강~파랑 수직 줄무늬 텍스쳐
        gl, createStripedTexture(64, [1, 0, 0], [0, 0, 1], 6, 'vertical'), 64, 64
    );

    // 낚시터/바다용 텍스처들
    TEXTURES.CHECKERBOARD_GREEN_YELLOW = createWebGLTexture(
        // 초록-노랑 체커보드 텍스쳐 (풀밭 느낌)
        gl, createColoredCheckerboardTexture(64, [0, 0.8, 0], [0.9, 0.9, 0.3]), 64, 64
    );

    TEXTURES.GRADIENT_BLUE_CYAN_H = createWebGLTexture(
        gl, createGradientTexture(64, [0.0, 0.0, 1.0], [0.2, 0.6, 0.8], 'horizontal'), 64, 64
    );
    
    // 이거 이미지 메모리로 로드하는 데 시간이 좀 걸림.
    // 그래서 메모리에 이미지 올라간 후(즉, createTextureFromImage 함수가 종료되어 반환되는 시점)에,
    // (rootManager가 존재하면) 렌더링을 수동으로 업데이트를 해줘야 함.
    // 이 코드를 빼먹으면 mouse interaction와 같이 render() 함수가 호출되어야만 텍스쳐가 실제로 렌더링됨.
    TEXTURES.GRASS_TEXTURE = createTextureFromImage(gl, 'src/data/textures/grass.jpg', () => {
        if (typeof rootManager !== 'undefined' && rootManager.canvasManager) {
            rootManager.canvasManager.render(); 
        }
    });    
    TEXTURES.OCEAN_TEXTURE = createTextureFromImage(gl, 'src/data/textures/ocean.jpg', () => {
        if (typeof rootManager !== 'undefined' && rootManager.canvasManager) {
            rootManager.canvasManager.render(); 
        }
    }); 
    TEXTURES.ROBOT_TEXTURE = createTextureFromImage(gl, 'src/data/textures/robot.jpg', () => {
        if (typeof rootManager !== 'undefined' && rootManager.canvasManager) {
            rootManager.canvasManager.render(); 
        }
    }); 
    TEXTURES.SKY_TEXTURE = createTextureFromImage(gl, 'src/data/textures/sky.jpg', () => {
        if (typeof rootManager !== 'undefined' && rootManager.canvasManager) {
            rootManager.canvasManager.render(); 
        }
    }); 
}
