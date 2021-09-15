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
        cameraWidth / -2,
        cameraWidth / 2,
        cameraHeight / 2,
        cameraHeight / -2,
        0,
        1000
    );
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 10, 0);

    let renderer = new THREE.WebGL1Renderer({ antialias: true });
    // Configure renderer clear color
    renderer.setClearColor(0x7a7a7a);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Start the rendering of the scene
    renderer.render(scene, camera);

    //Add the scene (canvas) to the DOM
    document.body.appendChild(renderer.domElement);

    const car = createCar();
    scene.add(car);

    var render = function () {
        requestAnimationFrame(render);

        car.rotation.y += 0.01;

        // Render the scene
        renderer.render(scene, camera);
    };

    render();
}

function createWheels() {
    let geom = new THREE.BoxBufferGeometry(12, 12, 33);
    let material = new THREE.MeshLambertMaterial({ color: 0x333333 });
    let wheel = new THREE.Mesh(geom, material);

    return wheel;
}

function createCar() {
    const car = new THREE.Group();
    const leftWheel = createWheels();
    leftWheel.position.y = 6;
    leftWheel.position.x = -18;
    car.add(leftWheel);

    const rightWheel = createWheels();
    rightWheel.position.y = 6;
    rightWheel.position.x = 18;
    car.add(rightWheel);

    const body = new THREE.Mesh(
        new THREE.BoxBufferGeometry(60, 15, 30),
        new THREE.MeshLambertMaterial({ color: 0x78b14b })
    );
    body.position.y = 12;
    car.add(body);

    const frontTexture = createFrontWindowTexture();
    const leftTexture = createSideTexture();
    const rightTexture = createSideTexture();

    rightTexture.center = new THREE.Vector2(0.5, 0.5);
    rightTexture.rotation = THREE.MathUtils.degToRad(180);
    rightTexture.flipY = false;

    const coupe = new THREE.Mesh(new THREE.BoxBufferGeometry(33, 12, 24), [
        new THREE.MeshLambertMaterial({ map: frontTexture }),
        new THREE.MeshLambertMaterial({ map: frontTexture }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ color: 0xffffff }),
        new THREE.MeshLambertMaterial({ map: leftTexture }),
        new THREE.MeshLambertMaterial({ map: rightTexture }),
    ]);
    coupe.position.y = 24;
    coupe.position.x = -6;
    car.add(coupe);

    return car;
}

function createFrontWindowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 32;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 64, 32);

    context.fillStyle = '#666666';
    context.fillRect(8, 8, 48, 24);

    return new THREE.CanvasTexture(canvas);
}

function createSideTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 32;
    const context = canvas.getContext('2d');

    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 128, 32);

    context.fillStyle = '#666666';
    context.fillRect(10, 8, 38, 24);
    context.fillRect(58, 8, 60, 24);

    return new THREE.CanvasTexture(canvas);
}
