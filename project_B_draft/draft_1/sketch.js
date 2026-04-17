let sand = [];
let isFist = false;
let timeContainer = 0;
const sandCount = 500;

function setup() {
  let canvas = createCanvas(800, 500);
  canvas.parent("p5-canvas-container");

  for (let i = 0; i < sandCount; i++) {
    sand.push(new Sand(random(width), random(height)));
  }
}

function draw() {
  
  background(0, 80);
  for (let i = 0; i < sand.length; i++) {
    sand[i].display();
    sand[i].update();
  }
}

class Sand {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 6;
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
    
    let angle = random(TWO_PI);
    let r = random(50, 100);
    this.offsetX = cos(angle) * r;
    this.offsetY = sin(angle) * r;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedX += random(-0.4, 0.4);
    this.speedY += random(-0.4, 0.4);

    if (isFist == true) {
      let targetX = width / 2 + this.offsetX;
      let targetY = height / 2 + this.offsetY;

      this.x = lerp(this.x, targetX, 0.075);
      this.y = lerp(this.y, targetY, 0.075);

      if (millis() - timeContainer > 3000) {
        console.log("time out");
        isFist = false;
      }
    }

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

function mousePressed() {
  isFist = true;
  timeContainer = millis();
}