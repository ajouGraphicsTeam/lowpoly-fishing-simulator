/**
 * Texture utility functions for generating procedural textures
 */

/**
 * Creates a WebGL texture from texture data
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {Uint8Array} textureData - Texture data
 * @param {number} width - Texture width
 * @param {number} height - Texture height
 * @returns {WebGLTexture} - WebGL texture object
 */
function createWebGLTexture(gl, textureData, width, height) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, textureData);
    
    // Set texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    
    return texture;
}

/**
 * Creates a WebGL texture from an image file
 * @param {WebGLRenderingContext} gl - WebGL context
 * @param {string} imagePath - Path to the image file
 * @param {Function} callback - Callback function called when texture is loaded (optional)
 * @returns {WebGLTexture} - WebGL texture object (initially with placeholder)
 */
function createTextureFromImage(gl, imagePath, callback = null) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    // 이미지 로딩 전까지 임시로 파란색 픽셀 사용
    const placeholder = new Uint8Array([0, 0, 255, 255]); // 파란색
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);
    
    // 이미지 로드
    const image = new Image();
    image.crossOrigin = "anonymous"; // CORS 문제 방지, 우리 프로젝트에선 딱히 필요x(local 파일들만 사용하니까)
    
    image.onload = function() {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        
        // 이미지 크기가 2의 거듭제곱인지 확인
        if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
            // 2의 거듭제곱이면 mipmap 생성 가능
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        } else {
            // 2의 거듭제곱이 아니면 CLAMP_TO_EDGE와 LINEAR 사용
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        } // 이부분 복습 필요
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        
        // 콜백 함수 호출 (렌더링 업데이트 등)
        if (callback) {
            callback();
        }
        
        console.log(`텍스처 로드 완료: ${imagePath} (${image.width}x${image.height})`);
    };
    
    image.onerror = function() {
        console.error(`텍스처 로드 실패: ${imagePath}`);
    };
    
    image.src = imagePath;
    return texture;
}

/**
 * 숫자가 2의 거듭제곱인지 확인
 * @param {number} value - 확인할 숫자
 * @returns {boolean} - 2의 거듭제곱이면 true
 */
function isPowerOf2(value) {
    return (value & (value - 1)) === 0;
}