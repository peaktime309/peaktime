import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import gsap from "gsap";
const Loft = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);
  const pointLightRef = useRef(null);
  const clock = new THREE.Clock();
  let model; // 모델을 저장할 변수 추가

  useEffect(() => {
    // Scene 생성
    const scene = new THREE.Scene();

    // 카메라 설정
    // Unity에서 가져온 카메라 값
    const unityPosition = new THREE.Vector3(-330, 70, 0.814); // Z축 반전
    // Unity 회전값을 직접 라디안으로 변환
    const unityRotation = new THREE.Euler(
      2.564 * (Math.PI / 180), // X축 회전
      -72.961 * (Math.PI / 180) - 0.5, // Y축 회전
      -0.012 * (Math.PI / 180), // Z축 회전
      "YXZ" // 회전 순서 설정
    );

    // Three.js 카메라 설정
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.up.set(0, 1, 0);
    camera.position.copy(unityPosition);
    camera.rotation.copy(unityRotation);

    // 렌더러 설정
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 조명 추가
    const ambientLight = new THREE.AmbientLight(0xb6f3fe, 0.5); // 환경광 추가
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xf5c673, 0.5); // DirectionalLight의 강도를 1로 조정
    light.position.set(-172, 228, -200);
    scene.add(light);

    // Optional: 추가적인 PointLight를 추가해볼 수 있습니다
    const pointLight = new THREE.PointLight(0xff4500, 50000, 0); // 강도 1, 범위 100의 PointLight 추가
    pointLight.position.set(174, 41, -170); // PointLight의 위치 설정
    scene.add(pointLight);
    pointLight.castShadow = true;

    // // GUI 컨트롤러 설정
    // const gui = new GUI();

    // const lightFolder = gui.addFolder("Point Light");
    // const mainlight = gui.addFolder("Main Light");

    // lightFolder.add(pointLight.position, "x", 0, 400, 1).name("X Position");
    // lightFolder.add(pointLight.position, "y", -100, 100, 1).name("Y Position");
    // lightFolder.add(pointLight.position, "z", -300, 100, 1).name("Z Position");
    // lightFolder.add(pointLight, "intensity", 0, 70000, 3).name("Intensity");
    // lightFolder.add(pointLight, "distance", 0, 100, 3).name("Distance");

    // // 색상 컨트롤 추가
    // const lightColor = { color: 0xff4500 };
    // lightFolder.addColor(lightColor, "color").onChange((value) => {
    //   pointLight.color.setHex(value);
    // });

    // mainlight.add(light.position, "x", -500, 100, 2).name("X Position");
    // mainlight.add(light.position, "y", -100, 500, 2).name("Y Position");
    // mainlight.add(light.position, "z", -100, 50, 2).name("Z Position");
    // mainlight.add(light, "intensity", 0, 50, 1).name("Intensity");

    // 배경 설정
    new RGBELoader().load(
      "../build/models/loft/satara_night_no_lamps_2k.hdr",
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
      }
    );
    // 투명 재질 설정
    const material01 = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      transparent: true,
      opacity: 0.3,
    });
    // FBX 모델 로드
    const loader = new FBXLoader();
    loader.load(
      "../build/models/loft/lobbyloft.fbx", // FBX 파일 경로로 변경
      (object) => {
        // 모델 로드 후 처리
        model = object; // 모델 저장
        object.scale.set(1, 1, 1);
        object.position.set(0, 0, 0);
        object.receiveShadow = true;
        object.traverse((child) => {
          if (child.name === "Glass") {
            child.material.transparent = true; // 투명 속성 활성화
            child.material.opacity = 0.1;
          }
        });

        scene.add(object);

        // 애니메이션 믹서 생성
        mixerRef.current = new THREE.AnimationMixer(object);
        console.log(object.animations);
        // 애니메이션 클립을 믹서에 추가
        object.animations.forEach((clip) => {
          mixerRef.current.clipAction(clip).play();
        });

        //불빛 깜빡임
        const flicker = () => {
          gsap.to(pointLight, {
            intensity: Math.random() * (70000 - 8000) + 8000, // 8000 ~ 70000 사이 랜덤 값
            duration: 1.1 + Math.random() * 0.2, // 0.1 ~ 0.3초 간격으로 변동
            ease: "power2.inOut",
            onComplete: flicker, // 애니메이션 종료 후 다시 실행
          });
        };
        flicker();
        // 카메라 이동
        gsap.to(camera.position, {
          duration: 7, // 오른쪽으로 이동하는 데 걸리는 시간
          z: camera.rotation.z + 25, // 오른쪽으로 5만큼 이동
          x: camera.rotation.x - 330,
          y: camera.rotation.y + 67,
          ease: "power1.inOut", // 부드러운 움직임 설정
          repeat: -1, // 반복 실행
          yoyo: true, // 되돌아가기
        });

        // 애니메이션 루프
        const animate = function () {
          requestAnimationFrame(animate);

          // 애니메이션 업데이트
          const delta = clock.getDelta();
          if (mixerRef.current) {
            mixerRef.current.timeScale = 0.3; // 속도 조절
            mixerRef.current.update(delta);
          }

          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error("모델 로드 오류:", error);
      }
    );

    // 화면 크기 변경 시 처리
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", handleResize);

    // 컴포넌트가 언마운트될 때 클린업
    return () => {
      // gui.destroy();
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-[100%] h-[100%] absolute top-0 left-0 z-[-1] overflow-hidden">
      <div ref={mountRef} className="w-[100%] h-[100%]" />
    </div>
  );
};

export default Loft;
