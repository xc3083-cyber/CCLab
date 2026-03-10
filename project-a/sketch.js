let state;
let gx;
let gy;
let s;
let size;
let r;
let length;
let eyeOffset;
let endTime;
let fallApart = false;
let fallAmount = 0;

//normal tentagle里面的三个
let Long;
let mode;
let k;
let wavelength = 150;
let patrolX;
let patrolY;
//
let patrolScale;
let targetScale;
//
let virusX;
let virusY;
let angryStartTime;
//
let shootLaser = false;
//
let TokenX = 100;
let TokenY = 400;
let dragging = false;





function setup() {
    let canvas = createCanvas(800, 500);
    canvas.id("p5-canvas");
    canvas.parent("p5-canvas-container");
    //createCanvas(800,500);
    state = "patrol"
    gx = width / 2;
    gy = height / 2;
    s = 10;
    size = 3;
    r = 3;
    length = 100
    eyeOffset = 0;
    //触手默认值
    Long = 130;
    mode = 10;
    k = TWO_PI / wavelength;
    patrolX = gx;
    patrolY = gy;
    patrolScale = 1;
    targetScale = 1;
    //
    virusX = 0;
    virusY = 0;




}

function draw() {

    //background(0,20);
    //drawBackground(10);
    //drawCyberBackground();
    patrolState();


    push();
    scale(patrolScale);
    //60无敌触手,130,150环形小球状态，图形学你赢了
    //k=1,long=200,最后=20
    normalTen(gx, gy + length * 0.6, 200, 30, 255, 20, 0.1, 45, 20);
    normalTen(gx - length * 0.35, gy + length * 0.5, 200, 30, 255, 20, 0.1, 90, 20);
    normalTen(gx - length * 0.35, gy + length * 0.5, 200, 30, 255, 20, 0.1, 135, 20);

    normalTen(gx, gy + length * 0.75, 200, 30, 255, 20, 0.1, -45, 20);
    normalTen(gx + length * 0.4, gy + length * 0.5, 200, 30, 255, 20, 0.1, -90, 20);
    normalTen(gx + length * 0.4, gy + length * 0.5, 200, 30, 255, 20, 0.1, -135, 20);


    //face
    pixelCircle(gx, gy - 30 * 0.65, length * 0.65, 10 * 0.65, "rgb(255,252,252)", fallAmount)
    pixelCircle(gx, gy + 30 * 0.65, length * 0.65 * 0.75, 10 * 0.65, "white", fallAmount)
    pixelCircle(gx, gy, length * 0.5 * 0.65, 10 * 0.65, "black", fallAmount)
    pixelCircle(gx, gy, length * 0.4 * 0.65, 10 * 0.65, "white", fallAmount)

    //eye
    if (mouseIsPressed) {
        someOffsetX = map(mouseX, 0, width, -20, 20, true);
        someOffsetY = map(mouseY, 0, height, -20, 20, true)
        // circle(map(mouseX,0,width,180,220,true), map(mouseY,0,height,180,220,true),30)
    } else {
        someOffsetX = 20 * cos(frameCount / 100);
        someOffsetY = 20 * sin(frameCount / 100);
    }
    pixelCircle(gx + 0.65 * someOffsetX, gy + 0.65 * someOffsetY, length * 0.65 * 0.3, 10 * 0.65, "black", fallAmount)
    pixelCircle(gx - 15 * 0.65 + someOffsetX * 0.65, gy - 15 * 0.65 + someOffsetY * 0.65, length * 0.65 * 0.04, 10 * 0.65, "white", fallAmount)
    //pixelCircle(gx+0.65*someOffsetX,gy+0.65*someOffsetY,14,5, "rgb(180,255,255)", fallAmount); 
    drawLazer(gx, gy)
    if (shootLaser) {
        push();
        strokeWeight(10);
        stroke("green");
        line(gx + 0.65 * someOffsetX, gy + 0.65 * someOffsetY, virusX, virusY);
        pop();
        shootLaser = false;
    }
    pop();
    //drawGrid(10)
    fallApartManager()
    virusManager()
    drawFood()

}


function fallApartManager() {
    if (fallApart) {
        if (millis() - endTime < 2000) {
            fallAmount = lerp(fallAmount, 30, 0.04)
            Long = lerp(Long, 200, 0.05);
            mode = lerp(mode, 20, 0.05);
            k = lerp(k, 1, 0.05);


        } else {
            fallAmount = lerp(fallAmount, 0, 0.05)
            Long = lerp(Long, 130, 0.05);
            mode = lerp(mode, 10, 0.05)
            k = lerp(k, TWO_PI / wavelength, 0.05);
            //fallApart = false;
            if (fallAmount < 0.5) {
                fallAmount = 0;
                Long = 130;
                mode = 10;
                k = TWO_PI / wavelength;
                fallApart = false;
            }
        }
    }

}

function keyPressed() {
    if (key === ' ') {
        fallApart = true;
        endTime = millis();

    }


}

function pixelCircle(x, y, r, s, col = 255, fallAmount = 0) {
    let fallApartX;
    let fallApartY;
    for (let i = x - r - 10; i < x + r + 10; i += s) {
        for (let j = y - r - 10; j < y + r + 10; j += s) {
            let d = dist(x, y, i, j)
            if (d <= r + 5) {
                fill(col);
                stroke(0, 0, 0, 20)
                let noiseOffset = noise(frameCount / 50);
                fallApartX = fallAmount * cos(frameCount / 50 - i)
                fallApartY = fallAmount * sin(frameCount / 50 - j)

                rect(i - s + map(noiseOffset, 0, 1, -30, 30) + fallApartX, j + s + map(noiseOffset, 0, 1, -30, 30) + fallApartY, s, s)
            }

        }

    }
}

function drawGrid(s, alpha1 = 40) {
    for (let x = 0; x < width; x += s) {
        for (let y = 0; y < height; y += s) {
            noFill();
            stroke(0, 0, 0, alpha1);
            rect(x - s, y - s, s, s)
        }
    }

}

function normalTen(tenx, teny, Long, r = 30, tencol = 0, amp = 30, speed = 0.1, Tenangle = 0, mode = 10, wavelength = 150) {

    push();
    //起点
    translate(tenx, teny);
    rotate(radians(Tenangle))
    fill(tencol);
    //noFill();
    //beginShape();
    //14,17,10 three modes
    for (let i = 0; i <= Long; i += Long / mode) {
        let v = amp * sin(frameCount * speed - i * k);
        // let k = TWO_PI / wavelength;  
        // let v = amp*sin(frameCount*speed-i*k);
        // curveVertex(v, i);
        // curveVertex(v, i);
        // curveVertex(v,i+Long);
        // curveVertex(v+20,i);
        // curveVertex(v,i)
        // curveVertex(v,i)
        stroke(0, 0, 0, 40);
        rect(v, i, r, r);
        r -= 1.5



        //circle(i, v, 5);
    }
    pop();

}

function drawLazer(gx, gy, sWeight = 3, sColor = "black", sLength = 700) {
    for (let x = 0; x < width; x += 30) {
        if (fallApart || state == "angry") {
            return
        } else {


            let offset = 150 * noise(frameCount / 100);
            push();
            strokeWeight(sWeight)
            stroke(sColor); line(gx + 20 * cos(frameCount / 100), gy + 20 * sin(frameCount / 100), gx + x + sLength * cos(frameCount / 100), gy + sLength * sin(frameCount / 100))
            pop();
        }

    }
}


function patrolState() {
    if (state == "patrol") {
        let maxScale = 1.2;
        let margin = length * maxScale;

        if (frameCount % 100 == 0) {
            patrolX = random(margin, width - margin)
            patrolY = random(margin, height - margin)
            targetScale = random(0.5, 1.2)

        }

        gx = lerp(gx, patrolX, 0.01);
        gy = lerp(gy, patrolY, 0.01);
        patrolScale = lerp(patrolScale, targetScale, 0.01)
    }
}


function drawBackground(s) {
    for (let x = 0; x < width; x += s) {
        for (let y = 0; y < height; y += s) {
            // let d= dist(gx,gy,x,y)
            // let colorOffset=
            let noiseVal2 = noise(x / 100 + frameCount / 100, y / 100 + frameCount / 100)
            fill(map(noiseVal2, 0, 1, 150, 340), 100, 100)
            noStroke()
            rect(x - 4, y - 4, s)

        }

    }

}


function virusManager() {
    if (dragging) {
        return
    }
    virusX = mouseX;
    virusY = mouseY;
    pixelCircle(virusX, virusY, 10, 10, "red", 10)
    let d;
    d = dist(virusX, virusY, gx, gy)
    if (d < 300) {
        state = "angry"
        gx += random(-3, 3);
        gy += random(-3, 3);

        if (angryStartTime === undefined) {
            angryStartTime = millis();
        }

        if (millis() - angryStartTime > 2500) {
            fallApart = true
            gx = lerp(gx, virusX, 0.06)
            gy = lerp(gy, virusY, 0.06)
            state = "patrol"
            shootLaser = true;
        }


    } else {
        angryStartTime = undefined;
    }

}


function drawFood() {
    pixelCircle(TokenX, TokenY, 5, 10, "rgb(123,145,200)", 10);
    if (dragging) {
        TokenX = lerp(TokenX, mouseX, 0.06);
        TokenY = lerp(TokenY, mouseY, 0.06)
        let d = dist(TokenX, TokenY, gx, gy);
        if (d < 30) {
            fallApart = true;
            endTime = millis()

        }
    }



}

function mousePressed() {
    if (dist(mouseX, mouseY, TokenX, TokenY) < 20) {
        dragging = true;
    }
}

function mouseReleased() {
    dragging = false

}





























































function pixelTen(startX, startY, tenwidth, tenheight, tencol = 255, a = 0, tentagle = 1, tenAngle = 0) {
    //   let s=10;
    //   let j=startY;
    //   push();
    //   translate(startX,startY);
    //   rotate(radians(tenAngle))

    //    while(j<=startY+tenheight){
    //     let i=startX;
    //     while(i<=startX+tenwidth){
    //       if(i>=startX+a&&i<=startX+tenwidth-a){
    //         fill(tencol)
    //         rect(i-s,j-s,s,s)
    //       }
    //       i+=s;
    //           }
    //      a+=tentagle;
    //      j+=s;


    //   }
    //   pop();
}
