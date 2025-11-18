import * as THREE from "three";

export default class ProcessBox3D {
  constructor({ 
    width = 1,
    height = 1,
    depth = 1,
    color = 0xff0000,
    position = { x: 0, y: 0, z: 0 },
    id = null,
    text = null,
    textColor = "#000000",
  } = {}) {

    this.id = id;
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.color = color;
    
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
    // this.mesh.rotation.x += this.rotationSpeed.x;
    // this.mesh.rotation.y += this.rotationSpeed.y;
  }

  // // Example: change color dynamically
  // setColor(newColor) {
  //   this.material.color.set(newColor);
  // }

  // // Example: move box
  // moveTo(x, y, z) {
  //   this.mesh.position.set(x, y, z);
  // }

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

function createColorTextTexture(text, textColor, bgColor, size= 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, size, size);

  // --- FIXED text size (not stretching) ---
  const fontSize = size * 0.9; // 25% of canvas height
  ctx.font = `bold ${size}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = textColor;

  ctx.fillText(text, size / 2, size / 2, size * 0.25); // no maxWidth → sharp

  const texture = new THREE.CanvasTexture(canvas);

  // important: reduce blur
  texture.anisotropy = 100; // high-quality texture

  texture.needsUpdate = true;
  return texture;
}

