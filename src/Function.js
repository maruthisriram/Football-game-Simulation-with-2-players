"use strict";

export class support {
  canGetBall(ballPos, playerPos) {
    let ballX = ballPos.x,
      ballZ = ballPos.z;

    let playerX = playerPos.x,
      playerZ = playerPos.z;

    let dist = Math.sqrt((ballX - playerX) ** 2 + (ballZ - playerZ) ** 2);

    if (dist < 2) {
      return true;
    }
    return false;
  }

  outOfBounds(playerPos) {
    let playerX = playerPos.x,
      playerZ = playerPos.z;

    let result = [playerX, playerZ];

    if (playerX > 300 || playerX < -300) {
      if (playerX > 300) {
        result[0] = 300;
      } else {
        result[0] = -300;
      }
    }

    if (playerZ > 150 || playerZ < -150) {
      if (playerZ > 150) {
        result[1] = 150;
      } else {
        result[1] = -150;
      }
    }

    return result;
  }

  ballOutOfBounds(ballPos, window) {
    let ballX = ballPos.x,
      ballZ = ballPos.z;

    if (ballX > 300 || ballX < -300) {
      window.location.reload();
    }

    if (ballZ > 150 || ballZ < -150) {
      window.location.reload();
    }
  }

  checkGoal(ballPos, window) {
    let ballX = ballPos.x,
      ballZ = ballPos.z;

    if (ballX >= 273 && ballZ <= 34 && ballZ >= -36) {
      console.log("Point goes to player 2!");
      window.location.reload();
    } else if (ballX <= -278 && ballZ <= 36 && ballZ >= -35) {
      console.log("Point goes to player 1!");
      window.location.reload();
    }
  }

  checkCollisionForObject(playerPos, objectPos) {
    let objectX = objectPos.x,
      objectZ = objectPos.z,
      playerX = playerPos.x,
      playerZ = playerPos.z;

    let dist = Math.sqrt((objectX - playerX) ** 2 + (objectZ - playerZ) ** 2);

    if (dist < 4) {
      return true;
    }
    return false;
  }

  stopPlayer(playerPos, objectPos) {
    let objectX = objectPos.x,
      objectZ = objectPos.z,
      playerX = playerPos.x,
      playerZ = playerPos.z;

    let result = [objectX - 4, objectZ - 4];

    if (playerX > objectX) {
      result[0] = objectX + 4;
    }

    if (playerZ > objectZ) {
      result[1] = objectZ + 4;
    }

    return result;
  }
}
