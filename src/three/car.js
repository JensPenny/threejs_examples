import * as THREE from 'three';

export function car(document) {
    let scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(200, 500, 300);
    scene.add(directionalLight);

    let aspectRatio = window.innerWidth / window.innerHeight;
    let cameraWidth = 150;
    let cameraHeight = cameraWidth / aspectRatio;

    let camera = new THREE.OrthographicCamera(
        cameraWidth / 2,
        cameraWidth / 2,
        cameraHeight / 2,
        cameraHeight / 2,
        0,
        1000
    );
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 10, 0);

    let renderer = new THREE.WebGL1Renderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);

    document.body.appendChild(renderer.domElement);
}
