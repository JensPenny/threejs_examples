import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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

    const canvas = renderer.domElement;
    //Add the scene (canvas) to the DOM
    document.body.appendChild(canvas);

    const car = createCar();
    scene.add(car);

    /*
    var carBoxHelper = new THREE.BoxHelper(car, 0xff0000);
    car.add(carBoxHelper);
    renderfunctions.push({
        render() {
            carBoxHelper.update();
        },
    });
    */

    const ground = createGround();
    scene.add(ground);

    let geom = new THREE.BoxBufferGeometry(20, 20, 20);
    let material = new THREE.MeshPhongMaterial({ color: 0x333333 });
    let cube = new THREE.Mesh(geom, material);
    cube.position.set(10, 10, -80);
    scene.add(cube);

    const axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);

    const controls = createControls(camera, canvas);

    var render = function () {
        requestAnimationFrame(render);

        //camera.position.y += 0.1;
        //camera.position.x += 0.1;
        //camera.position.z += 0.1;
        //car.rotation.y += 0.01;

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
    headlight.rotation.z += THREE.MathUtils.degToRad(90);

    return headlight;
}

/**
 * Add an actual light to a group. Also adds a target for that light
 * group: the group to add the light to
 * parent: the originating object. The parent's position will be used for the light pos
 */
function addActualLight(group, parent) {
    let range = 250;
    let angle = 10; //Angle in degrees

    let light = new THREE.SpotLight(0xff0000, 400, range, THREE.MathUtils.degToRad(angle), 0.25, 2);
    light.position.set(parent.position.x, parent.position.y, parent.position.z);
    group.add(light);

    const target = new THREE.Object3D();
    target.position.x = parent.position.x + 100;
    target.position.y = 0;
    target.position.z = parent.position.z;
    group.add(target);
    light.target = target;

    const helper = new THREE.SpotLightHelper(light);
    renderfunctions.push({
        render() {
            helper.update();
        },
    });
    group.add(helper);
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
    headlightR.position.x = 30;
    headlightR.position.y = 14;
    headlightR.position.z = 8;
    car.add(headlightR);

    const headlightL = createHeadlight();
    headlightL.position.x = 30;
    headlightL.position.y = 14;
    headlightL.position.z = -8;
    car.add(headlightL);

    addActualLight(car, headlightL);
    addActualLight(car, headlightR);

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

    const groundMaterial = new THREE.MeshPhongMaterial({ map: groundTexture });
    const geom = new THREE.PlaneBufferGeometry(10000, 10000);
    const mesh = new THREE.Mesh(geom, groundMaterial);

    mesh.position.y = 0;
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    return mesh;
}

function createControls(camera, canvas) {
    const controls = new OrbitControls(camera, canvas);
    return controls;
}

export { createCar, createControls };
