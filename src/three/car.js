import * as THREE from 'three';

/**
 * source: https://www.freecodecamp.org/news/three-js-tutorial/
 */

let renderfunctions = []; //only add render functions here!

export function car(document) {
    let scene = new THREE.Scene();

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    let directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(400, 1000, 600);
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
        10000
    );
    camera.position.set(200, 200, 200);
    camera.lookAt(0, 10, 0);

    let renderer = new THREE.WebGL1Renderer({ antialias: true });
    // Configure renderer clear color
    //renderer.setClearColor(0x7a7a7a);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //Start the rendering of the scene
    renderer.render(scene, camera);

    //Add the scene (canvas) to the DOM
    document.body.appendChild(renderer.domElement);

    const car = createCar();
    scene.add(car);

    var carBoxHelper = new THREE.BoxHelper(car, 0xff0000);
    car.add(carBoxHelper);
    renderfunctions.push({
        render() {
            carBoxHelper.update();
        },
    });

    const ground = createGround();
    scene.add(ground);

    let geom = new THREE.BoxBufferGeometry(20, 20, 20);
    let material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    let cube = new THREE.Mesh(geom, material);
    cube.position.set(10, 10, -80);
    scene.add(cube);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    var render = function () {
        requestAnimationFrame(render);

        //camera.position.y += 0.1;
        //camera.position.x += 0.1;
        //camera.position.z += 0.1;
        car.rotation.y += 0.01;

        renderfunctions.forEach((r) => r.render());

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

//todo: create functional headlights (may need a wall / floor)
function createHeadlight() {
    const geom = new THREE.CylinderGeometry(4, 4, 2, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const headlight = new THREE.Mesh(geom, material);
    //headlight.rotation.z += THREE.MathUtils.degToRad(90);

    let altitude = 0.8;
    let distance = 1.3;
    let range = 250;
    let angle = 0.1;

    let light = new THREE.SpotLight(0xff0000, 400, range, THREE.MathUtils.degToRad(10), 0.25, 2);

    const lightGroup = new THREE.Group();
    lightGroup.add(headlight);
    //lightGroup.add(light);
    light.position.x = 0;
    light.position.y = 0;
    light.position.z = 0;

    const target = new THREE.Object3D();
    target.position.x = 100;
    target.position.y = 0;
    target.position.z = 0;
    //lightGroup.add(target);
    light.target = target;

    let SpotlightHelper = new THREE.SpotLightHelper(light);
    //lightGroup.add(SpotlightHelper);

    //probably a memleak, but I just want to get this over with :D
    let renderCallback = {
        helper: SpotlightHelper,
        render() {
            this.helper.update();
        },
    };
    renderfunctions.push(renderCallback);

    //lightGroup.rotation.z += THREE.MathUtils.degToRad(90);

    return lightGroup;
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

    const headlightR = createHeadlight();
    var headlightGroupHelper = new THREE.BoxHelper(headlightR, 0xff0000);
    car.add(headlightGroupHelper);
    renderfunctions.push({
        render() {
            headlightGroupHelper.update();
        },
    });
    headlightR.position.x = 30;
    headlightR.position.y = 14;
    headlightR.position.z = 8;
    car.add(headlightR);

    let lightR = new THREE.SpotLight(0xff0000, 400, 250, THREE.MathUtils.degToRad(10), 0.25, 2);
    lightR.position.set(31, 14, 8);
    let SpotlightHelper = new THREE.SpotLightHelper(lightR);
    car.add(SpotlightHelper);

    const target = new THREE.Object3D();
    target.position.x = 50;
    target.position.y = 14;
    target.position.z = 8;
    car.add(target);
    lightR.target = target;
    //probably a memleak, but I just want to get this over with :D
    let renderCallback = {
        helper: SpotlightHelper,
        render() {
            this.helper.update();
        },
    };
    renderfunctions.push(renderCallback);

    //car.add(lightR);
    //car.add(headlightR);

    const headlightL = createHeadlight();
    headlightL.position.y = 14;
    headlightL.position.x = 30;
    headlightL.position.z = -8;
    //car.add(headlightL);

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
function createGround() {
    const groundTexture = new THREE.TextureLoader().load('/assets/textures/floor.png');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(10000 / 100, 10000 / 50);
    groundTexture.anisotropy = 16;
    groundTexture.encoding = THREE.sRGBEncoding;

    const groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });
    const geom = new THREE.PlaneBufferGeometry(10000, 10000);
    const mesh = new THREE.Mesh(geom, groundMaterial);

    mesh.position.y = 0;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    return mesh;
}
