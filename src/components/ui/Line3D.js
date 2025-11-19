import * as THREE from "three";

export default class Line3D {
  constructor({ 
    width = 1,
    color = 0xff0000,
    position = { x: 0, y: 0, z: 0 }
  } = {}) {

    this.width = width;
    this.color = color;
    
    // Create mesh
    const points = [
      new THREE.Vector3(-width / 2, 0, 0),
      new THREE.Vector3(width / 2, 0, 0)
    ];
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);

    this.material = new THREE.LineBasicMaterial({ color });
    this.mesh = new THREE.Line(this.geometry, this.material);
    this.mesh.position.set(position.x, position.y, position.z);

  }


  // Cleanup
  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}


