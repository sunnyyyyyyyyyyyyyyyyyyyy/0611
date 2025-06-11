let video;
let handpose;
let predictions = [];

let fingerTip = null;

// 兩邊的配對點資料
// 用大一跟大二的課程名稱示範
const leftPoints = [
  { x: 100, y: 80, label: "大學學習", paired: false },
  { x: 100, y: 160, label: "AI與程式語言", paired: false },
  { x: 100, y: 240, label: "教育心理學", paired: false },
  { x: 100, y: 320, label: "攝影與視覺傳達", paired: false },
];

const rightPoints = [
  { x: 540, y: 80, label: "教學設計", paired: false },
  { x: 540, y: 160, label: "需求分析", paired: false },
  { x: 540, y: 240, label: "互動教材設計", paired: false },
  { x: 540, y: 320, label: "教育統計", paired: false },
];

// 正確配對對應（左點index : 右點index）
const correctPairs = {
  0: 1, // 大學學習 -> 需求分析（範例）
  1: 0, // AI與程式語言 -> 教學設計
  2: 3, // 教育心理學 -> 教育統計
  3: 2, // 攝影與視覺傳達 -> 互動教材設計
};

let selectedLeftIndex = null;  // 使用者選的左邊點index
let currentLine = null;        // 畫的線{ x1, y1, x2, y2 }
let lines = [];               // 已配對的線條：{ leftIndex, rightIndex, correct }

function setup() {
  createCanvas(640, 480);
  let canvasElt = document.querySelector('canvas');
  canvasElt.style.display = 'block';
  canvasElt.style.margin = 'auto';

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => {
    console.log('Handpose 模型已載入');
  });
  handpose.on('predict', results => {
    predictions = results;
  });
  textAlign(CENTER, CENTER);
  textSize(16);
}

function draw() {
  background(220);

  // 鏡像畫面
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // 顯示所有左邊點
  for (let i = 0; i < leftPoints.length; i++) {
    const pt = leftPoints[i];
    fill(pt.paired ? 'gray' : 'white');
    stroke(0);
    ellipse(pt.x, pt.y, 40);
    fill(0);
    noStroke();
    text(pt.label, pt.x, pt.y);
  }

  // 顯示所有右邊點
  for (let i = 0; i < rightPoints.length; i++) {
    const pt = rightPoints[i];
    fill(pt.paired ? 'gray' : 'white');
    stroke(0);
    ellipse(pt.x, pt.y, 40);
    fill(0);
    noStroke();
    text(pt.label, pt.x, pt.y);
  }

  // 畫已完成的線條
  for (let line of lines) {
    stroke(line.correct ? 'green' : 'red');
    strokeWeight(4);
    const leftPt = leftPoints[line.leftIndex];
    const rightPt = rightPoints[line.rightIndex];
    line.x1 = leftPt.x;
    line.y1 = leftPt.y;
    line.x2 = rightPt.x;
    line.y2 = rightPt.y;
    line(line.x1, line.y1, line.x2, line.y2);
  }

  // 目前連線中(從左點出發，終點跟隨食指)
  if (selectedLeftIndex !== null && fingerTip) {
    const startPt = leftPoints[selectedLeftIndex];
    stroke('blue');
    strokeWeight(3);
    line(startPt.x, startPt.y, fingerTip.x, fingerTip.y);
  }

  // 抓取食指位置
  if (predictions.length > 0) {
    const hand = predictions[0];
    const finger = hand.landmarks[8];
    fingerTip = {
      x: width - finger[0],
      y: finger[1],
    };

    // 畫出食指紅點
    fill('red');
    noStroke();
    ellipse(fingerTip.x, fingerTip.y, 20);
  } else {
    fingerTip = null;
  }

  // 檢測食指是否按下/點擊
  handleInteraction();
  
  // 顯示狀態
  fill(0);
  noStroke();
  textSize(14);
  text('用食指點選左側課程，並拖動連接右側課程', width / 2, height - 20);

  // 完成提示
  if (lines.length === Object.keys(correctPairs).length) {
    textSize(32);
    fill('green');
    text('全部配對成功！恭喜！', width / 2, height / 2);
  }
}

let isTouching = false;
let lastTouchTime = 0;

// 互動判斷
function handleInteraction() {
  if (!fingerTip) {
    isTouching = false;
    return;
  }

  // 判斷距離：食指點距離某點40以內當點擊
  const threshold = 40;

  // 用簡單的觸控判斷：當手指停留在點附近超過0.3秒視為點擊
  if (!isTouching) {
    // 沒有選點，嘗試選左點
    for (let i = 0; i < leftPoints.length; i++) {
      if (leftPoints[i].paired) continue;
      let d = dist(fingerTip.x, fingerTip.y, leftPoints[i].x, leftPoints[i].y);
      if (d < threshold) {
        // 點選左點
        selectedLeftIndex = i;
        isTouching = true;
        lastTouchTime = millis();
        break;
      }
    }
  } else {
    // 已選左點，尋找右邊是否碰到點來完成連線
    if (selectedLeftIndex !== null) {
      for (let i = 0; i < rightPoints.length; i++) {
        if (rightPoints[i].paired) continue;
        let d = dist(fingerTip.x, fingerTip.y, rightPoints[i].x, rightPoints[i].y);
        if (d < threshold) {
          // 連線完成，判斷是否正確配對
          const correctRightIndex = correctPairs[selectedLeftIndex];
          const isCorrect = (i === correctRightIndex);

          // 記錄線條
          lines.push({
            leftIndex: selectedLeftIndex,
            rightIndex: i,
            correct: isCorrect
          });

          // 將點標記為已配對
          if (isCorrect) {
            leftPoints[selectedLeftIndex].paired = true;
            rightPoints[i].paired = true;
          }

          // 重置
          selectedLeftIndex = null;
          isTouching = false;
          return;
        }
      }
    }

    // 若離開點太遠且超過時間，取消選取（避免一直鎖住）
    if (millis() - lastTouchTime > 2000) {
      selectedLeftIndex = null;
      isTouching = false;
    }
  }
}
