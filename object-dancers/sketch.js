/*
  Check our the GOAL and the RULES of this exercise at the bottom of this file.
  
  After that, follow these steps before you start coding:

  1. rename the dancer class to reflect your name (line 35).
  2. adjust line 20 to reflect your dancer's name, too.
  3. run the code and see if a square (your dancer) appears on the canvas.
  4. start coding your dancer inside the class that has been prepared for you.
  5. have fun.
*/

let dancer;

function setup() {
  // no adjustments in the setup function needed...
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("p5-canvas-container");

  // ...except to adjust the dancer's name on the next line:
  dancer = new Bill(width / 2, height / 2);
}

function draw() {
  // you don't need to make any adjustments inside the draw loop
  background(0);
  drawFloor(); // for reference only

  dancer.update();
  dancer.display();
}

// You only code inside this class.
// Start by giving the dancer your name, e.g. LeonDancer.
class Bill {
  constructor(startX, startY) {
    this.x = startX;
    this.y = startY;
    this.dir=1;

    // add properties for your dancer here:
    //..
    //..
    //..
  }
  update() {
    if (frameCount%20==0){
      this.dir=this.dir*-1
    }
    // update properties here to achieve
    // your dancer's desired moves and behaviour
  }
  display() {
    // the push and pop, along with the translate 
    // places your whole dancer object at this.x and this.y.
    // you may change its position on line 19 to see the effect.
    push();
    translate(this.x, this.y);

    // ******** //
    // ⬇️ draw your dancer from here ⬇️
  push() 
  scale(this.dir,1);
  //
  triangle(20 * noise(frameCount / 30), -50, -50, 50, 50, 50);
  ellipse(noise(frameCount / 30), 0, 40, 20);
  push();
  //eye
  fill("black")
  ellipse(10*noise(frameCount/20),0,10,20)
  pop();
  //line
  for (let y = 170; y <= 200; y += 10) {
    let x1 = map(y, 100, 200, 200, 150); 
    let x2 = map(y, 100, 200, 200, 250); 
    line(x1, y, x2, y);
  }
  //hat
  push();
    fill("white");
    rect(-10 + 20 * noise(frameCount / 30), -100, 20, 50);
    rect(-30 + 20 * noise(frameCount / 30), -60, 60, 10);
    push();
    fill("black")
    triangle(-25 + 20 * noise(frameCount / 30), 25, -25, 40, 0, 32.5);
    triangle(0, 32.5, 25, 25, 25, 40);
    pop();
    pop();
  //left hand
  beginShape();
    push();
    noFill();
    stroke(255);
    curveVertex(-35, 18);
    curveVertex(-35, 18);
    curveVertex(-83, 27);
    curveVertex(-88, -5);
    curveVertex(-88, -5);
    endShape();
    pop();
  //right hand
  beginShape();
    push();
    noFill();
    stroke(255);
    curveVertex(33, 18);
    curveVertex(33, 18);
    curveVertex(77, 33);
    curveVertex(95, 0);
    curveVertex(95, 0);
    endShape();
    pop();
  //leg
  beginShape();
    push();
    noFill();
    stroke(255)
    curveVertex(-21, 49);
    curveVertex(-21, 49);
    curveVertex(-24, 87);
    curveVertex(-24, 87);
    endShape();
    line(15, 49, 24, 83);
    pop();
    
  //
  pop() 
  

    






    // ⬆️ draw your dancer above ⬆️
    // ******** //

    // the next function draws a SQUARE and CROSS
    // to indicate the approximate size and the center point
    // of your dancer.
    // it is using "this" because this function, too, 
    // is a part if your Dancer object.
    // comment it out or delete it eventually.
    this.drawReferenceShapes()

    pop();
  }
  drawReferenceShapes() {
    noFill();
    stroke(255, 0, 0);
    line(-5, 0, 5, 0);
    line(0, -5, 0, 5);
    stroke(255);
    rect(-100, -100, 200, 200);
    fill(255);
    stroke(0);
  }
}



/*
GOAL:
The goal is for you to write a class that produces a dancing being/creature/object/thing. In the next class, your dancer along with your peers' dancers will all dance in the same sketch that your instructor will put together. 

RULES:
For this to work you need to follow one rule: 
  - Only put relevant code into your dancer class; your dancer cannot depend on code outside of itself (like global variables or functions defined outside)
  - Your dancer must perform by means of the two essential methods: update and display. Don't add more methods that require to be called from outside (e.g. in the draw loop).
  - Your dancer will always be initialized receiving two arguments: 
    - startX (currently the horizontal center of the canvas)
    - startY (currently the vertical center of the canvas)
  beside these, please don't add more parameters into the constructor function 
  - lastly, to make sure our dancers will harmonize once on the same canvas, please don't make your dancer bigger than 200x200 pixels. 
*/