class Ocean extends PrefabObject {
    init() {

        // 바다 바닥
        const oceanSize = 50; // 바닥 크기
        const oceanGridSize = 50; // 각 격자의 크기
        const oceanGridCount = oceanSize / oceanGridSize; // 격자 개수
        
        const oceanBasePrimitives = [];
        for (let i = 0; i < 2*oceanGridCount; i++) {
            for (let j = 0; j < 2*oceanGridCount; j++) {
                const x1 = -oceanSize + i * oceanGridSize;
                const x2 = -oceanSize + (i + 1) * oceanGridSize;
                const z1 = -oceanSize + j * oceanGridSize;
                const z2 = -oceanSize + (j + 1) * oceanGridSize;
                
                const oceanGridPrimitive = new QuadPrimitive(
                    vec3(x1, -2.0, z1),
                    vec3(x1, -2.0, z2), 
                    vec3(x2, -2.0, z2), 
                    vec3(x2, -2.0, z1)  
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