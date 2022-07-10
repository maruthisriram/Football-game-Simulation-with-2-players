"use strict";

import * as THREE from "three";
import { Quaternion, Vector3 } from "three";

export class player {
  constructor(model, spotLight, animationMap, mixer, initial) {
    this.model = model;
    this.spotLight = spotLight;
    this.animationsMap = animationMap;
    this.mixer = mixer;
    this.runDirection = new THREE.Vector3(0, 0, 1);
    this.currentAction = "idle";
    this.fadeDuration = 0.4;
    this.rotateAxis = new Vector3(0, 1, 0);
    this.rotateQuaternion = new Quaternion();
    this.model.position.x = initial;
  }

  updatePlayer(delta, keysPressed, firstPerson, camera, ball) {
    let kick = false,
      run = false,
      dribble = false;
    // console.log("delta ", delta);
    // console.log("keys pressed", keysPressed);
    // console.log("camera", camera);
    if (keysPressed.get("k")) kick = true;
    if (keysPressed.get(" ")) dribble = true;
    if (
      keysPressed.get("w") ||
      keysPressed.get("s") ||
      keysPressed.get("a") ||
      keysPressed.get("d")
    ) {
      run = true;
    }
    if (kick && run) {
      kick = false;
    }
    if (dribble && run) {
      dribble = false;
    }
    if (kick && this.currentAction != "kick") {
      const toPlay = this.animationsMap.get("kick");
      const current = this.animationsMap.get(this.currentAction);

      if (current) current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = "kick";
    } else if (dribble && this.currentAction != "kick") {
      const toPlay = this.animationsMap.get("kick");
      const current = this.animationsMap.get(this.currentAction);

      if (current) current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = "kick";
    } else if (run && this.currentAction != "run") {
      // console.log("animation map ", this.animationMap.get("run"));
      const toPlay = this.animationsMap.get("run");
      const current = this.animationsMap.get(this.currentAction);

      if (current) current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = "run";
    } else if (!run && !kick && !dribble) {
      const current = this.animationsMap.get(this.currentAction);
      const toPlay = this.animationsMap.get("idle");

      if (current) current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();
      this.mixer.update(delta);
      this.currentAction = "idle";
    }
    this.model.position.set(
      camera.position.x,
      camera.position.y - 10,
      camera.position.z
    );
    this.mixer.update(delta);

    if (this.currentAction == "run") {
      // get the camera direction
      let cameraDirection = new Vector3();

      firstPerson.getDirection(cameraDirection);
      var lookPoint = new THREE.Vector3();
      lookPoint.addVectors(cameraDirection, this.model.position);
      this.model.lookAt(lookPoint.x, lookPoint.y, lookPoint.z);
    }

    this.updateSpotlight();
  }

  updatePlayerUp(delta, keysPressed, camera) {
    let kick = false,
      run = false;
    if (keysPressed.get("k")) kick = true;
    if (
      keysPressed.get("w") ||
      keysPressed.get("s") ||
      keysPressed.get("a") ||
      keysPressed.get("d")
    ) {
      run = true;
    }
    if (kick && run) {
      kick = false;
    }
    if (kick && this.currentAction != "kick") {
      const toPlay = this.animationsMap.get("kick");
      const current = this.animationsMap.get(this.currentAction);

      if (current) current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = "kick";
    } else if (run && this.currentAction != "run") {
      const toPlay = this.animationsMap.get("run");
      const current = this.animationsMap.get(this.currentAction);

      if (current) current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();

      this.currentAction = "run";
    } else if (!run && !kick) {
      const current = this.animationsMap.get(this.currentAction);
      const toPlay = this.animationsMap.get("idle");

      if (current) current.fadeOut(this.fadeDuration);
      toPlay.reset().fadeIn(this.fadeDuration).play();
      this.mixer.update(delta);
      this.currentAction = "idle";
    }

    this.mixer.update(delta);

    if (this.currentAction == "run") {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        camera.position.x - this.model.position.x,
        camera.position.z - this.model.position.z
      );
      // diagonal movement angle offset
      var directionOffset = this.directionOffset(keysPressed);

      // console.log("direction offset : ", directionOffset);
      // rotate model
      console.log(this.rotateQuaternion);
      this.rotateQuaternion.setFromAxisAngle(
        this.rotateAxis,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2);

      // calculate direction
      // let tempDirection = new Vector3(0,0,0);
      camera.getWorldDirection(this.runDirection);
      // tempDirection = new Vector3(-tempDirection.x,-tempDirection.y,-tempDirection.z);
      // this.runDirection = tempDirection;
      console.log("run direction : ", this.runDirection);
      this.runDirection.y = 0;
      this.runDirection.normalize();
      this.runDirection.applyAxisAngle(this.rotateAxis, directionOffset);

      // run/walk velocity
      const velocity = 20;

      // move model & camera
      const moveX = this.runDirection.x * velocity * delta;
      const moveZ = this.runDirection.z * velocity * delta;
      this.model.position.x += moveX;
      this.model.position.z += moveZ;
    }

    this.updateSpotlight();
  }

  directionOffset(keysPressed) {
    // keys pressed: List
    var directionOffset = 0; // w

    if (keysPressed.get("w")) {
      if (keysPressed.get("a")) {
        directionOffset = Math.PI / 4; // w+a
      } else if (keysPressed.get("d")) {
        directionOffset = -Math.PI / 4; // w+d
      }
    } else if (keysPressed.get("s")) {
      if (keysPressed.get("a")) {
        directionOffset = Math.PI / 4 + Math.PI / 2; // s+a
      } else if (keysPressed.get("d")) {
        directionOffset = -Math.PI / 4 - Math.PI / 2; // s+d
      } else {
        directionOffset = Math.PI; // s
      }
    } else if (keysPressed.get("a")) {
      directionOffset = Math.PI / 2; // a
    } else if (keysPressed.get("d")) {
      directionOffset = -Math.PI / 2; // d
    }

    return directionOffset;
  }

  updateSpotlight() {
    this.spotLight.target = this.model;
    this.spotLight.position.set(
      this.model.position.x,
      12.1,
      this.model.position.z
    );
  }
}
