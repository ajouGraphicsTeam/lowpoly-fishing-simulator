class Ocean extends PrefabObject {
    init() {
        // TODO:
        // 시간이 된다면, 바다에 파도 어떻게 넣을 수 없을까 고민해보기.
        // 아마 한다면 삼각기둥을 옆으로 눕힌 형태??

        // 바다 바닥
        const oceanSize = 200; // 바다 크기 (크게 확장)
        const oceanGridSize = 50; // 각 격자의 크기 (작을수록 더 세밀한 텍스처)
        const oceanGridCount = oceanSize / oceanGridSize; // 격자 개수
        
        // 바다를 격자로 나누어 생성
        const oceanBasePrimitives = [];
        for (let i = 0; i < 2*oceanGridCount; i++) {
            for (let j = 0; j < 2*oceanGridCount; j++) {
                const x1 = -oceanSize + i * oceanGridSize;
                const x2 = -oceanSize + (i + 1) * oceanGridSize;
                const z1 = -oceanSize + j * oceanGridSize;
                const z2 = -oceanSize + (j + 1) * oceanGridSize;
                
                const oceanGridPrimitive = new QuadPrimitive(
                    vec3(x1, -2.0, z1), // 앞쪽 왼쪽
                    vec3(x1, -2.0, z2), // 뒤쪽 왼쪽  
                    vec3(x2, -2.0, z2), // 뒤쪽 오른쪽 
                    vec3(x2, -2.0, z1)  // 앞쪽 오른쪽
                );
                oceanBasePrimitives.push(oceanGridPrimitive);
            }
        }
        
        this.children["oceanBase"] = new HierarchyObject(
            oceanBasePrimitives,
            new Transform(),
            COLORS.WHITE, // 흰색으로 텍스처 본연의 색상 살렸음.
            TEXTURES.OCEAN_TEXTURE 
        );
    }
} 