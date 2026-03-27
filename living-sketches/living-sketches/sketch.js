

//just a test

let ricks = [];
let curImage = 0;

function preload() {
  for (let i = 1; i < 10; i++) {
    let filename = 'rick' + i + '.jpg'
    let rick = loadImage(filename);
    ricks.push(rick);
    console.log("load")
  }

}

function setup() {
  createCanvas(800, 700);
  eraseBg(ricks, 10);
  fireworks = crop(ricks, 760, 41, 150, 700);
}

function draw() {
  background(255);
  imageMode(CENTER);
  //fireworks
  image(
    fireworks[curImage],
    mouseX,
    mouseY,
    fireworks[0].width * 0.25,
    fireworks[0].height * 0.25
  );

  let zhen;
  let d;
  d = dist(mouseX, mouseY, width / 2, height / 2)
  zhen = map(d, 0, 531, 10, 20)
  zhen = floor(zhen)

  curImage = floor((frameCount / zhen) % fireworks.length);
  let dx = random(-8, 8);
  let dy = random(-3, 3);
  tint(255, 0, 0, 120);
  image(ricks[curImage], width / 2 - 12 + dx, height / 2 + dy);
  tint(0, 255, 0, 120);
  image(ricks[curImage], width / 2 + 12 - dx, height / 2 - dy);
  tint(180, 100, 255, 180);
  image(ricks[curImage], width / 2, height / 2);
  filter(POSTERIZE, 1.9);

  if (frameCount % zhen == 0) {
    curImage = (curImage + 1) % ricks.length;
  }





}

// You shouldn't need to modify these helper functions:

function crop(imgs, x, y, w, h) {
  let cropped = [];
  for (let i = 0; i < imgs.length; i++) {
    cropped.push(imgs[i].get(x, y, w, h));
  }
  return cropped;
}

function eraseBg(imgs, threshold = 10) {
  for (let i = 0; i < imgs.length; i++) {
    let img = imgs[i];
    img.loadPixels();
    for (let j = 0; j < img.pixels.length; j += 4) {
      let d = 255 - img.pixels[j];
      d += 255 - img.pixels[j + 1];
      d += 255 - img.pixels[j + 2];
      if (d < threshold) {
        img.pixels[j + 3] = 0;
      }
    }
    img.updatePixels();
  }
  // this function uses the pixels array
  // we will cover this later in the semester - stay tuned
}

