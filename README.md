# lowpoly-fishing-simulator

webgl fishing simulator project

## 설계 아이디어

기본적으로 모든 drawtype은 Triangle로

hierarchyManager가 modelViewMatrix를 전파하여 사용

localSpaceManager?
ㅏ 애니메이션
ㅏ 트랜스폼
ㅏ 프리팹들
ㄴ 하위 localSpaceManager

---

## gemini가 짜준거

```mermaid
classDiagram
    class CanvasManager {
        +init()
        +render()
        +resize()
        +getRenderingContext()
    }
    class HierarchyObject {
        +addLocalSpace(localSpace)
        +removeLocalSpace(localSpace)
        +updateTransforms()
        +traverse(callback)
    }
    class LocalSpaceManager {
        +name: string
        +transform: Matrix4
        +animationManager: AnimationManager
        +addPrefab(prefab)
        +removePrefab(prefab)
        +update()
        +traversePrefabs(callback)
    }
    class AnimationManager {
        +animations: Map<string, Animation>
        +update(deltaTime)
        +playAnimation(name)
        +stopAnimation(name)
    }
    class Prefab {
        +name: string
        +transform: Matrix4
        +addPrimitive(primitive)
        +getVertices(): Float32Array
        +applyAnimationTransform(animationTransform: Matrix4)
    }
    class Primitive {
        +vertices: Float32Array
        +color: Vector4
        +getTransformedVertices(transform: Matrix4): Float32Array
    }

    CanvasManager --o HierarchyObject : manages
    HierarchyObject --o LocalSpaceManager : manages*
    LocalSpaceManager --o Prefab : manages*
    LocalSpaceManager --o AnimationManager : has
    Prefab --o Primitive : has*
```

```mermaid
graph TD
    A("CanvasManager.draw()") --> B{"HierarchyObject.traverse()"};
    B -- Visit LocalSpaceManager --> C["LocalSpaceManager.update()"];
    C -- Update Animation --> D("AnimationManager.update(deltaTime)");
    D -- Apply Animation Transform to Prefabs --> E["LocalSpaceManager.traversePrefabs()"];
    E -- Visit Prefab --> F{"Prefab.applyAnimationTransform(animationTransform)"};
    F -- Get Primitive --> G{"Primitive.getTransformedVertices(compositeTransform)"};
    G -- Apply Composite Transform --> H(Transformed Vertices);
    H --> I{Collect All Vertices};
    I --> J("gl.drawArrays(mode, first, count)");
```
