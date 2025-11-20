import { useEffect, useRef } from "react";
import * as THREE from "three";
import ProcessBox3D from "../ui/ProcessBox3D";
import Line3D from "../ui/Line3D";

const ThreeDInteractive = ({ problem, threeDMode }) => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rendererRef = useRef(null);
  const boxesRef = useRef([]);
  const lineRef = useRef([]);
  const minY = -70;
  const maxY = 40;
  const width = 5;
  const zdis = 5;
  const startXPos = 0;
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const currentBoxIndexRef = useRef(0);
  const creatingRef = useRef(false);
  const currentHoldingBoxIndex = useRef(-1);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerDragRef = useRef({ box: null, offset: new THREE.Vector3(), plane: null });

  useEffect(() => {
    if (!threeDMode) return; 
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
      100
    );
    camera.position.z = 10;
    camera.position.y = minY + 10;
    camera.position.x = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    rendererRef.current = renderer;

    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.top = 0;
    renderer.domElement.style.left = 0;
    renderer.domElement.style.zIndex = 2;
    container.appendChild(renderer.domElement);

    // ---- Zoom State ---
    let targetY = camera.position.y;
    const zoomSpeed = 0.003;

    let pinchStartDistance = 0;
    let isPinching = false;

    // --- Desktop wheel zoom ---
    function onWheel(event) {
      event.preventDefault();
      targetY += event.deltaY * zoomSpeed * 2;
      targetY = Math.max(minY, Math.min(maxY, targetY));
    }

    // --- Touch pinch zoom ---
    function onTouchStart(e) {
      if (e.touches.length === 2) {
        isPinching = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistance = Math.sqrt(dx * dx + dy * dy);
      }
    }

    function onTouchMove(e) {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();

        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const pinchCurrentDistance = Math.sqrt(dx * dx + dy * dy);

        const pinchDelta = pinchStartDistance - pinchCurrentDistance;
        targetY += pinchDelta * zoomSpeed * 2;
        targetY = Math.max(minY, Math.min(maxY, targetY));

        pinchStartDistance = pinchCurrentDistance;
      }
    }

    function onTouchEnd() {
      isPinching = false;
    }

    function getMouseNDC(event) {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      return { x, y, rect };
    }

    function onPointerDown(e) {
      const rc = raycasterRef.current;
      const ndc = getMouseNDC(e);
      rc.setFromCamera({ x: ndc.x, y: ndc.y }, camera);

      const meshes = boxesRef.current.map((b) => b.mesh);
      const intersects = rc.intersectObjects(meshes, false);
      if (!intersects || intersects.length === 0) return;

      const mesh = intersects[0].object;
      const box = boxesRef.current.find((b) => b.mesh === mesh);
      if (!box) return;

      // plane at box z (parallel to XY)
      const plane = new THREE.Plane();
      plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, box.mesh.position.z));

      const hitPoint = new THREE.Vector3();
      rc.ray.intersectPlane(plane, hitPoint);
      const offset = new THREE.Vector3().subVectors(box.mesh.position, hitPoint);

      pointerDragRef.current = { box, offset, plane };
      // prevent default browser drag
      e.preventDefault();
    }

    function onPointerMove(e) {
      const sel = pointerDragRef.current;
      if (!sel || !sel.box) return;
      const rc = raycasterRef.current;
      const ndc = getMouseNDC(e);
      rc.setFromCamera({ x: ndc.x, y: ndc.y }, camera);
      const hitPoint = new THREE.Vector3();
      rc.ray.intersectPlane(sel.plane, hitPoint);
      if (!hitPoint) return;
      const target = new THREE.Vector3().addVectors(hitPoint, sel.offset);
      sel.box.moveTo(target.x, target.y, sel.box.mesh.position.z);
    }

    function onPointerUp() {
      pointerDragRef.current = { box: null, offset: new THREE.Vector3(), plane: null };
    }
    

    // ---- Add event listeners ---
    container.addEventListener("wheel", onWheel, { passive: false });
    container.addEventListener("touchstart", onTouchStart);
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);
    // pointer-based drag
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);


    function maybeCreateNextBox() {
      const boxes = boxesRef.current;

      // If no boxes, nothing to do
      if (!boxes || boxes.length === 0) return;

      // If current index beyond available boxes -> stop
      if (currentBoxIndexRef.current >= boxes.length) return;

      // If current box not initialized yet, initialize it and return (so update runs after init)
      const current = boxes[currentBoxIndexRef.current];
      if (!current.initialized) {
        current.initialize();
        current.initialized = true;
        return;
      }

      // If any of the boxes up to current index are not final, do not proceed to next
      for (let i = 0; i <= currentBoxIndexRef.current; i++) {
        if (!boxes[i].isFinalState()) {
          return;
        }
      }

      // All previous up to current are final -> move to next (if exists)
      const next = currentBoxIndexRef.current + 1;
      if (next < boxes.length) {
        boxes[next].initialize();
        boxes[next].initialized = true;
        currentBoxIndexRef.current = next;
      }
    }


    // --- Animation Loop ---
    function animate() {
      requestAnimationFrame(animate);

      // First, ensure next box gets initialized (so update() uses correct initial position)
      maybeCreateNextBox();

      // Smooth zoom
      camera.position.y += (targetY - camera.position.y) * 0.1;
      const boxes = boxesRef.current;

      // Only update boxes up to current index
      for (let i = 0; i <= currentBoxIndexRef.current; i++) {
        boxes[i]?.update();
      }

      renderer.render(scene, camera);
    }
    animate();

    // CLEANUP
    return () => {
      if (stream) stream.getTracks().forEach(t => t.stop());
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    currentBoxIndexRef.current = 0;
    creatingRef.current = false;
    currentHoldingBoxIndex.current = -1;
    const scene = sceneRef.current;
    if (!scene || !problem) return;

    // 1. delete old boxes
    boxesRef.current.forEach(box => {
      scene.remove(box.mesh);
      box.dispose();
    });
    boxesRef.current = [];

    // 2. create new boxes
    let currentTop = minY;
    const processes = {};
    for (let i = 0; i < problem.question.processes.length; i++) {
      const item = problem.question.processes[i];
      processes[item.id] = {
        arrivalTime: item.arrivalTime,
        burstTime: item.burstTime,
      };
    }
    for (let i = 0; i < problem.solution.schedule.length && threeDMode; i++) {
      const item = problem.solution.schedule[i];
      const h = item.timeUnits;
      // Center of this box = previousTop + (h / 2)
      const centerY = currentTop + h / 2;
      const box = new ProcessBox3D({
        width: width,
        height: h,
        depth:1,
        id: item.processId,
        color: problem.colorMap[item.processId],
        position: { x: 999, y: 999, z: 999 },
        initialState: { x: startXPos+20, y: minY+15, z: zdis },
        targetState: { x: startXPos, y: centerY, z: zdis },
        text: 
          item.processId !== -1 ? `P${item.processId}\nA:${processes[item.processId].arrivalTime} B:${processes[item.processId].burstTime}` 
          : 'idle',
      });
      currentTop += h+0.1;
      scene.add(box.mesh);
      boxesRef.current.push(box);
    }
  }, [problem]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !problem) return;

    // 1. delete old line
    lineRef.current.forEach(line => {
      scene.remove(line.mesh);
      line.dispose();
    });
    lineRef.current = [];

    // 2. create new lines
    for(let i=minY; i<=minY; i++){
        const line = new Line3D({
        width: width,
        color: 0xff0000,
        position: { x: startXPos, y: i, z:zdis }
      });

      scene.add(line.mesh);
      lineRef.current.push(line);
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
