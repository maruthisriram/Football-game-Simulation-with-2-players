"use strict";

import * as THREE from "three";
import { PARSE } from "../helpers/parsing";

let textureLoader = new THREE.TextureLoader();
let map = textureLoader.load("Textures/Football2.jpeg");
let material = new THREE.MeshPhongMaterial({ map: map });

let football = new THREE.Group();
let football_object = new THREE.Group();
let lamp = new THREE.Group();
let plane = new THREE.Group();
let leftPost = new THREE.Group();
let rightPost = new THREE.Group();
let tree = new THREE.Group();
let loader = new PARSE();
let ballLight = new THREE.SpotLight(0xffffff, 3, 100);
ballLight.castShadow = true;

let treeLight = new THREE.SpotLight(0xffffff, 3, 100);
treeLight.castShadow = true;

football = loader.createObject(
  "OBJ Files/football.mtl",
  "OBJ Files/football.obj",
  football,
  0,
  1,
  0,
  material
);

map = textureLoader.load("Textures/Grass.jpg");
material = new THREE.MeshPhongMaterial({ map: map });

plane = loader.createObject(
  "OBJ Files/Field.mtl",
  "OBJ Files/Field.obj",
  plane,
  0,
  0,
  0,
  material
);
plane.scale.set(3, 3, 3);
// camera.lookAt(plane.position);

map = textureLoader.load("Textures/white.jpeg");
material = new THREE.MeshPhongMaterial({ map: map });

let x = [-300, -300, -150, -150, 0, 0, 150, 150, 300, 300];
let z = [-25, 25, -25, 25, -25, 25, -25, 25, -25, 25];
let streetLamps = [];
let lights = [];

for (let i = 0; i < 10; ++i) {
  // make lamp
  let temp = new THREE.Group();

  temp = loader.createObject(
    "OBJ Files/streetLamp.mtl",
    "OBJ Files/streetLamp.obj",
    temp,
    x[i],
    0,
    3 * (z[i] * 2),
    material
  );
  temp.scale.set(1, 3, 1);
  streetLamps.push(temp);
  if (i % 2 == 0) {
    streetLamps[i].rotation.y += Math.PI;
    streetLamps[i].position.z = 3 * (z[i] * 4);
  }

  // make light
  let light = new THREE.PointLight(0xffffff, 3, 100);

  if (i % 2 == 0) {
    light.position.set(x[i], 12.1, 3 * (z[i] * 2 + 1.83));
  } else {
    light.position.set(x[i], 12.1, 3 * (z[i] * 2 - 1.83));
  }
  lights.push(light);
}
for (let i = 0; i < 10; ++i) {
  lamp.add(streetLamps[i]);
  lamp.add(lights[i]);
}

map = textureLoader.load("Textures/white.jpeg");
material = new THREE.MeshPhongMaterial({ map: map });

leftPost = loader.createObject(
  "OBJ Files/leftPost.mtl",
  "OBJ Files/leftPost.obj",
  leftPost,
  -300,
  0,
  0,
  material
);

map = textureLoader.load("Textures/white.jpeg");
material = new THREE.MeshPhongMaterial({ map: map });

rightPost = loader.createObject(
  "OBJ Files/rightPost.mtl",
  "OBJ Files/rightPost.obj",
  rightPost,
  300,
  0,
  0,
  material
);

map = textureLoader.load("Textures/white.jpeg");
material = new THREE.MeshPhongMaterial({ map: map });

tree = loader.createObject(
  "",
  "OBJ Files/Lowpoly_tree_sample.obj",
  tree,
  0,
  0,
  0,
  material
);


export {
  football,
  lamp,
  plane,
  leftPost,
  rightPost,
  ballLight,
  tree,
  treeLight,
};
