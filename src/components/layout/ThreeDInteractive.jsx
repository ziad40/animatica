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
  const maxY = 70;
  const minX = -30;
  const maxX = 30;
  const boxWidth = 5;
  const lineWidth = 1;
  const zdis = 5;
  const startXPos = 0;
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const currentBoxIndexRef = useRef(0);
  const creatingRef = useRef(false);
  const currentHoldingBoxIndex = useRef(-1);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerDragRef = useRef({ box: null, offset: new THREE.Vector3(), plane: null });
  const targetXRef = useRef(0);
  const labelRef = useRef([]);
  const lastTouchXRef = useRef(null);
  const panSpeed = 0.02; // adjust horizontal pan sensitivity
  const shouldAnimateRef = useRef(true);
  const totalUnitTime = problem.solution.schedule.reduce((sum, p) => sum + (Number(p.timeUnits) || 0), 0);

  // create a sprite with text using canvas
  function createTextSprite(text, opts = {}) {
    const size = opts.size || 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0,0,size,size);
    ctx.fillStyle = opts.bgColor || 'rgba(0,0,0,0)';
    ctx.fillRect(0,0,size,size);
    ctx.fillStyle = opts.color || '#ffffff';
    const fontSize = Math.floor(size * (opts.fontScale || 0.4));
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(text), size/2, size/2 + (opts.dy||0));
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
    const sprite = new THREE.Sprite(material);
    const scale = opts.scale || 4;
    sprite.scale.set(scale, scale, 1);
    return sprite;
  }

  useEffect(() => {
    shouldAnimateRef.current = threeDMode;
  }, [threeDMode]);

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

    // --- Desktop wheel: vertical -> zoom, horizontal -> pan X ---
    function onWheel(event) {
      event.preventDefault();
      // vertical scroll -> camera Y
      targetY += event.deltaY * zoomSpeed * 2;
      targetY = Math.max(minY, Math.min(maxY, targetY));
      // horizontal scroll -> camera X pan
      targetXRef.current += event.deltaX * panSpeed;
      targetXRef.current = Math.max(minX, Math.min(maxX, targetXRef.current));
    }

    // --- Touch handlers: pinch to zoom, single-touch to pan X ---
    function onTouchStart(e) {
      if (e.touches.length === 2) {
        isPinching = true;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStartDistance = Math.sqrt(dx * dx + dy * dy);
      } else if (e.touches.length === 1) {
        // start panning horizontally
        lastTouchXRef.current = e.touches[0].clientX;
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
      } else if (e.touches.length === 1) {
        // pan horizontally using single touch
        const tx = e.touches[0].clientX;
        if (lastTouchXRef.current != null) {
          const dx = tx - lastTouchXRef.current;
          targetXRef.current -= dx * panSpeed * 0.5; // tune sensitivity
          targetXRef.current = Math.max(minX, Math.min(maxX, targetXRef.current));
        }
        lastTouchXRef.current = tx;
      }
    }

    function onTouchEnd(e) {
      isPinching = false;
      lastTouchXRef.current = null;
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

      if (shouldAnimateRef.current) {
        maybeCreateNextBox();

        camera.position.y += (targetY - camera.position.y) * 0.1;
        camera.position.x += (targetXRef.current - camera.position.x) * 0.1;

        const boxes = boxesRef.current;
        for (let i = 0; i <= currentBoxIndexRef.current; i++) {
          boxes[i]?.update();
        }
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
        width: boxWidth,
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
      currentTop += h;
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
    // remove old labels
    labelRef.current.forEach(s => {
      scene.remove(s);
      if (s.material && s.material.map) s.material.map.dispose();
      if (s.material) s.material.dispose();
    });
    labelRef.current = [];

    // 2. create new lines
    for(let i=minY; i<=minY + totalUnitTime; i++){
        const line = new Line3D({
        width: lineWidth,
        color: 0xff0000,
        position: { x: startXPos-4, y: i, z:zdis }
      });

      scene.add(line.mesh);
      lineRef.current.push(line);

      // add numeric label to the left of the line
      const label = createTextSprite(i-minY, { size: 128, color: '#ffffff', scale: 2.5 });
      label.position.set(startXPos - 6, i, zdis);
      scene.add(label);
      labelRef.current.push(label);
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
