# lowpoly-fishing-simulator

webgl fishing simulator project

## 설계 아이디어

기본적으로 모든 drawtype은 Triangle로

hierarchyManager가 frameMatrix를 전파하여 사용

모든 매니저들은 rootManager에서 접근 가능함.

## 애니메이션 관련

data의 prefabs/robotArm.js와 animators/robotArm.js를 보면 예시가 되어있는데,
Animator의 animationData는 gemini한테

````
아래 코드는 내가 webgl로 만든 로봇팔이야
```
class RobotArm extends PrefabObject {
  init() {
    this.animator = new RobotArmAnimator(this);

    const _box = new BoxPrimitive([
      [-0.1, 0.5, 0.025],
      [0.1, 0.5, 0.025],
      [0.1, -0.5, 0.025],
      [-0.1, -0.5, 0.025],
      [-0.1, 0.5, -0.025],
      [0.1, 0.5, -0.025],
      [0.1, -0.5, -0.025],
      [-0.1, -0.5, -0.025],
    ]);

    const _arm = new HierarchyObject([_box], new Transform());
    _arm.children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        })
      ),
    };
    _arm.children["innerArm"].children = {
      innerArm: new HierarchyObject(
        [_box],
        new Transform({
          position: vec3(0, 1, 0),
          rotation: vec3(0, 0, 30),
          anchor: vec3(0, 0.5, 0),
        })
      ),
    };

    this.children = {
      arm: _arm,
    };
  }
}
```

위 계층적 구조를 가지고 있는 로봇팔이 자연스럽게 좌우로 흔들리는 애니메이션을 만들 생각이거든?
살짝 bvh파일처럼 해석될 수 있는 json 형식을 아래와 같이 정의했어

```

여기에다가는
(new RobotArm()).getAnimationFrameFormat()
의 결과값을 넣으면 된다.


```
위 배열의 값을 초기상태로 60 프래임짜리 애니메이션을 6초 정도 만들고 싶은데 JS로 위와 같은 형식의 배열을 생성할 수 있는 코드를 짜줘
````

처럼 물어보면 찍어준다. (2.5 pro에서 테스트해봄)

## 작업할거 Tip

fishing.html의 main 부분이랑
objects/hierarchyObject.js,
data/prefabs/robotArm.js 부분만 참고해서 보면 될 듯

밑에는 할 작업들인데 순서는 상관없고 매번 브랜치를 하나씩 파서 작업하면 좋을듯

### color나 texture부분은 canvasManager에서 다룰 수 있는데

```
rootManager.canvasManager.lightAmbient = vec4(0.2, 0.2, 0.2, 1.0)
rootManager.canvasManager.lightingSync()
```

처럼 하면 됨.

아니면 colorManager나 textureManager같은거 만들어도 되고

내생각엔 HierarchyObject 클래스에 color나 texture 필드를 추가해서 만들면 될 것 같음

### 마우스 이벤트

fishing.html의 마지막에 mouse scirpt가 있는데 여기에 추가하면 될듯

handleMouseDown에 e.button === 1인 경우로 두고

### primitive 정리

적당히 primitives.js에 정리하면 될듯

---

# gemini가 짜준거

# WebGL 계층적 객체 렌더러 (요약)

이 프로젝트는 WebGL을 사용하여 계층 구조를 가진 3D 객체를 렌더링하는 방법을 보여줍니다. 부모-자식 관계를 가진 객체를 정의할 수 있으며, 부모 객체에 적용된 변환(이동, 회전, 크기 조절)은 자식 객체에도 동일하게 영향을 미칩니다. 렌더링에는 Blinn-Phong 조명 모델이 사용됩니다.

## 주요 기능

- **계층적 씬 그래프:** 객체들을 중첩하여 계층 구조로 관리합니다.
- **변환 컴포넌트:** 각 객체는 위치, 회전(앵커 포인트 지정 가능), 크기를 관리하는 `Transform` 컴포넌트를 가집니다. 변환은 자식에게 자동으로 전파됩니다.
- **기본 도형:** `QuadPrimitive`(사각형), `BoxPrimitive`(육면체)와 같은 기본 도형을 제공합니다.
- **프리팹 시스템:** `RobotArm`과 같이 복잡한 객체를 재사용 가능한 프리팹으로 정의할 수 있습니다.
- **WebGL 렌더링:** 커스텀 버텍스 및 프래그먼트 셰이더를 사용합니다.
- **Blinn-Phong 조명:** 버텍스 셰이더에서 기본적인 조명 계산을 수행합니다.
- **상호작용 컨트롤:**
  - 조명 위치 조절
  - 카메라 제어 (eye, at, up 벡터) 및 프리셋 (정면, 측면, 상단) 제공
  - 마우스 드래그를 통한 카메라 이동

## 핵심 파일 구조 및 역할

- `main.html`: 캔버스, UI 컨트롤, 셰이더 설정 및 WebGL 애플리케이션 초기화.
- `src/components/`:
  - `primitive.js`: 기본 도형(`PrimitiveBase`, `QuadPrimitive`, `BoxPrimitive`) 정의.
  - `transform.js`: 객체 변환 및 행렬 계산을 위한 `Transform` 클래스.
- `src/objects/`:
  - `hierarchyObject.js`: 씬 계층 내 객체의 핵심 클래스. 자식, 프리미티브, 변환 관리 및 재귀적 드로잉 처리.
  - `prefabObject.js`: 프리팹 객체 생성을 위한 기본 클래스.
- `src/data/prefabs/robotArm.js`: `RobotArm` 프리팹 정의 (계층 구조 예시).
- `src/managers/`: (추정) `RootManager`, `CanvasManager`, `CameraManager` 등 애플리케이션 관리 클래스.
- 셰이더 (main.html 내): 버텍스 변환 및 조명 계산(버텍스 셰이더), 색상 적용(프래그먼트 셰이더).

## 주요 클래스 및 개념

### `HierarchyObject` (계층 객체)

- 씬 객체의 기본 단위.
- 자신의 지역 변환(`transform`)과 부모로부터 전달받은 변환을 결합하여 최종 월드 변환을 계산.
- `drawRecursively(부모_월드_행렬)`:
  1.  자신의 최종 월드 행렬 계산: `부모_월드_행렬 * 자신의_로컬_변환_행렬`.
  2.  자신의 프리미티브(도형)를 `draw()` 메소드를 통해 그림.
  3.  각 자식 객체에 대해 `drawRecursively()`를 재귀적으로 호출하며, 자신의 최종 월드 행렬을 `부모_월드_행렬`로 전달.
- `draw(부모_월드_행렬)`:
  1.  자신의 최종 모델 행렬을 계산하여 셰이더에 전달.
  2.  자신의 정점 및 법선 데이터를 WebGL 버퍼에 업로드.
  3.  `gl.drawArrays()` 호출하여 렌더링.

### `Transform` (변환)

- 객체의 로컬 위치, 회전, 크기 및 회전 기준점(`anchor`)을 관리.
- 이 값들이 변경되면 자동으로 모델 행렬(`modelMat`)을 갱신.

## 렌더링 흐름 요약

1.  **초기화:** WebGL 컨텍스트, 셰이더, 버퍼 등을 설정하고, `RobotArm`과 같은 프리팹 객체를 생성하여 씬 그래프에 추가.
2.  **렌더 호출:** `canvasManager.render()`가 호출되면, 캔버스를 지우고 카메라/조명 등 전역 상태 설정 후, 루트 객체의 `drawRecursively()`를 호출하며 렌더링 시작.
3.  **재귀적 드로잉 (`HierarchyObject.drawRecursively()`):**
    - 각 객체는 부모로부터 받은 행렬과 자신의 로컬 변환 행렬을 곱해 현재 자신의 월드 행렬을 계산.
    - 자신의 도형을 그리고, 계산된 월드 행렬을 자식 객체에게 전달하며 재귀적으로 `drawRecursively()`를 호출.
4.  **셰이더 실행:** 각 객체의 정점 데이터는 버텍스 셰이더에서 변환 및 조명 계산 후, 프래그먼트 셰이더에서 최종 색상이 결정되어 화면에 그려짐.

## 실행 방법

1.  로컬 웹 서버를 사용하여 파일들을 호스팅합니다. (브라우저 보안 정책)
2.  `main.html`에 명시된 경로에 맞게 모든 JavaScript 파일(`primitive.js`, `transform.js` 등) 및 `Common/` 디렉토리의 유틸리티 스크립트를 배치합니다.
3.  웹 서버를 통해 `main.html` 파일을 엽니다.

## 렌더링 과정 순서도 (Mermaid)

```mermaid
graph TD
    A[main.html / RootManager 초기화] --> B(WebGL 캔버스 및 셰이더 설정);
    B --> C{RobotArm 프리팹 생성};
    C -- RobotArm.init() --> D[팔 계층 구조 빌드: HierarchyObject 자식들 + BoxPrimitives 및 Transforms];
    A --> E(카메라/조명 UI 이벤트 리스너 설정);

    subgraph RenderLoop [최초 로드 또는 UI 변경 시 트리거]
        F[CanvasManager.render()] --> G[전역 유니폼 설정: View, Projection, Light];
        G --> H[rootObject.drawRecursively(단위 행렬)];
    end

    subgraph RecursiveDraw [HierarchyObject.drawRecursively(부모_행렬)]
        I[현재_월드_행렬 = 부모_행렬 * 로컬_Transform.modelMat 계산] --> J[Self.draw(부모_행렬)];
        J --> K[현재_월드_행렬을 uModelMat으로 셰이더에 전송];
        K --> L[자신의 프리미티브 정점/법선 데이터 바인딩 및 버퍼링];
        L --> M[gl.drawArrays()];
        I --> N{각 자식 객체에 대해};
        N -- Yes --> O[ChildObject.drawRecursively(현재_월드_행렬)];
        N -- No --> P[현재 분기 종료];
        O --> RecursiveDraw;
    end

    M --> Q[버텍스 셰이더: 정점 변환, 조명 계산];
    Q --> R[프래그먼트 셰이더: 색상 적용];
    R --> S[캔버스에 표시];

    E -- 사용자 상호작용 --> F;
```

# WebGL Hierarchical Object Renderer

요약 안된 부분

This project demonstrates rendering hierarchical 3D objects using WebGL. It supports defining objects with parent-child relationships, where transformations (translation, rotation, scale) applied to a parent object also affect its children. The rendering includes Blinn-Phong lighting.

## Features

- **Hierarchical Scene Graph:** Objects can be nested within each other.
- **Transformation Component:** Each object has a `Transform` component managing its position, rotation (with optional anchor point), and scale. Transformations are automatically propagated to children.
- **Geometric Primitives:** Includes `QuadPrimitive` and `BoxPrimitive` as basic building blocks.
- **Prefab System:** Allows defining complex objects like `RobotArm` as reusable prefabs.
- **WebGL Rendering:** Uses custom vertex and fragment shaders for rendering.
- **Blinn-Phong Lighting:** Implements basic lighting calculations in the vertex shader.
- **Interactive Controls:**
  - Adjust light position.
  - Control camera (eye, at, up vectors) with presets (front, side, top).
  - Mouse-driven camera movement (click and drag on the canvas).

## File Structure

- `main.html`: The main HTML file that sets up the canvas, UI controls, shaders, and initializes the WebGL application.
- `src/components/primitive.js`: Defines base classes for geometric primitives (`PrimitiveBase`, `QuadPrimitive`, `BoxPrimitive`).
- `src/components/transform.js`: Defines the `Transform` class for handling object transformations and matrix calculations.
- `src/objects/hierarchyObject.js`: The core class for objects in the scene hierarchy. Manages children, primitives, and its own transform. Handles recursive drawing.
- `src/objects/prefabObject.js`: A base class for creating predefined complex objects, extending `HierarchyObject`.
- `src/data/prefabs/robotArm.js`: Defines the `RobotArm` prefab, showcasing a hierarchical structure.
- `src/managers/`: (Assumed based on `main.html` and common practice)
  - `rootManager.js`: Manages the overall application state and object hierarchy.
  - `canvasManager.js`: Handles WebGL canvas setup, shader compilation, buffer management, and the main render loop.
  - `cameraManager.js`: Manages camera properties and view matrix.
  - `animationManager.js`: (Placeholder/Future) Intended for managing animations.
- `Common/`: Contains utility scripts like `webgl-utils.js`, `initShaders.js`, and `MV.js` (likely a matrix/vector library).
- Vertex Shader (in `main.html`): Handles vertex transformation and Blinn-Phong lighting calculations.
- Fragment Shader (in `main.html`): Applies the calculated color to fragments.

## Key Classes and Concepts

### `PrimitiveBase` (and its derivatives `QuadPrimitive`, `BoxPrimitive`)

- Responsible for defining the raw geometry (vertices and normals) of a shape.
- `QuadPrimitive`: Creates a 2D quad (composed of two triangles).
- `BoxPrimitive`: Creates a 3D box (composed of six `QuadPrimitive`s).

### `Transform`

- Manages an object's local position, rotation (Euler angles), and scale.
- Includes an `anchor` property for specifying a rotation pivot other than the object's origin.
- Automatically computes and updates its `modelMat` (local model matrix) when transform properties change.
- The `rotateMat` helper function is used to create rotation matrices, handling rotation around an arbitrary fixed point.

### `HierarchyObject`

- The fundamental building block for scene objects.
- `parent`: A reference to its parent `HierarchyObject`.
- `children`: A dictionary of named child `HierarchyObject`s.
- `transform`: An instance of the `Transform` class for its local transformations.
- `_primitives`: An array of `PrimitiveBase` instances that make up this object's geometry.
- `_mergedVertices` & `_mergedNormals`: Aggregated vertex and normal data from its `_primitives`.
- `drawRecursively(parentsFrameMat)`:
  1.  Calculates its own world matrix by multiplying `parentsFrameMat` with its local `transform.modelMat`.
  2.  Calls its `draw()` method to render its own primitives.
  3.  Recursively calls `drawRecursively()` on all its children, passing its calculated world matrix as the new `parentsFrameMat`.
- `draw(parentsFrameMat)`:
  1.  Calculates the final model matrix (`frameMat`) by multiplying `parentsFrameMat` with its local `transform.modelMat`.
  2.  Sends this `frameMat` to the vertex shader as `uModelMat`.
  3.  Binds and uploads its `_mergedVertices` and `_mergedNormals` to WebGL buffers.
  4.  Calls `gl.drawArrays()` to render its primitives.

### `PrefabObject` (and `RobotArm`)

- Extends `HierarchyObject` to simplify the creation of complex, pre-defined objects.
- `RobotArm` uses its `init()` method to construct its internal hierarchy of `HierarchyObject`s, each with `BoxPrimitive`s and specific `Transform`s.

## Rendering Flow

The rendering process is initiated and managed primarily by `CanvasManager` (via `RootManager`) and the `HierarchyObject`'s recursive drawing mechanism.

1.  **Initialization (`main.html`, `RootManager`):**

    - WebGL context is obtained, shaders are compiled and linked.
    - Buffer IDs for vertices and normals are created.
    - The root `HierarchyObject` is established (managed by `RootManager`).
    - Prefab objects (like `RobotArm`) are instantiated and added as children to the scene graph. Their `init()` methods build their internal structure.

2.  **Render Call (`canvasManager.render()`):**

    - This function typically clears the canvas.
    - Sets up global rendering state (like view and projection matrices from `CameraManager`, light properties).
    - Initiates the drawing process by calling `drawRecursively()` on the root `HierarchyObject` of the scene, usually with an identity matrix as the initial `parentsFrameMat`.

3.  **Recursive Drawing (`HierarchyObject.drawRecursively()`):**

    - **Calculate World Matrix:** The current object computes its world transformation matrix (`frameMat`) by premultiplying the `parentsFrameMat` with its own local `transform.modelMat`.
      - `frameMat = parentsFrameMat * this.transform.modelMat`
    - **Draw Self:** The object calls its own `draw(parentsFrameMat)` method.
      - Inside `draw()`:
        1.  The final `frameMat` is sent to the vertex shader (`uModelMat`).
        2.  Vertex and normal data for the current object's primitives are bound and uploaded to GPU buffers.
        3.  `gl.drawArrays()` is called to render the current object's geometry.
    - **Draw Children:** The object iterates through its `children` and calls `drawRecursively()` on each child, passing its own calculated `frameMat` as the `parentsFrameMat` for the child. This ensures transformations accumulate down the hierarchy.

4.  **Shader Execution (Vertex & Fragment Shaders):**
    - **Vertex Shader:**
      - Receives vertex positions (`aVertexPosition`) and normals (`aVertexNormal`).
      - Transforms vertices using `uProjectionMat * uViewMat * uModelMat * aVertexPosition`.
      - Performs Blinn-Phong lighting calculations using transformed normals, light position, and material properties to determine `fColor`.
    - **Fragment Shader:**
      - Receives interpolated `fColor` from the vertex shader.
      - Assigns `fColor` to `gl_FragColor`, determining the pixel's final color.

## Mermaid Flowchart: Rendering Process

```mermaid
graph TD
    A[main.html / RootManager Initialization] --> B(Setup WebGL Canvas & Shaders);
    B --> C{Create RobotArm Prefab};
    C -- RobotArm.init() --> D[Builds Arm Hierarchy: HierarchyObject children with BoxPrimitives & Transforms];
    A --> E(Setup UI Event Listeners for Camera/Light);

    subgraph RenderLoop [Triggered by Initial Load or UI Change]
        F[CanvasManager.render()] --> G[Set Global Uniforms: View, Projection, Light];
        G --> H[rootObject.drawRecursively(IdentityMatrix)];
    end

    subgraph RecursiveDraw [HierarchyObject.drawRecursively(parentMatrix)]
        I[Calculate currentWorldMatrix = parentMatrix * localTransform.modelMat] --> J[Self.draw(parentMatrix)];
        J --> K[Send currentWorldMatrix to Shader as uModelMat];
        K --> L[Bind & Buffer own Primitives' Vertices/Normals];
        L --> M[gl.drawArrays()];
        I --> N{For each ChildObject};
        N -- Yes --> O[ChildObject.drawRecursively(currentWorldMatrix)];
        N -- No --> P[End of this branch];
        O --> RecursiveDraw;
    end

    M --> Q[Vertex Shader: Transform Vertices, Calculate Lighting];
    Q --> R[Fragment Shader: Apply Color];
    R --> S[Display on Canvas];

    E -- User Interaction --> F;
```

## How to Run

1.  Ensure you have a local web server to serve the files (due to browser security restrictions with `file:///` URLs for WebGL and shaders).
2.  Place all provided JavaScript files (`primitive.js`, `transform.js`, `hierarchyObject.js`, `prefabObject.js`, `robotArm.js`, and the assumed manager files) in the correct `src/` subdirectories as referenced in `main.html`.
3.  Place `webgl-utils.js`, `initShaders.js`, and `MV.js` into a `Common/` directory.
4.  Open `main.html` through your local web server.

## Potential Improvements / TODOs

- **Animation System:** Implement the `animation` property in `PrefabObject` and an `AnimationManager` to allow for dynamic object movements.
- **Material System:** Abstract material properties (ambient, diffuse, specular, shininess) into a separate component or class instead of being global.
- **Texture Mapping:** Add support for applying textures to objects.
- **More Primitives:** Introduce other basic shapes like spheres, cylinders, etc.
- **Error Handling:** More robust error checking, especially for WebGL calls and shader compilation.
- **Optimizations:** For very large scenes, consider techniques like frustum culling or instanced drawing.
- **Input System:** Refine mouse controls or add keyboard controls.

<!-- end list -->

**Explanation of the Mermaid Diagram:**

1.  **Initialization:** `main.html` and `RootManager` set up the basics, including creating the `RobotArm` prefab which in turn builds its own internal hierarchy. UI listeners are also set up.
2.  **Render Loop:** Triggered initially or by UI changes (like moving the camera/light). `CanvasManager.render()` sets global shader uniforms and starts the recursive drawing from the root object.
3.  **RecursiveDraw (Subgraph):** This is the core of the hierarchical rendering.
    - A `HierarchyObject` receives its parent's transformation matrix (`parentMatrix`).
    - It calculates its own `currentWorldMatrix` by multiplying the `parentMatrix` with its local `transform.modelMat`.
    - It then calls its internal `draw()` method (represented by steps J, K, L, M) to render its own geometry using this `currentWorldMatrix`.
    - Crucially, it then iterates through its children and calls `drawRecursively` on each child, passing down its `currentWorldMatrix` as the `parentMatrix` for the child. This ensures transformations accumulate correctly.
4.  **Shader Processing:** After `gl.drawArrays()` is called for a set of primitives, the vertex shader processes each vertex (transforming it and calculating lighting), and then the fragment shader determines the final pixel color.
5.  **Display:** The final image is shown on the canvas.

This README should give a good overview of your project's structure and functionality.
