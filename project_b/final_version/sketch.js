let handpose;
let video;
let hands = [];
let sand = [];
let img;
let isFist = false;
let timeContainer = 0;
let sample_step = 0;
let target_X;
let target_Y;
let images = [];
let state = "Intro";
let introTimeContainer = 0;
let wenwu1Container = 0;
let wenwu2Container = 0;
let wenwu3Container = 0;
let wenwu4Container = 0;
let endContainer = 0;
let allFallsDownContainer = 0;
let allFallsDownNextState = "default";
let allFallsDownDone = false;
let allFallsDownText = [" "];
let typeVisible = 0;
let typeText = "";
let typeState = "";
let typeDone = false;
let typeDoneContainer = 0;
let isLastFist = false;
let imageNum = -1;
let hasShow = false;
let canFist = false;
let time_gap = 3000;
let backgroundMusic;
let camelRingSound;
let bianzhongSound;
let sandDropSound;
let tangdaoSound;
let transitionSound;
let typewritterSound;
let artifactSoundPlayed = false;
let typewritterSoundStart = 0;

function preload() {
  handpose = ml5.handPose({
    flipHorizontal: true,
  });

  backgroundMusic = loadSound("music/background.mp3");
  camelRingSound = loadSound("music/camelring.mp3");
  bianzhongSound = loadSound("music/bianzhong.mp3");
  sandDropSound = loadSound("music/sand_drop.mp3");
  tangdaoSound = loadSound("music/tangdao.mp3");
  transitionSound = loadSound("music/transition.mp3");
  typewritterSound = loadSound("music/typewritter.mp3");

  //加载了四张图片
  for (let i = 1; i <= 4; i++) {
    let filename = "wenwu" + i + ".png";
    let tempImage = loadImage(filename);
    images.push(tempImage);
  }
  //by default,the first one, need state machine
  img = images[0];
}

//state manger
function stateManager() {
  if (state == "Intro") {
    let introText = ['Ten thousand years later, humans seek the echoes of ancient China, tracing the remnants of its spirit and culture.'];

    //打字机效果
    let introDone = typeWritter(width / 2, height / 2, introText, 10);

    //召唤沙子的Intro状态
    for (let i = 0; i < sand.length; i++) {
      sand[i].isIntro();
    }
    //时间完成之后自动复原
    if (introDone == true && millis() - typeDoneContainer > time_gap) {
      //把时间存下来
      introTimeContainer = millis();
      state = "default";
      img = images[0];
      imageNum = 0;
      hasShow = false;
      canFist = false;
      createTargetPoint(1, 100);
      for (let i = 0; i < sand.length; i++) {
        sand[i].x = random(1, width);
        sand[i].y = random(1, height);
        sand[i].speedX = random(-0.5, 0.5);
        sand[i].speedY = random(-0.5, 0.5);
        sand[i].tx = undefined;
        sand[i].ty = undefined;
      }
    }
  }
  if (state == "default") {

    textSize(24);
    fill(255, 150);
    textAlign(CENTER, CENTER);
    if (hasShow == true) {
      text("click to continue", width / 2, height - 80);
    } else {
      text("grab it", width / 2, height - 80);
    }
  }
  if (state == "allFallsDown") {
    allFallsDown();
    let allFallsDownTextDone = typeWritter(
      width / 2,
      height / 2,
      allFallsDownText,
      10
    );

    if (
      allFallsDownTextDone == true &&
      millis() - typeDoneContainer > time_gap
    ) {
      for (let i = 0; i < sand.length; i++) {
        sand[i].x = random(1, width);
        sand[i].y = random(1, height);
        sand[i].speedX = random(-0.5, 0.5);
        sand[i].speedY = random(-0.5, 0.5);
        sand[i].tx = undefined;
        sand[i].ty = undefined;
      }
      hasShow = false;
      canFist = false;
      artifactSoundPlayed = false;
      if (allFallsDownNextState == "default") {
        img = images[imageNum];
        createTargetPoint(1, 100);
      }
      state = allFallsDownNextState;
    }
  }
  if (state == "end") {
    let endText = ["hope the spirit remain"];

    let endDone = typeWritter(width / 2, height / 2, endText, 10);

    if (endDone == true && millis() - typeDoneContainer > time_gap) {
      endContainer = millis();
    }
  }

  isLastFist = isFist;
}

//开头的内容
function Intro() {
  //sand different movements
  if ((isIntro = true)) {
    for (let i = 0; i < sand.length; i++) {
      sand[i].isIntro();
    }
  }
  //call function type writter
  typeWritter();
}


function typeWritter(x, y, typeTextContent, n) {
  //n越小越快
  textSize(32);
  textLeading(42);
  fill(255);
  textAlign(CENTER, TOP);
  textFont("Courier New");

  let tempText = "";
  for (let i = 0; i < typeTextContent.length; i++) {
    tempText += typeTextContent[i];
  }

  if (typeText != tempText || typeState != state) {
    typeVisible = 0;
    typeText = tempText;
    typeState = state;
    typeDone = false;
    typeDoneContainer = 0;
    if (typewritterSound && !typewritterSound.isPlaying()) {
      typewritterSound.play();
      typewritterSoundStart = millis();
    }
  }
  if (state == "end" && typewritterSound && typewritterSound.isPlaying() && millis() - typewritterSoundStart > 5000) {
    typewritterSound.stop();
  }
  if (frameCount % n == 0) {
    if (typeVisible < tempText.length) {
      typeVisible += 1;
    }
  }


  let current_Text = tempText.substring(0, typeVisible);
  let boxW = min(800, width * 0.8);
  let boxH = height * 0.6;
  text(current_Text, x - boxW / 2, y - boxH / 2, boxW, boxH);

  if (typeVisible >= tempText.length && typeDone == false) {
    typeDone = true;
    typeDoneContainer = millis();
  }
  return typeDone;
}

function keyPressed() {
  if (key === " " && typeText.length > 0) {
    typeVisible = typeText.length;
    if (typewritterSound && typewritterSound.isPlaying()) {
      typewritterSound.stop();
    }
    return false;
  }
}

function playArtifactSound() {
  if (isFist == false || state != "default") {
    if (camelRingSound.isPlaying()) {
      camelRingSound.stop();
    }
    if (bianzhongSound.isPlaying()) {
      bianzhongSound.stop();
    }
    if (transitionSound.isPlaying()) {
      transitionSound.stop();
    }
    if (tangdaoSound.isPlaying()) {
      tangdaoSound.stop();
    }
    artifactSoundPlayed = false;
    return;
  }

  if (isFist == true && canFist == true && artifactSoundPlayed == false) {
    if (imageNum == 0) {
      camelRingSound.play();
    }
    if (imageNum == 1) {
      bianzhongSound.play();
    }
    if (imageNum == 2) {
      transitionSound.play();
    }
    if (imageNum == 3) {
      tangdaoSound.play();
    }
    artifactSoundPlayed = true;
  }
}


function mousePressed() {
  if (state == "default" && hasShow == true) {
    allFallsDownContainer = millis();
    allFallsDownDone = false;
    if (imageNum == 0) {
      allFallsDownText = ["This Tang-era camel whispers the enduring spirit of Harmony, carrying stories of unity across centuries"];
    }
    if (imageNum == 1) {
      allFallsDownText = ["The bronze bells resonate with Ritual, echoing the etiquette and order of a world long past"];
    }
    if (imageNum == 2) {
      allFallsDownText = ["The faint silhouette of Guanyin embodies Divinity, a testament to faith that transcends time"];
    }
    if (imageNum == 3) {
      allFallsDownText = ["The Tang sword stands for Courage, a silent emblem of bravery echoing through millennia."];
    }
    state = "allFallsDown";

    if (imageNum < images.length - 1) {
      imageNum++;
      allFallsDownNextState = "default";
    } else {
      allFallsDownNextState = "end";
    }
  }
}

//只要视频
function setup() {
  //intro text
  textSize(32);
  fill(255);

  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(windowWidth, windowHeight);
  video.hide();

  handpose.detectStart(video, gotHands);

  for (let i = 0; i <= 1000; i++) {
    sand.push(new Sand(random(1, width), random(1, height)));
  }
  //目标点
  createTargetPoint(1, 100);
}

function draw() {
  background(0);
  // for (let y = 0; y < height; y+=2) {
  // let chazhi = map(y, 0, height, 0, 1);
  // let topColor = color("rgb(106,23,23)");
  // let bottomColor = color("#833232");
  // stroke(lerpColor(topColor, bottomColor, chazhi));
  // line(0, y, width, y);
  // }

  //call function here
  //detect_Is_Parallel();
  call_Boshan_Gesture();
  detect_Is_Fist();

  //controlsand();
  if (isFist == false && state == "default") {
    canFist = true;
  }
  if (isFist == true && state == "default" && canFist == true) {
    hasShow = true;
  }
  playArtifactSound();
  stateManager();

  if (isFist == true && state == "default" && canFist == true) {
    assignSand();
  }

  // Draw all the tracked hand points
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];

    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];

      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }

  //draw sands
  for (let i = 0; i < sand.length; i++) {
    sand[i].display();
    sand[i].update();
  }
}

class Sand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 3;
    this.speedX = random(-0.5, 0.5);
    this.speedY = random(-0.5, 0.5);
  }

  isIntro() {
    if (state == "Intro") {
      this.speedX += random(-0.03, 0.03);
      this.speedY += random(-0.03, 0.03);
      this.speedX += 0.02 * sin(frameCount / 80 + this.y);
      this.speedY += 0.01 * sin(frameCount / 100 + this.x);
      this.speedX = constrain(this.speedX, -0.8, 0.8);
      this.speedY = constrain(this.speedY, -0.5, 0.5);
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y + this.radius / 2 > height) {
        this.y = this.radius / 2;
      }
      if (this.y - this.radius / 2 < 0) {
        this.y = height - this.radius / 2;
      }
      if (this.x - this.radius / 2 > width) {
        this.x = this.radius / 2;
      }
      if (this.x + this.radius / 2 < 0) {
        this.x = width - this.radius / 2;
      }
    }
  }

  setTarget(tx, ty) {
    this.tx = tx;
    this.ty = ty;
  }

  update() {
    if (
      isFist == true &&
      this.tx !== undefined &&
      state == "default" &&
      canFist == true
    ) {
      this.speedX = 0;
      this.speedY = 0;

      let fistSpeed = 0.12;
      if (imageNum == 1) {
        fistSpeed = 0.08;
      }
      if (imageNum == 2) {
        fistSpeed = 0.16;
      }
      if (imageNum == 3) {
        fistSpeed = 0.1;
      }
      this.x = lerp(this.x, this.tx, fistSpeed);
      this.y = lerp(this.y, this.ty, fistSpeed);

      return;
    }

    if (
      isFist == true &&
      this.offsetX !== undefined &&
      state == "default" &&
      canFist == true
    ) {
      let targetX = width / 2 + this.offsetX;
      let targetY = height / 2 + this.offsetY;

      this.x = lerp(this.x, targetX, 0.075);
      this.y = lerp(this.y, targetY, 0.075);

      return;
    }

    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX += random(-0.4, 0.4);
    this.speedY += random(-0.4, 0.4);
    this.speedX = constrain(this.speedX, -5, 5);
    this.speedY = constrain(this.speedY, -5, 5);

    if (this.x + this.radius / 2 > width || this.x - this.radius / 2 < 0) {
      this.speedX = -this.speedX;
    }
    if (this.y + this.radius / 2 > height || this.y - this.radius / 2 < 0) {
      this.speedY = -this.speedY;
    }
  }

  display() {
    noStroke();
    fill(255, 210, 140);
    circle(this.x, this.y, this.radius);
  }
}


function gotHands(results) {
  hands = results;
}

function call_Boshan_Gesture() {}


function detect_Is_Fist() {
  if (hands.length > 0) {
    let hand = hands[0];
    let mcp = hand.keypoints[5];
    let tip = hand.keypoints[8];
    let wrist = hand.keypoints[0];
    let fingerLen = dist(mcp.x, mcp.y, tip.x, tip.y);
    let baseLen = dist(mcp.x, mcp.y, wrist.x, wrist.y);
    let ratio = fingerLen / baseLen;

    if (ratio < 0.4) {
      isFist = true;
    } else {
      isFist = false;
    }
  }
}


// function detect_Is_Parallel() {
//   //the first hand I detect
//   let twohands_angle = [];

//   for (let i = 0; i < hands.length && i < 2; i++) {
//     if (hands.length > 0) {
//       let hand = hands[i];
//       let shizhishang = hand.keypoints[8];
//       let shizhixia = hand.keypoints[5];
//       let zhongzhishang = hand.keypoints[12];
//       let zhongzhixia = hand.keypoints[9];
//       let wumingzhishang = hand.keypoints[16];
//       let wumingzhixia = hand.keypoints[13];

//       let shizhi_angle =
//         (shizhishang.y - shizhixia.y) / (shizhishang.x - shizhixia.x);

//       let zhongzhi_angle =
//         (zhongzhishang.y - zhongzhixia.y) / (zhongzhishang.x - zhongzhixia.x);

//       let wumingzhi_angle =
//         (wumingzhishang.y - wumingzhixia.y) /
//         (wumingzhishang.x - wumingzhixia.x);

//       //每次清空
//       let angles = [];
//       angles.push(abs(shizhi_angle), abs(zhongzhi_angle), abs(wumingzhi_angle));

//       let max_angle = max(angles);
//       let min_angle = min(angles);
//       let temp = max_angle - min_angle;
//       twohands_angle.push(temp);
//     }
//   }

//   if (twohands_angle[0] < 0.5 && twohands_angle[1] < 0.5) {
//     //console.log("Parallel" + twohands_angle[0] + twohands_angle[1]);
//   } else {
//     console.log("No Parallel");
//   }
// }

//Atkinson dithering
// function createTargetPoint(sample_step = 1, dark_threshold = 127) {
//   boshanTarget_X = [];
//   boshanTarget_Y = [];
//   img.loadPixels();
//   let scaleFactor = 0.5;
//   let drawW = img.width * scaleFactor;
//   let drawH = img.height * scaleFactor;
//   let offsetX = width / 2 - drawW / 2;
//   let offsetY = height / 2 - drawH / 2;

//   for (let y = 0; y < img.height; y++) {
//     for (let x = 0; x < img.width; x++) {
//       let idx = (x + y * img.width) * 4;
//       let r = img.pixels[idx + 0];
//       let g = img.pixels[idx + 1];
//       let b = img.pixels[idx + 2];
//       let a = img.pixels[idx + 3];
//       let bright = (r + g + b) / 3;
//       let newVal, err;
//       if (bright < dark_threshold && a > 10) {
//         newVal = 0;
//         err = bright;
//       } else {
//         newVal = 255;
//         err = bright - 255;
//       }
//       img.pixels[idx + 0] = newVal;
//       img.pixels[idx + 1] = newVal;
//       img.pixels[idx + 2] = newVal;
//       img.pixels[idx + 3] = 255;

//       // Atkinson dithering
//       let neighbors = [
//         [x + 1, y],
//         [x + 2, y],
//         [x - 1, y + 1],
//         [x, y + 1],
//         [x + 1, y + 1],
//         [x, y + 2],
//       ];

//       for (let [nx, ny] of neighbors) {
//         if (nx >= 0 && nx < img.width && ny >= 0 && ny < img.height) {
//           let nIdx = (nx + ny * img.width) * 4;
//           let nBright =
//             (img.pixels[nIdx] + img.pixels[nIdx + 1] + img.pixels[nIdx + 2]) /
//             3;
//           nBright += err * 0.125;
//           nBright = constrain(nBright, 0, 255);
//           img.pixels[nIdx] = nBright;
//           img.pixels[nIdx + 1] = nBright;
//           img.pixels[nIdx + 2] = nBright;
//           img.pixels[nIdx + 3] = 255;
//         }
//       }
//     }
//   }
//   img.updatePixels();
//   for (let y = 0; y < img.height; y += sample_step) {
//     for (let x = 0; x < img.width; x += sample_step) {
//       let idx = (x + y * img.width) * 4;
//       let bright = img.pixels[idx];
//       if (bright === 0) {
//         let px = offsetX + x * scaleFactor;
//         let py = offsetY + y * scaleFactor;
//         boshanTarget_X.push(px);
//         boshanTarget_Y.push(py);
//       }
//     }
//   }

//   console.log("target points:", boshanTarget_X.length);
// }

function assignSand() {
  // for (let i = 0; i < sand.length; i++) {
  // let target_X = boshanTarget_X[i % boshanTarget_X.length];
  // let target_Y = boshanTarget_Y[i % boshanTarget_Y.length];

  for (let i = 0; i < sand.length; i++) {
    let id = floor(map(i, 0, sand.length, 0, boshanTarget_X.length));
    let target_X = boshanTarget_X[id];
    let target_Y = boshanTarget_Y[id];

    //boshan's offset
    if (target_Y < windowHeight * 0.5) {
      //target_X += 30 * noise(frameCount / 20)
      //target_Y += 20 * noise(sin(frameCount / 20 - i), -1, 1, 0, 1);
    }
    sand[i].setTarget(target_X, target_Y);
  }
}

//沙子的吸附in case I need it
// function controlsand() {
//   if (isFist == false) {
//     if (hands.length > 0) {
//       let hand = hands[0];
//       let finger = hand.keypoints[8];
//       let x = finger.x;
//       let y = finger.y;

//       for (let i = 0; i < sand.length; i++) {
//         let point = hand.keypoints[i];
//         let sand_Dist = dist(x, y, sand[i].x, sand[i].y);
//         if (sand_Dist < 100) {
//           sand[i].x = lerp(sand[i].x, x, 0.1);
//           sand[i].y = lerp(sand[i].y, y, 0.1);
//           console.log("Control the sand!");
//         }
//       }
//     }
//   }
// }

//threshold
function createTargetPoint(sample_step, dark_threshold) {
  boshanTarget_X = [];
  boshanTarget_Y = [];
  img.loadPixels();
  let scaleFactor = min((width * 0.8) / img.width, (height * 0.8) / img.height);
  let drawW = img.width * scaleFactor;
  let drawH = img.height * scaleFactor;
  let offsetX = width / 2 - drawW / 2;
  let offsetY = height / 2 - drawH / 2;

  for (let y = 0; y < img.height; y += sample_step) {
    for (let x = 0; x < img.width; x += sample_step) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let a = img.pixels[index + 3];

      let bright = (r + g + b) / 3;

      if (bright < dark_threshold && a > 10) {
        let px = offsetX + x * scaleFactor;
        let py = offsetY + y * scaleFactor;

        boshanTarget_X.push(px);
        boshanTarget_Y.push(py);
      }
    }
  }

  //console.log("target points:", boshanTarget_X.length);
}

//old isFist logic
//find the pooints with are dark by looping the pixel array

// function detect_Is_Fist() {
//   if (hands.length > 0) {
//     let hand = hands[0];
//     let largest_Dist = 0;
//     let wrist = hand.keypoints[0];

//     for (let i = 0; i < hand.keypoints.length; i++) {
//       let point = hand.keypoints[i];
//       let tem_Dist = dist(point.x, point.y, wrist.x, wrist.y);
//       if (tem_Dist > largest_Dist) {
//         largest_Dist = tem_Dist;
//       }
//     }

//     if (largest_Dist < 370) {
//       isFist = true;
//       isBoshan = true;
//     } else {
//       isFist = false;
//       isBoshan = false;
//     }
//   }
// }

//all trainsition
function allFallsDown() {
  if (state == "allFallsDown") {
    for (let i = 0; i < sand.length; i++) {
      sand[i].tx = 0;
      sand[i].ty = 0;
      sand[i].speedY += 0.2;
      sand[i].speedX += random(-0.1, 0.1);
      sand[i].x += sand[i].speedX;
      sand[i].y += sand[i].speedY;
    }
  }
}