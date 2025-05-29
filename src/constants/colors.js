// Material colors
const COLORS = {
    RED: {
        ambient: vec4(0.5, 0.2, 0.2, 1.0),
        diffuse: vec4(0.9, 0.3, 0.3, 1.0),
        specular: vec4(1.0, 0.8, 0.8, 1.0)
    },
    GREEN: {
        ambient: vec4(0.2, 0.5, 0.2, 1.0),
        diffuse: vec4(0.3, 0.8, 0.3, 1.0),
        specular: vec4(0.8, 1.0, 0.8, 1.0)
    },
    BLUE: {
        ambient: vec4(0.2, 0.2, 0.5, 1.0),
        diffuse: vec4(0.3, 0.4, 0.9, 1.0),
        specular: vec4(0.8, 0.8, 1.0, 1.0)
    },
    SKY_BLUE: {
        ambient: vec4(0.4, 0.6, 0.8, 1.0),
        diffuse: vec4(0.5, 0.8, 1.0, 1.0),
        specular: vec4(0.8, 0.9, 1.0, 1.0)
    },
    YELLOW: {
        ambient: vec4(0.5, 0.5, 0.2, 1.0),
        diffuse: vec4(1.0, 0.9, 0.3, 1.0),
        specular: vec4(1.0, 1.0, 0.8, 1.0)
    },
    CYAN: {
        ambient: vec4(0.2, 0.5, 0.5, 1.0),
        diffuse: vec4(0.3, 0.9, 0.9, 1.0),
        specular: vec4(0.8, 1.0, 1.0, 1.0)
    },
    MAGENTA: {
        ambient: vec4(0.5, 0.2, 0.5, 1.0),
        diffuse: vec4(0.9, 0.3, 0.9, 1.0),
        specular: vec4(1.0, 0.8, 1.0, 1.0)
    },
    WHITE: {
        ambient: vec4(0.8, 0.8, 0.8, 1.0),
        diffuse: vec4(0.95, 0.95, 0.95, 1.0),
        specular: vec4(1.0, 1.0, 1.0, 1.0)
    },
    BLACK: {
        ambient: vec4(0.1, 0.1, 0.1, 1.0),
        diffuse: vec4(0.2, 0.2, 0.2, 1.0),
        specular: vec4(0.4, 0.4, 0.4, 1.0)
    },
    GRAY: {
        ambient: vec4(0.4, 0.4, 0.4, 1.0),
        diffuse: vec4(0.6, 0.6, 0.6, 1.0),
        specular: vec4(0.8, 0.8, 0.8, 1.0)
    },
    DARK_YELLOW: {
        ambient: vec4(0.5, 0.4, 0.1, 1.0),
        diffuse: vec4(0.9, 0.7, 0.2, 1.0),
        specular: vec4(1.0, 0.8, 0.4, 1.0) 
    },
    DARK_GREEN: {
        ambient: vec4(0.1, 0.3, 0.1, 1.0),
        diffuse: vec4(0.2, 0.6, 0.2, 1.0),
        specular: vec4(0.4, 0.8, 0.4, 1.0)
    },
    LIGHT_BLUE: {
        ambient: vec4(0.3, 0.4, 0.6, 1.0),
        diffuse: vec4(0.5, 0.7, 0.9, 1.0),
        specular: vec4(0.8, 0.9, 1.0, 1.0)
    },
    SKY_LIGHT_BLUE: {
        ambient: vec4(3.0, 3.0, 3.0, 1.0),   // 텍스처와 곱해져도 밝게
        diffuse: vec4(0, 0, 0, 1.0),         
        specular: vec4(0, 0, 0, 1.0)         
    },
    LIGHT_DARK_BLUE: {
        ambient: vec4(0.1, 0.2, 0.3, 1.0),
        diffuse: vec4(0.2, 0.4, 0.6, 1.0),
        specular: vec4(0.4, 0.6, 0.8, 1.0)
    },
    ORANGE: {
        ambient: vec4(0.5, 0.3, 0.1, 1.0),
        diffuse: vec4(0.9, 0.5, 0.2, 1.0),
        specular: vec4(1.0, 0.7, 0.4, 1.0)
    },
    BROWN: {
        ambient: vec4(0.3, 0.2, 0.1, 1.0),
        diffuse: vec4(0.6, 0.4, 0.2, 1.0),
        specular: vec4(0.8, 0.6, 0.4, 1.0)
    },
    WHITE_BRIGHT: {
        ambient: vec4(1.0, 1.0, 1.0, 1.0),  // 최대 밝기
        diffuse: vec4(1.0, 1.0, 1.0, 1.0),  // 최대 밝기
        specular: vec4(1.0, 1.0, 1.0, 1.0)  // 최대 밝기
    }
}; 
/*
    색상들을 DARK_YELLOW처럼, 최대한 현실적이고 약간 바랜 듯한 색들로 색을 깎았음.
*/