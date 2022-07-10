import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import * as THREE  from "three";

export function loadHuman(scene,mixer,actions,human1){
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
    });

    fbxLoader.load("./../Models/converted/Idle.fbx", function (object) {
        // mixer = new THREE.AnimationMixer( object );
        let action = mixer.clipAction(object.animations[0]);
        action.play();
        // console.log("idle action :",action);
        actions.set("idle", action);
    });

    fbxLoader.load("./../Models/converted/Running.fbx", function (object) {
        // mixer = new THREE.AnimationMixer( object );
        let action = mixer.clipAction(object.animations[0]);
        // action.play();
        actions.set("run", action);
    });


    fbxLoader.load("./../Models/converted/KickSoccerball.fbx",  function (object) {
        let action = mixer.clipAction(object.animations[0]);
        actions.set("kick", action);
        // console.log("orbit controls for camera 2:", orbitControlCamera1);
    });

    console.log("done loading");
}