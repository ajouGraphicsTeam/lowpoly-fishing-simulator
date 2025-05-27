class SkyBox extends PrefabObject {
    init() {
        // TODO:
        // 이거 빛에서 먼 벽이 더 밝게 나옴... 왜지...???
        // 수정 필요함

        // Skybox는 카메라를 중심으로 거대한 정육면체를 만들어서 하늘 효과를 냄
        // 카메라가 움직여도 항상 따라다니도록 함
        
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
        
        // 각 면을 개별적으로 생성하여 다른 텍스처/색상 적용 가능
        
        // 위쪽 면(하늘)
        const topFace = new QuadPrimitive(
            skyboxVertices[3], skyboxVertices[0], skyboxVertices[4], skyboxVertices[7]
        );
        this.children["skyTop"] = new HierarchyObject(
            [topFace],
            new Transform(),
            COLORS.LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            null
        );
        
        // 아래쪽 면
        const bottomFace = new QuadPrimitive(
            skyboxVertices[1], skyboxVertices[2], skyboxVertices[6], skyboxVertices[5]
        );
        this.children["skyBottom"] = new HierarchyObject(
            [bottomFace],
            new Transform(),
            COLORS.LIGHT_BLUE,
            null
        );
        
        // 앞쪽 면
        const frontFace = new QuadPrimitive(
            skyboxVertices[3], skyboxVertices[2], skyboxVertices[1], skyboxVertices[0]
        );
        this.children["skyFront"] = new HierarchyObject(
            [frontFace],
            new Transform(),
            COLORS.LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            null
        );
        
        // 뒤쪽 면
        const backFace = new QuadPrimitive(
            skyboxVertices[4], skyboxVertices[5], skyboxVertices[6], skyboxVertices[7]
        );
        this.children["skyBack"] = new HierarchyObject(
            [backFace],
            new Transform(),
            COLORS.LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            null
        );
        
        // 왼쪽 면
        const leftFace = new QuadPrimitive(
            skyboxVertices[0], skyboxVertices[1], skyboxVertices[5], skyboxVertices[4]
        );
        this.children["skyLeft"] = new HierarchyObject(
            [leftFace],
            new Transform(),
            COLORS.LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            null
        );
        
        // 오른쪽 면
        const rightFace = new QuadPrimitive(
            skyboxVertices[7], skyboxVertices[6], skyboxVertices[2], skyboxVertices[3]
        );
        this.children["skyRight"] = new HierarchyObject(
            [rightFace],
            new Transform(),
            COLORS.LIGHT_BLUE,
            //TEXTURES.GRADIENT_BLUE_CYAN_H // 하늘 그라데이션
            null
        );
    }
    
    // 카메라 위치에 따라 skybox 위치를 업데이트하는 메서드
    updatePosition(cameraPosition) {
        // skybox는 항상 카메라를 중심으로 위치해야 함
        this.transform.position = vec3(cameraPosition[0], cameraPosition[1], cameraPosition[2]);
    }
} 