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
  tree,
  treeLight,
} from "./loadModels";

const scene = new THREE.Scene();
let mixer,
  currentHuman = true,// true is for player 1 false is for player 2
  mixer2,
  human1,
  human1Camera = false,
  human1Controls,
  human2,
  human2Camera = false,
  human2Controls,
  ballVelocity = 0,
  ballDirection = new THREE.Vector3();
let player1Light = new THREE.SpotLight(0xffffff, 3, 100);
let player2Light = new THREE.SpotLight(0xffffff, 3, 100);
player1Light.castShadow = true;
player2Light.castShadow = true;

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
const overHeadCamera2 = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
overHeadCamera2.position.set(0, 10, 0);

let firstPerson = new PointerLockControls(overHeadCamera1, renderer.domElement);
let secondPerson = new PointerLockControls(overHeadCamera2, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
ambientLights.add(ambientLight);

scene.add(ambientLights);
scene.add(leftPost);
scene.add(rightPost);
scene.add(football);
scene.add(plane);
scene.add(lamp);
scene.add(tree);
scene.add(ballLight);
scene.add(player1Light);
scene.add(player2Light);
scene.add(treeLight);

let currentCamera = upCamera;

// action map
let actions = new Map();
let actions2 = new Map();

// add robots
let fbxCounter = 0,fbxCounter2=0;
function loadHuman1() {
  if (fbxCounter >= 4) {
    human1Controls = new player(human1, player1Light, actions, mixer, 100);
    actions.forEach(function (value, key) {
      console.log("key:", key);
      console.log("value:", value);
    });
  }
}
function loadHuman2() {
  if (fbxCounter2 >= 4) {
    human2Controls = new player(human2, player2Light, actions2, mixer2, -100);
    actions2.forEach(function (value, key) {
      console.log("key:", key);
      console.log("value:", value);
    });
  }
}
const fbxLoader = new FBXLoader(); // mixer scene actions human
fbxLoader.load("./../Models/converted/untitled.fbx", function (object) {
  mixer = new THREE.AnimationMixer(object);
  human1 = object;
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
fbxLoader.load("./../Models/converted/untitled.fbx", function (object) {
  mixer2 = new THREE.AnimationMixer(object);
  human2 = object;
  object.traverse(function (child) {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  object.scale.set(0.05, 0.05, 0.05);
  scene.add(object);
  fbxCounter2 += 1;
  loadHuman2();
});

fbxLoader.load("./../Models/converted/Idle.fbx", function (object) {
  let action = mixer.clipAction(object.animations[0]);
  actions.set("idle", action);
  fbxCounter += 1;
  loadHuman1();
});
fbxLoader.load("./../Models/converted/Idle.fbx", function (object) {
  let action = mixer2.clipAction(object.animations[0]);
  actions2.set("idle", action);
  fbxCounter2 += 1;
  loadHuman2();
});
fbxLoader.load("./../Models/converted/Running.fbx", function (object) {
  let action = mixer.clipAction(object.animations[0]);
  actions.set("run", action);
  fbxCounter += 1;
  loadHuman1();
});
fbxLoader.load("./../Models/converted/Running.fbx", function (object) {
  let action = mixer2.clipAction(object.animations[0]);
  actions2.set("run", action);
  fbxCounter2 += 1;
  loadHuman2();
});

fbxLoader.load("./../Models/converted/KickSoccerball.fbx", function (object) {
  let action = mixer.clipAction(object.animations[0]);
  actions.set("kick", action);
  fbxCounter += 1;
  loadHuman1();
});
fbxLoader.load("./../Models/converted/KickSoccerball.fbx", function (object) {
  let action = mixer2.clipAction(object.animations[0]);
  actions2.set("kick", action);
  fbxCounter2 += 1;
  loadHuman2();
});


// Orbit Controls
let controls = new OrbitControls(upCamera, renderer.domElement);
renderer.setClearColor(0x000000);
let keysPressed = new Map();
let sup = new support();
let ballPocession = 0;


function animate() {
  // animate dribble
  if (ballVelocity > 0 && fbxCounter >= 4 && fbxCounter2>=4) {
    let delta = clock.getDelta();
    let multiplier;
    if (currentCamera == upCamera) multiplier = 20;
    else multiplier = 5;
    let xMove = ballDirection.x * ballVelocity * delta * multiplier;
    let zMove = ballDirection.z * ballVelocity * delta * multiplier;
    football.position.x += xMove;
    football.position.z += zMove;
    ballVelocity -= 2.5;
  }

  if (human1Camera || human2Camera) {// either human 1 or human 2 over head camera
    let mixerUpdateDelta = clock.getDelta();
    if (fbxCounter >= 4 && human1Camera && currentHuman) {
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
    }else if (fbxCounter2 >= 4 && human2Camera && (!currentHuman)) {
      human2Controls.updatePlayer(
        mixerUpdateDelta,
        keysPressed,
        secondPerson,
        currentCamera
      );

      if (keysPressed.get("w")) {
        secondPerson.moveForward(0.1);
      }
      if (keysPressed.get("s")) {
        secondPerson.moveForward(-0.1);
      }
      if (keysPressed.get("a")) {
        secondPerson.moveRight(-0.1);
      }
      if (keysPressed.get("d")) {
        secondPerson.moveRight(0.1);
      }
    }
    renderer.render(scene, currentCamera);
  } else {// else it is up camera 
    currentCamera.lookAt(new THREE.Vector3(0, 0, 0));
    controls.update();
    const delta = clock.getDelta() * 0.6;
    if (human1Controls != undefined && currentHuman)
      human1Controls.updatePlayerUp(delta, keysPressed, currentCamera);
    else if(human2Controls!=undefined && !currentHuman) 
      human2Controls.updatePlayerUp(delta,keysPressed,currentCamera);
    
    if (mixer && currentHuman) mixer.update(delta);
    if (mixer2 && !currentHuman) mixer2.update(delta);


    if (fbxCounter >= 4) {
      overHeadCamera1.position.set(human1.position.x, 10, human1.position.z);
    }
    if (fbxCounter2 >= 4) {
      overHeadCamera2.position.set(human2.position.x, 10, human2.position.z);
    }

    renderer.render(scene, currentCamera);
  }
  ballLight.target = football;
  ballLight.position.set(football.position.x, 12.1, football.position.z);

  tree.position.set(100, 0, 60);
  treeLight.target = tree;
  treeLight.position.set(tree.position.x, 30, tree.position.z);

  if (human1Controls != undefined && currentHuman) {
    let bounds = sup.outOfBounds(human1.position);

    human1.position.x = bounds[0];
    human1.position.z = bounds[1];

    if (
      sup.canGetBall(football.position, human1Controls.model.position) &&
      ballPocession != 2 &&
      ballVelocity == 0
    ) {
      football.position.set(
        human1Controls.model.position.x,
        0,
        human1Controls.model.position.z
      );
      ballPocession = 1;
    }
  }
  if (human2Controls != undefined && !currentHuman) {
    let bounds = sup.outOfBounds(human2.position);

    human2.position.x = bounds[0];
    human2.position.z = bounds[1];

    if (
      sup.canGetBall(football.position, human2Controls.model.position) &&
      ballPocession != 1 &&
      ballVelocity == 0
    ) {
      football.position.set(
        human2Controls.model.position.x,
        0,
        human2Controls.model.position.z
      );
      ballPocession = 2;
    }
  }

  if (fbxCounter >= 4) {
    if (sup.checkCollisionForObject(human1.position, tree.position)) {
      let bounds = sup.stopPlayer(human1.position, tree.position);

      // console.log(bounds);
      human1.position.x = bounds[0];
      human1.position.z = bounds[1];
    }
  }
  if (fbxCounter2 >= 4) {
    if (sup.checkCollisionForObject(human2.position, tree.position)) {
      let bounds = sup.stopPlayer(human2.position, tree.position);

      // console.log(bounds);
      human2.position.x = bounds[0];
      human2.position.z = bounds[1];
    }
  }

  if (sup.checkCollisionForObject(football.position, tree.position)) {
    let bounds = sup.stopPlayer(football.position, tree.position);

    ballDirection.x = -ballDirection.x;
    ballDirection.z = -ballDirection.z;

    console.log("Deflecting!");

    ballVelocity = 10;
  }

  sup.checkGoal(football.position, window);
  sup.ballOutOfBounds(football.position, window);

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
    human2Camera = !human2Camera;
    currentCamera = currentCamera == upCamera ? (currentHuman?overHeadCamera1:overHeadCamera2) : upCamera;
    if(currentCamera == overHeadCamera1)console.log("current camera is up camera 1");
    else if (currentCamera == overHeadCamera2)console.log("current camera is up camera 2");
    if (currentCamera == overHeadCamera1) {
      firstPerson.lock();
    } else {
      firstPerson.unlock();
    }
    if (currentCamera == overHeadCamera2) {
      secondPerson.lock();
    } else {
      secondPerson.unlock();
    }
  }
  if (event.key == " ") {
    //dribble
    keysPressed.set(" ", true);
    //check if ball in proximity in the animate kick
    if (ballPocession >0) {
      console.log("Space Pressed!");
      //set ball velocity
      ballVelocity = 10;
      ballDirection = (ballPocession==1?human1Controls.runDirection:human2Controls.runDirection);
      ballPocession = 0;
    }
    
    // if yes then update the position of ball in the direction where the camera is facing
  }
  if(event.key =="k"){
    if(ballPocession>0){
      ballVelocity = 30;
      ballDirection = (ballPocession==1?human1Controls.runDirection:human2Controls.runDirection);
      ballPocession = 0;
    }
  }
  if(event.key == "p"){
    keysPressed.set("p",true);
    currentHuman = !currentHuman;
    if(currentCamera == overHeadCamera1 || currentCamera == overHeadCamera2){
      currentCamera = (currentHuman?overHeadCamera1:overHeadCamera2);
    }

  }
  keysPressed.set(event.key.toLowerCase(), true);
});

window.addEventListener("keyup", (event) => {
  keysPressed.set(event.key.toLowerCase(), false);
});

