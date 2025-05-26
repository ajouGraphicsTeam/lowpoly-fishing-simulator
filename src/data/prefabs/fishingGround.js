class FishingGround extends PrefabObject {
    init() {
        // TODO:
        // 이거 무한정으로 반복해서 생성할 수 있나?? 메모리랑 GPU CPU 괜찮나? 확인

        // 낚시터 바닥
        const groundSize = 200; // 바닥 크기
        const groundGridSize = 50; // 각 격자의 크기 (작을수록 더 세밀한 텍스처)
        const groundGridCount = groundSize / groundGridSize; // 격자 개수
        
        // 바닥을 격자로 나누어 생성
        const fishingGroundPrimitives = [];
        for (let i = 0; i < 2*groundGridCount; i++) {
            for (let j = 0; j < 2*groundGridCount; j++) {
                const x1 = i * groundGridSize;
                const x2 = (i + 1) * groundGridSize;
                const z1 = -groundSize + j * groundGridSize;
                const z2 = -groundSize + (j + 1) * groundGridSize;
                
                const gridPrimitive = new QuadPrimitive(
                    vec3(x1, 0.5, z1),    // 뒤쪽 왼쪽
                    vec3(x1, 0.5, z2),    // 앞쪽 왼쪽
                    vec3(x2, 0.5, z2),    // 앞쪽 오른쪽
                    vec3(x2, 0.5, z1)     // 뒤쪽 오른쪽
                );
                fishingGroundPrimitives.push(gridPrimitive);
            }
        }
        
        this.children["fishingGround"] = new HierarchyObject(
            fishingGroundPrimitives,
            new Transform(),
            COLORS.WHITE, // 흰색으로 텍스처 본연의 색상 살렸음.
            TEXTURES.GRASS_TEXTURE // grass.jpg 텍스처 사용
        );
        
        const fishingGroundSidePrimitive = new QuadPrimitive(
            vec3(0, 0.5, -groundSize),    // 위쪽 왼쪽
            vec3(0, -2.0, -groundSize),     // 아래쪽 왼쪽
            vec3(0, -2.0, groundSize),  // 아래쪽 오른쪽
            vec3(0, 0.5, groundSize)  // 위쪽 오른쪽
        );

        this.children["fishingGroundSide"] = new HierarchyObject(
            [fishingGroundSidePrimitive],
            new Transform(),
            COLORS.WHITE,
            TEXTURES.GRASS_TEXTURE
        );
    }
} 