class SkyBox extends PrefabObject {
    init() {
        
        // 이거 skyBox를 box로 생성하면, 법선 벡터가 바깥쪽이라 안됨.
        // box primitive의 법선 벡터를 반대로 할 수 있게 parameter에 flag를 삽입할 수도 있겠으나,
        // 굳이 원래 있는 class를 바꾸기보단, 그냥 이렇게 quad primitive 6개로 만들기로 결정함.
        
        const skyboxSize = 100; // 한 변의 길이
        const halfSize = skyboxSize / 2;
        
        // 정육면체의 8개 꼭짓점 정의
        const skyboxVertices = [
            vec3(-halfSize, halfSize, halfSize),   // 0: 앞쪽 왼쪽 위
            vec3(-halfSize, -halfSize, halfSize),  // 1: 앞쪽 왼쪽 아래
            vec3(halfSize, -halfSize, halfSize),   // 2: 앞쪽 오른쪽 아래
            vec3(halfSize, halfSize, halfSize),    // 3: 앞쪽 오른쪽 위
            vec3(-halfSize, halfSize, -halfSize),   // 4: 뒤쪽 왼쪽 위
            vec3(-halfSize, -halfSize, -halfSize), // 5: 뒤쪽 왼쪽 아래
            vec3(halfSize, -halfSize, -halfSize),  // 6: 뒤쪽 오른쪽 아래
            vec3(halfSize, halfSize, -halfSize)   // 7: 뒤쪽 오른쪽 위
        ];
        
        // 각 면을 개별적으로 생성하여 다른 텍스처/색상 적용 가능 + 법선 벡터 방향 안쪽 향하게 함.
        var skyTexture = TEXTURES.SKY_TEXTURE;
        
        // 위쪽 면(하늘)
        const topFace = new QuadPrimitive(
            skyboxVertices[3], skyboxVertices[0], skyboxVertices[4], skyboxVertices[7]
        );
        this.children["skyTop"] = new HierarchyObject(
            [topFace],
            new Transform(),
            COLORS.SKY_LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            skyTexture
        );
        
        // 아래쪽 면
        const bottomFace = new QuadPrimitive(
            skyboxVertices[1], skyboxVertices[2], skyboxVertices[6], skyboxVertices[5]
        );
        this.children["skyBottom"] = new HierarchyObject(
            [bottomFace],
            new Transform(),
            COLORS.SKY_LIGHT_BLUE,
            skyTexture
        );
        
        // 앞쪽 면
        const frontFace = new QuadPrimitive(
            skyboxVertices[3], skyboxVertices[2], skyboxVertices[1], skyboxVertices[0]
        );
        this.children["skyFront"] = new HierarchyObject(
            [frontFace],
            new Transform(),
            COLORS.SKY_LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            skyTexture
        );
        
        // 뒤쪽 면
        const backFace = new QuadPrimitive(
            skyboxVertices[4], skyboxVertices[5], skyboxVertices[6], skyboxVertices[7]
        );
        this.children["skyBack"] = new HierarchyObject(
            [backFace],
            new Transform(),
            COLORS.SKY_LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            skyTexture
        );
        
        // 왼쪽 면
        const leftFace = new QuadPrimitive(
            skyboxVertices[0], skyboxVertices[1], skyboxVertices[5], skyboxVertices[4]
        );
        this.children["skyLeft"] = new HierarchyObject(
            [leftFace],
            new Transform(),
            COLORS.SKY_LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            skyTexture
        );
        
        // 오른쪽 면
        const rightFace = new QuadPrimitive(
            skyboxVertices[7], skyboxVertices[6], skyboxVertices[2], skyboxVertices[3]
        );
        this.children["skyRight"] = new HierarchyObject(
            [rightFace],
            new Transform(),
            COLORS.SKY_LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            skyTexture
        );
    }
    
} 