import { useEffect, useRef } from "react";
import * as THREE from "three";
import ProcessBox3D from "../ui/ProcessBox3D";

const ThreeDInteractive = ({ problem }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rendererRef = useRef(null);
  const boxesRef = useRef([]);

  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;

    if (!container || !video) return;

    let stream;

    // CAMERA SETUP
    navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false,
    })
    .then(s => {
      stream = s;
      video.srcObject = s;
    });

    // THREE SETUP
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      150,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    rendererRef.current = renderer;

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.zIndex = 2;
    container.appendChild(renderer.domElement);

    // ANIMATION LOOP
    const animate = () => {
      renderer.render(scene, camera);
      for (let box of boxesRef.current) {
        box.update();
      }
      requestAnimationFrame(animate);
    };
    animate();

    // CLEANUP
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !problem) return;

    // 1. delete old boxes
    boxesRef.current.forEach(box => {
      scene.remove(box.mesh);
      box.dispose();
    });
    boxesRef.current = [];

    // 2. create new boxes
    for (let i = 0; i < problem.solution.schedule.length; i++) {
      const item = problem.solution.schedule[i];

      const box = new ProcessBox3D({
        width: item.timeUnits,
        id: item.processId,
        color: problem.colorMap[item.processId],
        position: { x: 10*i-20, y: 0, z: 0 },
        text: item.processId !== -1 ? `P${item.processId}` : 'idle',
        // textColor: problem.colorMap[item.processId]
      });

      scene.add(box.mesh);
      boxesRef.current.push(box);
    }
  }, [problem]);


  return (
    <div
        ref={containerRef}
        className="relative w-full h-full border border-gray-700 rounded-lg overflow-hidden"
        >
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover z-0"
        />
    </div>

  );
};

export default ThreeDInteractive;
