import React, { Component } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
class ThreeScene extends Component {
  componentDidMount() {
    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGL1Renderer();
    this.renderer.setSize(500, 600);
    this.renderer.setClearColor( 0xffffff );
    this.mount.appendChild(this.renderer.domElement);
    this.camera = new THREE.PerspectiveCamera(45, 800 / 600);
    this.camera.position.z = 20;
    this.geometry = new THREE.SphereGeometry(3, 84, 84);
    this.material = new THREE.MeshStandardMaterial({
      color: "#00ff83",
    });
    this.cube = new THREE.Mesh(this.geometry, this.material);

    this.scene.add(this.cube);
    this.light = new THREE.PointLight(0xffffff, 1, 100);
    this.light.position.set(0, 10, 10);
    this.scene.add(this.light);
    this.renderer.render(this.scene, this.camera);
    this.renderer.setPixelRatio(2);
    this.control = new OrbitControls(this.camera, this.renderer.domElement);
    this.control.enableDamping = true;
    this.control.enablePan = false;
    this.control.enableZoom = false;
    this.control.autoRotate = true;
    this.control.autoRotateSpeed = 5;
    this.animation();

  }
  animation = () => {
    this.control.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.animation);
  };

  render() {
    return (
      <div
        ref={(mount) => {
          this.mount = mount;
        }}
      />
    );
  }
}
export default ThreeScene;
