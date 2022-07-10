import * as THREE from "three";
import { Quaternion, Vector2, Vector3 } from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export class CharacterControls {
  constructor(model, mixer, animationsMap, currentAction = "idle") {
    this.runDirection = new Vector3(0, 0, 1);
    this.rotateAngle = new Vector3(0, 1, 0);
    this.rotateQuaternion = new THREE.Quaternion();
    this.fadeDuration = 0.2;
    this.runVelocity = 10;
    this.model = model;
    this.mixer = mixer;
    this.animationsMap = animationsMap; // stand run kick
    this.currentAction = currentAction;
    animationsMap.get(this.currentAction).play();
    // this.updateCameraTarget(0, 0);
  }

  update(delta, keysPressed) {
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
    // this.fpControls.update(delta);

    if (this.currentAction == "run") {
      // calculate towards camera direction
      var angleYCameraDirection = Math.atan2(
        -(this.camera.position.x - this.model.position.x),
        -(this.camera.position.z - this.model.position.z)
      );
      // diagonal movement angle offset
      var directionOffset = this.directionOffset(keysPressed);

      console.log("direction offset : ", directionOffset);
      // rotate model
      this.rotateQuaternion.setFromAxisAngle(
        this.rotateAngle,
        angleYCameraDirection + directionOffset
      );
      this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2);

      // calculate direction
      // let tempDirection = new Vector3(0,0,0);
      this.camera.getWorldDirection(this.runDirection);
      // tempDirection = new Vector3(-tempDirection.x,-tempDirection.y,-tempDirection.z);
      // this.runDirection = tempDirection;
      console.log("run direction : ", this.runDirection);

      this.runDirection.y = 0;
      this.runDirection.normalize();
      this.runDirection.applyAxisAngle(this.rotateAngle, directionOffset);

      // run/walk velocity
      const velocity = this.runVelocity;

      // move model & camera
      const moveX = this.runDirection.x * velocity * delta;
      const moveZ = this.runDirection.z * velocity * delta;
      this.model.position.x += moveX;
      this.model.position.z += moveZ;
      this.updateCameraTarget(moveX, moveZ);
    }
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

  updateCameraTarget(moveX, moveZ) {
    // move camera
    this.camera.position.x += moveX;
    this.camera.position.z += moveZ;

    // update camera target
    this.cameraTarget.x = this.model.position.x;
    this.cameraTarget.y = this.model.position.y + 10;
    this.cameraTarget.z = this.model.position.z;
    this.orbitControls.target = this.cameraTarget;
  }
}
// updateCameraTarget(moveX, moveZ) {
//   // move camera
//   this.camera.position.x += moveX;
//   this.camera.position.z += moveZ;

//   // update camera target
//   // this.cameraTarget.x = this.model.position.x;
//   // this.cameraTarget.y = this.model.position.y + 7;
//   // this.cameraTarget.z = this.model.position.z;
//   this.camera.position.set(new Vector3(
//       this.model.position
//     )
//   )
//   this.orbitControls.update();
//   }

//   // calculate towards camera direction
//   var cameraDirection = new Vector3(0,0,0);
//   this.camera.getWorldDirection(cameraDirection);
//   // console.log("camera direction :", cameraDirection);
//   console.log("run direction : ", this.runDirection);
//   var angleYCameraDirection = Math.atan2(
//     -cameraDirection.x + this.runDirection.x,
//     -cameraDirection.z + this.runDirection.z
//     // this.camera.x - this.model.position.x,
//     // this.camera.position.z - this.model.position.z
//   );
//   // console.log("camera position: ",this.camera.position);
//   // diagonal movement angle offset
//   // var directionOffset = this.directionOffset(keysPressed);
//   // console.log("direction offset :",directionOffset);

//   // rotate model
//   console.log("angle Y camera direction : ",angleYCameraDirection);
//   this.rotateQuaternion.setFromAxisAngle(
//     this.rotateAngle,
//     angleYCameraDirection
//     // angleYCameraDirection + directionOffset
//   );
//   this.model.quaternion.rotateTowards(this.rotateQuaternion, 0.2);

//   // calculate direction

//   this.camera.getWorldDirection(this.runDirection);
//   this.runDirection.y = 0;
//   // console.log("run direction : ", this.runDirection);
//   this.runDirection.normalize();
//   // this.runDirection.applyAxisAngle(this.rotateAngle, directionOffset);

//   // run/walk velocity
//   const velocity = this.runVelocity;

//   // move model & camera
//   // const moveX = this.runDirection.x * velocity * delta*(keysPressed.get("s")?-1:1);
//   const moveX = this.runDirection.x * velocity * delta;
//   // const moveZ = this.runDirection.z * velocity * delta*(keysPressed.get("s")?-1:1);
//   const moveZ = this.runDirection.z * velocity * delta;
//   this.model.position.x += moveX;
//   this.model.position.z += moveZ;
// }
