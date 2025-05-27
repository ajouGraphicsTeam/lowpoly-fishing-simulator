/**
 * Texture utility functions for generating procedural textures
 */

/**
 * Creates a checkerboard pattern texture
 * @param {number} texSize - Size of the texture (texSize x texSize)
 * @param {number} checkSize - Size of each checker square (default: 8)
 * @returns {Uint8Array} - Texture data as Uint8Array for WebGL
 */
function createCheckerboardTexture(texSize = 64, checkSize = 8) {
    // Create a checkerboard pattern using floats
    var image1 = new Array();
    for (var i = 0; i < texSize; i++) image1[i] = new Array();
    for (var i = 0; i < texSize; i++)
        for (var j = 0; j < texSize; j++)
            image1[i][j] = new Float32Array(4);

    // Generate checkerboard pattern
    for (var i = 0; i < texSize; i++) {
        for (var j = 0; j < texSize; j++) {
            var c = (((i & checkSize) == 0) ^ ((j & checkSize) == 0));
            image1[i][j] = [c, c, c, 1];
        }
    }

    // Convert floats to ubytes for texture
    var image2 = new Uint8Array(4 * texSize * texSize);
    for (var i = 0; i < texSize; i++) {
        for (var j = 0; j < texSize; j++) {
            for (var k = 0; k < 4; k++) {
                image2[4 * texSize * i + 4 * j + k] = 255 * image1[i][j][k];
            }
        }
    }

    return image2;
}

/**
 * Creates a colored checkerboard pattern texture
 * @param {number} texSize - Size of the texture (texSize x texSize)
 * @param {Array} color1 - First color [r, g, b] (0~1 range)
 * @param {Array} color2 - Second color [r, g, b] (0~1 range)
 * @param {number} checkSize - Size of each checker square (default: 8)
 * @returns {Uint8Array} - Texture data as Uint8Array for WebGL
 */
function createColoredCheckerboardTexture(texSize = 64, color1 = [1, 1, 1], color2 = [0, 0, 0], checkSize = 8) {
    var image2 = new Uint8Array(4 * texSize * texSize);
    
    for (var i = 0; i < texSize; i++) {
        for (var j = 0; j < texSize; j++) {
            var isFirstColor = (((i & checkSize) == 0) ^ ((j & checkSize) == 0));
            var color = isFirstColor ? color1 : color2;
            
            var index = 4 * (texSize * i + j);
            image2[index] = 255 * color[0];     // R
            image2[index + 1] = 255 * color[1]; // G
            image2[index + 2] = 255 * color[2]; // B
            image2[index + 3] = 255;            // A
        }
    }

    return image2;
}

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
 * Creates a gradient texture
 * @param {number} texSize - Size of the texture
 * @param {Array} color1 - Start color [r, g, b] (0-1 range)
 * @param {Array} color2 - End color [r, g, b] (0-1 range)
 * @param {string} direction - 'horizontal' or 'vertical'
 * @returns {Uint8Array} - Gradient texture data
 */
function createGradientTexture(texSize = 64, color1 = [1, 0, 0], color2 = [0, 0, 1], direction = 'horizontal') {
    var image = new Uint8Array(4 * texSize * texSize);
    
    for (var i = 0; i < texSize; i++) {
        for (var j = 0; j < texSize; j++) {
            var t = direction === 'horizontal' ? j / (texSize - 1) : i / (texSize - 1);
            
            var r = color1[0] * (1 - t) + color2[0] * t;
            var g = color1[1] * (1 - t) + color2[1] * t;
            var b = color1[2] * (1 - t) + color2[2] * t;
            
            var index = 4 * (texSize * i + j);
            image[index] = 255 * r;     // R
            image[index + 1] = 255 * g; // G
            image[index + 2] = 255 * b; // B
            image[index + 3] = 255;     // A
        }
    }
    
    return image;
}

/**
 * Creates a striped texture
 * @param {number} texSize - Size of the texture
 * @param {Array} color1 - First color [r, g, b] (0-1 range)
 * @param {Array} color2 - Second color [r, g, b] (0-1 range)
 * @param {number} stripeWidth - Width of each stripe
 * @param {string} direction - 'horizontal' or 'vertical'
 * @returns {Uint8Array} - Striped texture data
 */
function createStripedTexture(texSize = 64, color1 = [1, 1, 1], color2 = [0, 0, 0], stripeWidth = 8, direction = 'horizontal') {
    var image = new Uint8Array(4 * texSize * texSize);
    
    for (var i = 0; i < texSize; i++) {
        for (var j = 0; j < texSize; j++) {
            var coord = direction === 'horizontal' ? j : i;
            var isFirstColor = Math.floor(coord / stripeWidth) % 2 === 0;
            var color = isFirstColor ? color1 : color2;
            
            var index = 4 * (texSize * i + j);
            image[index] = 255 * color[0];     // R
            image[index + 1] = 255 * color[1]; // G
            image[index + 2] = 255 * color[2]; // B
            image[index + 3] = 255;            // A
        }
    }
    
    return image;
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
    image.crossOrigin = "anonymous"; // CORS 문제 방지
    
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