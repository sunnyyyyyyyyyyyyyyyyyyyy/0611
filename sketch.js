let handpose, video;
let detections = [];
let canvas;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => console.log("模型載入完成"));
  handpose.on("predict", results => detections = results);
}

function draw() {
  image(video, 0, 0, width, height);

  if (detections.length > 0) {
    let hand = detections[0];
    let indexFinger = hand.annotations.indexFinger;
    let tip = indexFinger[3];

    fill(255, 0, 0);
    noStroke();
    ellipse(tip[0], tip[1], 20, 20); // 食指指尖標記

    // TODO: 在這裡加入連連看的邏輯，例如畫出線條、配對判斷
  }
}

function windowResized() {
  canvas.position((windowWidth - width) / 2, (windowHeight - height) / 2);
}
