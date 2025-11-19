import * as THREE from "three";

export default class ProcessBox3D {
  constructor({ 
    width = 1,
    height = 1,
    depth = 1,
    color = 0xff0000,
    position = { x: 0, y: 0, z: 0 },
    initialState = { x: 0, y: 0, z: 0 },
    targetState = { x: 0, y: 0, z: 0 },
    id = null,
    text = null,
    textColor = "#000000",
  } = {}) {

    this.id = id;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
    this.targetState = targetState;
    this.initialState = initialState;
    this.speed = {x:0, y:0, z:0};
    this.setSpeed = false;
    this.initialized = false;

    // Create mesh
    this.geometry = new THREE.BoxGeometry(width, height, depth);

    if (text) {
      const texture = createColorTextTexture(
        text,
        textColor,
        color,
        1024
      );
      
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: false,
      });

      this.material = material;

    } else {

      this.material = new THREE.MeshBasicMaterial({ color });

    }

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(position.x, position.y, position.z);


    // Example internal state
    this.rotationSpeed = { x: 0.01, y: 0.01 };
  }

  // // Example method: rotate box every frame
  update() {
    const pos = this.mesh.position;
    if (!this.setSpeed ){
      this.speed.x = (this.targetState.x - pos.x) /500;
      this.speed.y = (this.targetState.y - pos.y) /500;
      this.speed.z = (this.targetState.z - pos.z) /500;
      this.setSpeed = true;
    }
    if (!this.isFinalState()){
      pos.x += this.speed.x;
      pos.y += this.speed.y;
      pos.z += this.speed.z;
    }
  }

  isFinalState() {
    const pos = this.mesh.position;
    return (
      Math.abs(pos.x - this.targetState.x) <= 0.01  &&
      Math.abs(pos.y - this.targetState.y) <= 0.01 &&
      Math.abs(pos.z - this.targetState.z) <= 0.01
    );
  }

  initialize(){
    this.mesh.position.set(
      this.initialState.x,
      this.initialState.y,
      this.initialState.z
    );
  }

  moveTo(x, y, z) {
    this.mesh.position.set(x, y, z);
  }

  // Cleanup
  dispose() {
    this.geometry.dispose();
    if (Array.isArray(this.material)) {
        this.material.forEach(m => m.dispose());
    } else {
      this.material.dispose();
    }
  }
}

function createColorTextTexture(text, textColor, bgColor, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // --- FIXED text height ---
  // change multiplier (0.1 → small text, 0.9 → large text)
  const fontSize = size * 0.2;
  ctx.font = `bold ${fontSize}px Arial`;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColor;

   // --- MULTI-LINE SUPPORT ---
  const lines = text.split("\n");

  const totalHeight = fontSize * lines.length;

  let y = size / 2 - totalHeight / 2 + fontSize / 2;

  for (const line of lines) {
    ctx.fillText(line, size / 2, y);
    y += fontSize;
  }

  const texture = new THREE.CanvasTexture(canvas);

  texture.anisotropy = 16; // improves sharpness
  texture.needsUpdate = true;

  return texture;
}


