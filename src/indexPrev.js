import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { player } from "./animationControl";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { support } from "./Function";
import {
  football,
  lamp,
  plane,
  leftPost,
  rightPost,
  ballLight,
  urn,
  urnLight,
} from "./loadModels";

const scene = new THREE.Scene();
let mixer,
  human1,
  human1Camera = false,
  human1Controls,
  ballVelocity = 0,
  ballDirection = new THREE.Vector3();
let player1Light = new THREE.SpotLight(0xffffff, 3, 100);
player1Light.castShadow = true;

// urnLight.lookAt(10, 0, 10);

const clock = new THREE.Clock();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-15, 10, 0);
camera.lookAt(new THREE.Vector3(0, 0, 0));

const upCamera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
upCamera.position.set(0, 60, 0);
upCamera.lookAt(new THREE.Vector3(0, 0, 0));

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let ambientLights = new THREE.Group();

// orbit control for camera2: camera on top of head of model
// CONTROLS
const overHeadCamera1 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
overHeadCamera1.position.set(0, 10, 0);

let firstPerson = new PointerLockControls(overHeadCamera1, renderer.domElement);

const orbitControlCamera1 = new OrbitControls(
  overHeadCamera1,
  renderer.domElement
);
// orbitControlCamera1.enableDamping = true;
// orbitControlCamera1.minDistance = 5;
// orbitControlCamera1.maxDistance = 15;
// orbitControlCamera1.enablePan = false;
orbitControlCamera1.maxPolarAngle = Math.PI / 2 - 0.05;
// orbitControlCamera1.update();

const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
ambientLights.add(ambientLight);

scene.add(ambientLights);
scene.add(leftPost);
scene.add(rightPost);
scene.add(football);
scene.add(plane);
scene.add(lamp);
// scene.add(urn);
// scene.add(urnLight);
scene.add(ballLight);
scene.add(player1Light);

let currentCamera = upCamera;

// action map
let actions = new Map();

// add robots
let fbxCounter = 0;
function loadHuman1() {
  if (fbxCounter >= 4) {
    human1Controls = new player(human1, player1Light, actions, mixer, 100);
    actions.forEach(function (value, key) {
      console.log("key:", key);
      console.log("value:", value);
    });
  }
}
const fbxLoader = new FBXLoader(); // mixer scene actions human
fbxLoader.load("./../Models/converted/untitled.fbx", function (object) {
  mixer = new THREE.AnimationMixer(object);
  human1 = object;
  // let action = mixer.clipAction(object.animations[0]);
  // actions.set("stand",action);
  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(0.05, 0.05, 0.05);
  scene.add(object);
  fbxCounter += 1;
  loadHuman1();
});

fbxLoader.load("./../Models/converted/Idle.fbx", function (object) {
  // mixer = new THREE.AnimationMixer( object );
  let action = mixer.clipAction(object.animations[0]);
  // action.play();
  // console.log("idle action :",action);
  actions.set("idle", action);
  fbxCounter += 1;
  loadHuman1();
});

fbxLoader.load("./../Models/converted/Running.fbx", function (object) {
  // mixer = new THREE.AnimationMixer( object );
  let action = mixer.clipAction(object.animations[0]);
  // action.play();
  actions.set("run", action);
  fbxCounter += 1;
  loadHuman1();
});

fbxLoader.load("./../Models/converted/KickSoccerball.fbx", function (object) {
  let action = mixer.clipAction(object.animations[0]);
  actions.set("kick", action);
  // action.play();
  fbxCounter += 1;
  // console.log("orbit controls for camera 2:", orbitControlCamera1);
  loadHuman1();
});

// Orbit Controls
let controls = new OrbitControls(currentCamera, renderer.domElement);
renderer.setClearColor(0x000000);
let keysPressed = new Map();
let alphabets = "abcdefghijklmnopqrstuvwxyz";
for (let i = 0; i < alphabets.length; ++i) {
  keysPressed.set(alphabets[i], false);
}
let sup = new support();
let ballPocession = 0;
urn.position.set(50, 1, 30);

function animate() {
  // animate kick
  if (ballVelocity > 0 && fbxCounter >= 4) {
    let delta = clock.getDelta();
    let xMove = ballDirection.x * ballVelocity * delta * 29;
    let zMove = ballDirection.x * ballVelocity * delta * 29;
    football.position.x += xMove;
    football.position.z += zMove;
    ballVelocity -= 2.5;
  }
  if (human1Camera) {
    let mixerUpdateDelta = clock.getDelta();
    if (fbxCounter >= 4) {
      human1Controls.updatePlayer(
        mixerUpdateDelta,
        keysPressed,
        firstPerson,
        currentCamera
      );

      if (keysPressed.get("w")) {
        firstPerson.moveForward(0.1);
      }
      if (keysPressed.get("s")) {
        firstPerson.moveForward(-0.1);
      }
      if (keysPressed.get("a")) {
        firstPerson.moveRight(-0.1);
      }
      if (keysPressed.get("d")) {
        firstPerson.moveRight(0.1);
      }
    }

    renderer.render(scene, currentCamera);
  } else {
    currentCamera.lookAt(new THREE.Vector3(0, 0, 0));
    controls.update();
    const delta = clock.getDelta() * 0.6;
    if (human1Controls != undefined)
      human1Controls.updatePlayerUp(delta, keysPressed, currentCamera);
    if (mixer) mixer.update(delta);
    if (fbxCounter >= 4) {
      overHeadCamera1.position.set(human1.position.x, 10, human1.position.z);
    }
    renderer.render(scene, currentCamera);
  }
  ballLight.target = football;
  ballLight.position.set(football.position.x, 12.1, football.position.z);

  // urnLight.target = urn;

  if (human1Controls != undefined) {
    let bounds = sup.outOfBounds(human1.position);

    human1.position.x = bounds[0];
    human1.position.z = bounds[1];

    if (
      sup.canGetBall(football.position, human1Controls.model.position) &&
      ballPocession != 2
    ) {
      football.position.set(
        human1Controls.model.position.x,
        0,
        human1Controls.model.position.z
      );
      ballPocession = 1;
    }
  }
  sup.checkGoal(football.position, window);
  sup.ballOutOfBounds(football.position, window);

  if (fbxCounter >= 4) {
    if (sup.checkCollisionForObject(human1.position, urn.position)) {
      console.log("Collsion!");
    }
  }
  requestAnimationFrame(animate);
}

animate();

//Event Listeners

window.addEventListener("wheel", (event) => {
  const delta = Math.sign(event.deltaY);

  if (delta == -1) {
    if (currentCamera.position.y > 50) {
      currentCamera.position.y -= 10;
    }
  } else if (delta == 1) {
    currentCamera.position.y += 10;
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key == "z") {
    controls.enabled = !controls.enabled;
    human1Camera = !human1Camera;

    currentCamera = currentCamera == upCamera ? overHeadCamera1 : upCamera;
    // if(currentCamera == overHeadCamera1){
    // overHeadCamera1.up = new THREE.Vector3(0,1,0);
    // overHeadCamera1.position.set(new THREE.Vector3(human1Controls.model.position));
    // }
    if (currentCamera == overHeadCamera1) {
      firstPerson.lock();
    } else {
      firstPerson.unlock();
    }
    // orbitControlCamera1.enabled = !orbitControlCamera1.enabled;
  }
  if (event.key == " ") {
    //dribble
    keysPressed.set(" ", true);
    //check if ball in proximity in the animate kick
    if (ballPocession == 1) {
      console.log("Space Pressed!");
      //set ball velocity
      ballVelocity = 10;
      //set ball direction
      if (currentCamera == upCamera) {
        ballDirection = human1Controls.runDirection;
      } else {
        // let temp = new THREE.Vector3();
        currentCamera.getWorldDirection(ballDirection);
        console.log(currentCamera);
        // console.log(temp);

        // let cameraDirection = new THREE.Vector3();
        // firstPerson.getDirection(cameraDirection);
        // var lookPoint = new THREE.Vector3();
        // lookPoint.addVectors(cameraDirection, human1.position);
        // ballDirection.x = lookPoint.x;
        // ballDirection.z = lookPoint.z;
        // ballDirection.normalize();
      }
      ballPocession = 0;
    }
    // if yes then update the position of ball in the direction where the camera is facing
  }
  // keysPressed.push(event.key.toLowerCase());
  keysPressed.set(event.key.toLowerCase(), true);
  // console.log("keys pressed ", keysPressed);
});

window.addEventListener("keyup", (event) => {
  // keysPressed = keysPressed.filter(function (value, index, arr) {
  // return !(event.key.toLowerCase() == value);
  // });,
  keysPressed.set(event.key.toLowerCase(), false);

  // console.log("keys pressed ", keysPressed);
});

// window.addEventListener("keydown", (e) => {
//   keys[e.key] = true;
// });

// window.addEventListener("keyup", (e) => {
//   keys[e.key] = false;
// });
// //Attach listeners to functions
