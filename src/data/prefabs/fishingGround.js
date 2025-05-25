class FishingGround extends PrefabObject {
    init() {
        // TODO:
        // 이거 무한정으로 반복해서 생성할 수 있나?? 메모리랑 GPU CPU 괜찮나? 확인

        // 낚시터 바닥
        const groundSize = 10; // 바닥 크기
    
        const fishingGroundPrimitive = new QuadPrimitive(
            vec3(0, 0.5, -groundSize),    // 앞쪽 왼쪽
            vec3(0, 0.5, groundSize),     // 뒤쪽 왼쪽
            vec3(groundSize, 0.5, groundSize),  // 뒤쪽 오른쪽
            vec3(groundSize, 0.5, -groundSize)  // 앞쪽 오른쪽
        );
        
        this.children["fishingGround"] = new HierarchyObject(
            [fishingGroundPrimitive],
            new Transform(),
            COLORS.WHITE, // 흰색으로 텍스처 본연의 색상 살렸음.
            TEXTURES.GRASS_TEXTURE // grass.jpg 텍스처 사용
        );
        
    }
} 