class Ocean extends PrefabObject {
    init() {
        // TODO:
        // 시간이 된다면, 바다에 파도 어떻게 넣을 수 없을까 고민해보기.
        // 아마 한다면 삼각기둥을 옆으로 눕힌 형태??

        // 바다 바닥
        const oceanSize = 10; // 바다 크기
        
        const oceanBasePrimitive = new QuadPrimitive(
            vec3(-oceanSize, -2.0, -oceanSize), // 앞쪽 왼쪽
            vec3(-oceanSize, -2.0, oceanSize),  // 뒤쪽 왼쪽  
            vec3(0, -2.0, oceanSize),           // 뒤쪽 오른쪽 
            vec3(0, -2.0, -oceanSize)           // 앞쪽 오른쪽
        );
        
        this.children["oceanBase"] = new HierarchyObject(
            [oceanBasePrimitive],
            new Transform(),
            COLORS.WHITE, // 흰색으로 텍스처 본연의 색상 살렸음.
            TEXTURES.OCEAN_TEXTURE 
        );
    }
} 