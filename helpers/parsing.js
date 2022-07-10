"use strict";

import * as THREE from "three";
import { Scene, Vector3 } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class PARSE {
  createObject(mtlFilePath, objFilePath, group, x, y, z, material) {
    var objLoader = new OBJLoader();

    objLoader.load(objFilePath, function (mesh) {
      mesh.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
          node.castShadow = true;
          node.receiveShadow = true;
          node.material = material;
        }
      });

      mesh.position.set(x, y, z);
      group.add(mesh);
    });
    return group;
  }

  createFBXObject(fbxFilePath, scene, x, y, z) {
    const loader = new FBXLoader();
    loader.load(fbxFilePath, function (object) {
      // mixer = new THREE.AnimationMixer( object );
      // const action = mixer.clipAction( object.animations[ 0 ] );
      // action.play();
      object.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      object.position.set(new Vector3(x, y, z));
      scene.add(object);
      console.log("object: ", object);
      // scene.add( object );
    });
  }
}
