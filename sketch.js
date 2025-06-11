let handpose, video;
let detections = [];
const LEFT = [
  "教學設計", "程式設計", "攝影與視覺傳達"
];
const RIGHT = [
  "教材與策略規劃",
  "撰寫邏輯語法",
  "鏡頭與美感訓練"
];
const CORRECT = {
  "教學設計": "教材與策略規劃",
  "程式設計": "撰寫邏輯語法",
  "攝影與視覺傳達": "鏡頭與美感訓練"
};

let leftPos = [], rightPos = [];
let selected = null;
let lines = [];
let success = false;
let modelReadyFlag = false;

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => { modelReadyFlag = true });
  handpose.on("predict", results => detections = results);

  textSize(18);
  for (let i = 0; i < LEFT.length; i++) {
    leftPos.push({ x: 150, y: 120 + i * 120 });
    rightPos.push({ x: 650, y: 120 + i * 120 });
  }
}

function draw() {
  background(240);
  if (!modelReadyFlag) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("模型載入中...", width / 2, height / 2);
    return;
  }
  // 畫題目與答案
  LEFT.forEach((t, i) => drawBox(leftPos[i], t));
  RIGHT.forEach((t, i) => drawBox(rightPos[i], t));

  // 畫已配對線條
  stroke(0, 150, 200);
  strokeWeight(4);
  lines.forEach(l => line(l.x1, l.y1, l.x2, l.y2));

  // 偵測食指尖位置
  let fx, fy;
  if (detections.length > 0 && detections[0].landmarks) {
    const pt = detections[0].landmarks[8];
    fx = width - pt[0] * width;
    fy = pt[1] * height;
    // draw pointer
    fill(255, 0, 0);
    noStroke();
    ellipse(fx, fy, 15);
  }

  // 拖拉線段效果
  if (selected && fx != null) {
    stroke(255, 0, 0);
    line(selected.x, selected.y, fx, fy);
  }

  // 成功訊息
  if (success) {
    noStroke();
    fill(0, 200, 0);
    textSize(28);
    textAlign(CENTER, CENTER);
    text("🎉 全部配對完成！", width / 2, height - 40);
  }
}

function drawBox(pos, txt) {
  fill(255);
  stroke(0);
  rect(pos.x - 100, pos.y - 25, 200, 50, 5);
  noStroke();
  fill(0);
  textAlign(CENTER, CENTER);
  text(txt, pos.x, pos.y);
}

function mousePressed() { /* p5 placeholder */ }

function mouseReleased() { /* p5 placeholder */ }

function touchStarted() {
  // on first touch equivalent
  if (fx && fy) {
    LEFT.forEach((t, i) => {
      if (dist(fx, fy, leftPos[i].x, leftPos[i].y) < 50) {
        selected = { text: LEFT[i], x: leftPos[i].x, y: leftPos[i].y };
      }
    });
  }
  return false;
}

function touchEnded() {
  if (selected && fx && fy) {
    RIGHT.forEach((t, i) => {
      if (dist(fx, fy, rightPos[i].x, rightPos[i].y) < 50
        && !lines.some(l => l.text === selected.text)) {
        lines.push({
          text: selected.text,
          x1: selected.x, y1: selected.y,
          x2: rightPos[i].x, y2: rightPos[i].y
        });
      }
    });

    // 檢查配對是否完成
    if (lines.length === LEFT.length) {
      success = lines.every(l => CORRECT[l.text] === 
        RIGHT[ rightPos.findIndex(r => r.x === l.x2 && r.y === l.y2) ]);
    }

    selected = null;
  }
  return false;
}
