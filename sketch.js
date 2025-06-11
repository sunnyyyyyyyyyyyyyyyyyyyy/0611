let video;
let handpose;
let predictions = [];

let fingerTip = null; // 食指指尖位置

function setup() {
  createCanvas(640, 480);
  // 置中畫布
  let canvasElt = document.querySelector('canvas');
  canvasElt.style.display = 'block';
  canvasElt.style.margin = 'auto';

  // 開啟攝影機
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 handpose
  handpose = ml5.handpose(video, () => {
    console.log('Handpose 模型已載入');
  });

  // 當手勢被偵測到
  handpose.on('predict', results => {
    predictions = results;
  });

  // 設定畫面鏡像，符合手部動作邏輯
  // 如果你用的是鏡像畫面，可以在 draw 反轉影像，方便追蹤。
  // 這裡會用 translate+scale 反轉畫面
}

function draw() {
  background(220);

  // 鏡像畫面
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 若有偵測到手勢
  if (predictions.length > 0) {
    const hand = predictions[0];

    // landmarks 是21點，每點是 [x, y, z]
    // 食指指尖是 landmarks[8]
    const finger = hand.landmarks[8];
    // landmarks 用的是video大小座標，不用轉換

    fingerTip = {
      x: width - finger[0], // 因為畫面鏡像，x要反轉
      y: finger[1],
    };

    // 畫出食指指尖
    fill('red');
    noStroke();
    ellipse(fingerTip.x, fingerTip.y, 20);

    // 這裡你可以把 fingerTip.x, fingerTip.y 用來當遊戲控制點
  } else {
    fingerTip = null;
  }

  // 顯示提示文字
  fill(0);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  text('用食指指尖觸控畫面互動', width / 2, height - 10);
}
