class Sun extends PrefabObject {
    init() {
        const sunSize = 4.0; // 태양 지름
        const halfSize = sunSize / 2;
        
        const sunVertices = [
            vec3(-halfSize, halfSize, halfSize),   
            vec3(-halfSize, -halfSize, halfSize),  
            vec3(halfSize, -halfSize, halfSize),   
            vec3(halfSize, halfSize, halfSize),    
            vec3(-halfSize, halfSize, -halfSize),   
            vec3(-halfSize, -halfSize, -halfSize), 
            vec3(halfSize, -halfSize, -halfSize),  
            vec3(halfSize, halfSize, -halfSize)   
        ];
        const sunBox = new BoxPrimitive(sunVertices);
        
        this.children["sunBody"] = new HierarchyObject(
            [sunBox],
            new Transform(),
            COLORS.YELLOW, // 밝은 노란색 -> 좀 더 하얗게 만들어도 괜찮긴 할듯.
            null
        );
    }
} 