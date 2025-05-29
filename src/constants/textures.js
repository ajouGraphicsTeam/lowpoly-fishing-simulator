/**
 * 텍스쳐 상수들, 아래 함수의 반환값으로 텍스쳐 그 자체를 의미.
 * 사실 굳이 이걸 안 쓰고, robotArm.js에서 인자에 함수를 집어넣어도 되나,
 * 이렇게 하는 방식이 가독성도 좋고 실수도 더 적을 듯함.
 */
const TEXTURES = {

    // 이미지 파일에서 로드하는 텍스처들
    GRASS_TEXTURE: null, // grass.jpg
    OCEAN_TEXTURE: null, // water.jpg
    ROBOT_TEXTURE: null, // robot.jpg
    SKY_TEXTURE: null, // sky.jpg
    CLOUD_TEXTURE: null, // cloud.jpg
    BUILDING_SIDE_TEXTURE: null, // building_side.jpg
};

/**
 * 텍스처 생성 함수들 (WebGL 텍스처 객체 반환)
 * canvasManager에서 중간에 호출됨.
 */
function initTextures() {
    
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
    TEXTURES.CLOUD_TEXTURE = createTextureFromImage(gl, 'src/data/textures/cloud.jpg', () => {
        if (typeof rootManager !== 'undefined' && rootManager.canvasManager) {
            rootManager.canvasManager.render(); 
        }
    }); 
    TEXTURES.BUILDING_SIDE_TEXTURE = createTextureFromImage(gl, 'src/data/textures/building_side.jpg', () => {
        if (typeof rootManager !== 'undefined' && rootManager.canvasManager) {
            rootManager.canvasManager.render(); 
        }
    }); 
}
